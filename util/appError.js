class AppError extends Error {
  constructor(message, statusCode) {
  
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.status = String(statusCode).startsWith('4') ? 'fail' : 'success';

    Error.captureStackTrace(this, this.contructor);
  }
}

module.exports = AppError;