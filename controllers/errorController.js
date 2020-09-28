const AppError = require('../util/appError');

// Development Error
const sendDevError = (err, req, res) => {
  if(req.originalUrl.startsWith('/interndigger/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    })
  }
  //Render
  else {
    res.status(200).render('error', {
      title: 'Something went wrong',
      msg: err.message
    })
  }
}

// Productional Error
const sendProdError = (err, req, res) => {
  //interndigger/api
  if(req.originalUrl.startsWith('/interndigger/api')) {
    //Operational, trusted error: send message to the client
    if(err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      })
    }
    //Programming or unwanted error: don't leak error
    else {
      // console.log(err);
      res.status(err.statusCode).json({
        status: 'fail',
        message: 'Something went wrong'
      })
    }
  }
  //Render
  else {
    //Operational, trusted error: send message to the client
    if(err.isOperational) {
      res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
      })
    }
    //Programming or unwanted error: don't leak error
    else {
      res.status(err.statusCode).render('error', {
        title: 'something went wrong!',
        msg: 'Try again later'
      })
    }
  }
}

const handleDuplicateFieldsError = error => {
  const message = `Duplicate field value ${error.keyValue.email}. Please use another value`;
  return new AppError(message, 400);
}

const handleValidationError = error => {
  const errors = Object.values(error.errors).map(el => el.message); 
  const message = `Validation error: ${errors.join('. ')}`;
  return new AppError(message, 400);
}

const handleCastError = error => {
  const message = `Invalid: ${error.path}: ${error.value}`;
  return new AppError(message, 400);
}

const handleTypeError = error => {
  const message = `Invalid: ${error.path}: ${error.value}`;
  return new AppError(message, 400);
}

const handleJWTError = () => new AppError('Invalid Token', 401);

const handleJWTExpireError = () => new AppError('Token Expired', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  console.log(err);

  if(process.env.NODE_ENV === 'development') 
    sendDevError(err, req, res);
  
  else if(process.env.NODE_ENV === 'production') {
    let error = {...err};
    error.message = err.message;
    
    if(err.code === 11000)
      error = handleDuplicateFieldsError(error);

    if(err.name === 'ValidationError')
      error = handleValidationError(error);
    
    if(err.name === 'JsonWebTokenError')
      error = handleJWTError();

    if(err.name === 'TokenExpiredError')
      error = handleJWTExpireError();

    if(err.name === 'CastError')
      error = handleCastError(error);

    if(err.name === 'TypeError')
      error = handleTypeError(error);

    sendProdError(error, req, res);
  }
}