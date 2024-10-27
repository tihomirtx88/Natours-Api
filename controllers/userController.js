const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/apiError');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

// Upload image functionality and settings

// const multerStorage  = multer.diskStorage({
//   destination: (req, file, callBack) => {
//     callBack(null, 'public/img/users', )
//   },
//   filename: (req, file, callBack) => {
//      //user- 21342dsf231231232-23432423.jpg example to be uniqe
//      const extension = file.mimetype.split('/')[1];
//      callBack(null, `user-${req.user.id}-${Date.now()}.${extension}`)
//   }
// });

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

exports.uploadUserImage = upload.single('photo');

// Rezie image functionality

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpg`;

  //Because using multer.memoryStorage() instead local storage, also return promise
  await sharp(req.file.buffer)
  .resize(500, 500)
  .toFormat('jpg')
  .toFile(`public/img/users/${req.file.filename}`, (err, info) => {
    if (err) {
      console.error('Error saving file:', err);
      return next(err);
    }
    console.log('File saved:', info);
  });

  next();
});

const filteredObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

// Get data for current user
exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  //Send Response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users: users
    }
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //1. Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'this route is not for password updates! Please use / updatePassword',
        400
      )
    );
  }

  //2. filtered out unwanted fields names that are not allowedto be updated
  const filteredBody = filteredObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  //3. Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    message: 'This route is still not definded'
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not defined! Please use /signup instead'
  });
};

exports.getUser = factory.getOne(User);

exports.updateUserOther = catchAsync(async (req, res, next) => {

  
  try {
    const userId = req.params.id;
    console.log(userId);
    
    //1. filtered out unwanted fields names that are not allowedto be updated
  const filteredBody = filteredObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  //2. Update user document
  const updatedUser = await User.findByIdAndUpdate(userId, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
  } catch (error) {
    console.log(error.message);
    
  }
 
  
});

exports.deleteUser = factory.deleteOne(User);
