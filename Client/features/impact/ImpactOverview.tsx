'use client';

import type { ImpactData } from '@/lib/types';
import Badge from '../ui/Badge';

interface ImpactOverviewProps {
  impact: ImpactData;
}

export default function ImpactOverview({ impact }: ImpactOverviewProps) {
  const getImpactLevel = (score: number): { label: string; variant: 'success' | 'warning' | 'error' } => {
    if (score >= 0.7) return { label: 'High Impact', variant: 'success' };
    if (score >= 0.4) return { label: 'Medium Impact', variant: 'warning' };
    return { label: 'Low Impact', variant: 'error' };
  };

  const impactLevel = getImpactLevel(impact.impactScore);

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Impact Score</h3>
        <Badge variant={impactLevel.variant}>{impactLevel.label}</Badge>
      </div>

      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-emerald-600 mb-2">
          {Math.round(impact.impactScore * 100)}
        </div>
        <p className="text-sm text-slate-600">Environmental Impact Score</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-900">{impact.carbonReduction}</p>
          <p className="text-xs text-slate-600">kg CO₂ saved/month</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-900">{impact.transitUsageIncrease}%</p>
          <p className="text-xs text-slate-600">Transit increase</p>
        </div>
      </div>
    </div>
  );
}
