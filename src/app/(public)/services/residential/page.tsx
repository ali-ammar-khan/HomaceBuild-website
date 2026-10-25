import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import { siteConfig } from '@/config/site';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import { CallButton } from '@/components/ui/CallButton';
import InquiryForm from '@/components/public/InquiryForm';
import {
  Home,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Building,
  Compass,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Residential Property & Plot Services | HomaceBuild and Realators',
  description:
    'Verified residential plots, houses, villas, and apartments in Bahria Town and DHA Islamabad. Possession plots, balloted files, and standardized 225 sq ft Marla calculations.',
  alternates: {
    canonical: `${siteConfig.url}/services/residential`,
  },
  openGraph: {
    title: 'Residential Property & Plot Services | HomaceBuild and Realators',
    description:
      'Verified residential plots, houses, villas, and apartments in Bahria Town and DHA Islamabad.',
    url: `${siteConfig.url}/services/residential`,
    siteName: siteConfig.name,
    type: 'website',
    images: [
      {
        url: `${siteConfig.url}/HomaceLogo.png`,
        width: 738,
        height: 396,
        alt: 'Residential Property Services - HomaceBuild',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Residential Property Services | HomaceBuild',
    description:
      'Verified residential plots, houses, villas, and apartments in Bahria Town and DHA Islamabad.',
    images: [`${siteConfig.url}/HomaceLogo.png`],
  },
};

export default function ResidentialServicesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Services', url: `${siteConfig.url}/services` },
    { name: 'Residential Services', url: `${siteConfig.url}/services/residential` },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Services', href: '/services' },
          { label: 'Residential Property Services' },
        ]}
      />

      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-copper uppercase tracking-wider">
          <Home className="w-3.5 h-3.5 text-brand-azure" />
          <span>Homebuilders & Land Advisory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy leading-tight">
          Residential Property Services
        </h1>
        <p className="text-sm sm:text-base text-brand-slate-600 leading-relaxed">
          Guiding homebuyers, overseas families, and private land investors across Bahria Town Phases 1–8, Safari Valley, and DHA Islamabad Phases 1–5.
        </p>
      </div>

      {/* Three Residential Portfolios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Residential Plots */}
        <div className="bg-white rounded-3xl border border-brand-slate-200 p-8 space-y-4 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-brand-azure-tint text-brand-azure flex items-center justify-center">
            <Layers className="w-6 h-6 text-brand-azure" />
          </div>
          <h3 className="text-lg font-bold text-brand-navy">
            Residential Plots
          </h3>
          <p className="text-xs text-brand-slate-600 leading-relaxed">
            5 Marla, 10 Marla, 1 Kanal, and 2 Kanal plots. We clearly verify whether a plot is ready for possession or currently in balloted file status.
          </p>
          <ul className="space-y-2 text-xs text-brand-slate-500 pt-2 border-t border-brand-slate-100">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Standard 225 sq ft Marla calculations</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Ground level & non-embankment checks</span>
            </li>
          </ul>
          <div className="pt-2">
            <Link
              href="/properties?category=residential_plot"
              className="text-xs font-bold text-brand-azure hover:text-brand-copper transition-colors inline-flex items-center gap-1"
            >
              <span>View Residential Plots</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Ready Houses & Villas */}
        <div className="bg-white rounded-3xl border border-brand-slate-200 p-8 space-y-4 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-brand-copper-tint text-brand-copper flex items-center justify-center">
            <Home className="w-6 h-6 text-brand-copper" />
          </div>
          <h3 className="text-lg font-bold text-brand-navy">
            Houses & Designer Villas
          </h3>
          <p className="text-xs text-brand-slate-600 leading-relaxed">
            Newly completed luxury homes, architect-designed villas, and custom-built family residences with verified municipal completion certificates.
          </p>
          <ul className="space-y-2 text-xs text-brand-slate-500 pt-2 border-t border-brand-slate-100">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Independent double-unit configurations</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Solid A-grade construction assessments</span>
            </li>
          </ul>
          <div className="pt-2">
            <Link
              href="/properties?category=house"
              className="text-xs font-bold text-brand-copper hover:text-brand-azure transition-colors inline-flex items-center gap-1"
            >
              <span>View Houses & Villas</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Apartments & Penthouses */}
        <div className="bg-white rounded-3xl border border-brand-slate-200 p-8 space-y-4 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-brand-slate-100 text-brand-navy flex items-center justify-center">
            <Building className="w-6 h-6 text-brand-navy" />
          </div>
          <h3 className="text-lg font-bold text-brand-navy">
            Apartments & Penthouses
          </h3>
          <p className="text-xs text-brand-slate-600 leading-relaxed">
            High-yield urban apartments in prime developments along Bahria Town Phase 7, Phase 8, and the Islamabad Expressway.
          </p>
          <ul className="space-y-2 text-xs text-brand-slate-500 pt-2 border-t border-brand-slate-100">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>High rental yields & executive tenants</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Dual power backup & covered parking</span>
            </li>
          </ul>
          <div className="pt-2">
            <Link
              href="/properties?category=apartment"
              className="text-xs font-bold text-brand-navy hover:text-brand-copper transition-colors inline-flex items-center gap-1"
            >
              <span>View Apartment Catalogue</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Inquiry Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start pt-6">
        <div className="space-y-4">
          <span className="text-xs font-bold text-brand-copper uppercase tracking-wider">
            Residential Advisory
          </span>
          <h2 className="text-2xl font-bold text-brand-navy">
            Request Residential Guidance
          </h2>
          <p className="text-xs sm:text-sm text-brand-slate-600 leading-relaxed">
            Specify your preferred sector, plot dimensions (e.g., 5 Marla, 10 Marla, or 1 Kanal), and budget. Our residential specialists will respond with authenticated listings.
          </p>
          <div className="pt-2">
            <CallButton size="lg" fullWidth>
              Call Residential Advisor: {siteConfig.contact.phone}
            </CallButton>
          </div>
        </div>

        <div className="lg:col-span-2">
          <InquiryForm />
        </div>
      </div>
    </div>
  );
}
