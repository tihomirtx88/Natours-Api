const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

// 1. MIDDLEWARES

// Middleware
app.use(express.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//2. ROUTE HANDLER

const getallTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getSingleTour = (req, res) => {
  // Auto convert to to number
  const id = req.params.id * 1;

  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  const tour = tours.find((tour) => tour.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

const postTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ ud: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tours: newTour,
        },
      });
    }
  );
};

const patchSignleTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'Success',
    data: {
      tour: '<Updated tour here>',
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'Success',
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is stil not defined',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is stil not defined',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is stil not defined',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is stil not defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is stil not defined',
  });
};

//3 . ROUTES
const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/').get(getallTours).post(postTour);

tourRouter
  .route('/:id')
  .get(getSingleTour)
  .patch(patchSignleTour)
  .delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUser);

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//START SERVER

const port = 3000;
app.listen(port, () => {
  console.log(`App runinng on port ${port}...`);
});
