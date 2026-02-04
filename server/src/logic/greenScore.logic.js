/**
 * greenScore.logic.js
 * Core algorithm for calculating sustainability scores
 * Weighted combination of environmental proximity metrics
 */

const { normalizeDistance, normalizeCount } = require('./normalization.logic');

// Weight constants for green score calculation
const WEIGHTS = {
  PARK_PROXIMITY: 0.35,      // Proximity to green spaces
  TRANSIT_ACCESS: 0.30,      // Public transportation access
  PARK_DENSITY: 0.20,        // Number of parks nearby
  TRANSIT_DENSITY: 0.15      // Number of transit stops nearby
};

// Distance thresholds (in meters)
const THRESHOLDS = {
  PARK_OPTIMAL: 300,         // Ideal distance to nearest park
  PARK_SEARCH_RADIUS: 2000,  // Max distance to search for parks
  TRANSIT_OPTIMAL: 200,      // Ideal distance to transit
  TRANSIT_SEARCH_RADIUS: 1500, // Max distance to search for transit
  PARK_DECAY_RATE: 0.002,    // How quickly park score decays with distance
  TRANSIT_DECAY_RATE: 0.003  // How quickly transit score decays with distance
};

/**
 * Calculate green score for a single location
 * @param {Object} metrics - Environmental metrics for the location
 * @param {number} metrics.nearestParkDistance - Distance to closest park (meters)
 * @param {number} metrics.nearestTransitDistance - Distance to closest transit (meters)
 * @param {number} metrics.parksWithinRadius - Count of parks within search radius
 * @param {number} metrics.transitWithinRadius - Count of transit stops within search radius
 * @returns {number} Green score between 0 and 1
 */
function calculateGreenScore(metrics) {
  // Validate input
  if (!metrics || typeof metrics !== 'object') {
    throw new Error('Invalid metrics object');
  }

  const {
    nearestParkDistance = Infinity,
    nearestTransitDistance = Infinity,
    parksWithinRadius = 0,
    transitWithinRadius = 0
  } = metrics;

  // Calculate individual component scores
  const parkProximityScore = normalizeDistance(
    nearestParkDistance,
    THRESHOLDS.PARK_OPTIMAL,
    THRESHOLDS.PARK_DECAY_RATE
  );

  const transitProximityScore = normalizeDistance(
    nearestTransitDistance,
    THRESHOLDS.TRANSIT_OPTIMAL,
    THRESHOLDS.TRANSIT_DECAY_RATE
  );

  const parkDensityScore = normalizeCount(parksWithinRadius, 3);
  const transitDensityScore = normalizeCount(transitWithinRadius, 5);

  // Calculate weighted green score
  const greenScore = (
    parkProximityScore * WEIGHTS.PARK_PROXIMITY +
    transitProximityScore * WEIGHTS.TRANSIT_ACCESS +
    parkDensityScore * WEIGHTS.PARK_DENSITY +
    transitDensityScore * WEIGHTS.TRANSIT_DENSITY
  );

  // Ensure score is in valid range
  return Math.max(0, Math.min(1, greenScore));
}

/**
 * Calculate green scores for multiple locations
 * @param {Array<Object>} locationsMetrics - Array of location metrics
 * @returns {Array<number>} Array of green scores
 */
function calculateGreenScores(locationsMetrics) {
  if (!Array.isArray(locationsMetrics)) {
    throw new Error('locationsMetrics must be an array');
  }

  return locationsMetrics.map(metrics => calculateGreenScore(metrics));
}

/**
 * Get breakdown of score components for transparency
 * @param {Object} metrics - Environmental metrics
 * @returns {Object} Detailed score breakdown
 */
function getScoreBreakdown(metrics) {
  const {
    nearestParkDistance = Infinity,
    nearestTransitDistance = Infinity,
    parksWithinRadius = 0,
    transitWithinRadius = 0
  } = metrics;

  const parkProximityScore = normalizeDistance(
    nearestParkDistance,
    THRESHOLDS.PARK_OPTIMAL,
    THRESHOLDS.PARK_DECAY_RATE
  );

  const transitProximityScore = normalizeDistance(
    nearestTransitDistance,
    THRESHOLDS.TRANSIT_OPTIMAL,
    THRESHOLDS.TRANSIT_DECAY_RATE
  );

  const parkDensityScore = normalizeCount(parksWithinRadius, 3);
  const transitDensityScore = normalizeCount(transitWithinRadius, 5);

  const totalScore = calculateGreenScore(metrics);

  return {
    totalScore,
    components: {
      parkProximity: {
        score: parkProximityScore,
        weight: WEIGHTS.PARK_PROXIMITY,
        contribution: parkProximityScore * WEIGHTS.PARK_PROXIMITY,
        distance: nearestParkDistance
      },
      transitAccess: {
        score: transitProximityScore,
        weight: WEIGHTS.TRANSIT_ACCESS,
        contribution: transitProximityScore * WEIGHTS.TRANSIT_ACCESS,
        distance: nearestTransitDistance
      },
      parkDensity: {
        score: parkDensityScore,
        weight: WEIGHTS.PARK_DENSITY,
        contribution: parkDensityScore * WEIGHTS.PARK_DENSITY,
        count: parksWithinRadius
      },
      transitDensity: {
        score: transitDensityScore,
        weight: WEIGHTS.TRANSIT_DENSITY,
        contribution: transitDensityScore * WEIGHTS.TRANSIT_DENSITY,
        count: transitWithinRadius
      }
    }
  };
}

/**
 * Categorize green score into tiers
 * @param {number} score - Green score (0-1)
 * @returns {string} Tier label
 */
function getScoreTier(score) {
  if (score >= 0.8) return 'Excellent';
  if (score >= 0.6) return 'Good';
  if (score >= 0.4) return 'Fair';
  if (score >= 0.2) return 'Poor';
  return 'Very Poor';
}

module.exports = {
  calculateGreenScore,
  calculateGreenScores,
  getScoreBreakdown,
  getScoreTier,
  WEIGHTS,
  THRESHOLDS
};
