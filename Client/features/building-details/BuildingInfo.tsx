'use client';

import type { Recommendation } from '@/lib/types';
import ScoreBadge from '../recommendations/scoreBadge';

interface BuildingInfoProps {
  building: Recommendation;
}

export default function BuildingInfo({ building }: BuildingInfoProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          {building.name || `Building ${building.id}`}
        </h3>
        <p className="text-slate-600">
          {building.lat.toFixed(6)}, {building.lng.toFixed(6)}
        </p>
      </div>

      <div>
        <ScoreBadge score={building.greenScore} tier={building.tier} size="lg" />
      </div>

      <div className="bg-slate-50 rounded-lg p-4">
        <h4 className="font-semibold text-slate-900 mb-2">Sustainability Overview</h4>
        <p className="text-sm text-slate-700">{building.explanation}</p>
      </div>

      {building.metrics && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 rounded-lg p-4">
            <p className="text-xs text-emerald-600 font-medium mb-1">Nearest Park</p>
            <p className="text-lg font-bold text-emerald-900">
              {building.metrics.nearestParkDistance}m
            </p>
            {building.metrics.nearestPark && (
              <p className="text-xs text-emerald-700 mt-1">{building.metrics.nearestPark.name}</p>
            )}
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs text-blue-600 font-medium mb-1">Nearest Transit</p>
            <p className="text-lg font-bold text-blue-900">
              {building.metrics.nearestTransitDistance}m
            </p>
            {building.metrics.nearestTransit && (
              <p className="text-xs text-blue-700 mt-1">{building.metrics.nearestTransit.name}</p>
            )}
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-xs text-green-600 font-medium mb-1">Parks Nearby</p>
            <p className="text-lg font-bold text-green-900">
              {building.metrics.parksWithinRadius}
            </p>
            <p className="text-xs text-green-700 mt-1">Within 2km</p>
          </div>

          <div className="bg-cyan-50 rounded-lg p-4">
            <p className="text-xs text-cyan-600 font-medium mb-1">Transit Stops</p>
            <p className="text-lg font-bold text-cyan-900">
              {building.metrics.transitWithinRadius}
            </p>
            <p className="text-xs text-cyan-700 mt-1">Within 1.5km</p>
          </div>
        </div>
      )}
    </div>
  );
}
