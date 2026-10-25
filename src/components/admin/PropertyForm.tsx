'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createProperty, updateProperty } from '@/actions/properties';
import { PropertyInput } from '@/lib/validations/property';
import { Property } from '@/types/database';
import ImageManager from '@/components/admin/ImageManager';
import { calculateMarla, calculateSqft, DEFAULT_MARLA_SQFT } from '@/config/measurements';
import {
  Building2,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  X,
  Compass,
  ArrowLeft,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

interface PropertyFormProps {
  initialData?: Property | null;
  isEditing?: boolean;
}

export default function PropertyForm({ initialData, isEditing = false }: PropertyFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [referenceCode, setReferenceCode] = useState(
    initialData?.reference_code || `HBR-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [purpose, setPurpose] = useState<'sale' | 'rent'>(initialData?.purpose || 'sale');
  const [category, setCategory] = useState<any>(initialData?.category || 'residential_plot');
  const [plotFileStatus, setPlotFileStatus] = useState<any>(
    initialData?.plot_file_status || 'possession'
  );
  const [availabilityStatus, setAvailabilityStatus] = useState<any>(
    initialData?.availability_status || 'available'
  );
  const [publicationStatus, setPublicationStatus] = useState<'draft' | 'published' | 'archived'>(
    initialData?.publication_status || 'draft'
  );

  // Pricing
  const [isPriceOnCall, setIsPriceOnCall] = useState(initialData?.is_price_on_call || false);
  const [pricePkr, setPricePkr] = useState<string>(
    initialData?.price_pkr ? String(initialData.price_pkr) : ''
  );

  // Dimensions & Area
  const [areaValue, setAreaValue] = useState<string>(
    initialData?.area_value ? String(initialData.area_value) : '10'
  );
  const [areaUnit, setAreaUnit] = useState<any>(initialData?.area_unit || 'marla');
  const [marlaStandard, setMarlaStandard] = useState<number>(
    initialData?.marla_sqft_standard || DEFAULT_MARLA_SQFT
  );

  // Location
  const [city, setCity] = useState(initialData?.city || 'Islamabad');
  const [areaLocation, setAreaLocation] = useState(
    initialData?.area_location || 'Bahria Town Phase 8'
  );
  const [sectorBlock, setSectorBlock] = useState(initialData?.sector_block || 'Sector C');

  // Specs
  const [bedrooms, setBedrooms] = useState<string>(
    initialData?.bedrooms !== null && initialData?.bedrooms !== undefined
      ? String(initialData.bedrooms)
      : ''
  );
  const [bathrooms, setBathrooms] = useState<string>(
    initialData?.bathrooms !== null && initialData?.bathrooms !== undefined
      ? String(initialData.bathrooms)
      : ''
  );

  // Media & Features
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [featuredImage, setFeaturedImage] = useState<string | null>(
    initialData?.featured_image || null
  );
  const [features, setFeatures] = useState<string[]>(initialData?.features || []);
  const [newFeatureTag, setNewFeatureTag] = useState('');

  // Live Calculations
  const numArea = parseFloat(areaValue) || 0;
  const calculatedMarla = calculateMarla(numArea, areaUnit, marlaStandard);
  const calculatedSqft = calculateSqft(numArea, areaUnit, marlaStandard);

  // Live Slug Preview
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  const previewSlug = cleanTitle ? `${cleanTitle}-${referenceCode.toLowerCase()}` : '';

  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatureTag.trim()) return;
    const trimmed = newFeatureTag.trim();
    if (!features.includes(trimmed)) {
      setFeatures([...features, trimmed]);
    }
    setNewFeatureTag('');
  };

  const handleRemoveFeature = (tagToRemove: string) => {
    setFeatures(features.filter((f) => f !== tagToRemove));
  };

  const handleSave = async (targetPubStatus?: 'draft' | 'published' | 'archived') => {
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const activePubStatus = targetPubStatus || publicationStatus;

    const payload: PropertyInput = {
      reference_code: referenceCode.trim(),
      title: title.trim(),
      description: description.trim() || undefined,
      purpose,
      category,
      plot_file_status: plotFileStatus,
      publication_status: activePubStatus,
      availability_status: availabilityStatus,
      is_price_on_call: isPriceOnCall,
      price_pkr: isPriceOnCall ? null : parseInt(pricePkr, 10) || null,
      area_value: numArea,
      area_unit: areaUnit,
      marla_sqft_standard: marlaStandard,
      city: city.trim(),
      area_location: areaLocation.trim(),
      sector_block: sectorBlock.trim() || null,
      bedrooms: bedrooms ? parseInt(bedrooms, 10) : null,
      bathrooms: bathrooms ? parseInt(bathrooms, 10) : null,
      features,
      images,
      featured_image: featuredImage || (images.length > 0 ? images[0] : null),
    };

    let res;
    if (isEditing && initialData?.id) {
      res = await updateProperty(initialData.id, payload);
    } else {
      res = await createProperty(payload);
    }

    if (!res.success) {
      setErrorMsg(res.message);
      setSubmitting(false);
      return;
    }

    setSuccessMsg(res.message);
    setSubmitting(false);

    // Navigate to property portfolio on success
    setTimeout(() => {
      router.push('/admin/properties');
      router.refresh();
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar with Back and Preview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/properties"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Properties Portfolio</span>
        </Link>

        {isEditing && initialData?.publication_status === 'published' && (
          <Link
            href={`/properties/${initialData.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-azure hover:text-brand-navy"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Published Listing on Website</span>
          </Link>
        )}
      </div>

      {/* Main Form Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-xs">
        {/* Form Title & Status Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-brand-copper uppercase tracking-wider block">
              {isEditing ? 'Property Record Editor' : 'Listing Desk'}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              {isEditing ? `Edit Listing #${referenceCode}` : 'Publish New Property'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                publicationStatus === 'published'
                  ? 'bg-emerald-100 text-emerald-800'
                  : publicationStatus === 'archived'
                  ? 'bg-slate-200 text-slate-700'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {publicationStatus}
            </span>
          </div>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="flex items-center gap-2.5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Section 1: Core Identification */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-brand-copper" />
            <span>1. Core Identity &amp; Title</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reference Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={referenceCode}
                onChange={(e) => setReferenceCode(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-azure"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Listing Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 10 Marla Luxury Villa in Bahria Town Phase 8"
                required
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-azure"
              />
            </div>
          </div>

          {previewSlug && (
            <p className="text-[11px] text-slate-400 font-mono">
              Public URL Slug: <span className="text-slate-600">/properties/{previewSlug}</span>
            </p>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description &amp; Specifications
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe layout, builder finish, road width, amenities, and NDC clearance status..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-azure leading-relaxed"
            />
          </div>
        </div>

        {/* Section 2: Categorization, Purpose & Three Distinct Status Dimensions */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-copper" />
            <span>2. Classification &amp; Status Dimensions</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Transaction Purpose
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-azure"
              >
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Property Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-azure"
              >
                <optgroup label="Residential">
                  <option value="residential_plot">Residential Plot</option>
                  <option value="house">House / Villa</option>
                  <option value="apartment">Apartment / Flat</option>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Plot &amp; File Status
              </label>
              <select
                value={plotFileStatus}
                onChange={(e) => setPlotFileStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-azure"
              >
                <option value="possession">Possession Ready</option>
                <option value="balloted">Balloted Plot</option>
                <option value="allocated">Allocated File</option>
                <option value="file">Property File</option>
                <option value="not_applicable">Standard Construction</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Transaction / Availability Status
              </label>
              <select
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-azure"
              >
                <option value="available">Available (Active Listing)</option>
                <option value="under_offer">Under Active Offer</option>
                <option value="sold">Sold Out</option>
                <option value="rented">Leased / Rented</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Website Publication Status
              </label>
              <select
                value={publicationStatus}
                onChange={(e) => setPublicationStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-azure"
              >
                <option value="draft">Draft (Quarantined from Public Search)</option>
                <option value="published">Published (Visible Publicly)</option>
                <option value="archived">Archived (Hidden from Public)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Pricing */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="font-mono text-brand-copper font-bold text-sm">PKR</span>
            <span>3. Valuation &amp; Pricing</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Price in Pakistani Rupees (PKR)
              </label>
              <input
                type="number"
                disabled={isPriceOnCall}
                value={pricePkr}
                onChange={(e) => setPricePkr(e.target.value)}
                placeholder={isPriceOnCall ? 'Price on Call Active' : 'e.g. 25000000'}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-azure disabled:bg-slate-100 disabled:text-slate-400"
              />
            </div>

            <div className="pt-5">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={isPriceOnCall}
                  onChange={(e) => {
                    setIsPriceOnCall(e.target.checked);
                    if (e.target.checked) setPricePkr('');
                  }}
                  className="rounded text-brand-navy focus:ring-brand-navy"
                />
                <span>Designate as &ldquo;Price on Call&rdquo; (Advisory Quote)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 4: Dimensions, Area Unit & Town Planning Standards */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-brand-copper" />
            <span>4. Dimensions &amp; Marla Standard Calculation</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Area Value <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                min="0.1"
                value={areaValue}
                onChange={(e) => setAreaValue(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-azure"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Measurement Unit
              </label>
              <select
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-azure"
              >
                <option value="marla">Marla</option>
                <option value="kanal">Kanal (20 Marlas)</option>
                <option value="sqft">Square Feet</option>
                <option value="sqyd">Square Yards (Gazz)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Town Planning Marla Standard
              </label>
              <select
                value={marlaStandard}
                onChange={(e) => setMarlaStandard(parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-azure"
              >
                <option value={225}>225 Sq. Ft. (Bahria Town / DHA Standard)</option>
                <option value={250}>250 Sq. Ft. (Municipal Standard)</option>
                <option value={272.25}>272.25 Sq. Ft. (Punjab Revenue Standard)</option>
              </select>
            </div>
          </div>

          {/* Live Dimension Calculation Preview */}
          <div className="p-3 bg-brand-slate-50 border border-brand-slate-200 rounded-xl text-xs flex items-center justify-between text-slate-600">
            <span>
              Calculated Equivalent: <strong>{calculatedMarla.toFixed(2)} Marla</strong>
            </span>
            <span>
              Footprint: <strong>{Math.round(calculatedSqft).toLocaleString()} Sq. Ft.</strong>
            </span>
          </div>
        </div>

        {/* Section 5: Geographical Location */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-copper" />
            <span>5. Location &amp; Sector</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City / Metropolitan Region
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-azure"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Society / Territory / Phase <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={areaLocation}
                onChange={(e) => setAreaLocation(e.target.value)}
                placeholder="e.g. Bahria Town Phase 8, DHA Phase 2"
                required
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-azure"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sector / Block / Street
              </label>
              <input
                type="text"
                value={sectorBlock}
                onChange={(e) => setSectorBlock(e.target.value)}
                placeholder="e.g. Sector C, Block F, Street 12"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-azure"
              />
            </div>
          </div>
        </div>

        {/* Section 6: Building Specifications (Conditional on house/apartment) */}
        {(category === 'house' || category === 'apartment') && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              6. Living Space Specifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  min="0"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-azure"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  min="0"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  placeholder="e.g. 6"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-azure"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 7: Key Features Tag Manager */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            7. Amenities &amp; Infrastructure Highlights
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={newFeatureTag}
              onChange={(e) => setNewFeatureTag(e.target.value)}
              placeholder="e.g. Corner Plot, Main Boulevard, Underground Electricity, Park Facing"
              className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-azure"
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Tag</span>
            </button>
          </div>

          {features.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {features.map((feature, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-brand-slate-100 text-brand-navy border border-brand-slate-200"
                >
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(feature)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Section 8: Image & Gallery Management */}
        <div className="pt-4 border-t border-slate-100">
          <ImageManager
            images={images}
            onChange={setImages}
            featuredImage={featuredImage}
            onFeaturedChange={setFeaturedImage}
          />
        </div>

        {/* Bottom Submission & Status Actions */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {isEditing && (
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSave('archived')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Archive Listing
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSave('draft')}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              Save as Draft
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSave('published')}
              className="inline-flex items-center gap-2 bg-brand-navy hover:bg-brand-navy-light text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-colors active:scale-95 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-brand-copper" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-brand-cyan" />
                  <span>{isEditing ? 'Save Changes' : 'Publish Listing'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
