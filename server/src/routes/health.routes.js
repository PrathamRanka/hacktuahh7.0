/**
 * health.routes.js
 * Health check and system status routes
 */

const express = require('express');
const router = express.Router();
const { getDataStatistics } = require('../services/geo.service');

/**
 * GET /health
 * Basic health check endpoint
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CarbonCompass API',
    version: '1.0.0'
  });
});

/**
 * GET /health/detailed
 * Detailed health check with data statistics
 */
router.get('/detailed', (req, res, next) => {
  try {
    const stats = getDataStatistics();
    
    res.status(200).json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'CarbonCompass API',
      version: '1.0.0',
      data: {
        buildingsLoaded: stats.buildingsCount,
        parksLoaded: stats.parksCount,
        transitStopsLoaded: stats.transitStopsCount,
        dataReady: stats.dataLoaded
      },
      uptime: process.uptime()
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
