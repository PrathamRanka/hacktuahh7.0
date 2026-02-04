/**
 * logger.util.js
 * Simple logging utility
 * Provides consistent logging across the application
 */

const { config } = require('../config/env');

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Current log level from config
const currentLevel = LOG_LEVELS[config.logLevel.toUpperCase()] || LOG_LEVELS.INFO;

/**
 * Format log message with timestamp
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} meta - Additional metadata
 * @returns {string} Formatted log message
 */
function formatMessage(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level}] ${message}${metaStr}`;
}

/**
 * Log error message
 * @param {string} message - Error message
 * @param {Error|Object} error - Error object or metadata
 */
function error(message, error = {}) {
  if (currentLevel >= LOG_LEVELS.ERROR) {
    const meta = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : error;
    
    console.error(formatMessage('ERROR', message, meta));
  }
}

/**
 * Log warning message
 * @param {string} message - Warning message
 * @param {Object} meta - Additional metadata
 */
function warn(message, meta = {}) {
  if (currentLevel >= LOG_LEVELS.WARN) {
    console.warn(formatMessage('WARN', message, meta));
  }
}

/**
 * Log info message
 * @param {string} message - Info message
 * @param {Object} meta - Additional metadata
 */
function info(message, meta = {}) {
  if (currentLevel >= LOG_LEVELS.INFO) {
    console.log(formatMessage('INFO', message, meta));
  }
}

/**
 * Log debug message
 * @param {string} message - Debug message
 * @param {Object} meta - Additional metadata
 */
function debug(message, meta = {}) {
  if (currentLevel >= LOG_LEVELS.DEBUG) {
    console.log(formatMessage('DEBUG', message, meta));
  }
}

/**
 * Log HTTP request
 * @param {Object} req - Express request object
 */
function logRequest(req) {
  info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
}

/**
 * Log HTTP response
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {number} duration - Request duration in ms
 */
function logResponse(req, res, duration) {
  const level = res.statusCode >= 400 ? 'WARN' : 'INFO';
  const message = `${req.method} ${req.path} ${res.statusCode} ${duration}ms`;
  
  if (level === 'WARN') {
    warn(message);
  } else {
    info(message);
  }
}

/**
 * Create request logging middleware
 * @returns {Function} Express middleware
 */
function requestLogger() {
  return (req, res, next) => {
    const start = Date.now();
    
    // Log request
    logRequest(req);
    
    // Log response when finished
    res.on('finish', () => {
      const duration = Date.now() - start;
      logResponse(req, res, duration);
    });
    
    next();
  };
}

module.exports = {
  error,
  warn,
  info,
  debug,
  logRequest,
  logResponse,
  requestLogger
};
