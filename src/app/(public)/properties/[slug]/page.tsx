import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPropertyBySlug, getPublishedProperties } from '@/lib/propertyService';
import { Property } from '@/types/database';
import { formatArea, formatPKR } from '@/config/measurements';
import { generatePropertySchema, generateBreadcrumbSchema } from '@/lib/seo/schema';
import { siteConfig } from '@/config/site';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import PropertyCard from '@/components/public/PropertyCard';
import PropertyGallery from '@/components/public/PropertyGallery';
import InquiryForm from '@/components/public/InquiryForm';
import { Badge } from '@/components/ui/Badge';
import { CallButton } from '@/components/ui/CallButton';
import { Notification } from '@/components/ui/Notification';
import { PropertyContextSync } from '@/components/public/PropertyContextSync';
import {
  MapPin,
  Bed,
  Bath,
  Compass,
  CheckCircle2,
  FileCheck,
  Building2,
  Share2,
  ShieldAlert,
} from 'lucide-react';

export const revalidate = 60;

interface PropertyPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const property = await getPropertyBySlug(params.slug);

  if (!property || property.publication_status !== 'published') {
    return {
      title: 'Property Not Found | HomaceBuild and Realators',
      description: 'The requested property listing is not available or has been removed.',
    };
  }

  const priceText = formatPKR(property.price_pkr, property.is_price_on_call);
  const locationText = [property.sector_block, property.area_location, property.city]
    .filter(Boolean)
    .join(', ');

  const title = `${property.title} | ${priceText} in ${property.area_location}`;
  const description = property.description
    ? property.description.substring(0, 155)
    : `${property.title} available for ${property.purpose} in ${locationText}. Verified listing by ${siteConfig.name}.`;

  const imageUrl = property.featured_image || property.images[0] || `${siteConfig.url}/HomaceLogo.png`;
  const canonicalUrl = `${siteConfig.url}/properties/${property.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const property = await getPropertyBySlug(params.slug);

  // Return proper 404 for missing or unpublished listings
  if (!property || property.publication_status !== 'published') {
    notFound();
  }

  const typedProperty: Property = property;
  const canonicalUrl = `${siteConfig.url}/properties/${typedProperty.slug}`;
  const jsonLd = generatePropertySchema(typedProperty, canonicalUrl);

  // Fetch up to 3 published related listings in the same territory
  const allRelated = await getPublishedProperties({
    location: typedProperty.area_location.split(' ')[0],
    limit: 4,
  });
  const relatedProperties = allRelated.filter((p) => p.id !== typedProperty.id).slice(0, 3);

  const breadcrumbItems = [
    { label: 'Properties', href: '/properties' },
    {
      label: typedProperty.area_location,
      href: `/properties?location=${encodeURIComponent(typedProperty.area_location)}`,
    },
    { label: typedProperty.title },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Properties', url: `${siteConfig.url}/properties` },
    {
      name: typedProperty.area_location,
      url: `${siteConfig.url}/properties?location=${encodeURIComponent(typedProperty.area_location)}`,
    },
    { name: typedProperty.title, url: canonicalUrl },
  ]);

  const displayImages = typedProperty.images.length > 0 ? typedProperty.images : ['/HomaceLogo.png'];

  const isSoldOrRented =
    typedProperty.availability_status === 'sold' ||
    typedProperty.availability_status === 'rented';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Dynamic Property Context Sync for Floating WhatsApp & Global Controls */}
      <PropertyContextSync
        title={typedProperty.title}
        referenceCode={typedProperty.reference_code}
        slug={typedProperty.slug}
        url={canonicalUrl}
      />

      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Breadcrumbs items={breadcrumbItems} />

      {/* Availability Status Banner for Sold / Rented / Under Offer */}
      {typedProperty.availability_status === 'sold' && (
        <Notification
          variant="warning"
          title="Listing Status Notice: Property Sold"
          message="This property has been successfully transacted and transferred. Please contact our advisory desk to inquire about upcoming or off-market opportunities in this sector."
          isDismissible={false}
        />
      )}

      {typedProperty.availability_status === 'rented' && (
        <Notification
          variant="info"
          title="Listing Status Notice: Currently Rented"
          message="This property is currently leased out. Contact our advisory desk for alternative executive rentals in this location."
          isDismissible={false}
        />
      )}

      {typedProperty.availability_status === 'under_offer' && (
        <Notification
          variant="info"
          title="Under Active Offer"
          message="A token deposit has been placed on this listing. Inquiries are being accepted for second-position backup offers."
          isDismissible={false}
        />
      )}

      {/* Header Info */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-brand-slate-200">
        <div className="space-y-2">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={typedProperty.purpose === 'sale' ? 'sale' : 'rent'} size="md">
              For {typedProperty.purpose}
            </Badge>

            <Badge variant="default" size="md">
              {typedProperty.category.replace('_', ' ')}
            </Badge>

            {typedProperty.plot_file_status === 'possession' && (
              <Badge variant="possession" size="md">Possession Ready</Badge>
            )}
            {typedProperty.plot_file_status === 'balloted' && (
              <Badge variant="balloted" size="md">Balloted</Badge>
            )}
            {typedProperty.plot_file_status === 'file' && (
              <Badge variant="file" size="md">Allocation File</Badge>
            )}

            {typedProperty.availability_status === 'sold' && (
              <Badge variant="sold" size="md">Sold Out</Badge>
            )}
            {typedProperty.availability_status === 'rented' && (
              <Badge variant="sold" size="md">Rented</Badge>
            )}

            <span className="text-brand-slate-400 font-mono text-xs ml-1">
              Ref: #{typedProperty.reference_code}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy">
            {typedProperty.title}
          </h1>

          <p className="text-xs sm:text-sm text-brand-slate-500 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-brand-copper shrink-0" />
            <span>
              {[typedProperty.sector_block, typedProperty.area_location, typedProperty.city]
                .filter(Boolean)
                .join(', ')}
            </span>
          </p>
        </div>

        {/* Pricing Box & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-end gap-3">
          <div className="text-left lg:text-right">
            <span className="text-xs text-brand-slate-500 block uppercase tracking-wider font-semibold">
              Listing Price
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
              {formatPKR(typedProperty.price_pkr, typedProperty.is_price_on_call)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CallButton size="md">
              Call Agent: {siteConfig.contact.phone}
            </CallButton>
          </div>
        </div>
      </div>

      {/* Interactive Media Gallery with Fullscreen Lightbox */}
      <PropertyGallery
        images={displayImages}
        title={typedProperty.title}
      />

      {/* Main Specifications & Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Columns: Specifications, Description & Metrics */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-2xl border border-brand-slate-200 shadow-xs">
            <div>
              <span className="text-[11px] font-semibold text-brand-slate-400 uppercase tracking-wider block">
                Area Size
              </span>
              <span className="text-base font-bold text-brand-navy mt-0.5 block">
                {formatArea(typedProperty.area_value, typedProperty.area_unit)}
              </span>
              <span className="text-[11px] text-brand-slate-500 block">
                ≈ {Number(typedProperty.area_in_sqft).toLocaleString()} Sq. Ft.
              </span>
            </div>

            {typedProperty.bedrooms !== null && typedProperty.bedrooms !== undefined && typedProperty.bedrooms > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-brand-slate-400 uppercase tracking-wider block">
                  Bedrooms
                </span>
                <span className="text-base font-bold text-brand-navy mt-0.5 block flex items-center gap-1">
                  <Bed className="w-4 h-4 text-brand-azure" />
                  {typedProperty.bedrooms} Beds
                </span>
              </div>
            )}

            {typedProperty.bathrooms !== null && typedProperty.bathrooms !== undefined && typedProperty.bathrooms > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-brand-slate-400 uppercase tracking-wider block">
                  Bathrooms
                </span>
                <span className="text-base font-bold text-brand-navy mt-0.5 block flex items-center gap-1">
                  <Bath className="w-4 h-4 text-brand-azure" />
                  {typedProperty.bathrooms} Baths
                </span>
              </div>
            )}

            <div>
              <span className="text-[11px] font-semibold text-brand-slate-400 uppercase tracking-wider block">
                Availability
              </span>
              <span
                className={`text-base font-bold mt-0.5 block uppercase ${
                  typedProperty.availability_status === 'available'
                    ? 'text-emerald-600'
                    : 'text-brand-slate-700'
                }`}
              >
                {typedProperty.availability_status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-brand-navy mb-4">
              Property Overview & Description
            </h2>
            <div className="text-sm text-brand-slate-700 leading-relaxed whitespace-pre-line">
              {typedProperty.description ||
                'Contact our direct advisory desk for complete developer documentation, site visit scheduling, and transfer guidance.'}
            </div>
          </div>

          {/* Features and Amenities Section (if provided) */}
          {typedProperty.features && typedProperty.features.length > 0 && (
            <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-brand-navy mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-brand-azure" />
                <span>Property Features & Infrastructure</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {typedProperty.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-100 text-brand-slate-800 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Specifications Table */}
          <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-brand-navy mb-4 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-brand-azure" />
              <span>Technical & Legal Documentation Metrics</span>
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
              <div className="border-b border-brand-slate-100 pb-2">
                <dt className="text-brand-slate-500 font-medium">Reference Code</dt>
                <dd className="font-semibold text-brand-slate-900 font-mono mt-0.5">
                  #{typedProperty.reference_code}
                </dd>
              </div>

              <div className="border-b border-brand-slate-100 pb-2">
                <dt className="text-brand-slate-500 font-medium">Transaction Purpose</dt>
                <dd className="font-semibold text-brand-slate-900 capitalize mt-0.5">
                  For {typedProperty.purpose}
                </dd>
              </div>

              <div className="border-b border-brand-slate-100 pb-2">
                <dt className="text-brand-slate-500 font-medium">Property Category</dt>
                <dd className="font-semibold text-brand-slate-900 capitalize mt-0.5">
                  {typedProperty.category.replace('_', ' ')}
                </dd>
              </div>

              <div className="border-b border-brand-slate-100 pb-2">
                <dt className="text-brand-slate-500 font-medium">Local Marla Standard</dt>
                <dd className="font-semibold text-brand-slate-900 mt-0.5">
                  1 Marla = {typedProperty.marla_sqft_standard} sq ft (Bahria/DHA standard)
                </dd>
              </div>

              <div className="border-b border-brand-slate-100 pb-2">
                <dt className="text-brand-slate-500 font-medium">Normalized Marla Size</dt>
                <dd className="font-semibold text-brand-slate-900 mt-0.5">
                  {Number(typedProperty.area_in_marla).toFixed(2)} Marla
                </dd>
              </div>

              <div className="border-b border-brand-slate-100 pb-2">
                <dt className="text-brand-slate-500 font-medium">Square Footage</dt>
                <dd className="font-semibold text-brand-slate-900 mt-0.5">
                  {Number(typedProperty.area_in_sqft).toLocaleString()} Sq. Ft.
                </dd>
              </div>

              <div className="border-b border-brand-slate-100 pb-2">
                <dt className="text-brand-slate-500 font-medium">Development & Title Status</dt>
                <dd className="font-semibold text-brand-slate-900 capitalize mt-0.5">
                  {typedProperty.plot_file_status.replace('_', ' ')}
                </dd>
              </div>

              <div className="border-b border-brand-slate-100 pb-2">
                <dt className="text-brand-slate-500 font-medium">Territory / Location</dt>
                <dd className="font-semibold text-brand-slate-900 mt-0.5">
                  {typedProperty.area_location}, {typedProperty.city}
                </dd>
              </div>
            </dl>
          </div>

          {/* Contextual Advisory Note (AEO) */}
          <div className="bg-brand-azure-tint border border-brand-azure/20 rounded-2xl p-6 text-xs text-brand-slate-700 space-y-2">
            <h4 className="font-bold text-brand-navy flex items-center gap-1.5 text-sm">
              <Compass className="w-4 h-4 text-brand-azure" />
              <span>Town Planning Standard Note</span>
            </h4>
            <p className="leading-relaxed">
              This property is recorded under the <strong>{typedProperty.marla_sqft_standard} sq ft per Marla</strong> standard recognized by town planning authorities in {typedProperty.area_location}. Transfer transactions must be conducted in the official society transfer branch with an approved No Demand Certificate (NDC).
            </p>
          </div>
        </div>

        {/* Right 1 Column: Direct Inquiry Desk */}
        <div className="space-y-6">
          <InquiryForm
            propertyId={typedProperty.id}
            propertyTitle={typedProperty.title}
            referenceCode={typedProperty.reference_code}
          />
        </div>
      </div>

      {/* Related Properties Section */}
      {relatedProperties.length > 0 && (
        <div className="pt-10 border-t border-brand-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-brand-copper uppercase tracking-wider">
                Related Inventory
              </span>
              <h2 className="text-xl font-bold text-brand-navy mt-0.5">
                Similar Properties in {typedProperty.area_location}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProperties.map((relProp) => (
              <PropertyCard key={relProp.id} property={relProp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
