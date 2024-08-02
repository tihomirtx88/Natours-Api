const express = require('express');
const viewController = require('./../controllers/viewsController');

const router = express.Router();

//Render template

router.get('/', viewController.getOverview);

router.get('/tour', viewController.getTour);
//

module.exports = router;
