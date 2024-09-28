const express = require('express');
const databaseConfig = require('./config/db');
require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react']
});

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

// Routes
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

// Start app
const app = express();

async function start() {
  const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5173'], 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true 
  };
  
  // Apply CORS middleware
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions)); 
  await databaseConfig(app);

  // Body parser, reading data from body
  app.use(express.json());
  app.use(express.urlencoded({
    extended: true,
    limit: '10kb'
  }));
  app.use(cookieParser());

  // Set the template engine
  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, 'views'));

  // 1. GLOBAL MIDDLEWARES

  // Set http secure header
  app.use(
    helmet({
      contentSecurityPolicy: false
    })
  );

  // Development logging
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Middleware which limits requests from client to server
  const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000, // Fixed the value to 1 hour
    message: 'Too many requests from this IP, please try again in an hour'
  });

  app.use('/api', limiter);

  // Data sanitization against NoSQL query injection
  app.use(mongoSanitize());

  // Data sanitization against XSS
  app.use(xss());

  // Prevent parameter pollution
  app.use(
    hpp({
      // Simple array from properties with one allowed to duplicate query string
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

  // Serving static files
  app.use(express.static(path.join(__dirname, 'public')));

  // Custom test time middleware
  app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
  });

  // 3. MOUNT ROUTES

  // Template routes
  app.use('/', viewRouter);

  app.use('/api/v1/tours', tourRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/reviews', reviewRouter);
  app.use('api/v1/bookings', bookingRouter);

  app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });

  // Error middleware
  app.use(globalErrrorHandler);
}

start();

module.exports = app;