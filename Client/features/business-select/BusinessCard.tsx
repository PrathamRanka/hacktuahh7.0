'use client';

import { BusinessType } from './businessTypes';

interface BusinessCardProps {
  business: BusinessType;
  isSelected: boolean;
  onClick: () => void;
}

export default function BusinessCard({ business, isSelected, onClick }: BusinessCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
        isSelected
          ? 'border-emerald-500 bg-emerald-50 shadow-lg scale-105'
          : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div
          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${business.color} flex items-center justify-center text-2xl flex-shrink-0`}
        >
          {business.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 mb-1">{business.name}</h3>
          <p className="text-sm text-slate-600 line-clamp-2">{business.description}</p>
        </div>
      </div>
      
      {isSelected && (
        <div className="mt-3 flex items-center text-sm text-emerald-600 font-medium">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Selected
        </div>
      )}
    </button>
  );
}
