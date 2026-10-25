import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types/database';
import { formatArea, formatPKR } from '@/config/measurements';
import { siteConfig } from '@/config/site';
import { MapPin, Bed, Bath, ArrowUpRight, MessageSquare, ShieldCheck } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const displayImage = property.featured_image || property.images[0] || '/HomaceLogo.png';
  const isLogoPlaceholder = displayImage.includes('HomaceLogo.png');

  const plotFileStatusLabel: Record<string, string> = {
    possession: 'Possession Ready',
    balloted: 'Balloted',
    allocated: 'Allocated File',
    file: 'Plot File',
    not_applicable: '',
  };

  const statusLabel = plotFileStatusLabel[property.plot_file_status];

  const whatsappMessage = `Hello HomaceBuild & Realators, I am inquiring regarding "${property.title}" (Ref: ${property.reference_code}).`;
  const whatsappUrl = siteConfig.contact.whatsapp
    ? `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`
    : null;

  return (
    <article className="bg-white rounded-xl border border-brand-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
      {/* Property Visual Header */}
      <div className="relative h-56 w-full bg-brand-slate-900 overflow-hidden">
        <Link href={`/properties/${property.slug}`} className="block h-full w-full relative">
          <Image
            src={displayImage}
            alt={property.title}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
              isLogoPlaceholder ? 'p-10 object-contain opacity-85 bg-white' : ''
            }`}
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="bg-brand-navy/95 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-sm uppercase tracking-wider border border-white/10">
            For {property.purpose}
          </span>
          {statusLabel && (
            <span className="bg-emerald-600/95 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded shadow-sm flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              {statusLabel}
            </span>
          )}
        </div>

        {/* Reference Code Tag */}
        <div className="absolute bottom-3 right-3 bg-brand-navy-dark/80 backdrop-blur-sm text-brand-slate-200 text-xs px-2 py-0.5 rounded font-mono border border-white/10">
          #{property.reference_code}
        </div>
      </div>

      {/* Property Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price */}
          <div className="mb-2">
            <span className="text-xl font-bold text-brand-navy">
              {formatPKR(property.price_pkr, property.is_price_on_call)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-brand-slate-800 line-clamp-1 group-hover:text-brand-azure transition-colors">
            <Link href={`/properties/${property.slug}`}>
              {property.title}
            </Link>
          </h3>

          {/* Location */}
          <p className="mt-1 text-xs text-brand-slate-500 flex items-center gap-1.5 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-brand-copper shrink-0" />
            <span>
              {[property.sector_block, property.area_location, property.city].filter(Boolean).join(', ')}
            </span>
          </p>
        </div>

        {/* Specifications & Metrics */}
        <div className="mt-4 pt-3 border-t border-brand-slate-100">
          <div className="flex items-center justify-between text-xs text-brand-slate-600 mb-4">
            <span className="font-bold text-brand-navy bg-brand-slate-100 px-2.5 py-1 rounded border border-brand-slate-200">
              {formatArea(property.area_value, property.area_unit)}
            </span>

            {/* Bedrooms & Bathrooms (if applicable) */}
            <div className="flex items-center gap-3">
              {property.bedrooms !== null && property.bedrooms !== undefined && property.bedrooms > 0 && (
                <span className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-brand-azure" />
                  {property.bedrooms} Beds
                </span>
              )}
              {property.bathrooms !== null && property.bathrooms !== undefined && property.bathrooms > 0 && (
                <span className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-brand-azure" />
                  {property.bathrooms} Baths
                </span>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            <Link
              href={`/properties/${property.slug}`}
              className="flex-1 text-center bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
            >
              <span>View Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white p-2 rounded-lg border border-emerald-200 transition-colors"
                title="Direct WhatsApp Inquiry"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
