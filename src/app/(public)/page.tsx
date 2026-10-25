import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Property } from '@/types/database';
import SearchFilterBar from '@/components/public/SearchFilterBar';
import PropertyCard from '@/components/public/PropertyCard';
import InquiryForm from '@/components/public/InquiryForm';
import { siteConfig } from '@/config/site';
import { ShieldCheck, Compass, MapPin, Building2, CheckCircle2, ArrowRight } from 'lucide-react';

export const revalidate = 60; // ISR cache revalidation every 60s

export default async function HomePage() {
  const supabase = createClient();

  // Fetch published properties from PostgreSQL
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('publication_status', 'published')
    .order('created_at', { ascending: false })
    .limit(6);

  const publishedListings: Property[] = properties || [];

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative luxury-gradient text-white py-20 md:py-28 overflow-hidden">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Advisory Pill */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-brand-gold border border-white/15 mb-6">
              <ShieldCheck className="w-4 h-4" />
              <span>Islamabad & Rawalpindi Real Estate Advisory</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Verified Properties & Strategic Land Advisory in{' '}
              <span className="text-brand-gold">Bahria Town & DHA</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              HomaceBuild and Realators connects buyers, sellers, investors, and tenants with genuine residential plots, commercial investments, and luxury houses across Islamabad and Rawalpindi.
            </p>
          </div>

          {/* Integrated Search Bar */}
          <div className="mt-10">
            <SearchFilterBar />
          </div>
        </div>
      </section>

      {/* 2. CORE SPECIALIZATIONS & LOCAL MARKETS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">
              Market Focus
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy mt-1">
              Primary Advisory Territories
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 md:mt-0 max-w-md">
            Specialized in residential files, possession plots, and commercial avenues across the twin cities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Bahria Town */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-brand-navy">
              Bahria Town (Phases 1–8)
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Comprehensive coverage of residential plots (5 Marla, 10 Marla, 1 Kanal), commercial civic zones, and ready villas in Bahria Town Rawalpindi/Islamabad.
            </p>
            <Link
              href="/properties?location=Bahria+Town"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-navy hover:text-brand-gold transition-colors"
            >
              <span>Explore Bahria Town Listings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: DHA Islamabad / Rawalpindi */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-brand-navy">
              DHA Islamabad & Rawalpindi
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Verified allocations, balloted files, and possession plots in DHA Phase 1, Phase 2, Phase 3, Phase 4, and DHA Valley.
            </p>
            <Link
              href="/properties?location=DHA"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-navy hover:text-brand-gold transition-colors"
            >
              <span>Explore DHA Listings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Commercial & Corporate */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-brand-navy">
              Commercial Plazas & Retail
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Strategic retail shops, office floors, and commercial plots designed for high rental yields and capital appreciation.
            </p>
            <Link
              href="/properties?category=commercial_plot"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-navy hover:text-brand-gold transition-colors"
            >
              <span>Explore Commercial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. FEATURED LISTINGS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">
              Market Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy mt-1">
              Featured Property Opportunities
            </h2>
          </div>
          <Link
            href="/properties"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-brand-navy hover:text-brand-gold transition-colors"
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
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">
              Listings Are Being Updated
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              We only publish genuine, verified listings. Please submit your specific requirements below or contact us directly via WhatsApp.
            </p>
            <div className="mt-5">
              <Link
                href="/contact"
                className="inline-block bg-brand-navy hover:bg-brand-navyLight text-white text-xs font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                Submit Buying or Selling Request
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 4. ADVISORY STANDARDS / VALUE PROPOSITION */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">
                Our Foundation
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy mt-1">
                Transparent Advisory for Discerning Property Buyers & Investors
              </h2>
              <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                Navigating the Islamabad and Rawalpindi real estate landscape requires verified documentation, accurate area measurements in Marla and Kanal, and local authority compliance.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      Documented Marla & Kanal Conversions
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Standardized calculations reflecting 225 sq ft Bahria/DHA conventions to ensure absolute transparency.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      Possession & Balloting Verification
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Clear distinction between ready-for-possession plots, balloted units, and allocation files.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      Direct Principal-to-Principal Consultation
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Every inquiry connects directly with an authorized property advisor without deceptive intermediaries.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Inquiry Form Widget */}
            <div>
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
