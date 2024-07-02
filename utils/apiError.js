class AppError extends Error{
    constructor(message, statusCode){
        super(message);
       this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
       this.statusCode = statusCode;
       this.isOperational = true;
       
       //is property provides a stack trace that can help to debug errors by showing where the error was instantiated and the sequence of calls leading to it.
       Error.captureStackTrace(this, this.constructor);
    }
};

module.exports = AppError;