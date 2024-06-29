const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getallTours);

router.route('/').get(tourController.getallTours).post(tourController.createTour);

router
    .route('/:id')
    .get(tourController.getSingleTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);


module.exports = router;