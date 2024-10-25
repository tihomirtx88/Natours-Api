const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
// Recive email
router.post('/forgotPassword', authController.forgotPassword);

//recive token
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

//That mean i will use authController.protect middleware for the rest of code
router.use(authController.protect);

// Siwth params id with user id or some kind get data for current user
router.get('/getMe', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.uploadUserImage, userController.resizeUserPhoto, userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.uploadUserImage, userController.resizeUserPhoto, userController.updateUserOther)
  .delete(userController.deleteUser);

module.exports = router;
