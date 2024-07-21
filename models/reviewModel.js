const {
  model,
  Schema,
  Types: { ObjectId },
  default: mongoose
} = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty']
    },
    raitng: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    tour: {
      type: ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    },
    user: {
      type: ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    // Each time when data is outputet as json take virtual property
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Review = model('Review', reviewSchema);

module.exports = Review;
