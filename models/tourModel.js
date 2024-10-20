const {
  model,
  Schema,
  Types: { ObjectId },
  default: mongoose
} = require('mongoose');

const slugify = require('slugify');
const validator = require('validator');

// const User = require('../models/userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour must have less or equal then 40 characters'],
      minLength: [10, 'A tour must have more or equal then 10 characters'],
      validate: [validator.isAlpha, 'Tour name must  only contain characters']
    },
    slug: {
      type: String
    },
    duration: {
      type: Number,
      required: [true, 'Durations are required']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must to have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must to have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficulty'],
        message: 'Difficulty is either: easy, medium or difficulty'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.9'],
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      // validate: {
      //   validator: function(value) {
      //     //this only points to curent doc on NEW document cration
      //     console.log(typeof value)
      //     console.log(this.price)
      //     return value > this.price;
      //   },
      //   message: 'Discount price ({VALUE}) must be below the regular price'
      // }
    },
    summary: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    imageCover: {
      type: String,
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    // Embeded schema property
    startLocation: {
      // Geo json
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: {
          type: [Number], // Ensure this is set to accept an array of numbers
          required: true,
        },
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: ObjectId,
        ref: 'User'
      }
    ],
    
    //For embeding way
    // guides: Array
  },
  {
    // Each time when data is outputet as json take virtual property
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//Order price indexing in Acending order (1) or desending (-1), inprove scaning indexing from mongo for fast performance
tourSchema.index({price: 1, ratingsAverage: -1});
tourSchema.index({slug: 1});
// Basicly we tell on mongoDB that startLocation must be index to this 2dsphere. that for geoLocation
tourSchema.index({startLocation: '2dsphere'});

// Virtual property
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

//Virtual populating - make referencing to tour widthout to persist in database
tourSchema.virtual('reviews', {
  ref: 'Review',
  // field from review model
  foreignField: 'tour',
  // Current id tour
  localField: '_id'
});

// Document middleware and will be call before save() and create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

// Embedding way
// tourSchema.pre('save', async function(next){
//   // Array from promises
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);

//   next();
// });

// QUERY MIDDLEWARE and its work for all find() methods
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();

  next();
});

//Get populate data in query
tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });

  next();
});

// Affter all middlewares are exexuted
tourSchema.post(/^find/, function(docs, next) {
  // console.log(`Query took ${Date.now() - this.start} milliesecodns`);

  next();
});

// AGREGATIOM MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
  // console.log(this);
  // Remove all tour who have secretTour : true
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  next();
});

const Tour = model('Tour', tourSchema);

module.exports = Tour;
