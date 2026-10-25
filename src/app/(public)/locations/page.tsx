import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import { siteConfig } from '@/config/site';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import {
  MapPin,
  ShieldCheck,
  Building2,
  Compass,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Areas Served | Bahria Town, DHA & Islamabad Real Estate',
  description:
    'Explore prime real estate territories served by HomaceBuild and Realators across Bahria Town (Phases 1–8), DHA Islamabad (Phases 1–5), Islamabad CDA sectors, and Rawalpindi.',
  alternates: {
    canonical: `${siteConfig.url}/locations`,
  },
  openGraph: {
    title: 'Areas Served | Bahria Town, DHA & Islamabad Real Estate',
    description:
      'Explore prime real estate territories served by HomaceBuild and Realators across Bahria Town (Phases 1–8), DHA Islamabad (Phases 1–5), Islamabad CDA sectors, and Rawalpindi.',
    url: `${siteConfig.url}/locations`,
    siteName: siteConfig.name,
    type: 'website',
    images: [
      {
        url: `${siteConfig.url}/HomaceLogo.png`,
        width: 738,
        height: 396,
        alt: 'Homace Real Estate Operational Territories',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Areas Served | Bahria Town, DHA & Islamabad Real Estate',
    description:
      'Explore prime real estate territories across Bahria Town, DHA Islamabad, and the twin cities.',
    images: [`${siteConfig.url}/HomaceLogo.png`],
  },
};

export default function LocationsHubPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Areas Served', url: `${siteConfig.url}/locations` },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Breadcrumbs items={[{ label: 'Areas Served' }]} />

      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-copper uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5 text-brand-copper" />
          <span>Territorial Market Coverage</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy leading-tight">
          Areas & Territories Served
        </h1>
        <p className="text-sm sm:text-base text-brand-slate-600 leading-relaxed">
          HomaceBuild and Realators focuses on high-security master-planned developments and urban commercial centers in the twin cities where infrastructure, amenities, and developer records are transparent.
        </p>
      </div>

      {/* Primary Territories Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Territory 1: Bahria Town */}
        <div className="bg-white rounded-3xl border border-brand-slate-200 p-8 space-y-6 shadow-xs hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-azure-tint text-brand-azure flex items-center justify-center">
              <MapPin className="w-6 h-6 text-brand-azure" />
            </div>
            <h2 className="text-2xl font-bold text-brand-navy">
              Bahria Town Islamabad & Rawalpindi
            </h2>
            <p className="text-xs sm:text-sm text-brand-slate-600 leading-relaxed">
              Comprehensive advisory across Bahria Town Phases 1 to 8, Safari Valley, Executive Lodges, Garden City, and Bahria Enclave. We guide buyers on possession plot demarcation, balloted sectors, and commercial civic centers.
            </p>
          </div>

          <div className="space-y-2 text-xs text-brand-slate-600 pt-2 border-t border-brand-slate-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Standard 225 sq ft Marla calculations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Phase 8 Safari Valley & Business District specialists</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Direct Bahria Town Head Office transfer facilitation</span>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <Link
              href="/locations/bahria-town"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-azure hover:text-brand-copper transition-colors"
            >
              <span>Explore Bahria Town Guide</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/properties?location=Bahria"
              className="text-xs text-brand-slate-500 hover:text-brand-navy transition-colors underline underline-offset-2"
            >
              View Bahria Listings
            </Link>
          </div>
        </div>

        {/* Territory 2: DHA Islamabad */}
        <div className="bg-white rounded-3xl border border-brand-slate-200 p-8 space-y-6 shadow-xs hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-copper-tint text-brand-copper flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-brand-copper" />
            </div>
            <h2 className="text-2xl font-bold text-brand-navy">
              Defence Housing Authority (DHA)
            </h2>
            <p className="text-xs sm:text-sm text-brand-slate-600 leading-relaxed">
              Serving DHA Phase 1, Phase 2, Phase 3, Phase 4, Phase 5, and DHA Valley. We provide verified documentation checks for DHA membership files, balloted plot numbers, and possession-cleared residential and commercial avenues.
            </p>
          </div>

          <div className="space-y-2 text-xs text-brand-slate-600 pt-2 border-t border-brand-slate-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Direct DHA Transfer Office liaison</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>DHA Phase 2 commercial & Expressway corridor expertise</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>DHA Valley file transfer and verification guidance</span>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <Link
              href="/locations/dha-islamabad"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-copper hover:text-brand-azure transition-colors"
            >
              <span>Explore DHA Islamabad Guide</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/properties?location=DHA"
              className="text-xs text-brand-slate-500 hover:text-brand-navy transition-colors underline underline-offset-2"
            >
              View DHA Listings
            </Link>
          </div>
        </div>
      </div>

      {/* Additional Twin Cities Sectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-brand-slate-200 p-8 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-brand-slate-100 text-brand-navy flex items-center justify-center">
            <Building2 className="w-5 h-5 text-brand-navy" />
          </div>
          <h3 className="text-xl font-bold text-brand-navy">
            Islamabad Capital Territory (CDA Zones)
          </h3>
          <p className="text-xs sm:text-sm text-brand-slate-600 leading-relaxed">
            Targeted consultation on prime CDA sectors, Park Road developments, and institutional commercial corridors along the Islamabad Expressway.
          </p>
          <div className="pt-2">
            <Link
              href="/properties?location=Islamabad"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-azure hover:text-brand-copper transition-colors"
            >
              <span>Browse Islamabad Listings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-brand-slate-200 p-8 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Compass className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-brand-navy">
            Rawalpindi Strategic Corridors
          </h3>
          <p className="text-xs sm:text-sm text-brand-slate-600 leading-relaxed">
            Coverage of GT Road commercial strips, Chaklala Scheme, Peshawar Road, and emerging commercial districts connecting to the forthcoming Ring Road.
          </p>
          <div className="pt-2">
            <Link
              href="/properties?location=Rawalpindi"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-brand-copper transition-colors"
            >
              <span>Browse Rawalpindi Listings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-brand-navy-dark text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 border border-brand-slate-800">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-bold">Looking for Property in a Specific Sector?</h3>
          <p className="text-xs text-brand-slate-300">
            Our advisory team can confirm active inventory and developer transfer dues for your preferred block.
          </p>
        </div>
        <WhatsAppButton size="lg">
          Talk to a Local Specialist
        </WhatsAppButton>
      </div>
    </div>
  );
}
