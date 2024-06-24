const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

//Check if is ID valid
// router.param('id', tourController.checkID);

router.route('/').get(tourController.getallTours).post(tourController.createTour);

router
    .route('/:id')
    .get(tourController.getSingleTour)
    .patch(tourController.patchSignleTour)
    .delete(tourController.deleteTour);


module.exports = router;