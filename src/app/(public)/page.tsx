import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedProperties } from '@/lib/propertyService';
import SearchFilterBar from '@/components/public/SearchFilterBar';
import PropertyCard from '@/components/public/PropertyCard';
import InquiryForm from '@/components/public/InquiryForm';
import { EmptyState } from '@/components/ui/EmptyState';
import { CallButton } from '@/components/ui/CallButton';
import { siteConfig } from '@/config/site';
import { generateFAQSchema } from '@/lib/seo/schema';
import {
  ShieldCheck,
  Compass,
  MapPin,
  Building2,
  CheckCircle2,
  ArrowRight,
  Home,
  Layers,
  Store,
  Briefcase,
  HelpCircle,
  PhoneCall,
  ChevronDown,
  Building,
  FileText,
} from 'lucide-react';

export const revalidate = 60; // ISR cache revalidation every 60s

export const metadata: Metadata = {
  title: 'HomaceBuild and Realators | Verified Real Estate in Bahria Town & DHA Islamabad',
  description:
    'Premier real estate advisory in Islamabad and Rawalpindi. Verified residential plots, luxury houses, commercial plazas, and files across Bahria Town and DHA with transparent Marla standards.',
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: 'HomaceBuild and Realators | Verified Real Estate in Bahria Town & DHA',
    description:
      'Verified residential plots, luxury villas, commercial plots, and files across Bahria Town and DHA Islamabad/Rawalpindi.',
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/HomaceLogo.png`,
        width: 738,
        height: 396,
        alt: `${siteConfig.name} Official Logo`,
      },
    ],
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HomaceBuild and Realators | Verified Real Estate',
    description:
      'Verified residential plots, luxury villas, commercial plots, and files across Bahria Town and DHA.',
    images: [`${siteConfig.url}/HomaceLogo.png`],
  },
};

// Common real estate FAQs
const homeFaqs = [
  {
    question: 'What Marla conversion standard is used in Bahria Town and DHA Islamabad?',
    answer:
      'In Bahria Town (Phases 1–8) and DHA Islamabad/Rawalpindi, the established town planning convention is 225 square feet per Marla (1 Kanal = 20 Marlas = 4,500 sq ft). This differs from traditional rural land records (272.25 sq ft). HomaceBuild and Realators calculates and validates all listing dimensions according to this 225 sq ft standard.',
  },
  {
    question: 'What is the distinction between an Allocation File, Balloted Plot, and Possession Plot?',
    answer:
      'An Allocation File represents an initial membership or land quota without an assigned on-ground plot number. A Balloted Plot has undergone official computerized balloting and has a defined sector, street, and plot number on the master plan. A Possession Plot is fully developed with roads and utilities installed, allowing the owner to commence construction immediately.',
  },
  {
    question: 'What is the official procedure for transferring property in Bahria Town and DHA?',
    answer:
      'Property transfers require obtaining a No Demand Certificate (NDC) verifying all developer dues and taxes are cleared, followed by biometric verification of buyer and seller at the respective society transfer office, presentation of original allotment letters, valid CNICs, and payment of official transfer and stamp duty fees.',
  },
  {
    question: 'How does HomaceBuild and Realators assist Overseas Pakistani clients?',
    answer:
      'We provide end-to-end guidance for overseas buyers and sellers, including video site inspections, verification of official society transfer records, and coordination of Special Power of Attorney (SPA) documents attested by the relevant Pakistani Embassy or Consulate.',
  },
  {
    question: 'Why are certain properties listed as "Price on Call"?',
    answer:
      'High-value commercial plazas, bespoke luxury homes, and rapidly fluctuating plot files are frequently listed as Price on Call to ensure visitors receive accurate, real-time trading values directly from our advisory desk rather than outdated estimates.',
  },
];

export default async function HomePage() {
  const publishedListings = await getPublishedProperties({ limit: 6 });

  const faqSchema = generateFAQSchema(homeFaqs);

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* 1. HERO SECTION */}
      <section className="relative luxury-gradient text-white py-20 md:py-28 overflow-hidden">
        {/* Architectural grid overlay */}
        <div
          className="absolute inset-0 opacity-10 bg-[radial-gradient(#009BE5_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-brand-copper border border-brand-copper/30 mb-6 tracking-widest uppercase">
              <ShieldCheck className="w-4 h-4 text-brand-cyan" />
              <span>{siteConfig.tagline}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Verified Real Estate & Land Advisory in{' '}
              <span className="text-brand-cyan">Bahria Town & DHA</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-brand-slate-200 leading-relaxed max-w-2xl">
              HomaceBuild and Realators provides transparent property brokerage, authenticated plot files, and commercial investments across Islamabad and Rawalpindi.
            </p>

            {/* Direct Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/properties"
                className="bg-brand-copper hover:bg-brand-copper-hover text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all active:scale-[0.98]"
              >
                Browse Verified Listings
              </Link>
              <CallButton size="lg" className="shadow-md">
                Call: {siteConfig.contact.phone}
              </CallButton>
            </div>
          </div>

          {/* 2. PROMINENT SEARCH INTERFACE */}
          <div className="mt-12">
            <SearchFilterBar />
          </div>
        </div>
      </section>

      {/* 3. RESIDENTIAL PROPERTY CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-brand-slate-200">
          <div>
            <span className="text-xs font-bold text-brand-copper uppercase tracking-wider">
              Residential Inventory
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy mt-1">
              Residential Properties & Plots
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-brand-slate-500 mt-2 md:mt-0 max-w-md">
            Genuinely verified residential land and luxury living spaces tailored for families and long-term homebuilders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category 1: Residential Plots */}
          <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-azure-tint text-brand-azure flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6 text-brand-azure" />
              </div>
              <h3 className="text-lg font-bold text-brand-navy">
                Residential Plots
              </h3>
              <p className="text-xs text-brand-slate-600 mt-2 leading-relaxed">
                5 Marla, 10 Marla, 1 Kanal, and 2 Kanal residential plots in established and expanding sectors of Bahria Town and DHA Islamabad.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-brand-slate-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Possession-ready & balloted plots</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Direct developer verification</span>
                </li>
              </ul>
            </div>
            <Link
              href="/properties?category=residential_plot"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-brand-azure hover:text-brand-copper transition-colors"
            >
              <span>Explore Residential Plots</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Category 2: Houses & Designer Villas */}
          <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-copper-tint text-brand-copper flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Home className="w-6 h-6 text-brand-copper" />
              </div>
              <h3 className="text-lg font-bold text-brand-navy">
                Houses & Designer Villas
              </h3>
              <p className="text-xs text-brand-slate-600 mt-2 leading-relaxed">
                Modern newly built residences, architect-designed luxury villas, and established double-unit family houses available for sale and rent.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-brand-slate-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Ready to move & custom constructions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Rental yields & executive residences</span>
                </li>
              </ul>
            </div>
            <Link
              href="/properties?category=house"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-brand-copper hover:text-brand-azure transition-colors"
            >
              <span>Explore Houses & Villas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Category 3: Apartments & Penthouses */}
          <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-slate-100 text-brand-navy flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Building className="w-6 h-6 text-brand-navy" />
              </div>
              <h3 className="text-lg font-bold text-brand-navy">
                Apartments & Penthouses
              </h3>
              <p className="text-xs text-brand-slate-600 mt-2 leading-relaxed">
                Contemporary high-rise apartments, luxury studio flats, and duplex penthouses located in prime commercial and residential sectors.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-brand-slate-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>High-demand rental investment assets</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Modern building amenities & maintenance</span>
                </li>
              </ul>
            </div>
            <Link
              href="/properties?category=apartment"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-brand-azure hover:text-brand-copper transition-colors"
            >
              <span>Explore Apartments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. COMMERCIAL PROPERTY CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-brand-slate-200">
          <div>
            <span className="text-xs font-bold text-brand-copper uppercase tracking-wider">
              Commercial Portfolio
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy mt-1">
              Commercial Plots, Shops & Plazas
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-brand-slate-500 mt-2 md:mt-0 max-w-md">
            Commercial real estate opportunities engineered for high capital growth and steady rental returns in active business districts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Commercial Plots */}
          <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-brand-azure-tint text-brand-azure flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 text-brand-azure" />
              </div>
              <h3 className="text-base font-bold text-brand-navy">
                Commercial Plots
              </h3>
              <p className="text-xs text-brand-slate-600 mt-2 leading-relaxed">
                Boulevard and civic center commercial plots suitable for multi-story plazas and retail hubs.
              </p>
            </div>
            <Link
              href="/properties?category=commercial_plot"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-azure hover:text-brand-copper transition-colors"
            >
              <span>Commercial Plots</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Retail Shops */}
          <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-brand-copper-tint text-brand-copper flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Store className="w-5 h-5 text-brand-copper" />
              </div>
              <h3 className="text-base font-bold text-brand-navy">
                Retail Shops & Outlets
              </h3>
              <p className="text-xs text-brand-slate-600 mt-2 leading-relaxed">
                Ground and first-floor retail units in high-footfall commercial zones across Bahria and DHA.
              </p>
            </div>
            <Link
              href="/properties?category=shop"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-copper hover:text-brand-azure transition-colors"
            >
              <span>Retail Shops</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Corporate Offices */}
          <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-brand-azure-tint text-brand-azure flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5 text-brand-azure" />
              </div>
              <h3 className="text-base font-bold text-brand-navy">
                Corporate Offices
              </h3>
              <p className="text-xs text-brand-slate-600 mt-2 leading-relaxed">
                Executive office suites, dedicated corporate floors, and IT park commercial units.
              </p>
            </div>
            <Link
              href="/properties?category=office"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-azure hover:text-brand-copper transition-colors"
            >
              <span>Office Spaces</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Commercial Plazas */}
          <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-brand-slate-100 text-brand-navy flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5 text-brand-navy" />
              </div>
              <h3 className="text-base font-bold text-brand-navy">
                Complete Plazas
              </h3>
              <p className="text-xs text-brand-slate-600 mt-2 leading-relaxed">
                Full-building acquisitions for institutional and private investors seeking long-term tenant stability.
              </p>
            </div>
            <Link
              href="/properties?category=plaza"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-navy hover:text-brand-copper transition-colors"
            >
              <span>Plaza Listings</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FEATURED / RECENTLY PUBLISHED LISTINGS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-brand-copper uppercase tracking-wider">
              Market Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy mt-1">
              Featured Property Opportunities
            </h2>
          </div>
          <Link
            href="/properties"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-brand-azure hover:text-brand-copper transition-colors"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {publishedListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedListings.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Listings Are Being Authenticated"
            description="We only publish verified listings with confirmed developer records. Please submit your custom requirement or contact our advisory desk directly for off-market inventory."
            icon={Building2}
            actionLabel="Submit Requirement"
            actionHref="/contact"
          />
        )}
      </section>

      {/* 6. COVERAGE AREAS (ISLAMABAD, RAWALPINDI, BAHRIA TOWN, DHA) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-brand-slate-200">
          <div>
            <span className="text-xs font-bold text-brand-copper uppercase tracking-wider">
              Territorial Expertise
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy mt-1">
              Core Coverage Areas
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-brand-slate-500 mt-2 md:mt-0 max-w-md">
            Dedicated market presence and deep community knowledge across the twin cities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Area 1: Bahria Town */}
          <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 shadow-xs hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-xl bg-brand-azure-tint text-brand-azure flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5 text-brand-azure" />
            </div>
            <h3 className="text-base font-bold text-brand-navy">
              Bahria Town (1–8)
            </h3>
            <p className="text-xs text-brand-slate-600 mt-1.5 leading-relaxed">
              Complete coverage of Phases 1 to 8, Safari Valley, Executive Lodges, Garden City, and Bahria Enclave.
            </p>
            <Link
              href="/locations/bahria-town"
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-azure hover:text-brand-copper transition-colors"
            >
              <span>Explore Bahria Guide</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Area 2: DHA Islamabad */}
          <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 shadow-xs hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-xl bg-brand-copper-tint text-brand-copper flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 text-brand-copper" />
            </div>
            <h3 className="text-base font-bold text-brand-navy">
              DHA Islamabad
            </h3>
            <p className="text-xs text-brand-slate-600 mt-1.5 leading-relaxed">
              Defense Housing Authority Phase 1, Phase 2, Phase 3, Phase 4, Phase 5, and DHA Valley.
            </p>
            <Link
              href="/locations/dha-islamabad"
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-copper hover:text-brand-azure transition-colors"
            >
              <span>Explore DHA Guide</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Area 3: Islamabad Sectors */}
          <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 shadow-xs hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-xl bg-brand-slate-100 text-brand-navy flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5 text-brand-navy" />
            </div>
            <h3 className="text-base font-bold text-brand-navy">
              Islamabad Capital
            </h3>
            <p className="text-xs text-brand-slate-600 mt-1.5 leading-relaxed">
              CDA sectors, Islamabad Expressway, Park Road societies, and institutional commercial corridors.
            </p>
            <Link
              href="/properties?location=Islamabad"
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-azure hover:text-brand-copper transition-colors"
            >
              <span>Islamabad Listings</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Area 4: Rawalpindi City */}
          <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 shadow-xs hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <Compass className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-brand-navy">
              Rawalpindi Corridors
            </h3>
            <p className="text-xs text-brand-slate-600 mt-1.5 leading-relaxed">
              GT Road commercial avenues, Chaklala Scheme, Peshawar Road, and emerging commercial districts.
            </p>
            <Link
              href="/properties?location=Rawalpindi"
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-brand-copper transition-colors"
            >
              <span>Rawalpindi Listings</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. COMPANY INTRODUCTION & VERIFIED SERVICES */}
      <section className="bg-brand-slate-50 border-y border-brand-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold text-brand-copper uppercase tracking-wider">
              About HomaceBuild and Realators
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy mt-1">
              Real Estate Advisory Founded on Verifiable Documentation
            </h2>
            <p className="mt-4 text-sm text-brand-slate-600 leading-relaxed">
              HomaceBuild and Realators was established to provide genuine, documented property consultation for residential and commercial transactions in Islamabad, Rawalpindi, Bahria Town, and DHA. We eliminate misleading claims by adhering to confirmed town planning standards and developer transfer procedures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl border border-brand-slate-200 p-6">
              <div className="w-10 h-10 rounded-xl bg-brand-azure-tint text-brand-azure flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-brand-azure" />
              </div>
              <h3 className="text-base font-bold text-brand-navy">
                Documented Land Measurement
              </h3>
              <p className="text-xs text-brand-slate-600 mt-2 leading-relaxed">
                We clearly document and calculate areas based on the 225 sq ft Marla standard established by Bahria Town and DHA, preventing area discrepancies during site transfer.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-brand-slate-200 p-6">
              <div className="w-10 h-10 rounded-xl bg-brand-copper-tint text-brand-copper flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5 text-brand-copper" />
              </div>
              <h3 className="text-base font-bold text-brand-navy">
                Title & Status Verification
              </h3>
              <p className="text-xs text-brand-slate-600 mt-2 leading-relaxed">
                Every property file and plot is categorized by its actual development status: ready for possession, officially balloted, or unballoted allocation file.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-brand-slate-200 p-6">
              <div className="w-10 h-10 rounded-xl bg-brand-slate-100 text-brand-navy flex items-center justify-center mb-4">
                <PhoneCall className="w-5 h-5 text-brand-navy" />
              </div>
              <h3 className="text-base font-bold text-brand-navy">
                Direct Principal Representation
              </h3>
              <p className="text-xs text-brand-slate-600 mt-2 leading-relaxed">
                Clients deal directly with authorized property advisors, ensuring transparent negotiation without inflated intermediary commissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CLEAR INQUIRY & WHATSAPP ACTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Direct Consultation Info */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-brand-copper uppercase tracking-wider">
                Direct Advisory Desk
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy mt-1">
                Consult With a Verified Property Advisor
              </h2>
              <p className="mt-3 text-sm text-brand-slate-600 leading-relaxed">
                Whether you are acquiring a residential plot in Bahria Town, leasing a commercial plaza in DHA, or liquidating an investment asset, our advisory desk provides direct guidance on title verification, transfer dues, and fair market values.
              </p>
            </div>

            <div className="bg-brand-azure-tint border border-brand-azure/20 rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-brand-navy flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-azure" />
                <span>Our Advisory Commitment</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-brand-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-brand-azure font-bold">•</span>
                  <span>Zero fabricated listings or unauthorized re-advertisements.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-azure font-bold">•</span>
                  <span>Official transfer document checks prior to token transaction.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-azure font-bold">•</span>
                  <span>Standardized calculation under the 225 sq ft Marla convention.</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <CallButton size="lg" className="shadow-xs">
                Call: {siteConfig.contact.phone}
              </CallButton>
            </div>
          </div>

          {/* Right Column: Secure Inquiry Form */}
          <div>
            <InquiryForm />
          </div>
        </div>
      </section>

      {/* 9. USEFUL REAL ESTATE FAQS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-copper uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4 text-brand-copper" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy">
            Real Estate Questions & Advisory Answers
          </h2>
          <p className="text-xs sm:text-sm text-brand-slate-500 mt-2">
            Clear, transparent explanations regarding property measurements, development status, and society transfer protocols in Islamabad and Rawalpindi.
          </p>
        </div>

        <div className="space-y-4 max-w-4xl">
          {homeFaqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-white rounded-2xl border border-brand-slate-200 p-5 open:shadow-xs transition-all"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-sm sm:text-base text-brand-navy group-hover:text-brand-azure select-none">
                <span className="pr-4">{faq.question}</span>
                <ChevronDown className="w-5 h-5 text-brand-copper shrink-0 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="mt-3.5 pt-3.5 border-t border-brand-slate-100 text-xs sm:text-sm text-brand-slate-600 leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
