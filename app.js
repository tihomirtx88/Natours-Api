const express = require('express');
const databaseConfig = require(`./config/db`);
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

start();

async function start() {

  await databaseConfig(app);

  // 1. MIDDLEWARES

  // Middleware for reading file with data
  app.use(express.json());

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  //Taking static files
  app.use(express.static(`${__dirname}/public`));

  // Custom time middleware
  app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
  });

  //3 .Mount ROUTES

  app.use('/api/v1/tours', tourRouter);
  app.use('/api/v1/users', userRouter);

}

module.exports = app;

