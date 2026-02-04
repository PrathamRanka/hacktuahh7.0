// Business fit scoring logic

/**
 * Calculate business fit score
 * Simple implementation - can be enhanced based on requirements
 */
function calculateBusinessFit(greenScore, businessType) {
  // Business fit is primarily based on green score
  // Different business types may have different thresholds
  
  const baseScore = greenScore.score / 100;
  
  // Adjust based on business type preferences
  let fitMultiplier = 1.0;
  
  if (businessType === 'eco_cafe' && greenScore.breakdown.parkProximity >= 70) {
    fitMultiplier = 1.1; // Bonus for park proximity
  } else if (businessType === 'green_office' && greenScore.breakdown.transitProximity >= 70) {
    fitMultiplier = 1.1; // Bonus for transit access
  } else if (businessType === 'wellness_center' && greenScore.breakdown.parkCount >= 60) {
    fitMultiplier = 1.15; // Bonus for multiple parks
  }
  
  const fitScore = Math.min(1.0, baseScore * fitMultiplier);
  
  return {
    score: fitScore,
    percentage: Math.round(fitScore * 100),
  };
}

module.exports = {
  calculateBusinessFit,
};
