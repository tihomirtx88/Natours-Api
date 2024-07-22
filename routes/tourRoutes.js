const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

//POST /tour/34234sdads/reviews
//GET /tour/324fsdf34/reviews

//Middleware to use reviews router for nested router or some kind redirect
router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getallTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/montly-plan/:year').get(tourController.getMontlyPlan);

router.route('/').get(authController.protect ,tourController.getallTours).post(tourController.createTour);

router
    .route('/:id')
    .get(tourController.getSingleTour)
    .patch(tourController.updateTour)
    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = router;