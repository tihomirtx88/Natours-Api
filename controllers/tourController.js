const fs = require('fs');

//Middleware for reading data from json dev file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// Checing for valid ID
exports.checkID = (req, res, next, value) =>{
  console.log(value);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

// Checking for valid data information
exports.checkBodyInfo = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'missing name or price'
    });
  }
  next();
};

exports.getallTours = (req, res) => {
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

exports.getSingleTour = (req, res) => {
  // Auto convert to to number
  const id = req.params.id * 1;

  const tour = tours.find((tour) => tour.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

exports.postTour = (req, res) => {
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

exports.patchSignleTour = (req, res) => {

  res.status(200).json({
    status: 'Success',
    data: {
      tour: '<Updated tour here>',
    },
  });
};

exports.deleteTour = (req, res) => {

  res.status(204).json({
    status: 'Success',
    data: null,
  });
};
