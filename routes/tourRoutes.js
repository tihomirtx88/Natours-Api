const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

router.route('/').get(tourController.getallTours).post(tourController.postTour);

router
    .route('/:id')
    .get(tourController.getSingleTour)
    .patch(tourController.patchSignleTour)
    .delete(tourController.deleteTour);


module.exports = router;