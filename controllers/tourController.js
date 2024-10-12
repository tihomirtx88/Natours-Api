const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const APIFeatures = require('./../utils/APIFeaturingTour');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/apiError');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

//Middleware for reading data from json dev file
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callBack) => {
  //Basicly testing is it file image or not and pass error to top calback
  if (file.mimetype.startsWith('image')) {
    // Set to true
    callBack(null, true);
  } else {
    callBack(
      new AppError('Not an image! Please upload only images!', 400),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);



exports.resizeTourimages = catchAsync(async (req, res, next) => {
  console.log(req.files);
  
  
  if (!req.files.imageCover || !req.files.images) return next();


  // 1. Cover image
  if (!req.files || !req.files.imageCover || !req.files.images) {
    return next(new AppError('Images are required!', 400));
  }

  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpg`;

  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpg')
    .toFile(`public/img/tours/${req.body.imageCover}`, (err, info) => {
      if (err) {
        console.error('Error saving file:', err);
        return next(err);
      }
      console.log('File saved:', info);
    });

  // 2. Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, index) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${index + 1}.jpg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpg')
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

// Prefilling query string
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'ratingsAverage, price';
  req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
  next();
};

exports.getallTours = catchAsync(async (req, res, next) => {
  // Execute query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sorting()
    .limitFields()
    .pagination();
  // Explain is about more information for indexing and much more
  // const tours = await features.query.expplain();

  const tours = await features.query;

  //Send Response
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours
    }
  });
});

exports.getSingleTour = factory.getOne(Tour, { path: 'reviews' });

// exports.getSingleTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate('reviews');

//   if (!tour) {
//     return next(new AppError('No tour find with that id', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: tour
//     }
//   });
// });

// exports.createTour = factory.createOne(Tour);

// exports.createTour = catchAsync(async (req, res, next) => {
//   // Prepare the data for creating a new tour
//   const newTourData = {
//     name: req.body.name,
//     slug: req.body.slug,
//     duration: req.body.duration,
//     maxGroupSize: req.body.maxGroupSize,
//     difficulty: req.body.difficulty,
//     price: req.body.price,
//     priceDiscount: req.body.priceDiscount,
//     summary: req.body.summary,
//     description: req.body.description,
//     secretTour: req.body.secretTour,
//     startLocation: {
//       description: req.body.startLocationDescription,
//       coordinates: req.body.coordinates ? JSON.parse(req.body.coordinates) : undefined,
//     },
//     startDates: req.body.startDates ? JSON.parse(req.body.startDates) : undefined,
//   };

//   console.log(newTourData, 'from server');
  

//   // Handle images
//   if (req.files && req.files.imageCover) {
//     newTourData.imageCover = `tour-${Date.now()}-cover.jpg`;
//     await sharp(req.files.imageCover[0].buffer)
//       .resize(2000, 1333)
//       .toFormat('jpg')
//       .toFile(`public/img/tours/${newTourData.imageCover}`);
//   }

//   if (req.files && req.files.images) {
//     newTourData.images = [];
//     await Promise.all(
//       req.files.images.map(async (file, index) => {
//         const filename = `tour-${Date.now()}-${index + 1}.jpg`;
//         await sharp(file.buffer)
//           .resize(2000, 1333)
//           .toFormat('jpg')
//           .toFile(`public/img/tours/${filename}`);
//         newTourData.images.push(filename);
//       })
//     );
//   }

//   const newDocument = await Tour.create(newTourData);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       data: newDocument
//     }
//   });
// });
exports.createTour = catchAsync(async (req, res, next) => {

  const startLocation = req.body.startLocation ? JSON.parse(req.body.startLocation) : null;

  const startDates = req.body.startDates ? JSON.parse(req.body.startDates) : undefined;

  const locations = typeof req.body.locations === 'string' ? JSON.parse(req.body.locations) : req.body.locations || [];

  locations.forEach((loc) => {
    
    if (Array.isArray(loc.coordinates) && loc.coordinates.length === 2) {
      
      loc.coordinates = loc.coordinates.map((coord) => Number(coord));
      
      if (loc.coordinates.every((coord) => !isNaN(coord))) {
      } else {
        loc.coordinates = []; 
      }
    } else {
      loc.coordinates = []; 
    }
  });

  const clonedLocations = JSON.parse(JSON.stringify(locations));

  const guides = req.body.guides ? JSON.parse(req.body.guides) : [];
  const newTourData = {
    name: req.body.name,
    slug: req.body.slug,
    duration: req.body.duration,
    maxGroupSize: req.body.maxGroupSize,
    difficulty: req.body.difficulty,
    price: req.body.price,
    priceDiscount: req.body.priceDiscount,
    summary: req.body.summary,
    description: req.body.description,
    secretTour: req.body.secretTour,
    startLocation,
    startDates,
    locations: clonedLocations,  
    guides,
  };

  // Handle images
 if (req.files && req.files.imageCover) {
  newTourData.imageCover = `tour-${Date.now()}-cover.jpg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpg')
    .toFile(`public/img/tours/${newTourData.imageCover}`);
}

if (req.files && req.files.images) {
  newTourData.images = [];
  await Promise.all(
    req.files.images.map(async (file, index) => {
      const filename = `tour-${Date.now()}-${index + 1}.jpg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpg')
        .toFile(`public/img/tours/${filename}`);
      newTourData.images.push(filename);
    })
  );
}
  const newDocument = await Tour.create(newTourData);

  res.status(201).json({
    status: 'success',
    data: {
      data: newDocument,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {

 try {
  const startLocation = req.body.startLocation ? JSON.parse(req.body.startLocation) : null;

  const startDates = req.body.startDates ? JSON.parse(req.body.startDates) : undefined;

  const locations = typeof req.body.locations === 'string' ? JSON.parse(req.body.locations) : req.body.locations || [];

  locations.forEach((loc) => {
    console.log(loc, 'before processing coordinates');

    if (Array.isArray(loc.coordinates) && loc.coordinates.length === 2) {
      loc.coordinates = loc.coordinates.map((coord) => Number(coord));

      
      if (!loc.coordinates.every((coord) => !isNaN(coord))) {
        console.error('Invalid coordinates:', loc.coordinates);
        loc.coordinates = [];
      }
    } else {
      console.error('Invalid location format:', loc); 
      loc.coordinates = [];
    }
  });

  const clonedLocations = JSON.parse(JSON.stringify(locations));

  const guides = req.body.guides ? JSON.parse(req.body.guides) : [];
  const newTourData = {
    name: req.body.name,
    slug: req.body.slug,
    duration: req.body.duration,
    maxGroupSize: req.body.maxGroupSize,
    difficulty: req.body.difficulty,
    price: req.body.price,
    priceDiscount: req.body.priceDiscount,
    summary: req.body.summary,
    description: req.body.description,
    secretTour: req.body.secretTour,
    startLocation,
    startDates,
    locations: clonedLocations, 
    guides,
  }; 
   
  // Handle images
  if (req.files && req.files.imageCover) {
    newTourData.imageCover = `tour-${Date.now()}-cover.jpg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpg')
      .toFile(`public/img/tours/${newTourData.imageCover}`);
  }
  
  if (req.files && req.files.images) {
    newTourData.images = [];
    await Promise.all(
      req.files.images.map(async (file, index) => {
        const filename = `tour-${Date.now()}-${index + 1}.jpg`;
        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpg')
          .toFile(`public/img/tours/${filename}`);
        newTourData.images.push(filename);
      })
    );
  }

  console.log(newTourData);

  const newDocument = await Tour.findByIdAndUpdate(req.params.id, newTourData, { new: true, runValidators: true });

  res.status(200).json({ // Change status to 200 for updates
    status: 'success',
    data: {
      data: newDocument,
    },
  });
 } catch (error) {
  console.log(error.message);
  console.log(error);
 }
});

// exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    //Stages
    {
      $match: {
        ratingsAverage: { $gte: 4.5 }
      }
    },
    {
      $group: {
        // _id: '$ratingsAverage',
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
    // {
    //   $match: { _id: { $ne: 'easy' } }
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.getMontlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    // Match year
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    // Grouping by custom filters
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStats: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    // Add field for month name descruption
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    // sorting by desending order
    {
      $sort: {
        numToursStats: -1
      }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});

//'/tour-dstance/:distance/center/latlng/unit/:unit';

exports.getTourDistance = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radios = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radios] } }
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001; //instead devide to 1000

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng',
        400
      )
    );
  }

  const distances = Tour.aggregate([
    //First stage
    {
      $geoNear: {
        // Some kind of start point
        near: {
          type: 'Poin',
          coordinates: [lng, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    // Second stage
    {
      // What field i want to keep and display
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  // Find all booking
  const bookings = await Booking.find({ user: req.user.id });

  // Find tours with the returned ids
  const tourIDs = bookings.map(el => el.tour.id);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(201).json({
    status: 'success',
    data: {
      tours
    }
  });
});
