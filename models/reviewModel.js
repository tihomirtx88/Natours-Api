const {
  model,
  Schema,
  Types: { ObjectId },
  default: mongoose
} = require('mongoose');

const Tour = require('./tourModel');

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

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function() {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });

  this.populate({
    path: 'user',
    select: 'name photo'
  });

});

// Building calculate rating static method witch one revice tour
reviewSchema.statics.calcAverageRating = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$raitng' }
      }
    }
  ]);

  console.log(stats);
  

  await Tour.findByIdAndUpdate(tourId, {
    // Cooming data
    // [
    //   {
    //     _id: new ObjectId("66a60e27170fbbea0a635691"),
    //     nRating: 7,
    //     avgRating: 3.257142857142857
    //   }
    // ]
    
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating
  });
};

//Call method after document are state save
reviewSchema.post('save', function() {
   // This point to current review
  this.constructor.calcAverageRating(this.tour);
});


//findOneByIdAndDelete
//findOneByIdAndDelete for all this hooks
reviewSchema.pre(/^findOneAnd/, async function(next) {
  // This points to current query because of the type of hook and with this.r sending from pre middleware to post middleware on bottom
  this.r = await this.model.findOne(this.getQuery());
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  if (this.r) {
    await this.r.constructor.calcAverageRating(this.r.tour); 
  }
});

const Review = model('Review', reviewSchema);

module.exports = Review;
