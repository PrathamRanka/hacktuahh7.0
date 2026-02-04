// Explanation generation logic

/**
 * Generate human-readable explanation for a recommendation
 */
function generateExplanation(scoreResult, metrics, businessType) {
  const parts = [];

  // Overall assessment
  if (scoreResult.score >= 80) {
    parts.push('This location is excellent for sustainability.');
  } else if (scoreResult.score >= 60) {
    parts.push('This location offers good environmental benefits.');
  } else if (scoreResult.score >= 40) {
    parts.push('This location has moderate sustainability features.');
  } else {
    parts.push('This location has limited environmental advantages.');
  }

  // Park proximity
  if (metrics.nearestParkDistance < 500) {
    parts.push(`Green space is just ${Math.round(metrics.nearestParkDistance)}m away.`);
  } else if (metrics.nearestParkDistance < 1000) {
    parts.push(`A park is within ${Math.round(metrics.nearestParkDistance / 100) * 100}m.`);
  }

  // Transit access
  if (metrics.nearestTransitDistance < 300) {
    parts.push(`Public transit is highly accessible at ${Math.round(metrics.nearestTransitDistance)}m.`);
  } else if (metrics.nearestTransitDistance < 800) {
    parts.push(`Transit stop within walking distance (${Math.round(metrics.nearestTransitDistance)}m).`);
  }

  // Density benefits
  if (metrics.parksWithin2km >= 3) {
    parts.push(`${metrics.parksWithin2km} parks within 2km radius.`);
  }

  if (metrics.transitWithin1km >= 2) {
    parts.push(`${metrics.transitWithin1km} transit options nearby.`);
  }

  // Business-specific insights
  if (businessType === 'eco_cafe' && scoreResult.breakdown.parkProximity >= 70) {
    parts.push('Perfect for customers seeking nature-adjacent dining.');
  } else if (businessType === 'green_office' && scoreResult.breakdown.transitProximity >= 70) {
    parts.push('Excellent commute options for employees.');
  } else if (businessType === 'wellness_center' && metrics.parksWithin2km >= 2) {
    parts.push('Ideal for wellness activities with nearby green spaces.');
  }

  return parts.join(' ');
}

module.exports = {
  generateExplanation,
};
