const express = require('express');
const viewController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');

const router = express.Router();

//Render template

router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.signIn);

module.exports = router;
