const {
  model,
  Types: { ObjectId },
  default: mongoose
} = require('mongoose');

const Tour = require('./tourModel');

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
  price: {
    type: Number,
    required: [true, 'Booking must have a price!']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true
  }
});

// Middleware to set booking price based on the tour's price
bookingSchema.pre('save', async function(next) {
  if (!this.isModified('price')) return next();

  // Fetch the tour data
  const tour = await Tour.findById(this.tour);
  if (!tour) {
    return next(new Error('Tour not found!'));
  }

  // Set the booking price to the tour's price
  this.price = tour.price;

  next();
});

// Middleware to check if the tour is fully booked
bookingSchema.pre('save', async function(next) {
  // Find all bookings for the same tour
  const bookedCount = await this.constructor.countDocuments({
    tour: this.tour
  });

  const tour = await Tour.findById(this.tour);

  // Check if the number of bookings exceeds the maximum group size
  if (bookedCount >= tour.maxGroupSize) {
    return next(new Error('The tour is fully booked!'));
  }

  next();
});

// Populate user and tour details when querying bookings
bookingSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name price duration difficulty'
  });

  next();
});

// Virtual field to calculate total revenue from bookings
bookingSchema.virtual('revenue').get(function () {
  return this.price * 1; // Assuming price is per booking (can be adjusted)
});

const Booking = model('Booking', bookingSchema);

module.exports = Booking;
