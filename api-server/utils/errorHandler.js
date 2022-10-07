require('dotenv').config();
const createHttpError = require('http-errors')
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
    console.error(err, "{level:safe,error:err.name}")
    res.sendError(err)
};

// function to handle unknown errors in App
const handleUnknownExceptions = (err, res) => {
    err.expose = false
    switch (err.name) {
        case 'UnauthorizedError':
            err.statusCode = "401"
            err.message = "Unauthorized"
            err.expose = true
            res.sendError(err)
            break;   
                 
        case 'SequelizeForeignKeyConstraintError':
        case 'SequelizeUniqueConstraintError':
            err.statusCode = "409"
            err.message = "Foreign Key Violation"
            res.sendError(err)
            break;

        default:
            console.error(err, "{level:priority,error:" + err.name + "}")
            err.statusCode = "500"
            err.message = "Internal Server Error"
            res.sendError(err)
            break;
    }
};

const handleError = (err, res) => {
    err instanceof AppError || createHttpError.isHttpError(err) ?
        handleKnownExceptions(err, res) : handleUnknownExceptions(err, res);
};

const PromiseHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = {
    AppError,
    handleError,
    PromiseHandler
}