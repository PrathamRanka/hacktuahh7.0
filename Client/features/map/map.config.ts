// Map configuration for MapLibre GL

export const MAPBOX_CONFIG = {
  center: [76.3869, 30.3398] as [number, number], // Patiala, Punjab
  zoom: 15,
  style: 'https://demotiles.maplibre.org/style.json', // Free MapLibre style
};

/**
 * Get marker color based on green score
 */
export function getMarkerColor(score: number): string {
  if (score >= 0.8) return '#10b981'; // Emerald - Excellent
  if (score >= 0.6) return '#3b82f6'; // Blue - Good
  if (score >= 0.4) return '#f59e0b'; // Amber - Fair
  return '#ef4444'; // Red - Low
}

/**
 * Get tier badge color
 */
export function getTierColor(tier: string): string {
  switch (tier) {
    case 'Excellent':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'Good':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Fair':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Low':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300';
  }
}
