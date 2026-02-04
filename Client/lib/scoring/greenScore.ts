// Green Score calculation engine

import { ProximityMetrics } from '../geo/proximity';
import { normalizeDistance, normalizeCount } from './normalize';
import { SCORING_WEIGHTS, BUSINESS_TYPE_PREFERENCES } from './weights';

export interface GreenScoreResult {
  score: number; // 0-100
  tier: string;
  breakdown: {
    parkProximity: number;
    transitProximity: number;
    roadProximity: number;
    parkCount: number;
    transitCount: number;
  };
}

/**
 * Calculate Green Score for a location
 */
export function calculateGreenScore(
  metrics: ProximityMetrics,
  businessType?: string
): GreenScoreResult {
  // Get weights based on business type
  const weights = businessType && businessType in BUSINESS_TYPE_PREFERENCES
    ? BUSINESS_TYPE_PREFERENCES[businessType as keyof typeof BUSINESS_TYPE_PREFERENCES]
    : SCORING_WEIGHTS;

  // Normalize all metrics to 0-1
  const parkProximityScore = normalizeDistance(metrics.nearestParkDistance, 800);
  const transitProximityScore = normalizeDistance(metrics.nearestTransitDistance, 600);
  const roadProximityScore = normalizeDistance(metrics.nearestRoadDistance, 200);
  const parkCountScore = normalizeCount(metrics.parksWithin2km, 8);
  const transitCountScore = normalizeCount(metrics.transitWithin1km, 5);

  // Calculate weighted score
  const rawScore =
    weights.parkProximity * parkProximityScore +
    weights.transitProximity * transitProximityScore +
    weights.roadProximity * roadProximityScore +
    weights.parkCount * parkCountScore +
    weights.transitCount * transitCountScore;

  // Convert to 0-100 scale
  const score = Math.round(rawScore * 100);

  // Determine tier
  let tier = 'Low';
  if (score >= 80) tier = 'Excellent';
  else if (score >= 60) tier = 'Good';
  else if (score >= 40) tier = 'Fair';

  return {
    score,
    tier,
    breakdown: {
      parkProximity: Math.round(parkProximityScore * 100),
      transitProximity: Math.round(transitProximityScore * 100),
      roadProximity: Math.round(roadProximityScore * 100),
      parkCount: Math.round(parkCountScore * 100),
      transitCount: Math.round(transitCountScore * 100),
    },
  };
}
