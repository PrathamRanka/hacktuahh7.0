/**
 * error.util.js
 * Error handling utilities
 * Custom error classes and error formatting
 */

const { HTTP_STATUS, ERROR_CODES } = require('../config/constants');

/**
 * Base application error class
 */
class AppError extends Error {
  constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errorCode = ERROR_CODES.INTERNAL_ERROR) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error (400)
 */
class ValidationError extends AppError {
  constructor(message, details = {}) {
    super(message, HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    this.details = details;
  }
}

/**
 * Not found error (404)
 */
class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
  }
}

/**
 * Invalid coordinates error (400)
 */
class InvalidCoordinatesError extends AppError {
  constructor(message = 'Invalid coordinates provided') {
    super(message, HTTP_STATUS.BAD_REQUEST, ERROR_CODES.INVALID_COORDINATES);
  }
}

/**
 * Invalid business type error (400)
 */
class InvalidBusinessTypeError extends AppError {
  constructor(businessType) {
    super(
      `Invalid business type: ${businessType}`,
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.INVALID_BUSINESS_TYPE
    );
  }
}

/**
 * Data load error (500)
 */
class DataLoadError extends AppError {
  constructor(message = 'Failed to load data') {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.DATA_LOAD_ERROR);
  }
}

/**
 * Format error for API response
 * @param {Error} error - Error object
 * @param {boolean} includeStack - Whether to include stack trace
 * @returns {Object} Formatted error response
 */
function formatErrorResponse(error, includeStack = false) {
  const response = {
    success: false,
    error: {
      message: error.message || 'An unexpected error occurred',
      code: error.errorCode || ERROR_CODES.INTERNAL_ERROR
    }
  };

  // Add details if available (for validation errors)
  if (error.details) {
    response.error.details = error.details;
  }

  // Add stack trace in development
  if (includeStack && error.stack) {
    response.error.stack = error.stack;
  }

  return response;
}

/**
 * Check if error is operational (expected)
 * @param {Error} error - Error object
 * @returns {boolean} True if operational
 */
function isOperationalError(error) {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}

/**
 * Wrap async route handlers to catch errors
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  InvalidCoordinatesError,
  InvalidBusinessTypeError,
  DataLoadError,
  formatErrorResponse,
  isOperationalError,
  asyncHandler
};
