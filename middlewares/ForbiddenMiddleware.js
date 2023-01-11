const ErrorHandler = require('../exeptions/ErrorHandler');
const UserModel = require('../models/User');

module.exports = async function (request, response, next) {
    const loginForUpdate = request.params.login;

    // check for login in url path
    if(!loginForUpdate) {
        return next(ErrorHandler.BadRequest("No login in params"));
    }

    // check for user in request (we get it after calling AuthMiddleware)
    const user = request.user;
    if(!user) {
        return next(ErrorHandler.UserIsNotAuthorized());
    }

    // check for user who want to update another user if db has his
    const userWhoUpdate = await UserModel.findById(user.id);
    if(!userWhoUpdate) {
        return next(ErrorHandler.BadRequest("User not found"));
    }

    // if user want change himself it's okay
    if(userWhoUpdate.login === loginForUpdate) {
        return next();
    }

    // if user has role 'user' but try change info of another user, he get error
    if(userWhoUpdate.role !== "admin") {
        return next(ErrorHandler.Forbidden("You are not admin. You can change only own information"))
    }

    // check for updated user
    const userForUpdate = await UserModel.findOne({login: loginForUpdate});
    if(!userForUpdate) {
        return next(ErrorHandler.BadRequest("User not found"));
    }

    // admin should have the field 'time_admin'
    if(!userWhoUpdate.time_admin) {
        return next(ErrorHandler.BadRequest("You have problems with the field of time admin. It's empty"))
    }

    // admin can change users info
    if(userForUpdate.role === "user") {
        return next();
    }

    // admin should have the field 'time_admin'
    if(!userForUpdate.time_admin) {
        return next(ErrorHandler.BadRequest("Admin has problems with the field of time admin. It's empty"))
    }

    if(userWhoUpdate.time_admin > userForUpdate.time_admin) {
        return next(ErrorHandler.Forbidden("You can't change information of senior admin"))
    }

    next();
}