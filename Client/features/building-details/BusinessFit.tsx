'use client';

import ProgressBar from '../ui/ProgressBar';

interface BusinessFitProps {
  businessFitScore?: number;
  businessType?: string;
}

export default function BusinessFit({ businessFitScore = 0, businessType }: BusinessFitProps) {
  const fitPercentage = Math.round(businessFitScore * 100);

  const getFitLevel = (score: number) => {
    if (score >= 0.8) return { label: 'Excellent Fit', color: 'emerald' as const };
    if (score >= 0.6) return { label: 'Good Fit', color: 'blue' as const };
    if (score >= 0.4) return { label: 'Moderate Fit', color: 'yellow' as const };
    return { label: 'Poor Fit', color: 'red' as const };
  };

  const fitLevel = getFitLevel(businessFitScore);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-slate-900 mb-2">Business Fit Analysis</h4>
        {businessType && (
          <p className="text-sm text-slate-600 mb-4">
            Suitability for: <span className="font-medium">{businessType}</span>
          </p>
        )}
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-700">Overall Fit</span>
          <span className="text-2xl font-bold text-slate-900">{fitPercentage}%</span>
        </div>
        <ProgressBar value={fitPercentage} color={fitLevel.color} size="lg" />
        <p className="text-sm text-slate-600 mt-2">{fitLevel.label}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <p className="text-xs text-slate-500 mb-1">Park Proximity</p>
          <ProgressBar value={85} color="emerald" size="sm" showLabel />
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <p className="text-xs text-slate-500 mb-1">Transit Access</p>
          <ProgressBar value={90} color="blue" size="sm" showLabel />
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <p className="text-xs text-slate-500 mb-1">Foot Traffic</p>
          <ProgressBar value={70} color="yellow" size="sm" showLabel />
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <p className="text-xs text-slate-500 mb-1">Quietness</p>
          <ProgressBar value={60} color="emerald" size="sm" showLabel />
        </div>
      </div>
    </div>
  );
}
