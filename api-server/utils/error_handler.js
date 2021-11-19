require('dotenv').config();
const development = "development"
class AppError extends Error {

    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}

const handleKnownExceptions = (err, res) => {
    // logger.error(err);
    const { statusCode, message, stack } = err;
    return res.status(statusCode).json({
        success: 0, status: statusCode, error: err.message,
        ...(process.env.NODE_ENV === "development") && { stack: err.stack }
    });


};

const handleUnknownExceptions = (err, res) => {
    // logger.error(err);
    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json(
            {
                success: 0, error: 'Unauthorized',
                ...(process.env.NODE_ENV === development) && { message: err.message },
                ...(process.env.NODE_ENV === development) && { stack: err.stack }
            }
        );
    } else if (err.name === 'SequelizeForeignKeyConstraintError') {
        // foreign key error
        return res.status(409).json(
            {
                success: 0, error: 'Foreign Key Violation',
                ...(process.env.NODE_ENV === development) && { message: err.message },
                ...(process.env.NODE_ENV === development) && { stack: err.stack }
            }
        );
    } else {
        return res.status(500).json(
            {
                success: 0, message: 'Something went wrong.',
                ...(process.env.NODE_ENV === development) && { message: err.message },
                ...(process.env.NODE_ENV === development) && { stack: err.stack }
            }
        );
    }

};

const handleError = (err, res) => {
    if (err.statusCode == 400 || err.statusCode == 409 || err.statusCode == 401 || err.statusCode == 404) {
    
            console.log("in Central handler Known APP ERROR =>",err.name, err.message)
        
       
    } else {
        console.log("in central err handler =>", err.stack)
    }
    err instanceof AppError ? handleKnownExceptions(err, res) : handleUnknownExceptions(err, res);
};

const PromiseHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = {
    AppError,
    handleError,
    PromiseHandler
}