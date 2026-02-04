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

    // Extract transit stop nodes
    const stops = geojson.elements
      .filter(el => el.type === 'node' && el.lat && el.lon)
      .map(el => ({
        id: el.id.toString(),
        lat: el.lat,
        lng: el.lon,
        name: el.tags?.name || 'Bus Stop',
        tags: el.tags || {},
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
