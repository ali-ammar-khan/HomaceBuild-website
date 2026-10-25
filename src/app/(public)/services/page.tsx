import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import { siteConfig } from '@/config/site';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { CallButton } from '@/components/ui/CallButton';
import {
  ShieldCheck,
  Building2,
  Home,
  Store,
  KeyRound,
  FileText,
  ArrowRight,
  CheckCircle2,
  Layers,
  Compass,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Real Estate Services in Islamabad & Bahria Town | HomaceBuild',
  description:
    'Comprehensive real estate services by HomaceBuild and Realators. Residential and commercial acquisitions, sales, rental management, plot verification, and title transfer guidance.',
  alternates: {
    canonical: `${siteConfig.url}/services`,
  },
  openGraph: {
    title: 'Real Estate Services in Islamabad & Bahria Town | HomaceBuild',
    description:
      'Residential and commercial acquisitions, sales, rental management, plot verification, and title transfer guidance in Bahria Town and DHA Islamabad.',
    url: `${siteConfig.url}/services`,
    siteName: siteConfig.name,
    type: 'website',
    images: [
      {
        url: `${siteConfig.url}/HomaceLogo.png`,
        width: 738,
        height: 396,
        alt: 'Homace Real Estate Advisory Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate Services in Islamabad & Bahria Town | HomaceBuild',
    description:
      'Residential and commercial acquisitions, sales, rental management, plot verification, and title transfer guidance.',
    images: [`${siteConfig.url}/HomaceLogo.png`],
  },
};

export default function ServicesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Services', url: `${siteConfig.url}/services` },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-12">
      {/* Schema.org Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Breadcrumbs items={[{ label: 'Our Services' }]} />

      {/* Page Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-copper uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Professional Real Estate Services</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy leading-tight">
          Comprehensive Real Estate Solutions
        </h1>
        <p className="text-sm sm:text-base text-brand-slate-600 leading-relaxed">
          From first-time residential plot purchases to multi-story commercial plaza acquisitions and executive leasing, our advisory desk delivers verified documentation and strategic guidance across Islamabad and Rawalpindi.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Service 1: Property Buying & Selling */}
        <div className="bg-white rounded-3xl border border-brand-slate-200 p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-azure-tint text-brand-azure flex items-center justify-center group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-brand-azure" />
            </div>
            <div>
              <span className="text-xs font-bold text-brand-copper uppercase tracking-wider">
                Acquisition & Liquidation
              </span>
              <h2 className="text-xl font-bold text-brand-navy mt-1">
                Property Buying & Selling Services
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-brand-slate-600 leading-relaxed">
              Transparent facilitation for buyers and sellers. We conduct rigorous title verification, confirm society transfer fee obligations, and guide you through token payment, agreement drafting, and biometric transfer at developer offices.
            </p>
            <ul className="space-y-2 text-xs text-brand-slate-600 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fair market valuation without inflated broker margins</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No Demand Certificate (NDC) process guidance</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Safe token deposits and formal sale agreements</span>
              </li>
            </ul>
          </div>
          <div className="pt-6 border-t border-brand-slate-100 mt-6">
            <Link
              href="/services/buying-and-selling"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-azure hover:text-brand-copper transition-colors"
            >
              <span>Explore Buying & Selling Advisory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Service 2: Rental & Leasing Services */}
        <div className="bg-white rounded-3xl border border-brand-slate-200 p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-copper-tint text-brand-copper flex items-center justify-center group-hover:scale-105 transition-transform">
              <KeyRound className="w-6 h-6 text-brand-copper" />
            </div>
            <div>
              <span className="text-xs font-bold text-brand-copper uppercase tracking-wider">
                Residential & Commercial Leasing
              </span>
              <h2 className="text-xl font-bold text-brand-navy mt-1">
                Rental & Tenancy Services
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-brand-slate-600 leading-relaxed">
              Connecting qualified tenants with premium residential villas, apartments, and corporate offices. We draft legally enforceable tenancy contracts, conduct tenant verifications, and establish clear rent escalation schedules.
            </p>
            <ul className="space-y-2 text-xs text-brand-slate-600 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Executive houses and luxury apartments in gated communities</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Commercial retail shops and turnkey office leasing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Vetted tenancy agreements in compliance with Punjab/ICT Rent Acts</span>
              </li>
            </ul>
          </div>
          <div className="pt-6 border-t border-brand-slate-100 mt-6">
            <Link
              href="/services/rentals"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-copper hover:text-brand-azure transition-colors"
            >
              <span>Explore Rental Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Service 3: Residential Property Services */}
        <div className="bg-white rounded-3xl border border-brand-slate-200 p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-azure-tint text-brand-azure flex items-center justify-center group-hover:scale-105 transition-transform">
              <Home className="w-6 h-6 text-brand-azure" />
            </div>
            <div>
              <span className="text-xs font-bold text-brand-copper uppercase tracking-wider">
                Homebuyers & Plots
              </span>
              <h2 className="text-xl font-bold text-brand-navy mt-1">
                Residential Property Services
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-brand-slate-600 leading-relaxed">
              Specialized consultation for residential land and ready-to-move homes. We authenticate plot file allotments, balloted numbers, and possession-ready plots (5 Marla, 10 Marla, 1 Kanal, 2 Kanal) in Bahria Town and DHA Islamabad.
            </p>
            <ul className="space-y-2 text-xs text-brand-slate-600 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>On-ground plot demarcation and elevation checks</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Standardized 225 sq ft Marla calculations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ready luxury villas and custom construction guidance</span>
              </li>
            </ul>
          </div>
          <div className="pt-6 border-t border-brand-slate-100 mt-6">
            <Link
              href="/services/residential"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-azure hover:text-brand-copper transition-colors"
            >
              <span>Explore Residential Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Service 4: Commercial Property Services */}
        <div className="bg-white rounded-3xl border border-brand-slate-200 p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-slate-100 text-brand-navy flex items-center justify-center group-hover:scale-105 transition-transform">
              <Store className="w-6 h-6 text-brand-navy" />
            </div>
            <div>
              <span className="text-xs font-bold text-brand-copper uppercase tracking-wider">
                Commercial Investments
              </span>
              <h2 className="text-xl font-bold text-brand-navy mt-1">
                Commercial Property Services
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-brand-slate-600 leading-relaxed">
              Tailored advisory for commercial plots, retail shopping arcades, corporate floors, and entire commercial plazas. We analyze footfall patterns, municipal FAR regulations, and projected rental yields to maximize ROI.
            </p>
            <ul className="space-y-2 text-xs text-brand-slate-600 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Commercial boulevard and civic center plots</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Rental yield analysis and leaseback agreements</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Full plaza building sales and corporate floor leasing</span>
              </li>
            </ul>
          </div>
          <div className="pt-6 border-t border-brand-slate-100 mt-6">
            <Link
              href="/services/commercial"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy hover:text-brand-copper transition-colors"
            >
              <span>Explore Commercial Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Advisory Standards Banner */}
      <div className="bg-brand-azure-tint border border-brand-azure/20 rounded-3xl p-8 sm:p-10 space-y-4">
        <div className="max-w-2xl space-y-1">
          <h3 className="text-lg font-bold text-brand-navy flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-azure" />
            <span>Title Verification & Documentation Integrity</span>
          </h3>
          <p className="text-xs sm:text-sm text-brand-slate-700 leading-relaxed">
            In Pakistani real estate, a deal is only as good as its documentation. Before finalizing any purchase through our advisory desk, we verify original allotment letters, payment receipts, society records, and NDC clearance directly with the relevant developer office.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            href="/contact"
            className="bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Request Service Consultation
          </Link>
          <WhatsAppButton size="md">
            Direct WhatsApp Inquiry
          </WhatsAppButton>
        </div>
      </div>
    </div>
  );
}
