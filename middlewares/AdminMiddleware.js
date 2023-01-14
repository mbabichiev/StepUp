const ErrorHandler = require('../exceptions/ErrorHandler');
const UserModel = require('../models/User');

module.exports = async function (request, response, next) {

    // check for user in request (we get it after calling AuthMiddleware)
    const user = request.user;
    if(!user) {
        return next(ErrorHandler.UserIsNotAuthorized());
    }

    const userData = await UserModel.findById(user.id);
    if(!userData) {
        return next(ErrorHandler.BadRequest("User not found (maybe your token is not valid)"));
    }

    if(userData.role !== 'admin') {
        return next(ErrorHandler.Forbidden("You are not admin"));
    }

    next();
}