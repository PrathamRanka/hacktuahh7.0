/**
 * recommend.controller.js
 * Controller for location recommendation endpoints
 * Handles business type-based recommendations
 */

const { getRecommendations, calculateLocationScore } = require('../services/scoring.service');
const { isValidBusinessType, getAvailableBusinessTypes } = require('../logic/businessFit.logic');

/**
 * POST /recommend
 * Get location recommendations for a business type
 */
async function getRecommendationsController(req, res, next) {
  try {
    const { businessType, limit, minGreenScore, minBusinessFit, sortBy } = req.body;

    // Validate required fields
    if (!businessType) {
      return res.status(400).json({
        success: false,
        error: 'Business type is required',
        message: 'Please provide a businessType in the request body'
      });
    }

    // Validate business type
    if (!isValidBusinessType(businessType)) {
      const availableTypes = getAvailableBusinessTypes();
      return res.status(400).json({
        success: false,
        error: 'Invalid business type',
        message: `Business type must be one of: ${availableTypes.map(t => t.id).join(', ')}`,
        availableTypes
      });
    }

    // Build options
    const options = {
      limit: limit || 10,
      minGreenScore: minGreenScore || 0,
      minBusinessFit: minBusinessFit || 0,
      sortBy: sortBy || 'combined'
    };

    // Validate options
    if (options.limit < 1 || options.limit > 50) {
      return res.status(400).json({
        success: false,
        error: 'Invalid limit',
        message: 'Limit must be between 1 and 50'
      });
    }

    // Get recommendations
    const recommendations = getRecommendations(businessType, options);

    // Return response
    return res.status(200).json({
      success: true,
      businessType,
      count: recommendations.length,
      recommendations: recommendations.map(rec => ({
        id: rec.id,
        lat: rec.lat,
        lng: rec.lng,
        greenScore: parseFloat(rec.greenScore.toFixed(2)),
        businessFitScore: parseFloat(rec.businessFitScore.toFixed(2)),
        rank: rec.rank,
        tier: rec.tier,
        explanation: rec.explanation
      }))
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /recommend/score
 * Get score for a specific location
 */
async function getLocationScoreController(req, res, next) {
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

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        error: 'Invalid coordinate range',
        message: 'Latitude must be between -90 and 90, longitude between -180 and 180'
      });
    }

    // Validate business type if provided
    if (businessType && !isValidBusinessType(businessType)) {
      const availableTypes = getAvailableBusinessTypes();
      return res.status(400).json({
        success: false,
        error: 'Invalid business type',
        message: `Business type must be one of: ${availableTypes.map(t => t.id).join(', ')}`,
        availableTypes
      });
    }

    // Calculate score
    const score = calculateLocationScore(lat, lng, businessType);

    // Return response
    return res.status(200).json({
      success: true,
      location: {
        lat,
        lng
      },
      greenScore: parseFloat(score.greenScore.toFixed(2)),
      tier: score.tier,
      businessFitScore: score.businessFitScore ? parseFloat(score.businessFitScore.toFixed(2)) : null,
      explanation: score.explanation,
      detailedExplanation: score.detailedExplanation,
      metrics: score.metrics
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /recommend/business-types
 * Get all available business types
 */
async function getBusinessTypesController(req, res, next) {
  try {
    const types = getAvailableBusinessTypes();

    return res.status(200).json({
      success: true,
      count: types.length,
      businessTypes: types
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getRecommendationsController,
  getLocationScoreController,
  getBusinessTypesController
};
