const ErrorHandler = require('../exceptions/ErrorHandler');
const UserModel = require('../models/User');
const EventModel = require('../models/Event');

module.exports = async function (request, response, next) {

    const eventId = request.params.id;
    const user = request.user;

    const event = await EventModel.findById(eventId);
    if (!event) {
        return next(ErrorHandler.BadRequest(`Event with id ${eventId} not found`));
    }

    // check for user who want to update event of another user if db has his
    const userWhoUpdate = await UserModel.findById(user.id);
    if (!userWhoUpdate) {
        return next(ErrorHandler.BadRequest("User not found"));
    }

    // if user want change own event it's okay
    if (userWhoUpdate._id === event.author_id) {
        return next();
    }

    // if user has role 'user' but try change info of another user, he get error
    if (userWhoUpdate.role !== "admin") {
        return next(ErrorHandler.Forbidden("You are not admin. You can change only own events"))
    }

    // check for updated user
    const userForUpdate = await UserModel.findById(event.author_id);
    if (!userForUpdate) {
        return next(ErrorHandler.BadRequest("User not found"));
    }

    // admin should have the field 'time_admin'
    if (!userWhoUpdate.time_admin) {
        return next(ErrorHandler.BadRequest("You have problems with the field of time admin. It's empty"))
    }

    // admin can change users events info
    if (userForUpdate.role === "user") {
        return next();
    }

    // admin should have the field 'time_admin'
    if (!userForUpdate.time_admin) {
        return next(ErrorHandler.BadRequest("Admin has problems with the field of time admin. It's empty"))
    }

    if (userWhoUpdate.time_admin > userForUpdate.time_admin) {
        return next(ErrorHandler.Forbidden("You can't change information of events of senior admin"))
    }

    next();
}