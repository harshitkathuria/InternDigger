const express = require('express');
const responseController = require('../controllers/responseController');
const authController = require('../controllers/authController');

const Router = express.Router();

Router.use(authController.protect);

Router.route('/')
  .get(responseController.getAllResponses)
  .post(responseController.createResponse)

Router.route('/:id')
  .get(responseController.getResponse)
  .patch(responseController.updateResponse)
  .delete(responseController.deleteResponse)

module.exports = Router;