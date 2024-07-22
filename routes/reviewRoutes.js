const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({
  // For can access this parametar /:tourId/reviews'
  mergeParams: true
});

//POST /tour/34234sdads/reviews
//GET /tour/324fsdf34/reviews

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

router.route('/:id').delete(reviewController.deleteReview);

module.exports = router;
