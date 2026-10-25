'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProperty } from '@/actions/properties';
import { PropertyInput } from '@/lib/validations/property';
import { calculateMarla, calculateSqft, DEFAULT_MARLA_SQFT } from '@/config/measurements';
import { Building, Plus, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function NewPropertyPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [referenceCode, setReferenceCode] = useState(`HBR-${Math.floor(1000 + Math.random() * 9000)}`);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState<'sale' | 'rent'>('sale');
  const [category, setCategory] = useState<any>('residential_plot');
  const [plotFileStatus, setPlotFileStatus] = useState<any>('possession');
  const [publicationStatus, setPublicationStatus] = useState<'draft' | 'published'>('published');
  const [isPriceOnCall, setIsPriceOnCall] = useState(false);
  const [pricePkr, setPricePkr] = useState<string>('');

  // Area & Standard
  const [areaValue, setAreaValue] = useState<string>('10');
  const [areaUnit, setAreaUnit] = useState<any>('marla');
  const [marlaStandard, setMarlaStandard] = useState<number>(DEFAULT_MARLA_SQFT);

  // Location
  const [areaLocation, setAreaLocation] = useState('Bahria Town Phase 8');
  const [sectorBlock, setSectorBlock] = useState('Sector C');
  const [city, setCity] = useState('Islamabad');

  // Specs
  const [bedrooms, setBedrooms] = useState<string>('');
  const [bathrooms, setBathrooms] = useState<string>('');
  const [featuredImage, setFeaturedImage] = useState<string>('');

  // Live calculations
  const numArea = parseFloat(areaValue) || 0;
  const calculatedMarla = calculateMarla(numArea, areaUnit, marlaStandard);
  const calculatedSqft = calculateSqft(numArea, areaUnit, marlaStandard);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const payload: PropertyInput = {
      reference_code: referenceCode,
      title,
      description: description || undefined,
      purpose,
      category,
      plot_file_status: plotFileStatus,
      publication_status: publicationStatus,
      availability_status: 'available',
      is_price_on_call: isPriceOnCall,
      price_pkr: isPriceOnCall ? null : (parseInt(pricePkr, 10) || null),
      area_value: numArea,
      area_unit: areaUnit,
      marla_sqft_standard: marlaStandard,
      city,
      area_location: areaLocation,
      sector_block: sectorBlock || null,
      bedrooms: bedrooms ? parseInt(bedrooms, 10) : null,
      bathrooms: bathrooms ? parseInt(bathrooms, 10) : null,
      features: [],
      images: featuredImage ? [featuredImage] : [],
      featured_image: featuredImage || null,
    };

    const res = await createProperty(payload);

    if (!res.success) {
      setErrorMsg(res.message);
      setSubmitting(false);
      return;
    }

    router.push('/admin/properties');
    router.refresh();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/properties"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="border-b border-slate-200 pb-4 mb-6">
          <h1 className="text-xl font-bold text-slate-900">
            Publish New Property Listing
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Specify verified measurements, development status, and pricing details.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-700 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Reference & Publication Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Reference Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={referenceCode}
                onChange={(e) => setReferenceCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Transaction Purpose
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              >
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Publication Status
              </label>
              <select
                value={publicationStatus}
                onChange={(e) => setPublicationStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              >
                <option value="published">Published (Visible Publicly)</option>
                <option value="draft">Draft (Internal Only)</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Listing Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 10 Marla Prime Residential Plot in Bahria Town Phase 8"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              >
                <optgroup label="Residential">
                  <option value="residential_plot">Residential Plot</option>
                  <option value="house">House / Villa</option>
                  <option value="apartment">Apartment</option>
                </optgroup>
                <optgroup label="Commercial">
                  <option value="commercial_plot">Commercial Plot</option>
                  <option value="shop">Commercial Shop</option>
                  <option value="office">Corporate Office</option>
                  <option value="plaza">Commercial Plaza</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Plot / Development Status
              </label>
              <select
                value={plotFileStatus}
                onChange={(e) => setPlotFileStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              >
                <option value="possession">Possession Ready</option>
                <option value="balloted">Balloted Plot</option>
                <option value="allocated">Allocated File</option>
                <option value="file">Property File</option>
                <option value="not_applicable">Not Applicable</option>
              </select>
            </div>
          </div>

          {/* Area & Measurement Configuration */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
              Land Measurement & Conversion
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Area Value
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={areaValue}
                  onChange={(e) => setAreaValue(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Measurement Unit
                </label>
                <select
                  value={areaUnit}
                  onChange={(e) => setAreaUnit(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                >
                  <option value="marla">Marla</option>
                  <option value="kanal">Kanal (1 Kanal = 20 Marla)</option>
                  <option value="sqft">Square Feet</option>
                  <option value="sqyd">Square Yards</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Local Marla Standard
                </label>
                <select
                  value={marlaStandard}
                  onChange={(e) => setMarlaStandard(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                >
                  <option value={225}>225 Sq. Ft. (Bahria / DHA / CDA)</option>
                  <option value={272.25}>272.25 Sq. Ft. (Punjab Revenue)</option>
                  <option value={250}>250 Sq. Ft. (Municipal Standard)</option>
                </select>
              </div>
            </div>

            {/* Live Calculation Preview Banner */}
            <div className="p-3 bg-brand-gold/10 rounded-lg border border-brand-gold/20 flex items-center justify-between text-xs text-brand-navy font-medium">
              <span>Normalized Database Value: <strong>{calculatedMarla.toFixed(2)} Marla</strong></span>
              <span>Footprint Area: <strong>{calculatedSqft.toLocaleString()} Sq. Ft.</strong></span>
            </div>
          </div>

          {/* Pricing Architecture */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Price in PKR
              </label>
              <input
                type="number"
                disabled={isPriceOnCall}
                value={pricePkr}
                onChange={(e) => setPricePkr(e.target.value)}
                placeholder="e.g. 15000000 (1.5 Crore)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 disabled:opacity-50"
              />
            </div>

            <div className="pt-5 sm:pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPriceOnCall}
                  onChange={(e) => {
                    setIsPriceOnCall(e.target.checked);
                    if (e.target.checked) setPricePkr('');
                  }}
                  className="rounded border-slate-300 text-brand-navy focus:ring-brand-gold"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Mark as "Price on Call" (Leaves price confidential)
                </span>
              </label>
            </div>
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                City
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Location Area <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={areaLocation}
                onChange={(e) => setAreaLocation(e.target.value)}
                placeholder="e.g. Bahria Town Phase 8, DHA Phase 2"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Sector / Block
              </label>
              <input
                type="text"
                value={sectorBlock}
                onChange={(e) => setSectorBlock(e.target.value)}
                placeholder="e.g. Sector C, Block D"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Structure Specs (for houses/apartments/offices) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Bedrooms (Optional)
              </label>
              <input
                type="number"
                min="0"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Bathrooms (Optional)
              </label>
              <input
                type="number"
                min="0"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Featured Image URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Featured Image URL (Supabase Storage or CDN path)
            </label>
            <input
              type="text"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://... or leave empty to use company branding placeholder"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Full Description & Features
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline road width (e.g. 50ft boulevard), park face, possession status, transfer details..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-brand-navy hover:bg-brand-navyLight disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4 text-brand-gold" />
              <span>{submitting ? 'Creating Listing...' : 'Publish Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
