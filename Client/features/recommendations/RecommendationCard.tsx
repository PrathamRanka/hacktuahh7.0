'use client';

import type { Recommendation } from '@/lib/types';
import ScoreBadge from './scoreBadge';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onSelect: () => void;
  isSelected: boolean;
}

export default function RecommendationCard({
  recommendation,
  onSelect,
  isSelected,
}: RecommendationCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-lg border transition-all text-left ${
        isSelected
          ? 'border-emerald-500 bg-emerald-50 shadow-md'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
            #{recommendation.rank}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">
              {recommendation.name || `Location ${recommendation.id}`}
            </h3>
            <p className="text-xs text-slate-500">
              {recommendation.lat.toFixed(4)}, {recommendation.lng.toFixed(4)}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <ScoreBadge score={recommendation.greenScore} tier={recommendation.tier} size="sm" />
      </div>

      <p className="text-sm text-slate-600 line-clamp-2">{recommendation.explanation}</p>

      {recommendation.metrics && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 rounded px-2 py-1">
            <span className="text-slate-500">Parks:</span>{' '}
            <span className="font-medium text-slate-700">
              {recommendation.metrics.parksWithinRadius}
            </span>
          </div>
          <div className="bg-slate-50 rounded px-2 py-1">
            <span className="text-slate-500">Transit:</span>{' '}
            <span className="font-medium text-slate-700">
              {recommendation.metrics.transitWithinRadius}
            </span>
          </div>
        </div>
      )}
    </button>
  );
}
