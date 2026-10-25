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
          {/* Column 1: Company Profile */}
          <div className="space-y-4">
            <div className="relative h-14 w-44 bg-white/95 p-2 rounded-lg">
              <Image
                src="/HomaceLogo.png"
                alt="HomaceBuild and Realators"
                fill
                className="object-contain object-left p-1"
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
                <Link href="/locations/bahria-town" className="hover:text-brand-copper transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-copper" />
                  Bahria Town Phases 1–8 Guide
                </Link>
              </li>
              <li>
                <Link href="/locations/dha-islamabad" className="hover:text-brand-copper transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-copper" />
                  DHA Islamabad & Rawalpindi Guide
                </Link>
              </li>
              <li>
                <Link href="/properties?category=residential_plot" className="hover:text-brand-copper transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-copper" />
                  Residential Plots (5, 10 Marla, 1, 2 Kanal)
                </Link>
              </li>
              <li>
                <Link href="/properties?category=commercial_plot" className="hover:text-brand-copper transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-copper" />
                  Commercial Plots & Commercial Plazas
                </Link>
              </li>
              <li>
                <Link href="/properties?plot_status=possession" className="hover:text-brand-copper transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-copper" />
                  Possession-Ready Properties
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Property Types */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-azure pl-2">
              Property Categories
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/properties?category=house" className="hover:text-brand-azure-light transition-colors">
                  Houses & Luxury Villas
                </Link>
              </li>
              <li>
                <Link href="/properties?category=apartment" className="hover:text-brand-azure-light transition-colors">
                  Modern Apartments & Flats
                </Link>
              </li>
              <li>
                <Link href="/properties?category=shop" className="hover:text-brand-azure-light transition-colors">
                  Commercial Shops & Retail Outlets
                </Link>
              </li>
              <li>
                <Link href="/properties?category=office" className="hover:text-brand-azure-light transition-colors">
                  Corporate Offices
                </Link>
              </li>
              <li>
                <Link href="/properties?plot_status=file" className="hover:text-brand-azure-light transition-colors">
                  Balloted Plots & Verified Files
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
                  className="inline-block bg-brand-slate-800 hover:bg-brand-slate-700 text-white text-xs px-3.5 py-2 rounded border border-brand-slate-700 transition-colors"
                >
                  Send On-Site Inquiry
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
          <div className="flex items-center gap-6">
            <Link href="/properties" className="hover:text-brand-slate-400 transition-colors">
              Listings Directory
            </Link>
            <Link href="/contact" className="hover:text-brand-slate-400 transition-colors">
              Contact
            </Link>
            <Link href="/login" className="hover:text-brand-slate-400 transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
