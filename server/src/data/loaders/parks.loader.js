// GeoJSON loader for parks data

const fs = require('fs').promises;
const path = require('path');

let parksCache = null;

/**
 * Load parks from GeoJSON file
 */
async function loadParks() {
  if (parksCache) {
    return parksCache;
  }

  try {
    const filePath = path.join(__dirname, '../static/patiala_parks.geojson');
    const data = await fs.readFile(filePath, 'utf8');
    const geojson = JSON.parse(data);

    // Extract park points (nodes and polygon centroids)
    const parks = [];

    geojson.elements.forEach(el => {
      if (el.type === 'node' && el.lat && el.lon) {
        parks.push({
          id: el.id.toString(),
          lat: el.lat,
          lng: el.lon,
          name: el.tags?.name || 'Park',
          tags: el.tags || {},
        });
      } else if (el.geometry && el.geometry.length > 0) {
        // Calculate centroid for polygons
        const lats = el.geometry.map(coord => coord.lat);
        const lngs = el.geometry.map(coord => coord.lon);
        const centroidLat = lats.reduce((a, b) => a + b, 0) / lats.length;
        const centroidLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

        parks.push({
          id: el.id.toString(),
          lat: centroidLat,
          lng: centroidLng,
          name: el.tags?.name || 'Green Space',
          tags: el.tags || {},
        });
      }
    });

    parksCache = parks;
    console.log(`Loaded ${parks.length} parks from GeoJSON`);
    return parks;
  } catch (error) {
    console.error('Failed to load parks:', error);
    throw new Error('Parks data not available');
  }
}

/**
 * Clear cache
 */
function clearCache() {
  parksCache = null;
}

module.exports = {
  loadParks,
  clearCache,
};
