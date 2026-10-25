import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
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
  title: 'DHA Islamabad & Rawalpindi Real Estate & Plots Guide',
  description:
    'Comprehensive guide and verified listings across DHA Phases 1–5 and DHA Valley. Standard 225 sq ft Marla calculations, official transfer procedure, and luxury housing advisory.',
  alternates: {
    canonical: `${siteConfig.url}/locations/dha-islamabad`,
  },
};

export const revalidate = 60;

const dhaFaqs = [
  {
    question: 'How are land measurements calculated in DHA Islamabad/Rawalpindi?',
    answer:
      'In DHA Islamabad/Rawalpindi across all phases, land adheres strictly to the 225 square feet per Marla benchmark. A standard 5 Marla plot is 1,125 sq ft, a 10 Marla plot is 2,250 sq ft, and a 1 Kanal plot is 4,500 sq ft (20 Marlas).',
  },
  {
    question: 'What is the official plot transfer process in DHA Islamabad?',
    answer:
      'Transferring property in DHA Islamabad requires: (1) Application for Transfer with Membership Form, (2) No Demand Certificate (NDC) clearance from the DHA Finance Directorate, (3) Original Allotment/Transfer Letter surrender, (4) Biometric identity verification of both buyer and seller at the DHA Main Transfer Office (Phase 1 or Phase 2), and (5) Payment of applicable transfer fees and Government stamp duties/taxes.',
  },
  {
    question: 'What is the distinction between DHA allocation files, balloted plots, and possession plots?',
    answer:
      'An allocation file is an un-demarcated equity certificate awaiting official balloting. A balloted plot has an officially assigned plot number, street, and sector coordinates on the master map. A possession plot has concluded all development work (paved roads, utilities, electricity, water, sewerage) and is officially handed over to the owner for immediate residential construction.',
  },
];

