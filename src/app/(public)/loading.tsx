import React from 'react';

export default function Loading() {
  return (
    <div className="w-full">
      {/* Top instant progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-brand-slate-100 overflow-hidden">
        <div className="h-full bg-brand-copper animate-pulse w-2/3" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
        <div className="h-8 bg-brand-slate-200 rounded-lg w-1/3" />
        <div className="h-28 bg-brand-slate-100 rounded-2xl w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          <div className="h-80 bg-brand-slate-100 rounded-2xl" />
          <div className="h-80 bg-brand-slate-100 rounded-2xl" />
          <div className="h-80 bg-brand-slate-100 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
