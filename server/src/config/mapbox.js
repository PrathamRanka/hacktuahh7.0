/**
 * mapbox.js
 * Mapbox API configuration
 * Placeholder for future map visualization features
 */

const { config } = require('./env');

/**
 * Get Mapbox configuration
 * @returns {Object} Mapbox config
 */
function getMapboxConfig() {
  return {
    accessToken: config.mapboxToken,
    isConfigured: !!config.mapboxToken,
    defaultStyle: 'mapbox://styles/mapbox/streets-v12',
    defaultCenter: [76.3869, 30.3398], // Patiala, Punjab
    defaultZoom: 13
  };
}

/**
 * Check if Mapbox is configured
 * @returns {boolean} True if token is set
 */
function isMapboxConfigured() {
  return !!config.mapboxToken;
}

/**
 * Get Mapbox API URL for geocoding
 * @param {string} query - Search query
 * @returns {string|null} API URL or null if not configured
 */
function getGeocodingUrl(query) {
  if (!isMapboxConfigured()) {
    return null;
  }
  
  const encodedQuery = encodeURIComponent(query);
  return `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?access_token=${config.mapboxToken}`;
}

/**
 * Get Mapbox Static Image URL
 * @param {number} lng - Longitude
 * @param {number} lat - Latitude
 * @param {number} zoom - Zoom level
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string|null} Static image URL or null if not configured
 */
function getStaticImageUrl(lng, lat, zoom = 14, width = 600, height = 400) {
  if (!isMapboxConfigured()) {
    return null;
  }
  
  return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${lng},${lat},${zoom}/${width}x${height}?access_token=${config.mapboxToken}`;
}

module.exports = {
  getMapboxConfig,
  isMapboxConfigured,
  getGeocodingUrl,
  getStaticImageUrl
};
