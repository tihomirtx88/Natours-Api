const AppError = require('./../utils/apiError');

//Translate error from Mongo to nice human error for production 
const handleCastErrorDB = err => {
   const message = `Invalid ${err.path}: ${err.value}.`;
   return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational , trusted error: send message to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  // Programing or other unknown error: dont want to leave details on the client 
  }else{
    //1. Log error
     console.error('ERROR :(', err);
    //2. Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
 
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // Hard copy on error object and asignt to 
    let error = {...err};
    if (error.name === 'CastError') error = handleCastErrorDB(error);

    sendErrorProd(error, res);
  }
};
