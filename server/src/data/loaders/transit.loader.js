/**
 * transit.loader.js
 * Load and validate transit stops GeoJSON data
 * Provides normalized access to public transportation locations
 */

const fs = require('fs');
const path = require('path');

// Cache for loaded data
let transitCache = null;

/**
 * Load transit stops from GeoJSON file
 * @returns {Array<Object>} Array of transit stop objects with normalized structure
 */
function loadTransitStops() {
  // Return cached data if available
  if (transitCache) {
    return transitCache;
  }

  try {
    const filePath = path.join(__dirname, '../static/patiala_bus_stops.geojson');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn(`Transit GeoJSON file not found at ${filePath}`);
      return [];
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const geojson = JSON.parse(fileContent);

    // Validate GeoJSON structure
    if (!geojson || geojson.type !== 'FeatureCollection') {
      throw new Error('Invalid GeoJSON: must be a FeatureCollection');
    }

    if (!Array.isArray(geojson.features)) {
      throw new Error('Invalid GeoJSON: features must be an array');
    }

    // Normalize and validate features
    const transitStops = geojson.features
      .map((feature, index) => normalizeTransitStop(feature, index))
      .filter(stop => stop !== null);

    transitCache = transitStops;
    console.log(`Loaded ${transitStops.length} transit stops from GeoJSON`);
    
    return transitStops;
  } catch (error) {
    console.error('Error loading transit stops:', error.message);
    return [];
  }
}

/**
 * Normalize a transit stop feature to standard format
 * @param {Object} feature - GeoJSON feature
 * @param {number} index - Feature index for ID generation
 * @returns {Object|null} Normalized transit stop object or null if invalid
 */
function normalizeTransitStop(feature, index) {
  try {
    if (!feature || !feature.geometry) {
      return null;
    }

    const { geometry, properties = {} } = feature;

    // Transit stops should be Point geometry
    if (geometry.type !== 'Point') {
      console.warn(`Expected Point geometry for transit stop, got ${geometry.type}`);
      return null;
    }

    const [lng, lat] = geometry.coordinates;

    // Validate coordinates
    if (!isValidCoordinate(lat, lng)) {
      console.warn(`Invalid coordinates at index ${index}: lat=${lat}, lng=${lng}`);
      return null;
    }

    // Generate ID if not present
    const id = properties.id || properties.ID || properties.stop_id || `T${index + 1}`;

    return {
      id: String(id),
      lat,
      lng,
      name: properties.name || properties.stop_name || `Bus Stop ${index + 1}`,
      type: properties.type || properties.transit_type || 'bus',
      routes: properties.routes || properties.bus_routes || [],
      operator: properties.operator || properties.transit_operator || null,
      shelter: properties.shelter || false,
      accessibility: properties.accessibility || properties.wheelchair_accessible || false,
      properties: { ...properties } // Keep original properties
    };
  } catch (error) {
    console.warn(`Error normalizing transit stop at index ${index}:`, error.message);
    return null;
  }
}

/**
 * Validate coordinate values
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} True if valid
 */
function isValidCoordinate(lat, lng) {
  return typeof lat === 'number' && typeof lng === 'number' &&
         !isNaN(lat) && !isNaN(lng) &&
         lat >= -90 && lat <= 90 &&
         lng >= -180 && lng <= 180;
}

/**
 * Get transit stop by ID
 * @param {string} id - Transit stop ID
 * @returns {Object|null} Transit stop object or null
 */
function getTransitStopById(id) {
  const stops = loadTransitStops();
  return stops.find(s => s.id === String(id)) || null;
}

/**
 * Filter transit stops by type
 * @param {string} type - Transit type (e.g., 'bus', 'metro')
 * @returns {Array<Object>} Filtered transit stops
 */
function getTransitStopsByType(type) {
  const stops = loadTransitStops();
  return stops.filter(s => s.type === type);
}

/**
 * Get transit stops by route
 * @param {string} route - Route identifier
 * @returns {Array<Object>} Transit stops serving this route
 */
function getTransitStopsByRoute(route) {
  const stops = loadTransitStops();
  return stops.filter(s => 
    Array.isArray(s.routes) && s.routes.includes(route)
  );
}

/**
 * Get all unique transit types
 * @returns {Array<string>} Array of transit types
 */
function getTransitTypes() {
  const stops = loadTransitStops();
  const types = new Set(stops.map(s => s.type));
  return Array.from(types);
}

/**
 * Get all unique routes
 * @returns {Array<string>} Array of route identifiers
 */
function getAllRoutes() {
  const stops = loadTransitStops();
  const routes = new Set();
  
  stops.forEach(stop => {
    if (Array.isArray(stop.routes)) {
      stop.routes.forEach(route => routes.add(route));
    }
  });
  
  return Array.from(routes);
}

/**
 * Clear cache (useful for testing or reloading)
 */
function clearCache() {
  transitCache = null;
}

/**
 * Get transit stops count
 * @returns {number} Number of loaded transit stops
 */
function getTransitStopsCount() {
  const stops = loadTransitStops();
  return stops.length;
}

module.exports = {
  loadTransitStops,
  getTransitStopById,
  getTransitStopsByType,
  getTransitStopsByRoute,
  getTransitTypes,
  getAllRoutes,
  getTransitStopsCount,
  clearCache
};
