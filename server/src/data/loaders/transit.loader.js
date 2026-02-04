// GeoJSON loader for transit stops data

const fs = require('fs').promises;
const path = require('path');

let transitCache = null;

/**
 * Load transit stops from GeoJSON file
 */
async function loadTransit() {
  if (transitCache) {
    return transitCache;
  }

  try {
    const filePath = path.join(__dirname, '../static/patiala_bus_stops.geojson');
    const data = await fs.readFile(filePath, 'utf8');
    const geojson = JSON.parse(data);

    // Extract transit stop features
    const stops = geojson.features
      .filter(feature => feature.geometry && feature.geometry.type === 'Point')
      .map((feature, index) => ({
        id: feature.id?.toString() || `stop-${index}`,
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0],
        name: feature.properties?.name || 'Bus Stop',
        tags: feature.properties || {},
      }));

    transitCache = stops;
    console.log(`Loaded ${stops.length} transit stops from GeoJSON`);
    return stops;
  } catch (error) {
    console.error('Failed to load transit:', error);
    throw new Error('Transit data not available');
  }
}

/**
 * Clear cache
 */
function clearCache() {
  transitCache = null;
}

module.exports = {
  loadTransit,
  clearCache,
};
