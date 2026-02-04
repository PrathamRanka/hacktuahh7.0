/**
 * impact.controller.js
 * Controller for environmental impact endpoints
 * Handles impact calculations and projections
 */

const { calculateImpact, compareImpact } = require('../services/impact.service');
const { calculateLocationScore } = require('../services/scoring.service');
const { isValidBusinessType } = require('../logic/businessFit.logic');

/**
 * POST /impact
 * Calculate environmental impact for a location
 */
async function calculateImpactController(req, res, next) {
  try {
    const { lat, lng, businessType } = req.body;

    // Validate required fields
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Coordinates required',
        message: 'Please provide lat and lng in the request body'
      });
    }

    // Validate coordinates
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Invalid coordinates',
        message: 'Latitude and longitude must be numbers'
      });
    }

    // Validate business type if provided
    if (businessType && !isValidBusinessType(businessType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid business type',
        message: 'Please provide a valid business type'
      });
    }

    // Get location score and metrics
    const locationData = calculateLocationScore(lat, lng, businessType);

    // Calculate impact
    const impact = calculateImpact(locationData);

    // Return response
    return res.status(200).json({
      success: true,
      location: {
        lat,
        lng
      },
      impact: {
        impactScore: parseFloat(impact.impactScore.toFixed(2)),
        carbonReduction: parseFloat(impact.carbonReduction.toFixed(1)),
        transitUsageIncrease: parseFloat((impact.transitUsageIncrease * 100).toFixed(0)),
        greenSpaceAccess: parseFloat((impact.greenSpaceAccess * 100).toFixed(0)),
        wellbeingScore: parseFloat(impact.wellbeingScore.toFixed(0)),
        projections: impact.projections
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /impact/compare
 * Compare environmental impact between two locations
 */
async function compareImpactController(req, res, next) {
  try {
    const { location1, location2, businessType } = req.body;

    // Validate location1
    if (!location1 || location1.lat === undefined || location1.lng === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Invalid location1',
        message: 'Please provide location1 with lat and lng'
      });
    }

    // Validate location2
    if (!location2 || location2.lat === undefined || location2.lng === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Invalid location2',
        message: 'Please provide location2 with lat and lng'
      });
    }

    // Validate business type if provided
    if (businessType && !isValidBusinessType(businessType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid business type',
        message: 'Please provide a valid business type'
      });
    }

    // Get location data for both
    const location1Data = calculateLocationScore(location1.lat, location1.lng, businessType);
    const location2Data = calculateLocationScore(location2.lat, location2.lng, businessType);

    // Compare impact
    const comparison = compareImpact(location1Data, location2Data);

    // Return response
    return res.status(200).json({
      success: true,
      comparison: {
        location1: {
          coordinates: { lat: location1.lat, lng: location1.lng },
          impactScore: parseFloat(comparison.location1.impactScore.toFixed(2)),
          carbonReduction: parseFloat(comparison.location1.carbonReduction.toFixed(1)),
          transitUsageIncrease: parseFloat((comparison.location1.transitUsageIncrease * 100).toFixed(0)),
          wellbeingScore: parseFloat(comparison.location1.wellbeingScore.toFixed(0))
        },
        location2: {
          coordinates: { lat: location2.lat, lng: location2.lng },
          impactScore: parseFloat(comparison.location2.impactScore.toFixed(2)),
          carbonReduction: parseFloat(comparison.location2.carbonReduction.toFixed(1)),
          transitUsageIncrease: parseFloat((comparison.location2.transitUsageIncrease * 100).toFixed(0)),
          wellbeingScore: parseFloat(comparison.location2.wellbeingScore.toFixed(0))
        },
        differences: {
          carbonReduction: parseFloat(comparison.differences.carbonReduction.toFixed(1)),
          transitUsage: parseFloat(comparison.differences.transitUsage.toFixed(2)),
          betterChoice: comparison.differences.betterChoice
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  calculateImpactController,
  compareImpactController
};
