// Proximity scoring utilities

import { haversineDistance, findNearest, countWithinRadius } from './distance';

export interface ProximityMetrics {
  nearestParkDistance: number;
  nearestTransitDistance: number;
  nearestRoadDistance: number;
  parksWithin2km: number;
  transitWithin1km: number;
}

/**
 * Calculate proximity metrics for a building location
 */
export function calculateProximityMetrics(
  buildingLat: number,
  buildingLng: number,
  parks: Array<{ lat: number; lng: number }>,
  transit: Array<{ lat: number; lng: number }>,
  roads: Array<{ lat: number; lng: number }>
): ProximityMetrics {
  const nearestPark = findNearest(buildingLat, buildingLng, parks);
  const nearestTransit = findNearest(buildingLat, buildingLng, transit);
  const nearestRoad = findNearest(buildingLat, buildingLng, roads);

  return {
    nearestParkDistance: nearestPark?.distance || 10000,
    nearestTransitDistance: nearestTransit?.distance || 10000,
    nearestRoadDistance: nearestRoad?.distance || 10000,
    parksWithin2km: countWithinRadius(buildingLat, buildingLng, parks, 2000),
    transitWithin1km: countWithinRadius(buildingLat, buildingLng, transit, 1000),
  };
}
