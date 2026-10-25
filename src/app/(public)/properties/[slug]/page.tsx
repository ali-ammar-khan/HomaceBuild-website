import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPropertyBySlug, getPublishedProperties } from '@/lib/propertyService';
import { Property } from '@/types/database';
import { formatArea, formatPKR } from '@/config/measurements';
import { generatePropertySchema, generateBreadcrumbSchema } from '@/lib/seo/schema';
import { siteConfig } from '@/config/site';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import PropertyCard from '@/components/public/PropertyCard';
import InquiryForm from '@/components/public/InquiryForm';
import {
  MapPin,
  Bed,
  Bath,
  MessageSquare,
  ShieldCheck,
  Building,
  HelpCircle,
  Compass,
} from 'lucide-react';

export const revalidate = 60;

interface PropertyPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const property = await getPropertyBySlug(params.slug);

  if (!property) {
    return {
      title: 'Property Not Found',
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

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/properties/${property.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/properties/${property.slug}`,
      images: [{ url: imageUrl, alt: property.title }],
      type: 'article',
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const property = await getPropertyBySlug(params.slug);

  if (!property) {
    notFound();
  }

  const typedProperty: Property = property;
  const canonicalUrl = `${siteConfig.url}/properties/${typedProperty.slug}`;
  const jsonLd = generatePropertySchema(typedProperty, canonicalUrl);

  // Fetch related listings in the same location area
  const allRelated = await getPublishedProperties({
    location: typedProperty.area_location.split(' ')[0],
    limit: 4,
  });
  const relatedProperties = allRelated.filter((p) => p.id !== typedProperty.id).slice(0, 3);

  const breadcrumbItems = [
    { label: 'Properties', href: '/properties' },
    { label: typedProperty.area_location, href: `/properties?location=${encodeURIComponent(typedProperty.area_location)}` },
    { label: typedProperty.title },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Properties', url: `${siteConfig.url}/properties` },
    { name: typedProperty.area_location, url: `${siteConfig.url}/properties?location=${encodeURIComponent(typedProperty.area_location)}` },
    { name: typedProperty.title, url: canonicalUrl },
  ]);

  const displayImages = typedProperty.images.length > 0 ? typedProperty.images : ['/HomaceLogo.png'];

  const whatsappMessage = `Hello HomaceBuild & Realators, I am inquiring regarding "${typedProperty.title}" (Ref: ${typedProperty.reference_code}). Please confirm availability.`;
  const whatsappUrl = siteConfig.contact.whatsapp
    ? `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
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

      {/* Header Info */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-brand-slate-200">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-brand-navy text-white font-bold px-2.5 py-1 rounded uppercase tracking-wider">
              For {typedProperty.purpose}
            </span>
            <span className="bg-brand-slate-100 text-brand-slate-700 font-semibold px-2.5 py-1 rounded uppercase">
              {typedProperty.category.replace('_', ' ')}
            </span>
            {typedProperty.plot_file_status !== 'not_applicable' && (
              <span className="bg-emerald-600 text-white font-semibold px-2.5 py-1 rounded flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {typedProperty.plot_file_status.replace('_', ' ').toUpperCase()}
              </span>
            )}
            <span className="text-brand-slate-400 font-mono">
              Ref: #{typedProperty.reference_code}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy">
            {typedProperty.title}
          </h1>

          <p className="text-xs sm:text-sm text-brand-slate-500 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-brand-copper shrink-0" />
            <span>
              {[typedProperty.sector_block, typedProperty.area_location, typedProperty.city].filter(Boolean).join(', ')}
            </span>
          </p>
        </div>

        {/* Pricing Box & Quick Action */}
        <div className="flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-end gap-3">
          <div className="text-left lg:text-right">
            <span className="text-xs text-brand-slate-500 block uppercase tracking-wider font-semibold">
              Listing Price
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
              {formatPKR(typedProperty.price_pkr, typedProperty.is_price_on_call)}
            </span>
          </div>

          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Inquire via WhatsApp</span>
            </a>
          )}
        </div>
      </div>

      {/* Media Gallery / Main Image */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative h-80 sm:h-96 md:h-[480px] rounded-2xl overflow-hidden bg-brand-slate-900 border border-brand-slate-200">
          <Image
            src={displayImages[0]}
            alt={typedProperty.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Side Thumbnails or Advisory Box */}
        <div className="flex flex-col gap-4">
          {displayImages.slice(1, 3).map((img, index) => (
            <div key={index} className="relative h-44 sm:h-56 md:h-[232px] rounded-2xl overflow-hidden bg-brand-slate-900 border border-brand-slate-200">
              <Image src={img} alt={`${typedProperty.title} photo ${index + 2}`} fill className="object-cover" />
            </div>
          ))}

          {displayImages.length <= 1 && (
            <div className="h-full bg-brand-slate-50 border border-brand-slate-200 rounded-2xl p-6 flex flex-col justify-center text-center">
              <ShieldCheck className="w-10 h-10 text-brand-copper mx-auto mb-2" />
              <h4 className="text-sm font-bold text-brand-navy">
                Verified Listing Standards
              </h4>
              <p className="text-xs text-brand-slate-500 mt-1">
                All property attributes are verified against official developer records (Bahria Town & DHA).
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Specifications & Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Specifications & Description */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-2xl border border-brand-slate-200">
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
                  {typedProperty.bedrooms}
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
                  {typedProperty.bathrooms}
                </span>
              </div>
            )}

            <div>
              <span className="text-[11px] font-semibold text-brand-slate-400 uppercase tracking-wider block">
                Availability
              </span>
              <span className="text-base font-bold text-emerald-600 mt-0.5 block uppercase">
                {typedProperty.availability_status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-brand-navy mb-4">
              Property Description
            </h2>
            <div className="text-sm text-brand-slate-700 leading-relaxed whitespace-pre-line">
              {typedProperty.description || 'Contact our advisory desk for comprehensive documentation, transfer procedure, and site visit scheduling.'}
            </div>
          </div>

          {/* Technical Specifications Table */}
          <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-brand-navy mb-4">
              Listing Details & Technical Metrics
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
              <div className="border-b border-brand-slate-100 pb-2">
                <dt className="text-brand-slate-500 font-medium">Reference Code</dt>
                <dd className="font-semibold text-brand-slate-800 font-mono mt-0.5">#{typedProperty.reference_code}</dd>
              </div>

              <div className="border-b border-brand-slate-100 pb-2">
                <dt className="text-brand-slate-500 font-medium">Purpose</dt>
                <dd className="font-semibold text-brand-slate-800 capitalize mt-0.5">{typedProperty.purpose}</dd>
              </div>

              <div className="border-b border-brand-slate-100 pb-2">
                <dt className="text-brand-slate-500 font-medium">Property Category</dt>
                <dd className="font-semibold text-brand-slate-800 capitalize mt-0.5">{typedProperty.category.replace('_', ' ')}</dd>
              </div>

              <div className="border-b border-brand-slate-100 pb-2">
                <dt className="text-brand-slate-500 font-medium">Local Marla Standard</dt>
                <dd className="font-semibold text-brand-slate-800 mt-0.5">
                  1 Marla = {typedProperty.marla_sqft_standard} sq ft (Bahria/DHA/CDA convention)
                </dd>
              </div>

              <div className="border-b border-brand-slate-100 pb-2">
                <dt className="text-brand-slate-500 font-medium">Normalized Marla Size</dt>
                <dd className="font-semibold text-brand-slate-800 mt-0.5">
                  {Number(typedProperty.area_in_marla).toFixed(2)} Marla
                </dd>
              </div>

              <div className="border-b border-brand-slate-100 pb-2">
                <dt className="text-brand-slate-500 font-medium">Development & Plot Status</dt>
                <dd className="font-semibold text-brand-slate-800 capitalize mt-0.5">
                  {typedProperty.plot_file_status.replace('_', ' ')}
                </dd>
              </div>
            </dl>
          </div>

          {/* Direct-Answer Informational Box (AEO) */}
          <div className="bg-brand-azure-tint border border-brand-azure/20 rounded-2xl p-6 text-xs text-brand-slate-700 space-y-2">
            <h4 className="font-bold text-brand-navy flex items-center gap-1.5 text-sm">
              <Compass className="w-4 h-4 text-brand-azure" />
              <span>Area Standard Note for This Property</span>
            </h4>
            <p className="leading-relaxed">
              This property is recorded under the <strong>{typedProperty.marla_sqft_standard} sq ft per Marla</strong> standard. For residential plots in {typedProperty.area_location}, standard plot dimensions follow municipal and developer-approved town planning guidelines.
            </p>
          </div>
        </div>

        {/* Right Column: Inquire Form Card */}
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
