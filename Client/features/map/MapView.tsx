'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from './map.config';
import BuildingMarkers from './BuildingMarkers';
import MapControls from './MapControls';
import type { Recommendation } from '@/lib/types';

interface MapViewProps {
  recommendations: Recommendation[];
  onBuildingSelect: (building: Recommendation) => void;
  selectedBuilding: Recommendation | null;
}

export default function MapView({
  recommendations,
  onBuildingSelect,
  selectedBuilding,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_CONFIG.style,
      center: [MAPBOX_CONFIG.center.lng, MAPBOX_CONFIG.center.lat],
      zoom: MAPBOX_CONFIG.zoom,
      pitch: MAPBOX_CONFIG.pitch,
      bearing: MAPBOX_CONFIG.bearing,
      antialias: MAPBOX_CONFIG.antialias,
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // Add 3D buildings layer
      const layers = map.current.getStyle().layers;
      const labelLayerId = layers?.find(
        (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
      )?.id;

      map.current.addLayer(
        {
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 12,
          paint: {
            'fill-extrusion-color': '#cbd5e1',
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              12,
              0,
              12.05,
              ['get', 'height'],
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              12,
              0,
              12.05,
              ['get', 'min_height'],
            ],
            'fill-extrusion-opacity': 0.6,
          },
        },
        labelLayerId
      );

      setMapLoaded(true);
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {mapLoaded && map.current && (
        <>
          <BuildingMarkers
            map={map.current}
            recommendations={recommendations}
            onSelect={onBuildingSelect}
            selectedId={selectedBuilding?.id}
          />
          <MapControls map={map.current} />
        </>
      )}
    </div>
  );
}
