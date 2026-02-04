// Scoring service - orchestrates green score calculation

const { loadBuildings } = require('../data/loaders/buildings.loader');
const { loadParks } = require('../data/loaders/parks.loader');
const { loadTransit } = require('../data/loaders/transit.loader');
const { calculateProximityMetrics } = require('./geo.service');
const { calculateGreenScore } = require('../logic/greenScore.logic');
const { calculateBusinessFit } = require('../logic/businessFit.logic');
const { generateExplanation } = require('../logic/explanation.logic');

/**
 * Get recommendations for a business type
 */
async function getRecommendations(businessType, limit = 20) {
  try {
    // Load all data
    const [buildings, parks, transit] = await Promise.all([
      loadBuildings(),
      loadParks(),
      loadTransit(),
    ]);

    console.log(`Processing ${buildings.length} buildings for ${businessType}`);

    // Score each building
    const scoredBuildings = buildings
      .slice(0, 100) // Limit to first 100 for performance
      .map(building => {
        // Calculate proximity metrics
        const metrics = calculateProximityMetrics(building, parks, transit);

        // Calculate green score
        const greenScore = calculateGreenScore(metrics, businessType);

        // Calculate business fit
        const businessFit = calculateBusinessFit(greenScore, businessType);

        // Generate explanation
        const explanation = generateExplanation(greenScore, metrics, businessType);

        return {
          id: building.id,
          lat: building.lat,
          lng: building.lng,
          name: building.name || `Building ${building.id}`,
          greenScore: greenScore.score / 100,
          tier: greenScore.tier,
          businessFitScore: businessFit.score,
          explanation,
          metrics: {
            nearestParkDistance: Math.round(metrics.nearestParkDistance),
            nearestTransitDistance: Math.round(metrics.nearestTransitDistance),
            parksWithinRadius: metrics.parksWithin2km,
            transitWithinRadius: metrics.transitWithin1km,
            nearestPark: metrics.nearestPark,
            nearestTransit: metrics.nearestTransit,
          },
          breakdown: greenScore.breakdown,
        };
      });

    // Sort by green score (descending)
    scoredBuildings.sort((a, b) => b.greenScore - a.greenScore);

    // Add rank and limit results
    const recommendations = scoredBuildings
      .slice(0, limit)
      .map((building, index) => ({
        ...building,
        rank: index + 1,
      }));

    return recommendations;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
}

/**
 * Get single building score
 */
async function getScore(lat, lng, businessType) {
  try {
    const [parks, transit] = await Promise.all([
      loadParks(),
      loadTransit(),
    ]);

    const building = { lat, lng };
    const metrics = calculateProximityMetrics(building, parks, transit);
    const greenScore = calculateGreenScore(metrics, businessType);
    const businessFit = calculateBusinessFit(greenScore, businessType);
    const explanation = generateExplanation(greenScore, metrics, businessType);

    return {
      greenScore: greenScore.score / 100,
      tier: greenScore.tier,
      businessFitScore: businessFit.score,
      explanation,
      metrics: {
        nearestParkDistance: Math.round(metrics.nearestParkDistance),
        nearestTransitDistance: Math.round(metrics.nearestTransitDistance),
        parksWithinRadius: metrics.parksWithin2km,
        transitWithinRadius: metrics.transitWithin1km,
      },
      breakdown: greenScore.breakdown,
    };
  } catch (error) {
    console.error('Error calculating score:', error);
    throw error;
  }
}

module.exports = {
  getRecommendations,
  getScore,
};
