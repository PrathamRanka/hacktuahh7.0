'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import type { Recommendation } from '@/lib/types';
import { getMarkerColor } from './map.config';

interface BuildingMarkersProps {
  map: any; // Using any to avoid type conflicts
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
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    recommendations.forEach(building => {
      const isSelected = building.id === selectedId;
      const color = getMarkerColor(building.greenScore);

      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'building-marker';
      el.style.cssText = `
        width: ${isSelected ? '32px' : '24px'};
        height: ${isSelected ? '32px' : '24px'};
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        position: relative;
      `;

      // Add pulsing ring for selected marker
      if (isSelected) {
        const ring = document.createElement('div');
        ring.style.cssText = `
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          border: 2px solid ${color};
          border-radius: 50%;
          animation: pulse 2s infinite;
        `;
        el.appendChild(ring);
      }

      // Hover effects
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
        el.style.zIndex = '1000';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.zIndex = '1';
      });

      // Create marker
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([building.lng, building.lat])
        .addTo(map);

      // Add click handler
      el.addEventListener('click', () => onSelect(building));

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [map, recommendations, selectedId, onSelect]);

  return null;
}
