'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  Home,
  Tag,
  Layers,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export interface CatalogFilterProps {
  initialValues: {
    purpose?: string;
    category_group?: string;
    category?: string;
    location?: string;
    min_price?: string;
    max_price?: string;
    min_area?: string;
    max_area?: string;
    area_unit?: string;
    bedrooms?: string;
    bathrooms?: string;
    plot_status?: string;
    sort?: string;
  };
  totalResults: number;
}

export default function PropertyCatalogFilter({
  initialValues,
  totalResults,
}: CatalogFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local filter states
  const [purpose, setPurpose] = useState(initialValues.purpose || '');
  const [categoryGroup, setCategoryGroup] = useState(initialValues.category_group || '');
  const [category, setCategory] = useState(initialValues.category || '');
  const [location, setLocation] = useState(initialValues.location || '');
  const [minPrice, setMinPrice] = useState(initialValues.min_price || '');
  const [maxPrice, setMaxPrice] = useState(initialValues.max_price || '');
  const [minArea, setMinArea] = useState(initialValues.min_area || '');
  const [maxArea, setMaxArea] = useState(initialValues.max_area || '');
  const [areaUnit, setAreaUnit] = useState(initialValues.area_unit || 'marla');
  const [bedrooms, setBedrooms] = useState(initialValues.bedrooms || '');
  const [bathrooms, setBathrooms] = useState(initialValues.bathrooms || '');
  const [plotStatus, setPlotStatus] = useState(initialValues.plot_status || '');
  const [sort, setSort] = useState(initialValues.sort || 'newest');

  // UI state
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Sync state if URL changes externally
  useEffect(() => {
    setPurpose(initialValues.purpose || '');
    setCategoryGroup(initialValues.category_group || '');
    setCategory(initialValues.category || '');
    setLocation(initialValues.location || '');
    setMinPrice(initialValues.min_price || '');
    setMaxPrice(initialValues.max_price || '');
    setMinArea(initialValues.min_area || '');
    setMaxArea(initialValues.max_area || '');
    setAreaUnit(initialValues.area_unit || 'marla');
    setBedrooms(initialValues.bedrooms || '');
    setBathrooms(initialValues.bathrooms || '');
    setPlotStatus(initialValues.plot_status || '');
    setSort(initialValues.sort || 'newest');
  }, [initialValues]);

  // Count active filters
  const activeFiltersCount = [
    purpose,
    categoryGroup,
    category,
    location,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    bedrooms,
    bathrooms,
    plotStatus,
  ].filter(Boolean).length;

  const applyFilters = (overrides: Record<string, string | undefined> = {}) => {
    const params = new URLSearchParams();

    const merged = {
      purpose,
      category_group: categoryGroup,
      category,
      location,
      min_price: minPrice,
      max_price: maxPrice,
      min_area: minArea,
      max_area: maxArea,
      area_unit: areaUnit !== 'marla' ? areaUnit : undefined,
      bedrooms,
      bathrooms,
      plot_status: plotStatus,
      sort: sort !== 'newest' ? sort : undefined,
      ...overrides,
    };

    Object.entries(merged).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params.set(key, String(val));
      }
    });

    // Reset to page 1 on filter modification
    params.delete('page');

    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`);
    setIsMobileDrawerOpen(false);
  };

  const handleReset = () => {
    setPurpose('');
    setCategoryGroup('');
    setCategory('');
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setMinArea('');
    setMaxArea('');
    setAreaUnit('marla');
    setBedrooms('');
    setBathrooms('');
    setPlotStatus('');
    setSort('newest');
    router.push(pathname);
    setIsMobileDrawerOpen(false);
  };

  const removeFilter = (key: string) => {
    const overrides: Record<string, string | undefined> = { [key]: undefined };
    if (key === 'price') {
      overrides.min_price = undefined;
      overrides.max_price = undefined;
      setMinPrice('');
      setMaxPrice('');
    } else if (key === 'area') {
      overrides.min_area = undefined;
      overrides.max_area = undefined;
      setMinArea('');
      setMaxArea('');
    } else {
      switch (key) {
        case 'purpose':
          setPurpose('');
          break;
        case 'category':
          setCategory('');
          break;
        case 'category_group':
          setCategoryGroup('');
          break;
        case 'location':
          setLocation('');
          break;
        case 'bedrooms':
          setBedrooms('');
          break;
        case 'bathrooms':
          setBathrooms('');
          break;
        case 'plot_status':
          setPlotStatus('');
          break;
      }
    }
    applyFilters(overrides);
  };

  return (
    <div className="space-y-4">
      {/* Primary Search & Quick Filter Bar */}
      <div className="bg-white rounded-2xl border border-brand-slate-200/90 shadow-sm p-4 sm:p-6 space-y-4">
        {/* Purpose Segment Tabs & Quick Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-slate-100">
          {/* Purpose Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-brand-slate-100 rounded-xl max-w-fit">
            <button
              type="button"
              onClick={() => {
                setPurpose('');
                applyFilters({ purpose: undefined });
              }}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                purpose === ''
                  ? 'bg-brand-navy text-white shadow-xs'
                  : 'text-brand-slate-600 hover:text-brand-navy'
              }`}
            >
              All Listings
            </button>
            <button
              type="button"
              onClick={() => {
                setPurpose('sale');
                applyFilters({ purpose: 'sale' });
              }}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                purpose === 'sale'
                  ? 'bg-brand-navy text-white shadow-xs'
                  : 'text-brand-slate-600 hover:text-brand-navy'
              }`}
            >
              For Sale
            </button>
            <button
              type="button"
              onClick={() => {
                setPurpose('rent');
                applyFilters({ purpose: 'rent' });
              }}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                purpose === 'rent'
                  ? 'bg-brand-navy text-white shadow-xs'
                  : 'text-brand-slate-600 hover:text-brand-navy'
              }`}
            >
              For Rent
            </button>
          </div>

          {/* Quick Result Counter & Sort Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-brand-slate-500 font-medium hidden md:inline">
              <strong className="text-brand-navy font-bold">{totalResults}</strong> listings found
            </span>

            <div className="flex items-center gap-2">
              <label htmlFor="catalog-sort" className="text-xs font-semibold text-brand-slate-500 whitespace-nowrap">
                Sort By:
              </label>
              <select
                id="catalog-sort"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  applyFilters({ sort: e.target.value });
                }}
                className="text-xs font-semibold bg-brand-slate-50 border border-brand-slate-200 rounded-lg px-2.5 py-1.5 text-brand-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-azure"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="area_desc">Area: Largest First</option>
                <option value="area_asc">Area: Smallest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Primary Filter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Location Input */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 mb-1">
              Location / Society
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-copper" />
              <input
                type="text"
                placeholder="e.g. Bahria Phase 8, DHA 2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') applyFilters();
                }}
                className="w-full pl-9 pr-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-lg text-xs sm:text-sm text-brand-slate-900 placeholder:text-brand-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-azure focus:border-brand-azure"
              />
            </div>
          </div>

          {/* Property Category / Type */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 mb-1">
              Property Category
            </label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-azure" />
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  applyFilters({ category: e.target.value });
                }}
                className="w-full pl-9 pr-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-lg text-xs sm:text-sm text-brand-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-azure focus:border-brand-azure"
              >
                <option value="">All Categories</option>
                <optgroup label="Residential">
                  <option value="residential_plot">Residential Plot</option>
                  <option value="house">House / Villa</option>
                  <option value="apartment">Apartment / Flat</option>
                </optgroup>
                <optgroup label="Commercial">
                  <option value="commercial_plot">Commercial Plot</option>
                  <option value="shop">Retail Shop</option>
                  <option value="office">Corporate Office</option>
                  <option value="plaza">Commercial Plaza</option>
                </optgroup>
              </select>
            </div>
          </div>

          {/* Plot / Development Status */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 mb-1">
              Plot / Title Status
            </label>
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
              <select
                value={plotStatus}
                onChange={(e) => {
                  setPlotStatus(e.target.value);
                  applyFilters({ plot_status: e.target.value });
                }}
                className="w-full pl-9 pr-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-lg text-xs sm:text-sm text-brand-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-azure focus:border-brand-azure"
              >
                <option value="">Any Status</option>
                <option value="possession">Possession Ready</option>
                <option value="balloted">Balloted Plot</option>
                <option value="file">Allocation File</option>
                <option value="allocated">Allocated Plot</option>
              </select>
            </div>
          </div>

          {/* Search Trigger & Advanced Filter Toggle */}
          <div className="flex items-center gap-2 pt-1 sm:pt-0">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => applyFilters()}
              leftIcon={<Search className="w-4 h-4 text-brand-copper" />}
              className="flex-1 h-9.5 text-xs sm:text-sm"
            >
              Search
            </Button>

            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className={`h-9.5 px-3 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isAdvancedOpen || activeFiltersCount > 3
                  ? 'border-brand-azure text-brand-azure bg-brand-azure-tint'
                  : 'border-brand-slate-200 text-brand-slate-600 hover:bg-brand-slate-50'
              }`}
              title="Toggle advanced price, area, and bedroom filters"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-brand-copper text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
              {isAdvancedOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Filters Drawer */}
        {isAdvancedOpen && (
          <div className="pt-4 border-t border-brand-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-150">
            {/* Price Filter (PKR) */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-slate-500">
                Price Range (PKR)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min PKR"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-1.5 bg-brand-slate-50 border border-brand-slate-200 rounded-lg text-xs text-brand-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-azure"
                />
                <input
                  type="number"
                  placeholder="Max PKR"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-1.5 bg-brand-slate-50 border border-brand-slate-200 rounded-lg text-xs text-brand-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-azure"
                />
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMinPrice('10000000');
                    setMaxPrice('30000000');
                  }}
                  className="text-[10px] font-semibold bg-brand-slate-100 hover:bg-brand-slate-200 px-2 py-0.5 rounded text-brand-slate-700"
                >
                  1-3 Crore
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMinPrice('30000000');
                    setMaxPrice('60000000');
                  }}
                  className="text-[10px] font-semibold bg-brand-slate-100 hover:bg-brand-slate-200 px-2 py-0.5 rounded text-brand-slate-700"
                >
                  3-6 Crore
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMinPrice('60000000');
                    setMaxPrice('');
                  }}
                  className="text-[10px] font-semibold bg-brand-slate-100 hover:bg-brand-slate-200 px-2 py-0.5 rounded text-brand-slate-700"
                >
                  6+ Crore
                </button>
              </div>
            </div>

            {/* Land Area & Unit Filter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-slate-500">
                  Land Area
                </label>
                <select
                  value={areaUnit}
                  onChange={(e) => setAreaUnit(e.target.value)}
                  className="text-[11px] font-bold text-brand-azure bg-transparent border-0 focus:ring-0 p-0 cursor-pointer"
                >
                  <option value="marla">Marla (225 sq ft)</option>
                  <option value="kanal">Kanal (20 Marla)</option>
                  <option value="sqft">Sq. Ft.</option>
                  <option value="sqyd">Sq. Yd.</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder={`Min (${areaUnit})`}
                  value={minArea}
                  onChange={(e) => setMinArea(e.target.value)}
                  className="w-full px-3 py-1.5 bg-brand-slate-50 border border-brand-slate-200 rounded-lg text-xs text-brand-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-azure"
                />
                <input
                  type="number"
                  placeholder={`Max (${areaUnit})`}
                  value={maxArea}
                  onChange={(e) => setMaxArea(e.target.value)}
                  className="w-full px-3 py-1.5 bg-brand-slate-50 border border-brand-slate-200 rounded-lg text-xs text-brand-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-azure"
                />
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMinArea('5');
                    setMaxArea('5');
                    setAreaUnit('marla');
                  }}
                  className="text-[10px] font-semibold bg-brand-slate-100 hover:bg-brand-slate-200 px-2 py-0.5 rounded text-brand-slate-700"
                >
                  5 Marla
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMinArea('10');
                    setMaxArea('10');
                    setAreaUnit('marla');
                  }}
                  className="text-[10px] font-semibold bg-brand-slate-100 hover:bg-brand-slate-200 px-2 py-0.5 rounded text-brand-slate-700"
                >
                  10 Marla
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMinArea('1');
                    setMaxArea('1');
                    setAreaUnit('kanal');
                  }}
                  className="text-[10px] font-semibold bg-brand-slate-100 hover:bg-brand-slate-200 px-2 py-0.5 rounded text-brand-slate-700"
                >
                  1 Kanal
                </button>
              </div>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-slate-500">
                Rooms & Facilities
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-brand-slate-50 border border-brand-slate-200 rounded-lg text-xs text-brand-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-azure"
                >
                  <option value="">Any Bedrooms</option>
                  <option value="1">1+ Bedrooms</option>
                  <option value="2">2+ Bedrooms</option>
                  <option value="3">3+ Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                  <option value="5">5+ Bedrooms</option>
                </select>

                <select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-brand-slate-50 border border-brand-slate-200 rounded-lg text-xs text-brand-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-azure"
                >
                  <option value="">Any Bathrooms</option>
                  <option value="1">1+ Bathrooms</option>
                  <option value="2">2+ Bathrooms</option>
                  <option value="3">3+ Bathrooms</option>
                  <option value="4">4+ Bathrooms</option>
                </select>
              </div>

              {/* Action Buttons inside Drawer */}
              <div className="flex items-center gap-2 pt-1 justify-end">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-brand-slate-500 hover:text-brand-slate-800 underline underline-offset-2 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
                <Button
                  type="button"
                  variant="accent"
                  size="sm"
                  onClick={() => applyFilters()}
                  className="h-7 text-xs"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Active Filter Chips / Pills */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-brand-slate-100">
            <span className="text-[11px] font-semibold text-brand-slate-400 mr-1">Active Filters:</span>

            {purpose && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-navy text-white">
                For {purpose}
                <button type="button" onClick={() => removeFilter('purpose')} aria-label="Remove purpose filter">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-azure-tint text-brand-azure border border-brand-azure/30">
                {category.replace('_', ' ')}
                <button type="button" onClick={() => removeFilter('category')} aria-label="Remove category filter">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {location && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-copper/10 text-brand-copper border border-brand-copper/30">
                Location: {location}
                <button type="button" onClick={() => removeFilter('location')} aria-label="Remove location filter">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-slate-100 text-brand-slate-800 border border-brand-slate-200">
                Price: {minPrice ? `PKR ${Number(minPrice).toLocaleString()}` : '0'} –{' '}
                {maxPrice ? `PKR ${Number(maxPrice).toLocaleString()}` : 'Any'}
                <button type="button" onClick={() => removeFilter('price')} aria-label="Remove price filter">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(minArea || maxArea) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-slate-100 text-brand-slate-800 border border-brand-slate-200">
                Area: {minArea || '0'} – {maxArea || 'Any'} {areaUnit}
                <button type="button" onClick={() => removeFilter('area')} aria-label="Remove area filter">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {plotStatus && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Status: {plotStatus}
                <button type="button" onClick={() => removeFilter('plot_status')} aria-label="Remove status filter">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {bedrooms && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-slate-100 text-brand-slate-800 border border-brand-slate-200">
                {bedrooms}+ Beds
                <button type="button" onClick={() => removeFilter('bedrooms')} aria-label="Remove bedrooms filter">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-700 ml-1 underline underline-offset-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
