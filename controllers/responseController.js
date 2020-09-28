const catchAsync = require('../util/catchAsync');
const AdvancedFeatures = require('../util/advancedFeatures');
const Response = require('../models/responseModel');
const User = require('../models/userModel');

exports.createResponse = catchAsync(async (req, res, next) => {
  req.body.user = req.user._id;
  let response = await Response.create(req.body);
  response = await response.populate({
    path: 'vacancy',
    select: 'contactEmail'
  }).execPopulate();
  const resID = response._id;
  req.user.response = req.user.response || [];
  req.user.response.push(resID);
  await req.user.save({ validateBeforeSave: false });
  const user = await User.findOne({ email: response.vacancy.contactEmail });
  user.reponse = user.response || [];
  user.reponse.push(resID);
  await user.save({ validateBeforeSave: false });

  res.status(201).json({
    status: 'success',
    data: {
      response
    }
  })
});

exports.getAllResponses = catchAsync(async (req, res, next) => {
  let features = new AdvancedFeatures(Response.find(), req.query);
  const responses = await features.query;

  res.status(200).json({
    status: 'success',
    results: responses.length,
    data: {
      responses
    }
  })
});

exports.getResponse = catchAsync(async (req, res, next) => {
  const response = await Response.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      response
    }
  })
});

exports.updateResponse = catchAsync(async (req, res, next) => {
  const updatedResponse = await Response.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      updatedResponse
    }
  })
});

exports.deleteResponse = catchAsync(async (req, res, next) => {
  const deletedResponse = await Response.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      deletedResponse
    }
  })
});