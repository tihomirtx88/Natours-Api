const fs = require('fs');
const Tour = require('../models/tourModel');

//Middleware for reading data from json dev file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);


// Checing for valid ID
exports.checkID = (req, res, next, value) => {
  console.log(value);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  next();
};

exports.getallTours = async (req, res) => {
  try {
    //BUILD QUERY
    //1.Filtering
    const queryObj = {...req.query};
    const exludedFields = ['page', 'sort', 'limit', 'fields']; 
    exludedFields.forEach(el => delete queryObj[el]);

    //2.Advanced filtering
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    //gte, gt, lte, lt

    // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

    let query = Tour.find(JSON.parse(queryString));

    //3. Sorting
    if(req.query.sort){
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    }else{
      query = query.sort('-createdAt');
    }
    
    // Execute query
    const tours = await query;
    
    //Send Response 
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours: tours
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.getSingleTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour
    }
  });
};

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour();
    // newTour.save();

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent'
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'Success',
      data: {
        tour: updatedTour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'Success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};
