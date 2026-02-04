/**
 * constants.js
 * Application-wide constants
 * Centralized location for magic numbers and configuration values
 */

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// API Response Messages
const MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  NOT_FOUND: 'Resource not found',
  BAD_REQUEST: 'Invalid request parameters',
  INTERNAL_ERROR: 'An internal server error occurred',
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'Access forbidden'
};

// Green Score Tiers
const GREEN_SCORE_TIERS = {
  EXCELLENT: { min: 0.8, max: 1.0, label: 'Excellent' },
  GOOD: { min: 0.6, max: 0.8, label: 'Good' },
  FAIR: { min: 0.4, max: 0.6, label: 'Fair' },
  POOR: { min: 0.2, max: 0.4, label: 'Poor' },
  VERY_POOR: { min: 0.0, max: 0.2, label: 'Very Poor' }
};

// Distance Thresholds (meters)
const DISTANCE_THRESHOLDS = {
  PARK: {
    EXCELLENT: 200,
    GOOD: 500,
    FAIR: 1000,
    POOR: 2000
  },
  TRANSIT: {
    EXCELLENT: 150,
    GOOD: 400,
    FAIR: 700,
    POOR: 1500
  }
};

// Search Radii (meters)
const SEARCH_RADIUS = {
  PARKS: 2000,
  TRANSIT: 1500,
  BUILDINGS: 5000
};

// Scoring Weights
const SCORING_WEIGHTS = {
  GREEN_SCORE: {
    PARK_PROXIMITY: 0.35,
    TRANSIT_ACCESS: 0.30,
    PARK_DENSITY: 0.20,
    TRANSIT_DENSITY: 0.15
  },
  COMBINED_SCORE: {
    GREEN_SCORE: 0.6,
    BUSINESS_FIT: 0.4
  },
  IMPACT_SCORE: {
    CARBON_REDUCTION: 0.4,
    TRANSIT_USAGE: 0.3,
    GREEN_SPACE_ACCESS: 0.3
  }
};

// Carbon Emission Constants
const CARBON_CONSTANTS = {
  CAR_EMISSIONS_PER_KM: 0.2, // kg CO2 per km
  AVERAGE_COMMUTE_KM: 10,
  WORKING_DAYS_PER_MONTH: 20,
  CO2_PER_TREE_PER_YEAR: 20 // kg CO2 absorbed per tree per year
};

// Pagination Defaults
const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
  DEFAULT_OFFSET: 0
};

// Request Limits
const REQUEST_LIMITS = {
  MESSAGE_MAX_LENGTH: 500,
  BATCH_MAX_SIZE: 100
};

// Cache TTL (Time To Live) in seconds
const CACHE_TTL = {
  GEOJSON_DATA: 3600, // 1 hour
  RECOMMENDATIONS: 300, // 5 minutes
  STATISTICS: 600 // 10 minutes
};

// Coordinate Bounds for Patiala, Punjab
const PATIALA_BOUNDS = {
  MIN_LAT: 30.2,
  MAX_LAT: 30.4,
  MIN_LNG: 76.3,
  MAX_LNG: 76.5,
  CENTER: {
    lat: 30.3398,
    lng: 76.3869
  }
};

// Business Type Categories
const BUSINESS_CATEGORIES = {
  FOOD_BEVERAGE: ['eco_cafe'],
  OFFICE: ['green_office', 'coworking_space'],
  RETAIL: ['sustainable_retail'],
  WELLNESS: ['wellness_center']
};

// Error Codes
const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  INVALID_COORDINATES: 'INVALID_COORDINATES',
  INVALID_BUSINESS_TYPE: 'INVALID_BUSINESS_TYPE',
  DATA_LOAD_ERROR: 'DATA_LOAD_ERROR'
};

// API Versioning
const API_VERSION = {
  CURRENT: 'v1',
  SUPPORTED: ['v1']
};

module.exports = {
  HTTP_STATUS,
  MESSAGES,
  GREEN_SCORE_TIERS,
  DISTANCE_THRESHOLDS,
  SEARCH_RADIUS,
  SCORING_WEIGHTS,
  CARBON_CONSTANTS,
  PAGINATION,
  REQUEST_LIMITS,
  CACHE_TTL,
  PATIALA_BOUNDS,
  BUSINESS_CATEGORIES,
  ERROR_CODES,
  API_VERSION
};
