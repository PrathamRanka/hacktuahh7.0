'use client';

import { BUSINESS_TYPES } from './businessTypes';
import BusinessCard from './BusinessCard';

interface BusinessSelectorProps {
  onSelect: (businessTypeId: string) => void;
  selected: string | null;
}

export default function BusinessSelector({ onSelect, selected }: BusinessSelectorProps) {
  return (
    <div className="space-y-3">
      {BUSINESS_TYPES.map((business) => (
        <BusinessCard
          key={business.id}
          business={business}
          isSelected={selected === business.id}
          onClick={() => onSelect(business.id)}
        />
      ))}
    </div>
  );
}
