const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);

router.patch('/updatePassword',authController.protect, authController.updatePassword);

router.patch('/updateMe',authController.protect, userController.updateMe);
router.delete('/deleteMe',authController.protect, userController.deleteMe);

// Recive email
router.post('/forgotPassword', authController.forgotPassword);

//recive token
router.patch('/resetPassword/:token', authController.resetPassword);

router.route('/').get(userController.getAllUsers).post(userController.createUser);

router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteMe);

module.exports = router;
