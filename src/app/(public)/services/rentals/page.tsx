import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import { siteConfig } from '@/config/site';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import InquiryForm from '@/components/public/InquiryForm';
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Building,
  Home,
  Store,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Rental & Leasing Property Services | HomaceBuild and Realators',
  description:
    'Executive house rentals, modern apartment leases, and corporate commercial leasing in Bahria Town and DHA Islamabad. Verified tenancy agreements and vetted tenants.',
  alternates: {
    canonical: `${siteConfig.url}/services/rentals`,
  },
};

export default function RentalServicesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Services', url: `${siteConfig.url}/services` },
    { name: 'Rental Services', url: `${siteConfig.url}/services/rentals` },
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
          { label: 'Rental Services' },
        ]}
      />

      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-copper uppercase tracking-wider">
          <KeyRound className="w-3.5 h-3.5 text-brand-copper" />
          <span>Tenancy & Leasing Solutions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy leading-tight">
          Rental & Tenancy Services
        </h1>
        <p className="text-sm sm:text-base text-brand-slate-600 leading-relaxed">
          Comprehensive leasing advisory for residential homes, luxury apartments, corporate offices, and commercial retail units across Bahria Town, DHA, and Islamabad.
        </p>
      </div>

      {/* Pillars of Rental Services */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-brand-slate-200 p-6 space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-brand-azure-tint text-brand-azure flex items-center justify-center">
            <Home className="w-5 h-5 text-brand-azure" />
          </div>
          <h3 className="text-base font-bold text-brand-navy">
            Residential Rentals
          </h3>
          <p className="text-xs text-brand-slate-600 leading-relaxed">
            Executive designer villas, 5 Marla and 10 Marla family residences, and modern furnished apartments in secure gated sectors of Bahria Town and DHA.
          </p>
          <ul className="space-y-1.5 text-xs text-brand-slate-500 pt-1">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Full houses & independent portions</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Serviced high-rise apartments</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl border border-brand-slate-200 p-6 space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-brand-copper-tint text-brand-copper flex items-center justify-center">
            <Building className="w-5 h-5 text-brand-copper" />
          </div>
          <h3 className="text-base font-bold text-brand-navy">
            Corporate & Commercial Leasing
          </h3>
          <p className="text-xs text-brand-slate-600 leading-relaxed">
            Grade-A executive corporate floors, IT company spaces, call center buildings, and high-street retail shops for multinational and local brands.
          </p>
          <ul className="space-y-1.5 text-xs text-brand-slate-500 pt-1">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Complete plaza leasing contracts</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Retail shop franchise placements</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl border border-brand-slate-200 p-6 space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-brand-slate-100 text-brand-navy flex items-center justify-center">
            <FileCheck className="w-5 h-5 text-brand-navy" />
          </div>
          <h3 className="text-base font-bold text-brand-navy">
            Tenancy Agreements & Legal Compliance
          </h3>
          <p className="text-xs text-brand-slate-600 leading-relaxed">
            Drafting legally enforceable tenancy agreements adhering to the Islamabad Rent Restriction Ordinance and Punjab Rented Premises Act.
          </p>
          <ul className="space-y-1.5 text-xs text-brand-slate-500 pt-1">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Police tenant registration guidance</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Clear security deposit terms</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Inquiry Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start pt-6">
        <div className="space-y-4">
          <span className="text-xs font-bold text-brand-copper uppercase tracking-wider">
            List or Rent a Property
          </span>
          <h2 className="text-2xl font-bold text-brand-navy">
            Submit Your Rental Requirement
          </h2>
          <p className="text-xs sm:text-sm text-brand-slate-600 leading-relaxed">
            Whether you are a landlord listing a luxury property or an executive looking for an immediate rental in Bahria Town or DHA, connect with our rental desk.
          </p>
          <div className="pt-2">
            <WhatsAppButton size="lg" fullWidth>
              Inquire via WhatsApp
            </WhatsAppButton>
          </div>
        </div>

        <div className="lg:col-span-2">
          <InquiryForm />
        </div>
      </div>
    </div>
  );
}
