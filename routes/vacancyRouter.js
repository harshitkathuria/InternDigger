const express = require('express');
const vacancyController = require('../controllers/vacancyController');
const authController = require('../controllers/authController');

const Router = express.Router();

Router.use(authController.protect);

Router.route('/')
  .get(vacancyController.getAllVacancy)
  .post(authController.restrictTo('admin', 'recruiter'), vacancyController.createVacancy);

Router.get('/:id', vacancyController.getVancancy);

Router.use(authController.restrictTo('admin', 'recruiter'));

Router.route('/:id')
  .patch(vacancyController.updateVacancy)
  .delete(vacancyController.deleteVacancy)

module.exports = Router;