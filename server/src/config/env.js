/**
 * env.js
 * Environment configuration and validation
 * Loads and validates environment variables
 */

require('dotenv').config();

/**
 * Get environment variable with fallback
 * @param {string} key - Environment variable key
 * @param {*} defaultValue - Default value if not set
 * @returns {*} Environment variable value or default
 */
function getEnv(key, defaultValue = undefined) {
  const value = process.env[key];
  
  if (value === undefined && defaultValue === undefined) {
    console.warn(`Environment variable ${key} is not set and has no default`);
  }
  
  return value !== undefined ? value : defaultValue;
}

/**
 * Get required environment variable (throws if not set)
 * @param {string} key - Environment variable key
 * @returns {string} Environment variable value
 */
function getRequiredEnv(key) {
  const value = process.env[key];
  
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  
  return value;
}

// Application configuration
const config = {
  // Server configuration
  port: parseInt(getEnv('PORT', '5000'), 10),
  nodeEnv: getEnv('NODE_ENV', 'development'),
  
  // CORS configuration
  corsOrigin: getEnv('CORS_ORIGIN', 'http://localhost:3000'),
  
  // API configuration
  apiPrefix: getEnv('API_PREFIX', '/api'),
  
  // Mapbox configuration (optional)
  mapboxToken: getEnv('MAPBOX_TOKEN', ''),
  
  // Logging
  logLevel: getEnv('LOG_LEVEL', 'info'),
  
  // Rate limiting
  rateLimitWindowMs: parseInt(getEnv('RATE_LIMIT_WINDOW_MS', '900000'), 10), // 15 minutes
  rateLimitMaxRequests: parseInt(getEnv('RATE_LIMIT_MAX_REQUESTS', '100'), 10),
  
  // Data paths (relative to project root)
  dataPath: getEnv('DATA_PATH', './src/data/static'),
  
  // Feature flags
  enableCaching: getEnv('ENABLE_CACHING', 'true') === 'true',
  enableDetailedErrors: getEnv('ENABLE_DETAILED_ERRORS', 'false') === 'true'
};

/**
 * Validate configuration
 */
function validateConfig() {
  const errors = [];
  
  if (config.port < 1 || config.port > 65535) {
    errors.push('PORT must be between 1 and 65535');
  }
  
  if (!['development', 'production', 'test'].includes(config.nodeEnv)) {
    console.warn(`NODE_ENV is set to '${config.nodeEnv}', expected 'development', 'production', or 'test'`);
  }
  
  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
}

// Validate on load
validateConfig();

// Helper functions
const isDevelopment = () => config.nodeEnv === 'development';
const isProduction = () => config.nodeEnv === 'production';
const isTest = () => config.nodeEnv === 'test';

module.exports = {
  config,
  getEnv,
  getRequiredEnv,
  isDevelopment,
  isProduction,
  isTest
};
