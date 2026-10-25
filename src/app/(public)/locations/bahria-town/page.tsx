import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedProperties } from '@/lib/propertyService';
import { Property } from '@/types/database';
import PropertyCard from '@/components/public/PropertyCard';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import InquiryForm from '@/components/public/InquiryForm';
import { siteConfig } from '@/config/site';
import { generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo/schema';
import {
  MapPin,
  Building,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bahria Town Rawalpindi & Islamabad Real Estate Guide',
  description:
    'Comprehensive guide and verified listings across Bahria Town Phases 1–8. Standard 225 sq ft Marla calculations, possession plot documentation, and commercial investments.',
  alternates: {
    canonical: `${siteConfig.url}/locations/bahria-town`,
  },
  openGraph: {
    title: 'Bahria Town Rawalpindi & Islamabad Real Estate Guide | HomaceBuild',
    description:
      'Verified property guide across Bahria Town Phases 1 to 8. Plot sizes, 225 sq ft Marla standard, official transfer process, and live listings.',
    url: `${siteConfig.url}/locations/bahria-town`,
    siteName: siteConfig.name,
    type: 'website',
    images: [
      {
        url: `${siteConfig.url}/HomaceLogo.png`,
        width: 738,
        height: 396,
        alt: 'Bahria Town Real Estate Guide - HomaceBuild',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bahria Town Real Estate Guide | HomaceBuild and Realators',
    description:
      'Verified listings, plot transfer protocols, and 225 sq ft Marla calculations across Bahria Town Phases 1–8.',
    images: [`${siteConfig.url}/HomaceLogo.png`],
  },
};

export const revalidate = 60;

const bahriaFaqs = [
  {
    question: 'How many square feet are in 1 Marla in Bahria Town Rawalpindi/Islamabad?',
    answer:
      'In Bahria Town (Phases 1 through 8), 1 Marla is standardized at exactly 225 square feet. Consequently, a standard 5 Marla plot is 1,125 sq ft (25x45 ft), a 10 Marla plot is 2,250 sq ft (35x70 ft), and a 1 Kanal plot is 4,500 sq ft (50x90 ft, equivalent to 20 Marlas).',
  },
  {
    question: 'What is the plot transfer procedure in Bahria Town?',
    answer:
      'Bahria Town transfers require: (1) Application for Transfer form submission, (2) Original Allotment/Transfer Letter surrender, (3) Clearance of all outstanding developer dues (NDC - No Demand Certificate), (4) National Identity Card (CNIC) verification of both buyer and seller, and (5) In-person biometric and signature verification at the official Bahria Town Customer Support Centre.',
  },
  {
    question: 'What is the difference between a possession plot and a non-possession plot in Bahria Town?',
    answer:
      'A possession plot has completed on-ground infrastructure (asphalt roads, underground electricity, sewerage, water supply) and is ready for immediate architectural approval and construction. A non-possession plot or developing file is legally allocated but awaits final ground leveling, utility connection, or possession demarcation by the developer.',
  },
];

export default async function BahriaTownPage() {
  const listings = await getPublishedProperties({ location: 'Bahria', limit: 6 });

  const breadcrumbItems = [
    { label: 'Locations', href: '/locations' },
    { label: 'Bahria Town Islamabad & Rawalpindi' },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Locations', url: `${siteConfig.url}/locations` },
    { name: 'Bahria Town', url: `${siteConfig.url}/locations/bahria-town` },
  ]);

  const faqSchema = generateFAQSchema(bahriaFaqs);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Schema.org Payloads */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Breadcrumbs items={breadcrumbItems} />

      {/* Hero Header */}
      <div className="bg-brand-navy-dark text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden luxury-gradient">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-brand-copper uppercase tracking-wider border border-white/10">
            <ShieldCheck className="w-4 h-4 text-brand-cyan" />
            <span>Territory Authority Guide</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Bahria Town Real Estate & Land Advisory
          </h1>

          <p className="text-sm sm:text-base text-brand-slate-200 leading-relaxed">
            A comprehensive, verified guide to property acquisitions, residential plot sizes, and commercial developments across Bahria Town Phases 1 to 8 in the Islamabad/Rawalpindi region.
          </p>
        </div>
      </div>

      {/* 1. DIRECT-ANSWER SUMMARY BLOCK (AEO) */}
      <section className="bg-brand-azure-tint border border-brand-azure/20 rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <Compass className="w-5 h-5 text-brand-azure shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h2 className="text-base font-bold text-brand-navy">
              Essential Market Definition: Bahria Town Plot Standards
            </h2>
            <p className="text-xs sm:text-sm text-brand-slate-700 leading-relaxed">
              Bahria Town Rawalpindi/Islamabad encompasses eight master-planned phases connected along the GT Road and Islamabad Expressway corridors. All residential and commercial plots in Bahria Town operate on the <strong>225 square feet per Marla</strong> standard (1 Kanal = 4,500 sq ft). Possession plots permit immediate residential construction upon approved structural drawings, while commercial hubs such as the Civic Center and Phase 7/8 Commercials support multi-story corporate and retail developments.
            </p>
          </div>
        </div>
      </section>

      {/* 2. GROUND-TRUTH FACTUAL REFERENCE MATRIX (GEO) */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-bold text-brand-copper uppercase tracking-wider">
            Factual Reference
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-brand-navy mt-0.5">
            Phase-by-Phase Master Plan Matrix
          </h2>
          <p className="text-xs text-brand-slate-500">
            Structural standards, road widths, and land classification across Bahria Town sectors.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-brand-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-brand-slate-600">
              <thead className="bg-brand-slate-50 text-brand-slate-500 font-semibold border-b border-brand-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Phase / Sector</th>
                  <th className="py-3 px-4">Standard Plot Sizes</th>
                  <th className="py-3 px-4">Marla Footprint</th>
                  <th className="py-3 px-4">Possession & Infrastructure Status</th>
                  <th className="py-3 px-4">Key Commercial Amenities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-slate-100">
                <tr className="hover:bg-brand-slate-50">
                  <td className="py-3 px-4 font-bold text-brand-navy">Phase 8</td>
                  <td className="py-3 px-4">5, 8, 10 Marla, 1 & 2 Kanal</td>
                  <td className="py-3 px-4 font-mono font-semibold">225 sq ft / Marla</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">Possession & Active Development</td>
                  <td className="py-3 px-4">Hub Commercial, Ring Road Link, Sector Commercials</td>
                </tr>
                <tr className="hover:bg-brand-slate-50">
                  <td className="py-3 px-4 font-bold text-brand-navy">Phase 7</td>
                  <td className="py-3 px-4">10 Marla, 1 & 2 Kanal</td>
                  <td className="py-3 px-4 font-mono font-semibold">225 sq ft / Marla</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">100% Possession Ready</td>
                  <td className="py-3 px-4">Wilayat Complex, Commercial Boulevard, Food Streets</td>
                </tr>
                <tr className="hover:bg-brand-slate-50">
                  <td className="py-3 px-4 font-bold text-brand-navy">Safari Valley</td>
                  <td className="py-3 px-4">5, 7, 8 Marla</td>
                  <td className="py-3 px-4 font-mono font-semibold">225 sq ft / Marla</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">Constructed & Inhabited</td>
                  <td className="py-3 px-4">Rafi Commercial, Community Parks, Schools</td>
                </tr>
                <tr className="hover:bg-brand-slate-50">
                  <td className="py-3 px-4 font-bold text-brand-navy">Phases 1–6</td>
                  <td className="py-3 px-4">10 Marla, 1 & 2 Kanal</td>
                  <td className="py-3 px-4 font-mono font-semibold">225 sq ft / Marla</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">Mature Infrastructure</td>
                  <td className="py-3 px-4">Civic Center, Commercial Arena, Hospital Facilities</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. VERIFIED LIVE LISTINGS IN BAHRIA TOWN */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-brand-copper uppercase tracking-wider">
              Live Inventory
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-navy mt-0.5">
              Available Properties in Bahria Town
            </h2>
          </div>
          <Link
            href="/properties?location=Bahria+Town"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-azure hover:text-brand-copper transition-colors"
          >
            <span>Browse All Bahria Town Listings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-brand-slate-200 p-8 text-center max-w-lg mx-auto">
            <Building className="w-10 h-10 text-brand-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-brand-slate-800">
              New Bahria Town Listings Under Verification
            </h3>
            <p className="text-xs text-brand-slate-500 mt-1">
              Contact our advisory desk directly for private off-market plots and villas currently undergoing title documentation check.
            </p>
          </div>
        )}
      </section>

      {/* 4. VERIFIED AEO FAQ ACCORDION / ANSWERS */}
      <section className="bg-white rounded-2xl border border-brand-slate-200 p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-bold text-brand-copper uppercase tracking-wider">
            Advisory FAQs
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-brand-navy mt-0.5">
            Common Inquiries Regarding Bahria Town Real Estate
          </h2>
          <p className="text-xs text-brand-slate-500">
            Clear, authoritative answers verified by HomaceBuild and Realators.
          </p>
        </div>

        <div className="divide-y divide-brand-slate-100">
          {bahriaFaqs.map((faq, index) => (
            <div key={index} className="py-4 space-y-1.5">
              <h3 className="text-sm font-bold text-brand-navy flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-brand-copper shrink-0 mt-0.5" />
                <span>{faq.question}</span>
              </h3>
              <p className="text-xs text-brand-slate-600 leading-relaxed pl-6">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. DIRECT CONSULTATION DESK */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-copper uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-brand-cyan" />
            <span>Title Security Guarantee</span>
          </div>
          <h3 className="text-2xl font-extrabold text-brand-navy">
            Acquiring or Selling in Bahria Town?
          </h3>
          <p className="text-xs text-brand-slate-600 leading-relaxed">
            Our property consultants assist with NDC clearance, allotment verification at the Bahria Town head office, and on-ground site demarcation to guarantee zero legal friction.
          </p>
          <div className="space-y-2 text-xs text-brand-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Direct Developer Transfer Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Transparent Commission & Tax Guidance</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>On-Ground Physical Demarcation</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <InquiryForm />
        </div>
      </section>
    </div>
  );
}
