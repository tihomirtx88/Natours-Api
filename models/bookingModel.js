const mongoose = require('mongoose');
const { model, Types: { ObjectId } } = mongoose;

const Tour = require('./tourModel');
const validator = require('validator');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a Tour!']
  },
  user: {
    type: ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!']
  },
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  paid: {
    type: Boolean,
    default: true
  },
  fullName: {
    type: String,
    required: [true, 'Booking must have a full name']
  },
  email: {
    type: String,
    required: [true, 'Booking must have an email'],
    validate: [validator.isEmail, 'Please provide a valid email address']
  },
  groupSize: {
    type: String,
    required: [true, 'Please choose a group size'],
    enum: ['small', 'large']
  },
  participants: {
    type: Number,
    required: [true, 'Booking must specify the number of participants'],
    min: [1, 'There must be at least one participant']
  }
});

// Populate user and tour details when querying bookings
bookingSchema.pre(/^find/, function(next) {
  this.populate('user', 'name email')  // Populate user's name and email
      .populate({
        path: 'tour', 
        select: 'name price duration difficulty imageCover images startLocation maxGroupSize, startDates'  // Populate relevant tour details
      });
  next();
});

// Middleware to set booking price based on the tour's price

bookingSchema.pre('save', async function(next) {
   if (!this.isNew) return next();

  // Fetch the tour data
  const tour = await Tour.findById(this.tour);
  if (!tour) {
    return next(new Error('Tour not found!'));
  }

  // Capacity check
  const bookedCount = await this.constructor.countDocuments({
    tour: this.tour
  });

  if (bookedCount >= tour.maxGroupSize) {
    return next(new Error('The tour is fully booked'));
  }

  next();
});


// Virtual field to calculate total revenue from bookings
bookingSchema.virtual('revenue').get(function () {
  return this.price * this.participants;
});

const Booking = model('Booking', bookingSchema);

module.exports = Booking;
