// Mapbox configuration for CarbonCompass

export const MAPBOX_CONFIG = {
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiY2FyYm9uY29tcGFzcyIsImEiOiJjbHh5ejEyM3QwMDAwMmtzNzg5YnJxeXN6In0.example',
  style: 'mapbox://styles/mapbox/light-v11',
  center: {
    lng: 76.3869,
    lat: 30.3398,
  },
  zoom: 13,
  pitch: 60,
  bearing: 0,
  antialias: true,
};

export const PATIALA_BOUNDS = {
  minLng: 76.3,
  maxLng: 76.5,
  minLat: 30.2,
  maxLat: 30.4,
};

// Marker colors based on green score
export const getMarkerColor = (greenScore: number): string => {
  if (greenScore >= 0.8) return '#10b981'; // Excellent - emerald-500
  if (greenScore >= 0.6) return '#22c55e'; // Good - green-500
  if (greenScore >= 0.4) return '#eab308'; // Fair - yellow-500
  if (greenScore >= 0.2) return '#f97316'; // Poor - orange-500
  return '#ef4444'; // Very Poor - red-500
};

export const SCORE_TIERS = {
  EXCELLENT: { min: 0.8, label: 'Excellent', color: '#10b981' },
  GOOD: { min: 0.6, label: 'Good', color: '#22c55e' },
  FAIR: { min: 0.4, label: 'Fair', color: '#eab308' },
  POOR: { min: 0.2, label: 'Poor', color: '#f97316' },
  VERY_POOR: { min: 0, label: 'Very Poor', color: '#ef4444' },
};
