const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const TokenService = require('./TokenService');
const MailService = require('./MailService');
const UserDto = require('../dtos/UserDto');
const ErrorHandler = require('../exceptions/ErrorHandler');
const walletService = require('./WalletService');
const EventModel = require('../models/Event');
const UserLinkDto = require('../dtos/UserLinkDto');
const userRepository = require('../repositories/UserRepository');


class UserService {

    constructor() {
        this.tokenService = new TokenService();
        this.mailService = new MailService();
    }


    async createUser(login, firstname, lastname, password, email) {
        console.log("Created user with login: " + login);
        if (await UserModel.findOne({ login })) {
            throw ErrorHandler.BadRequest(`User with the login '${login}' already exists`);
        }

        if (await UserModel.findOne({ email })) {
            throw ErrorHandler.BadRequest(`The email '${email}' already in use`);
        }

        password = await bcrypt.hash(password, 8);
        const user = await UserModel.create(
            {
                login: login,
                firstname: firstname,
                lastname: lastname,
                password: password,
                email: email
            });

        const wallet = await walletService.createWallet(user._id);
        user.wallet_id = wallet._id;
        user.save();

        const userDto = new UserDto(user);
        const tokens = this.tokenService.generateAccessAndRefreshTokens({ ...userDto });

        this.tokenService.saveRefreshTokenInDb(user._id, tokens.refreshToken);
        this.mailService.sendGreetings(email);

        return { ...tokens, user: userDto }
    }


    async getUserByLogin(login) {
        console.log("Get user with login: " + login);

        const user = await userRepository.findByLogin(login);
        return new UserDto(user);
    }


    async getUserById(id) {
        console.log("Get user with id: " + id);

        const user = await userRepository.findById(id);
        return new UserDto(user);
    }


    async getByLimitSortPage(limit, sort, page) {
        console.log(`Get users by limit: ${limit}, sort: ${sort}, page: ${page}`);

        if(!sort) {
            sort = "new";
        }

        let sorting = {};
        if(sort === 'new') {
            sorting = { _id: -1 };
        }

        const users = await userRepository.findByParams({}, limit, page, sorting);
        const usersDto = [];
        for (var i = 0; users[i]; i++) {
            usersDto.push(new UserDto(users[i]));
        }

        return usersDto;
    }


    async updateUserById(updaterId, updatedLogin, login, firstname, lastname, email, description, role, official, phone_number) {
        console.log(`Update user with login '${updatedLogin}' by user with id: ${updaterId}`);

        const userForUpdate = await userRepository.findByLogin(updatedLogin);

        if (login && userForUpdate.login !== login) {
            if (await UserModel.findOne({ login })) {
                throw ErrorHandler.BadRequest(`Login '${login}' already in use`)
            }

            userForUpdate.login = login;
        }

        if (email && userForUpdate.email !== email) {
            const anotherUser = await UserModel.findOne({ email });
            if (anotherUser) {
                throw ErrorHandler.BadRequest(`Email '${email}' already in use`)
            }
            userForUpdate.email = email;
        }

        if (firstname) {
            userForUpdate.firstname = firstname;
        }

        if (lastname) {
            userForUpdate.lastname = lastname;
        }

        if (phone_number) {
            userForUpdate.phone_number = phone_number;
        }

        if (description !== undefined) {
            userForUpdate.description = description;
        }

        if (official !== undefined) {
            userForUpdate.official = official;
        }

        if (role) {
            if (role === 'user' && userForUpdate.role === 'admin') {
                userForUpdate.role = role;
                userForUpdate.time_admin = null;
            }
            else if (role === 'admin' && userForUpdate.role === 'user') {
                userForUpdate.role = role;
                userForUpdate.time_admin = Date.now();
            }
        }

        userForUpdate.save();
    }


    async subscribeOnUserByLogin(subscriber_id, login) {
        console.log("Subscribe fo user with login: " + login);

        const user = await userRepository.findByLogin(login);

        if (String(user._id) === String(subscriber_id)) {
            throw ErrorHandler.BadRequest(`You can't subscribe on yourself`)
        }

        let indexOfSubscriberId = user.subscribers.indexOf(subscriber_id);
        if (indexOfSubscriberId !== -1) {
            throw ErrorHandler.BadRequest(`You are already subcriber of this user`);
        }

        user.subscribers.push(subscriber_id);
        user.save();
    }


