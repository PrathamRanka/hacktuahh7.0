// Normalization functions for scoring

/**
 * Normalize distance to 0-1 score (closer = higher score)
 * Uses inverse exponential decay
 */
export function normalizeDistance(distanceMeters: number, optimalDistance: number = 500): number {
  if (distanceMeters <= 0) return 1;
  if (distanceMeters >= 5000) return 0;
  
  // Exponential decay: score decreases as distance increases
  const score = Math.exp(-distanceMeters / optimalDistance);
  return Math.max(0, Math.min(1, score));
}

/**
 * Normalize count to 0-1 score (more = higher score)
 */
export function normalizeCount(count: number, maxCount: number = 10): number {
  if (count <= 0) return 0;
  if (count >= maxCount) return 1;
  
  return count / maxCount;
}

/**
 * Linear normalization
 */
export function normalizeLinear(value: number, min: number, max: number): number {
  if (value <= min) return 0;
  if (value >= max) return 1;
  
  return (value - min) / (max - min);
}
