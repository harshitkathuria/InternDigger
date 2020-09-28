const User = require("../models/userModel");
const AdvancedFeatures = require("../util/advancedFeatures");
const AppError = require("../util/appError");
const catchAsync = require('../util/catchAsync');

// To filter out the unwanted dields from req
const filterReq = (obj, ...unwantedFields) => {
  let filteredObj = {...obj};
  unwantedFields.forEach(el => {
    delete filteredObj[el];
  });
  return filteredObj;
}

exports.createUser = catchAsync(async(req, res) => {
  console.log('creating');
  const user = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      user
    }
  });
})

exports.getAllUsers = catchAsync(async(req, res) => {
  const features = new AdvancedFeatures(User.find(), req.query).filter().sort().limitingFields();
  const users = await features.query;

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
})

exports.getUser = catchAsync(async(req, res) => {
  const limit =  req.query.limit || 5, skip = (req.query.page - 1) * limit || 0;
  let user = await User.findById(req.user._id);
  user = await user.populate({
    path: 'response',
    options: {
      limit,
      skip
    }
  }).execPopulate();

  // console.log(user.response);
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
})

exports.deleteMe = catchAsync(async(req, res) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  })
});

exports.updateMe = catchAsync(async(req, res) => {
  if(req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for changing password..To change password please head over to: /updatePassword', 400));
  }

  const filterFields = filterReq(req.body, 'role');
  // console.log(filterFields);
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filterFields, {
    new: true,
    runValidators: true
  });
  console.log(updatedUser);
  res.status(201).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  })
})

// by Admin
exports.updateUser = catchAsync(async(req, res) => {
  let updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
})

// by Admin
exports.deleteUser = catchAsync(async(req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: {
      deletedUser
    }
  });
})