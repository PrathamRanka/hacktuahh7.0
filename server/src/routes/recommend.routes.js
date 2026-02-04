/**
 * recommend.routes.js
 * Routes for location recommendation endpoints
 */

const express = require('express');
const router = express.Router();
const {
  getRecommendationsController,
  getLocationScoreController,
  getBusinessTypesController
} = require('../controllers/recommend.controller');

/**
 * POST /recommend
 * Get location recommendations for a business type
 */
router.post('/', getRecommendationsController);

/**
 * POST /recommend/score
 * Get score for a specific location
 */
router.post('/score', getLocationScoreController);

/**
 * GET /recommend/business-types
 * Get all available business types
 */
router.get('/business-types', getBusinessTypesController);

module.exports = router;
