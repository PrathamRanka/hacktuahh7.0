'use client';

import Button from '../ui/Button';

export default function LeasingInfo() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-slate-900 mb-2">Leasing Information</h4>
        <p className="text-sm text-slate-600">
          Contact property management for availability and pricing
        </p>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-slate-600">Estimated Rent</span>
          <span className="text-sm font-semibold text-slate-900">₹25,000 - ₹40,000/mo</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-slate-600">Square Footage</span>
          <span className="text-sm font-semibold text-slate-900">800 - 1,200 sq ft</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-slate-600">Availability</span>
          <span className="text-sm font-semibold text-emerald-600">Available Now</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" size="sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call Agent
        </Button>
        <Button variant="primary" size="sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Schedule Tour
        </Button>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
        <p className="text-xs text-emerald-700">
          <span className="font-semibold">Green Building Certified:</span> This property meets sustainability standards
        </p>
      </div>
    </div>
  );
}
