const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/apiError');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //1. Get currently book tour
  const tour = await Tour.findById(req.params.tourID);

  // 2.Create checkout session
  //Information about session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourID
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      //Information about product
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [tour.imageCover],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1
      }
    ]
  });

  // 3.Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();

  await Booking.create({
    tour,
    user,
    price
  });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = catchAsync(async (req, res, next) => {
  // 1. Get the tour from the request body
  const { tourId, price } = req.body;

  // 2. Check if the tour exists
  const tour = await Tour.findById(tourId);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  const booking = await Booking.create({
    tour: tour._id,
    user: req.user.id, // Assuming user is authenticated and req.user contains user info
    price: price || tour.price
  });

  res.status(201).json({
    status: 'success',
    data: {
      booking
    }
  });
});