export default async function DhaIslamabadPage() {
  const supabase = createClient();

  // Fetch properties specifically located in DHA
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('publication_status', 'published')
    .ilike('area_location', '%DHA%')
    .order('created_at', { ascending: false })
    .limit(6);

  const listings: Property[] = properties || [];

  const breadcrumbItems = [
    { label: 'Locations', href: '/properties' },
    { label: 'DHA Islamabad & Rawalpindi' },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Locations', url: `${siteConfig.url}/properties` },
    { name: 'DHA Islamabad', url: `${siteConfig.url}/locations/dha-islamabad` },
  ]);

  const faqSchema = generateFAQSchema(dhaFaqs);

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
            DHA Islamabad & Rawalpindi Real Estate Advisory
          </h1>

          <p className="text-sm sm:text-base text-brand-slate-200 leading-relaxed">
            Verified guidance on plots, allocations, and luxury residences across DHA Phase 1, Phase 2, Phase 3, Phase 4, Phase 5, and DHA Valley under statutory Defence Housing Authority regulations.
          </p>
        </div>
      </div>

      {/* 1. DIRECT-ANSWER SUMMARY BLOCK (AEO) */}
      <section className="bg-brand-copper-tint border border-brand-copper/20 rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <Compass className="w-5 h-5 text-brand-copper shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h2 className="text-base font-bold text-brand-navy">
              Essential Market Definition: DHA Islamabad Statutory Regulations
            </h2>
            <p className="text-xs sm:text-sm text-brand-slate-700 leading-relaxed">
              Defence Housing Authority (DHA) Islamabad-Rawalpindi is established under federal statute, providing the highest standards of municipal security, urban infrastructure, and title security in Pakistan. All residential and commercial assets are recorded using the <strong>225 square feet per Marla</strong> standard. Property transfers require comprehensive No Demand Certificate (NDC) clearance and mandatory biometric transfer execution at the DHA Directorate.
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
            DHA Phase-by-Phase Master Matrix
          </h2>
          <p className="text-xs text-brand-slate-500">
            Authority oversight, plot dimensions, and development timelines across DHA sectors.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-brand-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-brand-slate-600">
              <thead className="bg-brand-slate-50 text-brand-slate-500 font-semibold border-b border-brand-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">DHA Phase</th>
                  <th className="py-3 px-4">Standard Plot Dimensions</th>
                  <th className="py-3 px-4">Marla Footprint</th>
                  <th className="py-3 px-4">Development & Possession Status</th>
                  <th className="py-3 px-4">Strategic Commercial Connectivity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-slate-100">
                <tr className="hover:bg-brand-slate-50">
                  <td className="py-3 px-4 font-bold text-brand-navy">Phase 2</td>
                  <td className="py-3 px-4">10 Marla, 1 & 2 Kanal, Plazas</td>
                  <td className="py-3 px-4 font-mono font-semibold">225 sq ft / Marla</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">100% Possession Ready & Inhabited</td>
                  <td className="py-3 px-4">Central Commercial Area, World Trade Center Islamabad, Giga Mall</td>
                </tr>
                <tr className="hover:bg-brand-slate-50">
                  <td className="py-3 px-4 font-bold text-brand-navy">Phase 1</td>
                  <td className="py-3 px-4">10 Marla, 1 & 2 Kanal</td>
                  <td className="py-3 px-4 font-mono font-semibold">225 sq ft / Marla</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">Fully Established Residential</td>
                  <td className="py-3 px-4">GT Road Frontage, Fauji Foundation Hospital access</td>
                </tr>
                <tr className="hover:bg-brand-slate-50">
                  <td className="py-3 px-4 font-bold text-brand-navy">Phase 3</td>
                  <td className="py-3 px-4">5, 8, 10 Marla, 1 Kanal</td>
                  <td className="py-3 px-4 font-mono font-semibold">225 sq ft / Marla</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">Active Development & Possession</td>
                  <td className="py-3 px-4">Direct connectivity from GT Road and Rawalpindi Ring Road</td>
                </tr>
                <tr className="hover:bg-brand-slate-50">
                  <td className="py-3 px-4 font-bold text-brand-navy">Phase 4 & 5</td>
                  <td className="py-3 px-4">5, 10 Marla, 1 Kanal</td>
                  <td className="py-3 px-4 font-mono font-semibold">225 sq ft / Marla</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">Developing Infrastructure</td>
                  <td className="py-3 px-4">Islamabad Expressway Corridor connectivity</td>
                </tr>
                <tr className="hover:bg-brand-slate-50">
                  <td className="py-3 px-4 font-bold text-brand-navy">DHA Valley</td>
                  <td className="py-3 px-4">5 & 8 Marla (Files / Balloted)</td>
                  <td className="py-3 px-4 font-mono font-semibold">225 sq ft / Marla</td>
                  <td className="py-3 px-4 text-brand-slate-600 font-semibold">Ongoing Roadworks & Demarcation</td>
                  <td className="py-3 px-4">Affordable residential investment sectors</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. VERIFIED LIVE LISTINGS IN DHA */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-brand-copper uppercase tracking-wider">
              Live Inventory
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-navy mt-0.5">
              Available Properties in DHA Islamabad
            </h2>
          </div>
          <Link
            href="/properties?location=DHA"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-azure hover:text-brand-copper transition-colors"
          >
            <span>Browse All DHA Listings</span>
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
              New DHA Listings Under Title Verification
            </h3>
            <p className="text-xs text-brand-slate-500 mt-1">
              Contact our advisory desk directly for private off-market DHA plots, balloted files, and villas undergoing NDC review.
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
            Common Inquiries Regarding DHA Islamabad Real Estate
          </h2>
          <p className="text-xs text-brand-slate-500">
            Clear, authoritative legal and procedural answers verified by HomaceBuild and Realators.
          </p>
        </div>

        <div className="divide-y divide-brand-slate-100">
          {dhaFaqs.map((faq, index) => (
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
            Acquiring or Selling in DHA Islamabad?
          </h3>
          <p className="text-xs text-brand-slate-600 leading-relaxed">
            Our property consultants assist with official NDC clearance, membership registration, and biometric execution at the DHA Directorate to guarantee authentic ownership.
          </p>
          <div className="space-y-2 text-xs text-brand-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Official DHA Transfer Execution</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Balloting & Allocation Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>On-Ground Demarcation & Utility Status</span>
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
