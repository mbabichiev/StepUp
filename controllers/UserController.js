const userService = require('../services/UserService');
const photoService = require('../services/PhotoService');
const {validationResult} = require('express-validator');
const ErrorHandler = require('../exeptions/ErrorHandler');

class UserController {


    async updateUserByLogin(request, response, next) {
        try {
            const errors = validationResult(request);

            if(!errors.isEmpty()) {
                return next(ErrorHandler.BadRequest('Validation error', errors.array()));
            }

            const {login, firstname, lastname, email, description, role, official, phone_number} = request.body;
            const {user} = request;
            const userLoginForUpdate = request.params.login;
            await userService.updateUserById(user.id, userLoginForUpdate, login, firstname, lastname, email, description, role, official, phone_number);
            
            return response.status(202).json();
        }
        catch(e) {
            next(e);
        }
    }


    async updateUserPhotoByLogin(request, response, next) {
        try {
            if (!request.files || Object.keys(request.files).length === 0) {
                return next(ErrorHandler.BadRequest('No files were uploaded'));
            }
            const login = request.params.login;
            photoService.uploadAvatarByLogin(login, request.files.file);
            return response.status(202).json();
        }
        catch(e) {
            next(e);
        }
    }


    async subscribeOnUser(request, response, next) {
        try {
            const login = request.params.login;
            const {user} = request;

            await userService.subscribeOnUserByLogin(user.id, login);
            return response.status(202).json();
        }
        catch(e) {
            next(e);
        }
    }


    async unsubscribeFromUser(request, response, next) {
        try {
            const login = request.params.login;
            const {user} = request;

            await userService.unsubscribeFromUserByLogin(user.id, login);
            return response.status(202).json();
        }
        catch(e) {
            next(e);
        }
    }


    async getSubscribers(request, response, next) {
        try {
            const login = request.params.login;
            const users = await userService.getSubscribers(login);
            return response.status(200).json(users);
        }
        catch(e) {
            next(e);
        }
    }


    async getFollowings(request, response, next) {
        try {
            const login = request.params.login;
            const users = await userService.getFollowings(login);
            return response.status(200).json(users);
        }
        catch(e) {
            next(e);
        }
    }


    async getUserByLogin(request, response, next) {
        try {
            const login = request.params.login;
            const userData = await userService.getUserByLogin(login);
            return response.status(200).json(userData);
        }
        catch(e) {
            next(e);
        }
    }


    async getUserPhotoByLogin(request, response, next) {
        try {
            const login = request.params.login;
            const photo = photoService.getAvatarByLogin(login);
            return response.status(200).end(photo);
        }
        catch(e) {
            next(e);
        }
    }


    async deleteUserByLogin(request, response, next) {
        try {
            const login = request.params.login;
            await userService.deleteUserByLogin(login);
            return response.status(204).end();
        }
        catch(e) {
            next(e);
        }
    }


    async deleteUserPhotoByLogin(request, response, next) {
        try {
            const login = request.params.login;
            photoService.deleteAvatarByLogin(login);
            return response.status(204).end();
        }
        catch(e) {
            next(e);
        }
    }
}

module.exports = UserController;