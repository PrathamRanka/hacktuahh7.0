/**
 * geo.service.js
 * Geospatial service for calculating environmental metrics
 * Orchestrates data loaders and distance calculations
 */

const { loadBuildings } = require('../data/loaders/buildings.loader');
const { loadParks } = require('../data/loaders/parks.loader');
const { loadTransitStops } = require('../data/loaders/transit.loader');
const { 
  findNearest, 
  findWithinRadius, 
  isValidCoordinate 
} = require('../utils/distance.util');

// Search radius constants (in meters)
const SEARCH_RADIUS = {
  PARKS: 2000,
  TRANSIT: 1500
};

/**
 * Calculate environmental metrics for a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Object} Environmental metrics
 */
function calculateLocationMetrics(lat, lng) {
  if (!isValidCoordinate(lat, lng)) {
    throw new Error('Invalid coordinates provided');
  }

  // Load all data
  const parks = loadParks();
  const transitStops = loadTransitStops();

  // Find nearest park
  const nearestPark = findNearest(lat, lng, parks);
  const nearestParkDistance = nearestPark ? nearestPark.distance : Infinity;

  // Find nearest transit stop
  const nearestTransit = findNearest(lat, lng, transitStops);
  const nearestTransitDistance = nearestTransit ? nearestTransit.distance : Infinity;

  // Find parks within radius
  const parksNearby = findWithinRadius(lat, lng, parks, SEARCH_RADIUS.PARKS);
  const parksWithinRadius = parksNearby.length;

  // Find transit stops within radius
  const transitNearby = findWithinRadius(lat, lng, transitStops, SEARCH_RADIUS.TRANSIT);
  const transitWithinRadius = transitNearby.length;

  return {
    nearestParkDistance,
    nearestTransitDistance,
    parksWithinRadius,
    transitWithinRadius,
    nearestPark: nearestPark ? {
      id: nearestPark.id,
      name: nearestPark.name,
      distance: nearestPark.distance
    } : null,
    nearestTransit: nearestTransit ? {
      id: nearestTransit.id,
      name: nearestTransit.name,
      distance: nearestTransit.distance
    } : null,
    parksNearby: parksNearby.map(p => ({
      id: p.id,
      name: p.name,
      distance: p.distance
    })),
    transitNearby: transitNearby.map(t => ({
      id: t.id,
      name: t.name,
      distance: t.distance
    }))
  };
}

/**
 * Calculate metrics for multiple locations
 * @param {Array<Object>} locations - Array of {lat, lng} objects
 * @returns {Array<Object>} Array of metrics
 */
function calculateBulkMetrics(locations) {
  if (!Array.isArray(locations)) {
    throw new Error('Locations must be an array');
  }

  return locations.map(loc => {
    try {
      return calculateLocationMetrics(loc.lat, loc.lng);
    } catch (error) {
      console.error(`Error calculating metrics for ${loc.lat}, ${loc.lng}:`, error.message);
      return null;
    }
  }).filter(metrics => metrics !== null);
}

/**
 * Get all available buildings with their coordinates
 * @returns {Array<Object>} Array of buildings
 */
function getAllBuildings() {
  return loadBuildings();
}

/**
 * Get all available parks
 * @returns {Array<Object>} Array of parks
 */
function getAllParks() {
  return loadParks();
}

/**
 * Get all available transit stops
 * @returns {Array<Object>} Array of transit stops
 */
function getAllTransitStops() {
  return loadTransitStops();
}

/**
 * Get summary statistics for the loaded data
 * @returns {Object} Data statistics
 */
function getDataStatistics() {
  const buildings = loadBuildings();
  const parks = loadParks();
  const transitStops = loadTransitStops();

  return {
    buildingsCount: buildings.length,
    parksCount: parks.length,
    transitStopsCount: transitStops.length,
    dataLoaded: buildings.length > 0 || parks.length > 0 || transitStops.length > 0
  };
}

/**
 * Find buildings near a specific park
 * @param {string} parkId - Park ID
 * @param {number} radiusMeters - Search radius
 * @returns {Array<Object>} Buildings within radius
 */
function findBuildingsNearPark(parkId, radiusMeters = 500) {
  const parks = loadParks();
  const buildings = loadBuildings();

  const park = parks.find(p => p.id === parkId);
  if (!park) {
    throw new Error(`Park not found: ${parkId}`);
  }

  return findWithinRadius(park.lat, park.lng, buildings, radiusMeters);
}

/**
 * Find buildings near a transit stop
 * @param {string} transitId - Transit stop ID
 * @param {number} radiusMeters - Search radius
 * @returns {Array<Object>} Buildings within radius
 */
function findBuildingsNearTransit(transitId, radiusMeters = 400) {
  const transitStops = loadTransitStops();
  const buildings = loadBuildings();

  const transit = transitStops.find(t => t.id === transitId);
  if (!transit) {
    throw new Error(`Transit stop not found: ${transitId}`);
  }

  return findWithinRadius(transit.lat, transit.lng, buildings, radiusMeters);
}

/**
 * Get environmental coverage score for the entire city
 * @returns {Object} Coverage metrics
 */
function getCityCoverageMetrics() {
  const buildings = loadBuildings();
  const parks = loadParks();
  const transitStops = loadTransitStops();

  if (buildings.length === 0) {
    return {
      parkCoverage: 0,
      transitCoverage: 0,
      totalBuildings: 0
    };
  }

  let buildingsNearParks = 0;
  let buildingsNearTransit = 0;

  buildings.forEach(building => {
    const nearestPark = findNearest(building.lat, building.lng, parks);
    const nearestTransit = findNearest(building.lat, building.lng, transitStops);

    if (nearestPark && nearestPark.distance < 500) {
      buildingsNearParks++;
    }

    if (nearestTransit && nearestTransit.distance < 400) {
      buildingsNearTransit++;
    }
  });

  return {
    parkCoverage: buildingsNearParks / buildings.length,
    transitCoverage: buildingsNearTransit / buildings.length,
    totalBuildings: buildings.length,
    buildingsNearParks,
    buildingsNearTransit
  };
}

module.exports = {
  calculateLocationMetrics,
  calculateBulkMetrics,
  getAllBuildings,
  getAllParks,
  getAllTransitStops,
  getDataStatistics,
  findBuildingsNearPark,
  findBuildingsNearTransit,
  getCityCoverageMetrics,
  SEARCH_RADIUS
};
