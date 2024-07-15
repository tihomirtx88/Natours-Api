const express = require('express');
const databaseConfig = require(`./config/db`);
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/apiError');
const globalErrrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

start();

async function start() {
  await databaseConfig(app);

  // 1.GLOBAL MIDDLEWARES
  
  //Set http secure header
  app.use(helmet());
  
  //Development logging
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
  
  //Middleware witch one limit the request from client to server
  const limiter = rateLimit({
     max: 1000,
     windowMs: 60 * 60 * 100,
     message: 'To many request from this IP, please try again in hour'
  });
  
  app.use('/api', limiter);

  //Body parser, reading data from body 
  app.use(express.json({limit: '10kb'}));

  //Data sanitanization against NoSQLquery injection
  app.use(mongoSanitize());

  //Data sanitanization against XSS
  app.use(xss());

  //Prevent parameter pollution
  app.use(hpp({
    // Simple array from properties with one allowed to dublicate query string 
    whitelist: [
      'duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'
    ]
  }));

  //Serving static files
  app.use(express.static(`${__dirname}/public`));

  // Custom test time middleware
  app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
  });

  //3 .Mount ROUTES

  app.use('/api/v1/tours', tourRouter);
  app.use('/api/v1/users', userRouter);

  app.all('*', (req, res, next) => {
    next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
  });

  //Error middleware
  app.use(globalErrrorHandler);
}

module.exports = app;
