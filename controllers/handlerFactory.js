const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/apiError');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(new AppError('No document find with that id', 404));
    }
    res.status(204).json({
      status: 'Success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
     // Check if the request has valid data
     if (!req.body) {
      return next(new AppError('No data provided to update', 400));
    }


    const updateDocument = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updateDocument) {
      return next(new AppError('No tour find with that id', 404));
    }

    res.status(200).json({
      status: 'Success',
      data: {
        data: updateDocument
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    // const newTour = new Tour();
    // newTour.save();

    console.log(req.body, 'from server');
    

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
      startLocation: {
        description: req.body.startLocationDescription,
        coordinates: req.body.coordinates ? JSON.parse(req.body.coordinates) : undefined,
      },
      startDates: req.body.startDates ? JSON.parse(req.body.startDates) : undefined,
    };

    // Handle images
    if (req.files && req.files.imageCover) {
      newTourData.imageCover = req.files.imageCover[0].buffer; // Store image buffer
    }
  
    if (req.files && req.files.images) {
      newTourData.images = req.files.images.map(file => file.buffer); // Store array of image buffers
    }

    const newDocument = await Model.create(newTourData);

    res.status(201).json({
      status: 'success',
      data: {
        data: newDocument
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // 1. Building the query
    let query = Model.find();

    // 2. Execute the query
    const documents = await query;

    // 3. Send response
    res.status(200).json({
      status: 'success',
      results: documents.length,
      data: {
        data: documents
      }
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = await Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const document = await query;

    if (!document) {
      return next(new AppError('No tour find with that id', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: document
      }
    });
  });
