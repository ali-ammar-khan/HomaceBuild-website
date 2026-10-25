import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import { siteConfig } from '@/config/site';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import { CallButton } from '@/components/ui/CallButton';
import InquiryForm from '@/components/public/InquiryForm';
import {
  Store,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Briefcase,
  Compass,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Commercial Real Estate Services | HomaceBuild and Realators',
  description:
    'Commercial plots, plazas, retail shops, and corporate office advisory in Bahria Town and DHA Islamabad. High-yield commercial investments, rental yield modeling, and transfer facilitation.',
  alternates: {
    canonical: `${siteConfig.url}/services/commercial`,
  },
  openGraph: {
    title: 'Commercial Real Estate Services | HomaceBuild and Realators',
    description:
      'Commercial plots, plazas, retail shops, and corporate office advisory in Bahria Town and DHA Islamabad.',
    url: `${siteConfig.url}/services/commercial`,
    siteName: siteConfig.name,
    type: 'website',
    images: [
      {
        url: `${siteConfig.url}/HomaceLogo.png`,
        width: 738,
        height: 396,
        alt: 'Commercial Real Estate Services - HomaceBuild',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Commercial Real Estate Services | HomaceBuild',
    description:
      'High-yield commercial investments, rental yield modeling, and commercial plot advisory in Bahria Town and DHA.',
    images: [`${siteConfig.url}/HomaceLogo.png`],
  },
};

export default function CommercialServicesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Services', url: `${siteConfig.url}/services` },
    { name: 'Commercial Services', url: `${siteConfig.url}/services/commercial` },
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
          { label: 'Commercial Property Services' },
        ]}
      />

      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-copper uppercase tracking-wider">
          <Store className="w-3.5 h-3.5 text-brand-copper" />
          <span>Institutional & Commercial Advisory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy leading-tight">
          Commercial Property Services
        </h1>
        <p className="text-sm sm:text-base text-brand-slate-600 leading-relaxed">
          Engineered advisory for commercial land acquisition, multi-story plaza developments, retail shops, and corporate office floors in high-footfall business districts.
        </p>
      </div>

      {/* Four Commercial Asset Classes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl border border-brand-slate-200 p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-brand-azure-tint text-brand-azure flex items-center justify-center">
            <Compass className="w-5 h-5 text-brand-azure" />
          </div>
          <h3 className="text-base font-bold text-brand-navy">Commercial Plots</h3>
          <p className="text-xs text-brand-slate-600 leading-relaxed">
            Main boulevard and civic center commercial plots (5, 8, 10, 12 Marla) approved for multi-story construction.
          </p>
          <Link
            href="/properties?category=commercial_plot"
            className="text-xs font-bold text-brand-azure hover:text-brand-copper inline-flex items-center gap-1 pt-1"
          >
            <span>View Plots</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-brand-slate-200 p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-brand-copper-tint text-brand-copper flex items-center justify-center">
            <Store className="w-5 h-5 text-brand-copper" />
          </div>
          <h3 className="text-base font-bold text-brand-navy">Retail Shops</h3>
          <p className="text-xs text-brand-slate-600 leading-relaxed">
            Ground and lower-ground retail spaces in prominent commercial shopping malls and business arcades.
          </p>
          <Link
            href="/properties?category=shop"
            className="text-xs font-bold text-brand-copper hover:text-brand-azure inline-flex items-center gap-1 pt-1"
          >
            <span>View Shops</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-brand-slate-200 p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-brand-azure-tint text-brand-azure flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-brand-azure" />
          </div>
          <h3 className="text-base font-bold text-brand-navy">Corporate Offices</h3>
          <p className="text-xs text-brand-slate-600 leading-relaxed">
            Dedicated corporate floors and IT executive cabins situated along key transit corridors and business hubs.
          </p>
          <Link
            href="/properties?category=office"
            className="text-xs font-bold text-brand-azure hover:text-brand-copper inline-flex items-center gap-1 pt-1"
          >
            <span>View Offices</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-brand-slate-200 p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-brand-slate-100 text-brand-navy flex items-center justify-center">
            <Building2 className="w-5 h-5 text-brand-navy" />
          </div>
          <h3 className="text-base font-bold text-brand-navy">Complete Plazas</h3>
          <p className="text-xs text-brand-slate-600 leading-relaxed">
            Full-building acquisitions for private and family-office investors seeking turnkey multi-tenant rental income.
          </p>
          <Link
            href="/properties?category=plaza"
            className="text-xs font-bold text-brand-navy hover:text-brand-copper inline-flex items-center gap-1 pt-1"
          >
            <span>View Plazas</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Commercial Advisory Value Banner */}
      <div className="bg-white rounded-3xl border border-brand-slate-200 p-8 sm:p-10 space-y-6 shadow-xs">
        <h3 className="text-xl font-bold text-brand-navy">
          Our Commercial Investment Discipline
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-brand-slate-600">
          <div className="space-y-2">
            <h4 className="font-bold text-brand-slate-900 text-sm">Rental Yield Analysis</h4>
            <p className="leading-relaxed">
              We calculate realistic rental yields based on actual signed leases in the market, not inflated speculative projections.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-brand-slate-900 text-sm">FAR & Parking Compliance</h4>
            <p className="leading-relaxed">
              Verifying developer Floor Area Ratios (FAR), basement parking mandates, and municipal utility connections.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-brand-slate-900 text-sm">Commercial Transfer Oversight</h4>
            <p className="leading-relaxed">
              Ensuring all commercial transfer taxes, capital value taxes (CVT), and society commercial charges are fully verified.
            </p>
          </div>
        </div>
      </div>

      {/* Inquiry Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start pt-6">
        <div className="space-y-4">
          <span className="text-xs font-bold text-brand-copper uppercase tracking-wider">
            Commercial Desk
          </span>
          <h2 className="text-2xl font-bold text-brand-navy">
            Consult on Commercial Opportunities
          </h2>
          <p className="text-xs sm:text-sm text-brand-slate-600 leading-relaxed">
            Connect directly with our commercial specialists to review off-market plazas, retail opportunities, or boulevard plots.
          </p>
          <div className="pt-2">
            <CallButton size="lg" fullWidth>
              Call Commercial Desk: {siteConfig.contact.phone}
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
