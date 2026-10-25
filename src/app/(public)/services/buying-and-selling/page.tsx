import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import { siteConfig } from '@/config/site';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import { CallButton } from '@/components/ui/CallButton';
import InquiryForm from '@/components/public/InquiryForm';
import {
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  DollarSign,
  Building,
  UserCheck,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Property Buying & Selling Services | HomaceBuild and Realators',
  description:
    'Verified property acquisition and selling services in Bahria Town and DHA Islamabad. Title checking, society transfer protocols, fair pricing, and secure transactions.',
  alternates: {
    canonical: `${siteConfig.url}/services/buying-and-selling`,
  },
  openGraph: {
    title: 'Property Buying & Selling Services | HomaceBuild and Realators',
    description:
      'Verified property acquisition and selling services in Bahria Town and DHA Islamabad. Title checking, society transfer protocols, and secure transactions.',
    url: `${siteConfig.url}/services/buying-and-selling`,
    siteName: siteConfig.name,
    type: 'website',
    images: [
      {
        url: `${siteConfig.url}/HomaceLogo.png`,
        width: 738,
        height: 396,
        alt: 'Property Buying & Selling - HomaceBuild',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Property Buying & Selling Services | HomaceBuild',
    description:
      'Title checking, society transfer protocols, and secure property transactions in Bahria Town and DHA Islamabad.',
    images: [`${siteConfig.url}/HomaceLogo.png`],
  },
};

export default function BuyingSellingPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Services', url: `${siteConfig.url}/services` },
    { name: 'Buying & Selling', url: `${siteConfig.url}/services/buying-and-selling` },
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
          { label: 'Property Buying & Selling' },
        ]}
      />

      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-copper uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Real Estate Transaction Advisory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy leading-tight">
          Property Buying & Selling Services
        </h1>
        <p className="text-sm sm:text-base text-brand-slate-600 leading-relaxed">
          Guiding buyers and sellers through authenticated property transfers, title verification, market valuation, and safe transaction execution in Bahria Town and DHA Islamabad.
        </p>
      </div>

      {/* Buying vs Selling Process Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* For Property Buyers */}
        <div className="bg-white rounded-3xl border border-brand-slate-200 p-8 space-y-6 shadow-xs">
          <div className="space-y-2">
            <span className="text-xs font-bold text-brand-azure uppercase tracking-wider">
              For Property Buyers
            </span>
            <h2 className="text-xl font-bold text-brand-navy">
              Safe Acquisition & Transfer Process
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-brand-slate-600 leading-relaxed">
            Buying real estate in Pakistan requires thorough verification before releasing funds. We ensure your purchase is backed by verified developer records and fair market rates.
          </p>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-brand-azure/10 text-brand-azure font-bold flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold text-brand-navy">Requirement & Budget Alignment</h4>
                <p className="text-brand-slate-500 mt-0.5">We match your budget with realistic options across Bahria Town (Phases 1–8) or DHA (Phases 1–5).</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-brand-azure/10 text-brand-azure font-bold flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold text-brand-navy">Title & Allotment Verification</h4>
                <p className="text-brand-slate-500 mt-0.5">We check original allotment letters, payment ledgers, and society records for any outstanding dues.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-brand-azure/10 text-brand-azure font-bold flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h4 className="font-bold text-brand-navy">Token & Formal Agreement</h4>
                <p className="text-brand-slate-500 mt-0.5">Drafting clear agreement terms specifying transfer dates, tax liabilities, and token conditions.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-brand-azure/10 text-brand-azure font-bold flex items-center justify-center shrink-0">
                4
              </div>
              <div>
                <h4 className="font-bold text-brand-navy">Official Society Transfer</h4>
                <p className="text-brand-slate-500 mt-0.5">Coordinating biometric verification, stamp paper issuance, and receipt of the official transfer letter.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-brand-slate-100">
            <Link
              href="/properties?purpose=sale"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-azure hover:text-brand-copper transition-colors"
            >
              <span>Browse Properties for Sale</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* For Property Sellers */}
        <div className="bg-white rounded-3xl border border-brand-slate-200 p-8 space-y-6 shadow-xs">
          <div className="space-y-2">
            <span className="text-xs font-bold text-brand-copper uppercase tracking-wider">
              For Property Sellers
            </span>
            <h2 className="text-xl font-bold text-brand-navy">
              Liquidation & Listing Advisory
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-brand-slate-600 leading-relaxed">
            Sell your plot, house, or commercial asset at realistic prevailing market values with direct representation to qualified buyers without time-wasting intermediaries.
          </p>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-brand-copper/10 text-brand-copper font-bold flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold text-brand-navy">Comparative Market Analysis</h4>
                <p className="text-brand-slate-500 mt-0.5">Evaluating recent actual transactions in your sector to recommend an authentic, achievable asking price.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-brand-copper/10 text-brand-copper font-bold flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold text-brand-navy">Documentation Readiness</h4>
                <p className="text-brand-slate-500 mt-0.5">Assisting with No Demand Certificate (NDC) applications and clearing society utility dues.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-brand-copper/10 text-brand-copper font-bold flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h4 className="font-bold text-brand-navy">Targeted Buyer Sourcing</h4>
                <p className="text-brand-slate-500 mt-0.5">Marketing directly to our active database of qualified private buyers and institutional investors.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-brand-copper/10 text-brand-copper font-bold flex items-center justify-center shrink-0">
                4
              </div>
              <div>
                <h4 className="font-bold text-brand-navy">Secure Closing & Funds Realization</h4>
                <p className="text-brand-slate-500 mt-0.5">Supervising secure bank pay orders and biometric verification at the society transfer office.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-brand-slate-100">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-copper hover:text-brand-azure transition-colors"
            >
              <span>List Your Property with HomaceBuild</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Inquiry Desk Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start pt-6">
        <div className="space-y-4">
          <span className="text-xs font-bold text-brand-copper uppercase tracking-wider">
            Start Your Transaction
          </span>
          <h2 className="text-2xl font-bold text-brand-navy">
            Consult With Our Transaction Desk
          </h2>
          <p className="text-xs sm:text-sm text-brand-slate-600 leading-relaxed">
            Whether you want to buy a 10 Marla plot in Bahria Town Phase 8 or liquidate a commercial plaza in DHA, submit your details for a verified response.
          </p>
          <div className="pt-2">
            <CallButton size="lg" fullWidth>
              Call Directly: {siteConfig.contact.phone}
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
