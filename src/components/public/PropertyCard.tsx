import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types/database';
import { formatArea, formatPKR } from '@/config/measurements';
import { siteConfig } from '@/config/site';
import { MapPin, Bed, Bath, ArrowUpRight, MessageSquare, Tag } from 'lucide-react';

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
    <article className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
      {/* Property Visual Header */}
      <div className="relative h-56 w-full bg-slate-900 overflow-hidden">
        <Link href={`/properties/${property.slug}`} className="block h-full w-full relative">
          <Image
            src={displayImage}
            alt={property.title}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
              isLogoPlaceholder ? 'p-12 object-contain opacity-70' : ''
            }`}
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="bg-brand-navy/90 backdrop-blur-sm text-brand-gold text-xs font-semibold px-2.5 py-1 rounded shadow-sm uppercase tracking-wider">
            For {property.purpose}
          </span>
          {statusLabel && (
            <span className="bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded shadow-sm">
              {statusLabel}
            </span>
          )}
        </div>

        {/* Reference Code Tag */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-slate-200 text-xs px-2 py-0.5 rounded font-mono">
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
          <h3 className="text-base font-semibold text-slate-800 line-clamp-1 group-hover:text-brand-gold transition-colors">
            <Link href={`/properties/${property.slug}`}>
              {property.title}
            </Link>
          </h3>

          {/* Location */}
          <p className="mt-1 text-xs text-slate-500 flex items-center gap-1.5 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" />
            <span>
              {[property.sector_block, property.area_location, property.city].filter(Boolean).join(', ')}
            </span>
          </p>
        </div>

        {/* Specifications & Metrics */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-4">
            <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-1 rounded">
              {formatArea(property.area_value, property.area_unit)}
            </span>

            {/* Bedrooms & Bathrooms (if applicable) */}
            <div className="flex items-center gap-3">
              {property.bedrooms !== null && property.bedrooms !== undefined && property.bedrooms > 0 && (
                <span className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-slate-400" />
                  {property.bedrooms} Beds
                </span>
              )}
              {property.bathrooms !== null && property.bathrooms !== undefined && property.bathrooms > 0 && (
                <span className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-slate-400" />
                  {property.bathrooms} Baths
                </span>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            <Link
              href={`/properties/${property.slug}`}
              className="flex-1 text-center bg-slate-100 hover:bg-brand-navy hover:text-white text-slate-800 text-xs font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
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
