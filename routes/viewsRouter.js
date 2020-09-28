const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const Router =  express.Router();

// Landing page
Router.get('/', authController.isLoggedIn, viewsController.getOverview);
// Login page
Router.get('/login', viewsController.getLoginForm);
Router.get('/signup/:role', viewsController.getSignUpForm);
// Candidate-Home page
Router.get('/userHome', authController.isLoggedIn, authController.restrictTo('admin', 'candidate'), viewsController.getUserHome);
// User's personal section
Router.get('/me/:content?', authController.isLoggedIn, viewsController.getUserAbout);
// About a particular vacancy
Router.get('/vacancy/:jobID', authController.isLoggedIn, viewsController.getVacancyAbout);
// Update user info
// Router.post('/submit-user-data', authController.protect, viewsController.updateUserData, viewsController.getUserAbout);

module.exports = Router;