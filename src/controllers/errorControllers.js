import { AppError } from '../utils/appError.js';

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(400, message);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name}. Please use another value!`;
  return new AppError(400, message);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(400, message);
};

// development error
const sendDebError = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};
// production error
const sendProdError = (res, err) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!!',
    });
  }
};

export const globalErrorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // console.log('=====error details====', err);
  // console.log('=====error name====', err.name);
  // console.log('=====error value====', err.value);
  // console.log('=====error path====', err.path);

  if (process.env.NODE_ENV === 'development') {
    sendDebError(res, err);
  } else if (process.env.NODE_ENV === 'production') {
    // NOTE: in this case no need to copy object, because per request error are different
    // let error = { ...err };
    if (err.name === 'CastError') err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') err = handleValidationErrorDB(err);

    sendProdError(res, err);
  }
};
