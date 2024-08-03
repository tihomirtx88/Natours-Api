const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  //1. Get tour data from collection
  const tours = await Tour.find();
  console.log(tours);

  //2. Build template

  //3. Render that template using tour data from step 1
  res.status(200).render('overview', {
    tours,
    user: 'Tihomir'
  });
});

exports.getTour = catchAsync(async (req, res) => {
  //1. GEt data, for the requested tour
  const tour = await Tour.findOne({slug: req.params.slug}).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  //2. Building termplate

  //3. Render template using the data from step 1
  res.status(200).render('tour', {
    title: 'The Forest Hiker',
    tour
  });
});
