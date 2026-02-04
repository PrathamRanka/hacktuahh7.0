'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { getMarkerColor } from './map.config';
import type { Recommendation } from '@/lib/types';

interface BuildingMarkersProps {
  map: mapboxgl.Map;
  recommendations: Recommendation[];
  onSelect: (building: Recommendation) => void;
  selectedId?: string;
}

export default function BuildingMarkers({
  map,
  recommendations,
  onSelect,
  selectedId,
}: BuildingMarkersProps) {
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    recommendations.forEach((rec) => {
      const isSelected = rec.id === selectedId;
      const color = getMarkerColor(rec.greenScore);

      // Create marker element
      const el = document.createElement('div');
      el.className = `cursor-pointer transition-transform ${
        isSelected ? 'scale-125 z-50' : 'hover:scale-110'
      }`;
      el.style.width = isSelected ? '48px' : '40px';
      el.style.height = isSelected ? '48px' : '40px';

      el.innerHTML = `
        <div class="relative w-full h-full">
          <svg viewBox="0 0 40 40" class="w-full h-full drop-shadow-lg">
            <circle cx="20" cy="20" r="18" fill="${color}" opacity="0.9"/>
            <circle cx="20" cy="20" r="14" fill="white" opacity="0.3"/>
            <text x="20" y="25" text-anchor="middle" fill="white" font-size="14" font-weight="bold">
              ${rec.rank}
            </text>
          </svg>
          ${
            isSelected
              ? `<div class="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>`
              : ''
          }
        </div>
      `;

      el.addEventListener('click', () => {
        onSelect(rec);
        map.flyTo({
          center: [rec.lng, rec.lat],
          zoom: 16,
          pitch: 60,
          duration: 1500,
        });
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([rec.lng, rec.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [map, recommendations, selectedId, onSelect]);

  return null;
}
