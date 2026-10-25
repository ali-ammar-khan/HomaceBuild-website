import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import { siteConfig } from '@/config/site';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { CallButton } from '@/components/ui/CallButton';
import {
  ShieldCheck,
  Compass,
  FileCheck,
  MapPin,
  CheckCircle2,
  Building2,
  Users,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About HomaceBuild and Realators | Verified Real Estate Advisory',
  description:
    'Learn about HomaceBuild and Realators. Professional real estate brokerage, strategic land advisory, and verified property transactions in Bahria Town and DHA Islamabad.',
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
  openGraph: {
    title: 'About HomaceBuild and Realators | Verified Real Estate Advisory',
    description:
      'Professional real estate brokerage, strategic land advisory, and verified property transactions in Bahria Town and DHA Islamabad.',
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.name,
    type: 'website',
    images: [
      {
        url: `${siteConfig.url}/HomaceLogo.png`,
        width: 738,
        height: 396,
        alt: 'About HomaceBuild and Realators',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About HomaceBuild and Realators | Verified Real Estate Advisory',
    description:
      'Professional real estate brokerage and strategic land advisory across Bahria Town and DHA Islamabad.',
    images: [`${siteConfig.url}/HomaceLogo.png`],
  },
};

export default function AboutPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'About Us', url: `${siteConfig.url}/about` },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-12">
      {/* Schema.org Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Breadcrumbs items={[{ label: 'About Us' }]} />

      {/* Hero Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-copper uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
          <span>About HomaceBuild and Realators</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy leading-tight">
          Engineering Trust & Transparency in Real Estate
        </h1>
        <p className="text-sm sm:text-base text-brand-slate-600 leading-relaxed">
          HomaceBuild and Realators was founded with a singular objective: to provide authenticated, documented property advisory for buyers, sellers, landlords, and investors across Islamabad, Rawalpindi, Bahria Town, and DHA.
        </p>
      </div>

      {/* Brand Identity & Mission Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white rounded-3xl border border-brand-slate-200 p-8 sm:p-12 shadow-xs">
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-brand-copper uppercase tracking-wider">
              Our Foundational Mission
            </span>
            <h2 className="text-2xl font-bold text-brand-navy">
              A Documented Approach to Pakistani Real Estate
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-brand-slate-600 leading-relaxed">
            The real estate landscape of the twin cities has long been clouded by speculative claims, ambiguous file quotas, and conflicting area conversion measurements. At HomaceBuild and Realators, we reject unverified marketing.
          </p>

          <p className="text-xs sm:text-sm text-brand-slate-600 leading-relaxed">
            Every listing we present is cross-checked against official society records (Bahria Town Pvt Ltd and Defence Housing Authority). We standardize all land calculations using the recognized <strong>225 sq ft per Marla</strong> town planning convention, ensuring buyers know precisely what they are purchasing.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/properties"
              className="bg-brand-navy hover:bg-brand-navy-light text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              Explore Verified Inventory
            </Link>
            <WhatsAppButton size="md">
              Connect on WhatsApp
            </WhatsAppButton>
          </div>
        </div>

        {/* Brand Visual Card with Logo */}
        <div className="bg-brand-slate-50 border border-brand-slate-200/80 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative h-24 w-72 bg-white p-3 rounded-2xl shadow-sm border border-brand-slate-200">
            <Image
              src="/HomaceLogo.png"
              alt="HomaceBuild and Realators Logo"
              fill
              className="object-contain p-1"
              sizes="288px"
            />
          </div>

          <div className="space-y-2 max-w-sm">
            <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wider">
              {siteConfig.tagline}
            </h3>
            <p className="text-xs text-brand-slate-500 leading-relaxed">
              Operating with engineering precision, verified title checks, and direct principal representation across the twin cities.
            </p>
          </div>
        </div>
      </div>

      {/* Core Principles */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold text-brand-copper uppercase tracking-wider">
            Operational Standards
          </span>
          <h2 className="text-2xl font-bold text-brand-navy mt-1">
            How We Protect Our Clients
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Principle 1 */}
          <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-azure-tint text-brand-azure flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-brand-azure" />
            </div>
            <h3 className="text-base font-bold text-brand-navy">
              Title & Status Verification
            </h3>
            <p className="text-xs text-brand-slate-600 leading-relaxed">
              We verify the current status of every plot or property — clearly identifying ready possession plots, balloted units with defined plot numbers, and allocation files.
            </p>
          </div>

          {/* Principle 2 */}
          <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-copper-tint text-brand-copper flex items-center justify-center">
              <Compass className="w-5 h-5 text-brand-copper" />
            </div>
            <h3 className="text-base font-bold text-brand-navy">
              Accurate Area Measurements
            </h3>
            <p className="text-xs text-brand-slate-600 leading-relaxed">
              All properties are converted transparently based on the 225 sq ft Marla standard (1 Kanal = 20 Marla = 4,500 sq ft), preventing costly surprises during demarcation.
            </p>
          </div>

          {/* Principle 3 */}
          <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-slate-100 text-brand-navy flex items-center justify-center">
              <Users className="w-5 h-5 text-brand-navy" />
            </div>
            <h3 className="text-base font-bold text-brand-navy">
              Direct Principal Consultation
            </h3>
            <p className="text-xs text-brand-slate-600 leading-relaxed">
              Clients deal directly with authorized property advisors without deceptive sub-broker chains or unauthorized markup layers.
            </p>
          </div>
        </div>
      </div>

      {/* Territories Overview */}
      <div className="bg-brand-slate-50 border border-brand-slate-200 rounded-3xl p-8 sm:p-10 space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold text-brand-copper uppercase tracking-wider">
            Territorial Focus
          </span>
          <h2 className="text-2xl font-bold text-brand-navy mt-1">
            Specialized Local Market Expertise
          </h2>
          <p className="text-xs sm:text-sm text-brand-slate-600 mt-2 leading-relaxed">
            Our market coverage focuses where town planning, security, and developer infrastructure create sustainable capital growth:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <Link
            href="/locations/bahria-town"
            className="p-4 rounded-xl bg-white border border-brand-slate-200 hover:border-brand-azure transition-colors space-y-1 block"
          >
            <h4 className="font-bold text-brand-navy">Bahria Town (1–8)</h4>
            <p className="text-brand-slate-500">Phases 1 to 8, Safari Valley, Garden City & Commercial Hubs.</p>
          </Link>

          <Link
            href="/locations/dha-islamabad"
            className="p-4 rounded-xl bg-white border border-brand-slate-200 hover:border-brand-azure transition-colors space-y-1 block"
          >
            <h4 className="font-bold text-brand-navy">DHA Islamabad</h4>
            <p className="text-brand-slate-500">DHA Phase 1, Phase 2, Phase 3, Phase 4, Phase 5 & Valley.</p>
          </Link>

          <Link
            href="/properties?location=Islamabad"
            className="p-4 rounded-xl bg-white border border-brand-slate-200 hover:border-brand-azure transition-colors space-y-1 block"
          >
            <h4 className="font-bold text-brand-navy">Islamabad Capital</h4>
            <p className="text-brand-slate-500">CDA Sectors, Expressway corridors, and corporate business centers.</p>
          </Link>

          <Link
            href="/properties?location=Rawalpindi"
            className="p-4 rounded-xl bg-white border border-brand-slate-200 hover:border-brand-azure transition-colors space-y-1 block"
          >
            <h4 className="font-bold text-brand-navy">Rawalpindi City</h4>
            <p className="text-brand-slate-500">GT Road commercial avenues and established residential schemes.</p>
          </Link>
        </div>
      </div>

      {/* Call to Action Bar */}
      <div className="bg-brand-navy-dark text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-brand-slate-800">
        <div className="space-y-1 max-w-xl text-center md:text-left">
          <h3 className="text-xl font-bold">Have a Specific Real Estate Requirement?</h3>
          <p className="text-xs text-brand-slate-300">
            Submit your residential plot size or commercial criteria directly to our advisory desk for authenticated options.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/contact"
            className="bg-brand-copper hover:bg-brand-copper-hover text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Schedule Consultation
          </Link>
          <CallButton size="md" />
        </div>
      </div>
    </div>
  );
}
