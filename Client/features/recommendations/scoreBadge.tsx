'use client';

interface ScoreBadgeProps {
  score: number;
  tier: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ScoreBadge({ score, tier, size = 'md' }: ScoreBadgeProps) {
  const getColor = () => {
    if (score >= 0.8) return 'bg-emerald-100 text-emerald-700 border-emerald-300';
    if (score >= 0.6) return 'bg-green-100 text-green-700 border-green-300';
    if (score >= 0.4) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    if (score >= 0.2) return 'bg-orange-100 text-orange-700 border-orange-300';
    return 'bg-red-100 text-red-700 border-red-300';
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const percentage = Math.round(score * 100);

  return (
    <div className={`inline-flex items-center space-x-2 rounded-lg border ${getColor()} ${sizeClasses[size]} font-semibold`}>
      <span>{percentage}%</span>
      <span className="opacity-75">•</span>
      <span>{tier}</span>
    </div>
  );
}
