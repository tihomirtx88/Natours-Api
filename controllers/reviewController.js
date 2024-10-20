const Review = require('../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/apiError');
const factory = require('./handlerFactory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: {
      reviews
    }
  });
});

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getSingleReview = factory.getOne(Review)

// exports.createReview = factory.createOne(Review);
exports.createReview =  catchAsync(async (req, res, next) => {
  try {
    console.log("Incoming Request Body:", req.body);
    const newReviewData = {
      review: req.body.review,
      rating: req.body.rating,
      tour: req.body.tour,
      user: req.body.user
    };
    
    const newDocument = await Review.create(newReviewData);

    res.status(201).json({
      status: 'success',
      data: {
        data: newDocument
      }
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return next(new AppError("Could not create review. Please try again later.", 500));
  }
});
exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
