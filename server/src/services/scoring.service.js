/**
 * scoring.service.js
 * Scoring service combining environmental and business metrics
 * Orchestrates green score and business fit calculations
 */

const { calculateGreenScore, getScoreBreakdown, getScoreTier } = require('../logic/greenScore.logic');
const { calculateBusinessFit, getBusinessFitBreakdown, isValidBusinessType } = require('../logic/businessFit.logic');
const { generateExplanation, generateDetailedExplanation } = require('../logic/explanation.logic');
const { calculateLocationMetrics, getAllBuildings } = require('./geo.service');

/**
 * Calculate complete score for a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} businessType - Type of business
 * @returns {Object} Complete scoring data
 */
function calculateLocationScore(lat, lng, businessType) {
  // Validate business type
  if (businessType && !isValidBusinessType(businessType)) {
    throw new Error(`Invalid business type: ${businessType}`);
  }

  // Get environmental metrics
  const metrics = calculateLocationMetrics(lat, lng);

  // Calculate green score
  const greenScore = calculateGreenScore(metrics);
  const scoreBreakdown = getScoreBreakdown(metrics);
  const tier = getScoreTier(greenScore);

  // Calculate business fit if business type provided
  let businessFitScore = null;
  let businessFitBreakdown = null;

  if (businessType) {
    businessFitScore = calculateBusinessFit(businessType, metrics);
    businessFitBreakdown = getBusinessFitBreakdown(businessType, metrics);
  }

  // Generate explanation
  const locationData = {
    greenScore,
    businessFitScore,
    metrics,
    businessType
  };

  const explanation = generateExplanation(locationData);
  const detailedExplanation = generateDetailedExplanation(locationData, scoreBreakdown);

  return {
    lat,
    lng,
    greenScore,
    tier,
    businessFitScore,
    metrics,
    scoreBreakdown,
    businessFitBreakdown,
    explanation,
    detailedExplanation
  };
}

/**
 * Get recommendations for a business type
 * @param {string} businessType - Type of business
 * @param {Object} options - Filtering options
 * @returns {Array<Object>} Sorted recommendations
 */
function getRecommendations(businessType, options = {}) {
  const {
    limit = 10,
    minGreenScore = 0,
    minBusinessFit = 0,
    sortBy = 'combined' // 'combined', 'greenScore', 'businessFit'
  } = options;

  // Validate business type
  if (!isValidBusinessType(businessType)) {
    throw new Error(`Invalid business type: ${businessType}`);
  }

  // Get all buildings
  const buildings = getAllBuildings();

  if (buildings.length === 0) {
    return [];
  }

  // Calculate scores for all buildings
  const scoredLocations = buildings.map((building, index) => {
    try {
      const score = calculateLocationScore(building.lat, building.lng, businessType);
      
      return {
        id: building.id,
        lat: building.lat,
        lng: building.lng,
        name: building.name,
        greenScore: score.greenScore,
        businessFitScore: score.businessFitScore,
        combinedScore: (score.greenScore * 0.6) + (score.businessFitScore * 0.4),
        tier: score.tier,
        explanation: score.explanation,
        metrics: score.metrics
      };
    } catch (error) {
      console.error(`Error scoring building ${building.id}:`, error.message);
      return null;
    }
  }).filter(loc => loc !== null);

  // Filter by minimum scores
  const filtered = scoredLocations.filter(loc => 
    loc.greenScore >= minGreenScore && 
    loc.businessFitScore >= minBusinessFit
  );

  // Sort based on criteria
  let sorted;
  if (sortBy === 'greenScore') {
    sorted = filtered.sort((a, b) => b.greenScore - a.greenScore);
  } else if (sortBy === 'businessFit') {
    sorted = filtered.sort((a, b) => b.businessFitScore - a.businessFitScore);
  } else {
    sorted = filtered.sort((a, b) => b.combinedScore - a.combinedScore);
  }

  // Add rank
  const ranked = sorted.slice(0, limit).map((loc, index) => ({
    ...loc,
    rank: index + 1
  }));

  return ranked;
}

/**
 * Compare two locations
 * @param {Object} location1 - First location {lat, lng}
 * @param {Object} location2 - Second location {lat, lng}
 * @param {string} businessType - Business type for comparison
 * @returns {Object} Comparison results
 */
function compareLocations(location1, location2, businessType) {
  const score1 = calculateLocationScore(location1.lat, location1.lng, businessType);
  const score2 = calculateLocationScore(location2.lat, location2.lng, businessType);

  const winner = score1.greenScore > score2.greenScore ? 'location1' : 'location2';
  const scoreDifference = Math.abs(score1.greenScore - score2.greenScore);

  return {
    location1: score1,
    location2: score2,
    winner,
    scoreDifference,
    percentageDifference: (scoreDifference * 100).toFixed(1)
  };
}

/**
 * Get score distribution across all buildings
 * @returns {Object} Score distribution statistics
 */
function getScoreDistribution() {
  const buildings = getAllBuildings();

  if (buildings.length === 0) {
    return {
      total: 0,
      distribution: {}
    };
  }

  const scores = buildings.map(building => {
    const metrics = calculateLocationMetrics(building.lat, building.lng);
    return calculateGreenScore(metrics);
  });

  const distribution = {
    excellent: scores.filter(s => s >= 0.8).length,
    good: scores.filter(s => s >= 0.6 && s < 0.8).length,
    fair: scores.filter(s => s >= 0.4 && s < 0.6).length,
    poor: scores.filter(s => s >= 0.2 && s < 0.4).length,
    veryPoor: scores.filter(s => s < 0.2).length
  };

  const average = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const max = Math.max(...scores);
  const min = Math.min(...scores);

  return {
    total: buildings.length,
    distribution,
    statistics: {
      average,
      max,
      min
    }
  };
}

/**
 * Find best location for a specific business type
 * @param {string} businessType - Business type
 * @returns {Object|null} Best location
 */
function findBestLocation(businessType) {
  const recommendations = getRecommendations(businessType, { limit: 1 });
  return recommendations.length > 0 ? recommendations[0] : null;
}

module.exports = {
  calculateLocationScore,
  getRecommendations,
  compareLocations,
  getScoreDistribution,
  findBestLocation
};