    async getSubscribers(login) {
        console.log("Get subscribers for user with login: " + login);

        const user = await userRepository.findByLogin(login);
        if (user.subscribers.length === 0) {
            return [];
        }

        const subscribers = await UserModel.find({ '_id': { $in: user.subscribers } });
        const subscribersDto = [];

        for (var i = 0; subscribers[i]; i++) {
            subscribersDto.push(new UserLinkDto(subscribers[i]))
        }

        return subscribersDto;
    }


    async getFollowings(login) {
        console.log("Get followings for user with login: " + login);

        const user = await userRepository.findByLogin(login);
        const followings = await UserModel.find({ subscribers: { $all: user._id } });
        const followingsDto = [];

        for (var i = 0; followings[i]; i++) {
            followingsDto.push(new UserLinkDto(followings[i]))
        }

        return followingsDto;
    }


    async unsubscribeFromUserByLogin(subscriber_id, login) {
        console.log("Unsubscribe from user with login: " + login);

        const user = await userRepository.findByLogin(login);

        let indexOfSubscriberId = user.subscribers.indexOf(subscriber_id);
        if (indexOfSubscriberId === -1) {
            throw ErrorHandler.BadRequest(`You are not subcriber of this user`);
        }

        user.subscribers.splice(indexOfSubscriberId, 1);
        user.save();
    }


    async deleteUserByLogin(login) {
        console.log("Delete user with login: " + login);

        const user = await userRepository.findByLogin(login);

        const event = await EventModel.findOne({ $and: [{ author_id: user._id }, { time_end: { $lt: Date.now() } }] });
        if (event) {
            throw ErrorHandler.BadRequest("User has pending events");
        }

        user.deleteOne();
    }


    async login(login, password) {
        console.log("Login user with login: " + login);

        const user = await UserModel.findOne({ login });

        if (!user) {
            throw ErrorHandler.BadRequest(`User with the login '${login}' not found`);
        }

        if (!await bcrypt.compare(password, user.password)) {
            throw ErrorHandler.BadRequest(`Wrong password`);
        }

        const userDto = new UserDto(user);
        const tokens = this.tokenService.generateAccessAndRefreshTokens({ ...userDto });
        this.tokenService.saveRefreshTokenInDb(user._id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }


    async logout(refreshToken) {
        await this.tokenService.removeRefreshTokenFromDb(refreshToken);
    }


    async refreshToken(refreshToken) {
        if (!refreshToken) {
            throw ErrorHandler.UserIsNotAuthorized();
        }

        const userData = this.tokenService.validateRefreshToken(refreshToken);
        if (!userData) {
            throw ErrorHandler.UserIsNotAuthorized();
        }

        const token = this.tokenService.findToken(refreshToken);
        if (!token) {
            throw ErrorHandler.UserIsNotAuthorized();
        }

        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = this.tokenService.generateAccessAndRefreshTokens({ ...userDto });
        this.tokenService.saveRefreshTokenInDb(user._id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }


    async sendResetLinkToEmail(email) {
        const user = await UserModel.findOne({ email });

        if (!user) {
            throw ErrorHandler.BadRequest(`User with the email ${email} not found`);
        }

        const tokens = this.tokenService.generateAccessAndRefreshTokens({ id: user._id });

        let link = process.env.CLIENT_URL + '/reset/' + tokens.accessToken;
        this.mailService.sendResetLink(email, link);
    }


    async resetPassword(token, password) {
        console.log("Reset with token: " + token);
        const user_id = this.tokenService.validateAccessToken(token).id;

        if (!user_id) {
            throw ErrorHandler.BadRequest(`Token not found`);
        }

        const user = await UserModel.findById(user_id);
        if (!user) {
            throw ErrorHandler.BadRequest(`User not found`);
        }

        user.password = await bcrypt.hash(password, 8);
        user.save();

        const userDto = new UserDto(user);
        const tokens = this.tokenService.generateAccessAndRefreshTokens({ ...userDto });
        this.tokenService.saveRefreshTokenInDb(user._id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }

}


module.exports = new UserService();