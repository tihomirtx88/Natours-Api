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


