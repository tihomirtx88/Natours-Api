const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

const router = express.Router();

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getallTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/montly-plan/:year').get(tourController.getMontlyPlan);

router.route('/').get(authController.protect ,tourController.getallTours).post(tourController.createTour);

router
    .route('/:id')
    .get(tourController.getSingleTour)
    .patch(tourController.updateTour)
    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

//POST /tour/34234sdads/reviews
//GET /tour/324fsdf34/reviews
//GET /tour/dsadsa2334/reviews/dsasa22
router.route('/:tourId/reviews').post(authController.protect, authController.restrictTo('user'), reviewController.createReview);


module.exports = router;