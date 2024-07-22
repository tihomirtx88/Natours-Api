const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/apiError');
const factory = require('./handlerFactory')

const filteredObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

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
    message: 'This route is stil not defined'
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is stil not defined'
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is stil not defined'
  });
};

exports.deleteUser = factory.deleteOne(User);

