/**
 * validate.middleware.js
 * Request validation middleware
 * Provides common validation functions
 */

const { HTTP_STATUS } = require('../config/constants');

/**
 * Validate request body exists
 */
function validateBody(req, res, next) {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: {
        message: 'Request body is required',
        code: 'VALIDATION_ERROR'
      }
    });
  }
  next();
}

/**
 * Validate required fields in request body
 * @param {Array<string>} fields - Required field names
 */
function validateRequiredFields(fields) {
  return (req, res, next) => {
    const missing = [];
    
    for (const field of fields) {
      if (req.body[field] === undefined || req.body[field] === null) {
        missing.push(field);
      }
    }
    
    if (missing.length > 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: {
          message: 'Missing required fields',
          code: 'VALIDATION_ERROR',
          details: {
            missing
          }
        }
      });
    }
    
    next();
  };
}

/**
 * Validate coordinates
 */
function validateCoordinates(req, res, next) {
  const { lat, lng } = req.body;
  
  if (lat === undefined || lng === undefined) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: {
        message: 'Coordinates (lat, lng) are required',
        code: 'VALIDATION_ERROR'
      }
    });
  }
  
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: {
        message: 'Coordinates must be numbers',
        code: 'VALIDATION_ERROR'
      }
    });
  }
  
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: {
        message: 'Invalid coordinate range',
        code: 'VALIDATION_ERROR',
        details: {
          lat: 'Must be between -90 and 90',
          lng: 'Must be between -180 and 180'
        }
      }
    });
  }
  
  next();
}

/**
 * Validate pagination parameters
 */
function validatePagination(req, res, next) {
  const { limit, offset } = req.query;
  
  if (limit !== undefined) {
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 50) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: {
          message: 'Limit must be between 1 and 50',
          code: 'VALIDATION_ERROR'
        }
      });
    }
  }
  
  if (offset !== undefined) {
    const offsetNum = parseInt(offset, 10);
    if (isNaN(offsetNum) || offsetNum < 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: {
          message: 'Offset must be a non-negative number',
          code: 'VALIDATION_ERROR'
        }
      });
    }
  }
  
  next();
}

/**
 * Sanitize string input
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
}

/**
 * Sanitize request body
 */
function sanitizeBody(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]);
      }
    }
  }
  next();
}

module.exports = {
  validateBody,
  validateRequiredFields,
  validateCoordinates,
  validatePagination,
  sanitizeBody,
  sanitizeString
};
