const userService = require('../services/UserService');
const {validationResult} = require('express-validator');
const ErrorHandler = require('../exceptions/ErrorHandler');

class AuthController {


    async register(request, response, next) {
        try {
            const errors = validationResult(request);

            if(!errors.isEmpty()) {
                return next(ErrorHandler.BadRequest('Validation error', errors.array()));
            }

            const {login, firstname, lastname, password, email} = request.body;
            const userData = await userService.createUser(login, firstname, lastname, password, email);

            response.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

            return response.status(201).json(userData);
        }
        catch(e) {
            next(e);
        }
    }


    async login(request, response, next) {
        try {
            const errors = validationResult(request);

            if(!errors.isEmpty()) {
                return next(ErrorHandler.BadRequest('Validation error', errors.array()));
            }

            const {login, password} = request.body;
            const userData = await userService.login(login, password);

            response.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

            return response.status(200).json(userData);
        }
        catch(e) {
            next(e);
        }
    }


    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.status(200).json();
        } catch (e) {
            next(e);
        }
    }


    async profile(request, response, next) {
        try {
            const {user} = request;
            const profile = await userService.getUserById(user.id);
            return response.status(200).json(profile);
        }
        catch(e) {
            next(e);
        }
    }


    async refresh(request, response, next) {
        try {
            const {refreshToken} = request.cookies;
            const userData = await userService.refreshToken(refreshToken);
            response.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return response.status(200).json(userData);
        }
        catch(e) {
            next(e);
        }
    }



    async sendLinkToResetPassword(request, response, next) {
        try {
            const errors = validationResult(request);

            if(!errors.isEmpty()) {
                return next(ErrorHandler.BadRequest('Validation error', errors.array()));
            }

            const {email} = request.body;
            await userService.sendResetLinkToEmail(email);

            return response.status(200).send();
        }
        catch(e) {
            next(e);
        }
    }


    async resetPassword(request, response, next) {
        try {
            const errors = validationResult(request);

            if(!errors.isEmpty()) {
                return next(ErrorHandler.BadRequest('Validation error', errors.array()));
            }

            const {password} = request.body;
            const token = request.params.token;

            const userData = await userService.resetPassword(token, password);
            response.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return response.status(200).json(userData);
        }
        catch(e) {
            next(e);
        }
    }

}

module.exports = AuthController;