const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const TokenService = require('./TokenService');
const MailService = require('./MailService');
const UserDto = require('../dtos/UserDto');
const ErrorHandler = require('../exeptions/ErrorHandler');
const walletService = require('./WalletService');
const EventModel = require('../models/Event');

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

        user.wallet_id = wallet.id;
        user.save();

        const userDto = new UserDto(user);
        const tokens = this.tokenService.generateAccessAndRefreshTokens({ ...userDto });

        this.tokenService.saveRefreshTokenInDb(user._id, tokens.refreshToken);
        this.mailService.sendGreetings(email);

        return { ...tokens, user: userDto }
    }


    async getUserByLogin(login) {
        console.log("Get user with login: " + login);
        const user = await UserModel.findOne({ login });

        if (!user) {
            throw ErrorHandler.BadRequest(`User with login ${login} not found`);
        }

        const userDto = new UserDto(user);
        return { ...userDto }
    }


    async getUserById(id) {
        console.log("Get user with id: " + id);
        const user = await UserModel.findById(id);

        if (!user) {
            throw ErrorHandler.BadRequest(`User not found`);
        }

        const userDto = new UserDto(user);
        return { ...userDto }
    }


    async updateUserById(updaterId, updatedLogin, login, firstname, lastname, email, description, role, official, phone_number) {
        console.log(`Update user with login '${updatedLogin}' by user with id: ${updaterId}`);

        const userForUpdate = await UserModel.findOne({ login: updatedLogin });
        if (!userForUpdate) {
            throw ErrorHandler.BadRequest(`User with login '${updatedLogin}' not found`);
        }

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

        if(phone_number) {
            userForUpdate.phone_number = phone_number;
        }

        if (description !== undefined) {
            userForUpdate.description = description;
        }

        if(official !== undefined) {
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

        await userForUpdate.save();
    }


    async deleteUserByLogin(login) {
        console.log("Delete user with login: " + login);

        const user = await UserModel.findOne({ login });
        if (!user) {
            throw ErrorHandler.BadRequest(`User with login '${login}' not found`);
        }

        const event = await EventModel.findOne({ $and: [{ author_id: user._id }, { time_end: { $lt: Date.now() } }] });
        if(event) {
            throw ErrorHandler.BadRequest("User has pending events");
        }

        await UserModel.findOneAndDelete({ login });
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