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
      max: [5, 'Rating must be below 5.9']
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
      validate: {
        validator: function(value) {
          //this only points to curent doc on NEW document cration
          return value < this.price;
        },
        message: 'Discount price ({VALUE}) must be below the regular price'
      }
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
      required: [true, 'A tour must have a cover image']
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
      cordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        cordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: ObjectId,
        ref: 'User'
      }
    ]
    //For embeding way
    // guides: Array
  },
  {
    // Each time when data is outputet as json take virtual property
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual property
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
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
  console.log(`Query took ${Date.now() - this.start} milliesecodns`);

  // console.log(docs);

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
