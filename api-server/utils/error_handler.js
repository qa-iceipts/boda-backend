class AppError extends Error {
    
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}
const handleKnownExceptions = (err, res) => {
    // logger.error(err);
    const { statusCode, message } = err;
    res.status(statusCode).json({status:statusCode,error : message});
};

const handleUnknownExceptions = (err, res) => {
    // logger.error(err);
    res.status(500).json({ message: 'Something went wrong.',err:err.message });
};

const handleError = (err, res) => {
    if(err.statusCode == 400 || err.statusCode == 401 || err.statusCode == 404) {
        console.log("in central err handler ERROR =>",err.message)
    }else{
        console.log("in central err handler =>",err.stack)
    }
    err instanceof AppError ? handleKnownExceptions(err, res) : handleUnknownExceptions(err, res);
};

module.exports = {
    AppError,
    handleError
  }