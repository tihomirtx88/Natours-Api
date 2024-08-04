const express = require('express');
const viewController = require('./../controllers/viewsController');

const router = express.Router();

//Render template

router.get('/', viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.signIn);

module.exports = router;
