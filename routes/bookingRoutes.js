const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/checkout-session/tourID', authController.protect, bookingController.getCheckoutSession);
router.post('/create-booking', authController.protect, bookingController.createBooking);

module.exports = router