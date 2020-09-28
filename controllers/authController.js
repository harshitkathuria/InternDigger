const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/appError');

// Signup function
exports.signUp = catchAsync(async (req, res) => {
  if(req.params.role === 'candidate' || req.params.role === 'recruiter')
    req.body.role = req.params.role;

  if(req.body.role === 'candidate')
    req.body.organization = undefined;

  const user = await User.create(req.body);
  // Signing JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN
  });

  const cookieOptions = {
    expires: process.env.COOKIEIN * 24 * 60 * 60 * 1000,
    httpOnly: true,
    // secure: true
  }

  res.cookie('jwt', token, cookieOptions);

  res.status(201).json({
    status: 'success',
    data: {
      token,
      user
    }
  })
})

// login function
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return next(new AppError('Please provide both email and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');

  if(!user || !await user.verifyPassword(password, user.password)) {
    res.status(400).json({
      status: 'fail',
      message: 'Incorrect Username or Password'
    })
    return;
  }

  const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN
  });

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRESIN * 24 * 60 * 60 * 1000),
    httpOnly: true
  }

  res.cookie('jwt', token, cookieOptions);

  res.status(200).json({
    status: 'success',
    data: {
      token,
      user
    }
  })
})

// Protecting from non-logged users
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // Get token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    token = req.headers.authorization.split(' ')[1];
  else if(req.cookies.jwt)
    token = req.cookies.jwt;

  // token not present
  if(!token) {
    return next(new AppError('Please log in first', 401));
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // console.log(decoded);

  // Check User exist
  const user = await User.findById(decoded.id);
  if(!user)
    return next(new AppError('User does not exist', 401));

  // Check is password is changed before isssue of jwt token
  if(user.compareChangedPasswordTime(decoded.iat))
    return next(new AppError('Password was changed...Please log in again', 401));

  // Set user on req 
  req.user = user;
  res.locals.user = user;
  
  next();
});

// For controlling navbar in view templates
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if(req.cookies.jwt) {
    const token = req.cookies.jwt;
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
  
    // Check User exist
    const user = await User.findById(decoded.id);
    if(!user)
      return next();
  
    // Check is password is changed before isssue of jwt token
    if(user.compareChangedPasswordTime(decoded.iat))
      return next();
  
    if(req.originalUrl === '/')
      return next();

    // Set user on req 
    req.user = user;
    res.locals.user = user;
    
    return next();
  }
  else {
    next();
  }
});

exports.logOut = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;
  // console.log(token);

  res.cookie('jwt', token, {
    expires: new Date(Date.now() - 10 * 1000),
    httpOnly: true
  });

  req.user = undefined;
  res.status(200).json({
    status: 'success'
  })
});

//Giving authorization to certain role user only
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role))
      return next(new AppError('You are not authorized to perform this action', 403));
    
    next();
  }
}

// Update Password
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');
  
  if(!await user.verifyPassword(req.body.passwordCurrent, user.password))
    return next(new AppError('Invalid Password', 401));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  user.password = undefined;
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN
  });

  res.cookie('jwt', token, {
    expiresIn: process.env.COOKIE_EXPIRESIN * 24 * 60 * 60 * 1000,
    httpOnly: true
  })

  res.status(201).json({
    status: 'success',
    data: {
      user
    }
  })
})