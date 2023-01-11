module.exports = class ErrorHandler extends Error {

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }


    static BadRequest(message, errors = []) {
        return new ErrorHandler(400, message, errors);
    }


    static UserIsNotAuthorized() {
        return new ErrorHandler(401, "User is not authorized")
    }


    static Forbidden(message, errors = []) {
        return new ErrorHandler(403, message, errors);
    }


    static ServerError(message, errors = []) {
        return new ErrorHandler(500, message, errors);
    }
}