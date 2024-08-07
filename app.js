const express = require('express');
const databaseConfig = require(`./config/db`);

const path = require('path');

// Security
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Middlewares
const AppError = require('./utils/apiError');
const globalErrrorHandler = require('./controllers/errorController');

//Routes
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');

//Template routes
const reviewRouter = require('./routes/reviewRoutes');

// Start app

const app = express();

start();

async function start() {
  await databaseConfig(app);

  //Body parser, reading data from body
  app.use(express.json());
  app.use(express.urlencoded({
    extended: true,
    limit: '10kb'
  }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: 'http://localhost:3000', // Replace with your frontend domain
      credentials: true
    })
  );

  //Set the template engine
  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, 'views'));

  // 1.GLOBAL MIDDLEWARES

  //Set http secure header
  app.use(
    helmet({
      contentSecurityPolicy: false
    })
  );

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

  //Data sanitanization against NoSQLquery injection
  app.use(mongoSanitize());

  //Data sanitanization against XSS
  app.use(xss());

  //Prevent parameter pollution
  app.use(
    hpp({
      // Simple array from properties with one allowed to dublicate query string
      whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
      ]
    })
  );

  //Serving static files
  app.use(express.static(path.join(__dirname, 'public')));

  // Custom test time middleware
  app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
  });

  //3 .Mount ROUTES

  // Template routes
  app.use('/', viewRouter);

  app.use('/api/v1/tours', tourRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/reviews', reviewRouter);

  app.all('*', (req, res, next) => {
    next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
  });

  //Error middleware
  app.use(globalErrrorHandler);
}

module.exports = app;
