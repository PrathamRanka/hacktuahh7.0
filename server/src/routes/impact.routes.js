/**
 * impact.routes.js
 * Routes for environmental impact endpoints
 */

const express = require('express');
const router = express.Router();
const {
  calculateImpactController,
  compareImpactController
} = require('../controllers/impact.controller');

/**
 * POST /impact
 * Calculate environmental impact for a location
 */
router.post('/', calculateImpactController);

/**
 * POST /impact/compare
 * Compare environmental impact between two locations
 */
router.post('/compare', compareImpactController);

module.exports = router;
