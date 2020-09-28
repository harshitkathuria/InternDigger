const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const Router = express.Router();

Router.post('/signup', authController.signUp);
Router.post('/signup/:role', authController.signUp);
Router.post('/login', authController.login);
Router.get('/logout', authController.logOut);

Router.use(authController.protect);

Router.route('/')
  .get(authController.restrictTo('admin', 'recruiter'), userController.getAllUsers)

Router.delete('/deleteMe', userController.deleteMe)
  
Router.patch('/updateMyPassword', authController.updatePassword);
Router.patch('/updateMe', userController.updateMe);

Router.route('/:id')
  .get(userController.getUser)
  .patch(authController.restrictTo('admin'), userController.updateUser)
  .delete(authController.restrictTo('admin'), userController.deleteUser)
  

module.exports = Router;