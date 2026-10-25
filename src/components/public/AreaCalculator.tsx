'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AREA_STANDARDS, MARLA_PER_KANAL, SQFT_PER_SQYD } from '@/config/measurements';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { CallButton } from '@/components/ui/CallButton';

export default function AreaCalculator() {
  const [inputValue, setInputValue] = useState<string>('10');
  const [selectedUnit, setSelectedUnit] = useState<'marla' | 'kanal' | 'sqft' | 'sqyd'>('marla');
  const standard = AREA_STANDARDS.BAHRIA_DHA_CDA; // 225 sq ft standard

  const numVal = parseFloat(inputValue) || 0;

  // Calculate area in sqft first based on selected input unit and selected standard
  let currentSqft = 0;
  if (selectedUnit === 'marla') currentSqft = numVal * standard;
  else if (selectedUnit === 'kanal') currentSqft = numVal * MARLA_PER_KANAL * standard;
  else if (selectedUnit === 'sqft') currentSqft = numVal;
  else if (selectedUnit === 'sqyd') currentSqft = numVal * SQFT_PER_SQYD;

  // Now compute outputs for both standards
  const bahriaMarla = currentSqft / AREA_STANDARDS.BAHRIA_DHA_CDA;
  const bahriaKanal = bahriaMarla / MARLA_PER_KANAL;
  const sqyd = currentSqft / SQFT_PER_SQYD;

  const revenueMarla = currentSqft / AREA_STANDARDS.PUNJAB_REVENUE;
  const revenueKanal = revenueMarla / MARLA_PER_KANAL;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left 2 Columns: The Calculator Form & Outputs */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-brand-slate-200 p-6 sm:p-10 space-y-8 shadow-xs">
        {/* Input Row */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-azure" />
            <span>Enter Property Dimension</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dimension-value" className="block text-xs font-bold text-brand-slate-600 uppercase tracking-wider mb-1.5">
                Measurement Value
              </label>
              <input
                id="dimension-value"
                type="number"
                min="0"
                step="any"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g. 5, 10, 1"
                className="w-full px-4 py-3 bg-brand-slate-50 border border-brand-slate-200 rounded-xl text-base font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-azure"
              />
            </div>

            <div>
              <label htmlFor="dimension-unit" className="block text-xs font-bold text-brand-slate-600 uppercase tracking-wider mb-1.5">
                Input Unit
              </label>
              <select
                id="dimension-unit"
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value as any)}
                className="w-full px-4 py-3 bg-brand-slate-50 border border-brand-slate-200 rounded-xl text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-azure"
              >
                <option value="marla">Marla</option>
                <option value="kanal">Kanal (20 Marlas)</option>
                <option value="sqft">Square Feet (Sq. Ft.)</option>
                <option value="sqyd">Square Yards (Sq. Yd.)</option>
              </select>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-brand-slate-400 font-medium mr-1">Common Sizes:</span>
            <button
              type="button"
              onClick={() => {
                setInputValue('5');
                setSelectedUnit('marla');
              }}
              className="px-3 py-1 bg-brand-slate-100 hover:bg-brand-slate-200 text-brand-slate-800 text-xs font-semibold rounded-lg transition-colors active:scale-95"
            >
              5 Marla
            </button>
            <button
              type="button"
              onClick={() => {
                setInputValue('10');
                setSelectedUnit('marla');
              }}
              className="px-3 py-1 bg-brand-slate-100 hover:bg-brand-slate-200 text-brand-slate-800 text-xs font-semibold rounded-lg transition-colors active:scale-95"
            >
              10 Marla
            </button>
            <button
              type="button"
              onClick={() => {
                setInputValue('1');
                setSelectedUnit('kanal');
              }}
              className="px-3 py-1 bg-brand-slate-100 hover:bg-brand-slate-200 text-brand-slate-800 text-xs font-semibold rounded-lg transition-colors active:scale-95"
            >
              1 Kanal
            </button>
            <button
              type="button"
              onClick={() => {
                setInputValue('2');
                setSelectedUnit('kanal');
              }}
              className="px-3 py-1 bg-brand-slate-100 hover:bg-brand-slate-200 text-brand-slate-800 text-xs font-semibold rounded-lg transition-colors active:scale-95"
            >
              2 Kanal
            </button>
          </div>
        </div>

        {/* Results Comparison Grid */}
        <div className="space-y-4 pt-6 border-t border-brand-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-base font-bold text-brand-navy">
              Verified Conversion Results
            </h3>
            <span className="text-xs text-brand-copper font-semibold bg-brand-copper/10 px-2.5 py-1 rounded-full">
              Bahria & DHA Standard (225 sq ft / Marla)
            </span>
          </div>

          {/* Main Result Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-brand-azure-tint/50 border border-brand-azure/30 p-4 rounded-2xl">
              <span className="text-[11px] font-semibold text-brand-azure uppercase tracking-wider block">
                Marla
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-brand-navy mt-1 block">
                {bahriaMarla.toFixed(2)}
              </span>
              <span className="text-[11px] text-brand-slate-500 block">Marlas</span>
            </div>

            <div className="bg-brand-slate-50 border border-brand-slate-200 p-4 rounded-2xl">
              <span className="text-[11px] font-semibold text-brand-slate-500 uppercase tracking-wider block">
                Kanal
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-brand-navy mt-1 block">
                {bahriaKanal.toFixed(2)}
              </span>
              <span className="text-[11px] text-brand-slate-500 block">Kanal</span>
            </div>

            <div className="bg-brand-slate-50 border border-brand-slate-200 p-4 rounded-2xl">
              <span className="text-[11px] font-semibold text-brand-slate-500 uppercase tracking-wider block">
                Square Feet
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-brand-navy mt-1 block">
                {Math.round(currentSqft).toLocaleString()}
              </span>
              <span className="text-[11px] text-brand-slate-500 block">Sq. Ft.</span>
            </div>

            <div className="bg-brand-slate-50 border border-brand-slate-200 p-4 rounded-2xl">
              <span className="text-[11px] font-semibold text-brand-slate-500 uppercase tracking-wider block">
                Square Yards
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-brand-navy mt-1 block">
                {Math.round(sqyd).toLocaleString()}
              </span>
              <span className="text-[11px] text-brand-slate-500 block">Sq. Yd. (Gazz)</span>
            </div>
          </div>

          {/* Comparison against Revenue Standard */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Comparison: Punjab Revenue Standard (272.25 sq ft)</span>
            </div>
            <p className="leading-relaxed">
              If measured under traditional rural revenue records, this area equals{' '}
              <strong>{revenueMarla.toFixed(2)} Marla</strong> ({revenueKanal.toFixed(2)} Kanal).
              In Bahria Town and DHA master plans, the <strong>225 sq ft</strong> standard is strictly used.
            </p>
          </div>
        </div>
      </div>

      {/* Right 1 Column: Educational & Listing Links */}
      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-brand-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-brand-navy">
            Standard Plot Dimensions in Bahria & DHA
          </h3>
          <div className="space-y-3 text-xs text-brand-slate-600">
            <div className="border-b border-brand-slate-100 pb-2">
              <strong className="text-brand-slate-900 block font-semibold">5 Marla Plot:</strong>
              <span>25 ft × 45 ft = 1,125 Sq. Ft.</span>
            </div>
            <div className="border-b border-brand-slate-100 pb-2">
              <strong className="text-brand-slate-900 block font-semibold">10 Marla Plot:</strong>
              <span>35 ft × 65 ft = 2,250 Sq. Ft. (or 35 × 70 ft)</span>
            </div>
            <div className="border-b border-brand-slate-100 pb-2">
              <strong className="text-brand-slate-900 block font-semibold">1 Kanal Plot:</strong>
              <span>50 ft × 90 ft = 4,500 Sq. Ft.</span>
            </div>
            <div>
              <strong className="text-brand-slate-900 block font-semibold">2 Kanal Plot:</strong>
              <span>75 ft × 120 ft = 9,000 Sq. Ft.</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/properties?category=residential_plot"
              className="w-full inline-flex items-center justify-center gap-2 bg-brand-navy hover:bg-brand-navy-light text-white font-semibold text-xs py-2.5 rounded-xl transition-colors shadow-xs active:scale-95"
            >
              <span>Browse Verified Plots</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="bg-brand-navy-dark text-white rounded-3xl p-6 space-y-3 border border-brand-slate-800">
          <h4 className="text-sm font-bold flex items-center gap-2 text-brand-copper">
            <ShieldCheck className="w-4 h-4 text-brand-cyan" />
            <span>Need On-Ground Demarcation?</span>
          </h4>
          <p className="text-xs text-brand-slate-300 leading-relaxed">
            Before transferring or commencing construction, our team can verify your plot boundaries with society surveyor markers.
          </p>
          <div className="pt-1">
            <CallButton size="sm" fullWidth>
              Call Specialist: +92 300 6100619
            </CallButton>
          </div>
        </div>
      </div>
    </div>
  );
}
