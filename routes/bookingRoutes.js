const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');
const tourController = require('./../controllers/tourController');

const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/tourID', bookingController.getCheckoutSession);

router.use(authController.restrictTo('admin', 'lead-guide'));

router.route('/').get(bookingController.getAllBookings).post(bookingController.createBooking);

router.route('/:id').get(bookingController.getBooking).patch(bookingController.updateBooking).delete(bookingController.deleteBooking);

router.get('/my-bookings', authController.protect, tourController.getMyBookings);

module.exports = router