require('dotenv').config();
const createError = require('http-errors')
const development = "development"

class AppError extends Error {
    // constructor for Error
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}

// function for handling already known errors - user defined
const handleKnownExceptions = (err, res) => {
    // console.error(err);
    // err.expose = true
    sendError(res, err)
};

// function to handle unknown errors in App
const handleUnknownExceptions = (err, res) => {
    err.expose = false
    switch (err.name) {

        case 'UnauthorizedError':
            err.statusCode = "401"
            err.message = "Unauthorized"
            sendError(res, err)
            break;

        case 'SequelizeForeignKey ConstraintError', 'SequelizeUniqueConstraintError':
            err.statusCode = "409"
            err.message = "Foreign Key Violation"
            sendError(res, err)
            break;

        default:
            console.error(err);
            err.statusCode = "500"
            err.message = "Internal Server Error"
            sendError(res, err)
            break;
    }
};

const sendError = (res, err) => {
    const { statusCode, message, stack, expose } = err;
    return res.status(statusCode).json({
        success: false,
        status: statusCode,
        expose: expose,
        error_message: message,
        ...(process.env.NODE_ENV === development) && { error_stack: stack }
    });
}

const handleError = (err, res) => {

    let basicStatus = [400, 403, 409, 401, 404]

    if (basicStatus.includes(err.statusCode))
        console.log("in central err handler ERROR(SAFE) =>", err.message)
    else
    console.log("in central err handler ERROR(PRIORITY) =>", err)
    err instanceof AppError || createError.isHttpError(err) ?
        handleKnownExceptions(err, res) : handleUnknownExceptions(err, res);
};

const PromiseHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = {
    AppError,
    handleError,
    PromiseHandler
}