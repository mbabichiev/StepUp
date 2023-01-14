const ErrorHandler = require('../exceptions/ErrorHandler');
const TokenService = require('../services/TokenService');

const tokenService = new TokenService();

module.exports = function (request, response, next) {
    try {
        const authorizationHeader = request.headers.authorization;
        if (!authorizationHeader) {
            return next(ErrorHandler.UserIsNotAuthorized());
        }

        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            return next(ErrorHandler.UserIsNotAuthorized());
        }

        const userData = tokenService.validateAccessToken(token);
        if(!userData) {
            return next(ErrorHandler.UserIsNotAuthorized());
        }

        request.user = userData;
        next();

    } catch (e) {
        return next(ErrorHandler.UserIsNotAuthorized());
    }
}