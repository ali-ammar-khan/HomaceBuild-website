import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { MapPin, Phone, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-navy-dark text-brand-slate-400 border-t border-brand-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Company Profile with Clean, Proportional Logo Frame */}
          <div className="space-y-4">
            <div className="relative h-16 sm:h-18 w-56 sm:w-60 bg-white p-2.5 rounded-xl shadow-xs border border-brand-slate-200/90 flex items-center justify-center">
              <Image
                src="/HomaceLogo.png"
                alt="HomaceBuild and Realators"
                fill
                className="object-contain object-center p-1.5"
                sizes="(max-width: 640px) 224px, 240px"
              />
            </div>
            <p className="text-[11px] font-bold tracking-widest text-brand-copper uppercase">
              {siteConfig.tagline}
            </p>
            <p className="text-xs text-brand-slate-400 leading-relaxed">
              HomaceBuild and Realators delivers professional, verified real estate consultancy, plot acquisitions, and residential and commercial property advisory across Islamabad and Rawalpindi.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-copper">
              <ShieldCheck className="w-4 h-4 shrink-0 text-brand-cyan" />
              <span>Genuine Listings & Ethical Advisory</span>
            </div>
          </div>

          {/* Column 2: Key Markets & Sectors */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-copper pl-2">
              Key Market Focus
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/locations/bahria-town" prefetch={true} className="hover:text-brand-copper transition-colors flex items-center gap-1.5 active:scale-95">
                  <ArrowRight className="w-3 h-3 text-brand-copper" />
                  Bahria Town Phases 1–8 Guide
                </Link>
              </li>
              <li>
                <Link href="/locations/dha-islamabad" prefetch={true} className="hover:text-brand-copper transition-colors flex items-center gap-1.5 active:scale-95">
                  <ArrowRight className="w-3 h-3 text-brand-copper" />
                  DHA Islamabad & Rawalpindi Guide
                </Link>
              </li>
              <li>
                <Link href="/locations" prefetch={true} className="hover:text-brand-copper transition-colors flex items-center gap-1.5 active:scale-95">
                  <ArrowRight className="w-3 h-3 text-brand-copper" />
                  All Areas Served
                </Link>
              </li>
              <li>
                <Link href="/tools/area-calculator" prefetch={true} className="hover:text-brand-copper transition-colors flex items-center gap-1.5 active:scale-95">
                  <ArrowRight className="w-3 h-3 text-brand-copper" />
                  Marla & Area Calculator (225 sq ft)
                </Link>
              </li>
              <li>
                <Link href="/properties?plot_status=possession" prefetch={true} className="hover:text-brand-copper transition-colors flex items-center gap-1.5 active:scale-95">
                  <ArrowRight className="w-3 h-3 text-brand-copper" />
                  Possession-Ready Properties
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Advisory Services */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-azure pl-2">
              Advisory Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/services/buying-and-selling" prefetch={true} className="hover:text-brand-azure-light transition-colors active:scale-95">
                  Property Buying & Selling
                </Link>
              </li>
              <li>
                <Link href="/services/rentals" prefetch={true} className="hover:text-brand-azure-light transition-colors active:scale-95">
                  Rental & Tenancy Services
                </Link>
              </li>
              <li>
                <Link href="/services/residential" prefetch={true} className="hover:text-brand-azure-light transition-colors active:scale-95">
                  Residential Plots & Homes
                </Link>
              </li>
              <li>
                <Link href="/services/commercial" prefetch={true} className="hover:text-brand-azure-light transition-colors active:scale-95">
                  Commercial Plots & Plazas
                </Link>
              </li>
              <li>
                <Link href="/services" prefetch={true} className="hover:text-brand-azure-light transition-colors active:scale-95">
                  All Advisory Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-cyan pl-2">
              Direct Contact
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-copper shrink-0 mt-0.5" />
                <span>Islamabad / Rawalpindi, Pakistan</span>
              </div>
              {siteConfig.contact.phone !== 'To be provided' && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-brand-copper shrink-0" />
                  <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-white transition-colors">
                    {siteConfig.contact.phone}
                  </a>
                </div>
              )}
              {siteConfig.contact.email !== 'To be provided' && (
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-brand-copper shrink-0" />
                  <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white transition-colors">
                    {siteConfig.contact.email}
                  </a>
                </div>
              )}
              <div className="pt-2">
                <Link
                  href="/contact"
                  prefetch={true}
                  className="inline-block bg-brand-slate-800 hover:bg-brand-slate-700 text-white text-xs px-3.5 py-2 rounded border border-brand-slate-700 transition-colors active:scale-95"
                >
                  Schedule Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-12 pt-6 border-t border-brand-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-brand-slate-500">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-5 sm:gap-6">
            <Link href="/about" prefetch={true} className="hover:text-brand-slate-400 transition-colors">
              About
            </Link>
            <Link href="/services" prefetch={true} className="hover:text-brand-slate-400 transition-colors">
              Services
            </Link>
            <Link href="/locations" prefetch={true} className="hover:text-brand-slate-400 transition-colors">
              Areas Served
            </Link>
            <Link href="/privacy-policy" prefetch={true} className="hover:text-brand-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-use" prefetch={true} className="hover:text-brand-slate-400 transition-colors">
              Terms of Use
            </Link>
            <Link href="/login" prefetch={true} className="hover:text-brand-slate-400 transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
