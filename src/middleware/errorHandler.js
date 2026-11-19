const { nodeEnv } = require('../config/env');

function errorHandler(err, _req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors;

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    message = `${field} already exists`;
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid id';
  }

  if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }

  if (statusCode === 500 && nodeEnv === 'production') {
    message = 'Internal server error';
    errors = undefined;
  }

  if (statusCode === 500 && nodeEnv !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    message,
    ...(errors ? { errors } : {}),
  });
}

module.exports = errorHandler;
