/**
 * error.middleware.js
 * Global error handling middleware
 * Catches and formats all errors
 */

const { formatErrorResponse, isOperationalError } = require('../utils/error.util');
const { HTTP_STATUS } = require('../config/constants');
const logger = require('../utils/logger.util');
const { isDevelopment } = require('../config/env');

/**
 * Global error handler middleware
 * Must be registered last in middleware chain
 */
function errorHandler(err, req, res, next) {
  // Log error
  logger.error('Error occurred', err);

  // Determine status code
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  // Format error response
  const includeStack = isDevelopment();
  const errorResponse = formatErrorResponse(err, includeStack);

  // Send response
  res.status(statusCode).json(errorResponse);
}

/**
 * 404 Not Found handler
 * Catches requests to undefined routes
 */
function notFoundHandler(req, res, next) {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      code: 'NOT_FOUND'
    }
  });
}

/**
 * Async error wrapper
 * Wraps async route handlers to catch promise rejections
 */
function asyncErrorHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncErrorHandler
};
