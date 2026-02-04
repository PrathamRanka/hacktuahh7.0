'use client';

import type { Recommendation } from '@/lib/types';
import RecommendationCard from './RecommendationCard';

interface RecommendationListProps {
  recommendations: Recommendation[];
  onSelect: (recommendation: Recommendation) => void;
  selectedId?: string;
}

export default function RecommendationList({
  recommendations,
  onSelect,
  selectedId,
}: RecommendationListProps) {
  if (recommendations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-6">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-slate-900 mb-1">No recommendations yet</h3>
        <p className="text-sm text-slate-500">
          Select a business type to discover sustainable locations
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {recommendations.map((rec) => (
        <RecommendationCard
          key={rec.id}
          recommendation={rec}
          onSelect={() => onSelect(rec)}
          isSelected={selectedId === rec.id}
        />
      ))}
    </div>
  );
}
