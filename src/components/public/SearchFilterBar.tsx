'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Home, SlidersHorizontal } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface SearchFilterBarProps {
  initialPurpose?: string;
  initialCategory?: string;
  initialLocation?: string;
}

export default function SearchFilterBar({
  initialPurpose = '',
  initialCategory = '',
  initialLocation = '',
}: SearchFilterBarProps) {
  const router = useRouter();
  const [purpose, setPurpose] = useState(initialPurpose);
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState(initialLocation);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (purpose) params.set('purpose', purpose);
    if (category) params.set('category', category);
    if (location) params.set('location', location);

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 md:p-6">
      {/* Purpose Tabs */}
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
        <button
          type="button"
          onClick={() => setPurpose('')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            purpose === ''
              ? 'bg-brand-navy text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Listings
        </button>
        <button
          type="button"
          onClick={() => setPurpose('sale')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            purpose === 'sale'
              ? 'bg-brand-navy text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          For Sale
        </button>
        <button
          type="button"
          onClick={() => setPurpose('rent')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            purpose === 'rent'
              ? 'bg-brand-navy text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          For Rent
        </button>
      </div>

      {/* Main Search Grid */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
        {/* Location Dropdown / Input */}
        <div className="relative">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Target Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gold" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold"
            >
              <option value="">All Islamabad / Rawalpindi</option>
              <option value="Bahria Town">Bahria Town (All Phases)</option>
              <option value="DHA">DHA Islamabad / Rawalpindi</option>
              <option value="Islamabad">Islamabad Sectors</option>
            </select>
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Property Type
          </label>
          <div className="relative">
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gold" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold"
            >
              <option value="">All Categories</option>
              <optgroup label="Residential">
                <option value="residential_plot">Residential Plots</option>
                <option value="house">Houses & Villas</option>
                <option value="apartment">Apartments & Flats</option>
              </optgroup>
              <optgroup label="Commercial">
                <option value="commercial_plot">Commercial Plots</option>
                <option value="shop">Commercial Shops</option>
                <option value="office">Corporate Offices</option>
                <option value="plaza">Commercial Plazas</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Quick Area / Category Helper */}
        <div className="relative">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Standard Sizes
          </label>
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gold" />
            <select
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold"
              onChange={(e) => {
                if (e.target.value) {
                  router.push(`/properties?size=${e.target.value}`);
                }
              }}
            >
              <option value="">Any Size</option>
              <option value="5-marla">5 Marla</option>
              <option value="10-marla">10 Marla</option>
              <option value="1-kanal">1 Kanal</option>
              <option value="2-kanal">2 Kanal</option>
            </select>
          </div>
        </div>

        {/* Submit Search Button */}
        <div className="pt-5 md:pt-0">
          <button
            type="submit"
            className="w-full h-11 bg-brand-navy hover:bg-brand-navyLight text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Search className="w-4 h-4 text-brand-gold" />
            <span>Search Properties</span>
          </button>
        </div>
      </form>
    </div>
  );
}
