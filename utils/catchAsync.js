//Pass function and return another function for can i use req and res
const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(err => next(err));
  };
};

module.exports = catchAsync;
