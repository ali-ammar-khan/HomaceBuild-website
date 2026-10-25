'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { Menu, X, Phone, MessageSquare, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const whatsappUrl = siteConfig.contact.whatsapp
    ? `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
        'Hello HomaceBuild & Realators, I am interested in inquiring about property opportunities.'
      )}`
    : null;

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-brand-slate-200 shadow-sm transition-all">
      {/* Top Advisory Bar */}
      <div className="bg-brand-navy-dark text-brand-slate-300 text-xs py-2 px-4 border-b border-brand-navy">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-brand-copper font-medium tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
              Verified Real Estate Advisory
            </span>
            <span className="hidden md:inline text-brand-slate-600">•</span>
            <span className="hidden md:inline text-[11px] uppercase tracking-wider text-brand-slate-400">
              Bahria Town & DHA (Islamabad / Rawalpindi)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {siteConfig.contact.phone !== 'To be provided' && (
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <Phone className="w-3 h-3 text-brand-copper" />
                {siteConfig.contact.phone}
              </a>
            )}
            <Link
              href="/login"
              prefetch={true}
              className="text-brand-slate-400 hover:text-white transition-colors border-l border-brand-slate-800 pl-3 active:scale-95"
            >
              Staff Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation with Prominent, Generous Logo Presence */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 sm:h-28">
          {/* Company Brand Logo - Large, Prominent, Razor-Sharp */}
          <Link
            href="/"
            prefetch={true}
            className="flex items-center group py-2 active:scale-[0.98] transition-transform"
            title="HomaceBuild and Realators"
          >
            <div className="relative h-18 w-56 sm:h-22 sm:w-72 md:h-24 md:w-84 lg:h-24 lg:w-96 flex items-center">
              <Image
                src="/HomaceLogo.png"
                alt="HomaceBuild and Realators - We Engineer Your Dreams"
                fill
                priority
                className="object-contain object-left transition-transform duration-200 group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 240px, (max-width: 768px) 300px, 380px"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-brand-slate-700">
            <Link
              href="/"
              prefetch={true}
              className="hover:text-brand-azure py-1 transition-colors active:scale-95"
            >
              Home
            </Link>
            <Link
              href="/properties?purpose=sale"
              prefetch={true}
              className="hover:text-brand-azure py-1 transition-colors active:scale-95"
            >
              For Sale
            </Link>
            <Link
              href="/properties?purpose=rent"
              prefetch={true}
              className="hover:text-brand-azure py-1 transition-colors active:scale-95"
            >
              For Rent
            </Link>
            <Link
              href="/properties?category=residential_plot"
              prefetch={true}
              className="hover:text-brand-azure py-1 transition-colors active:scale-95"
            >
              Plots
            </Link>
            <Link
              href="/locations/bahria-town"
              prefetch={true}
              className="hover:text-brand-azure py-1 transition-colors active:scale-95"
            >
              Bahria Town
            </Link>
            <Link
              href="/locations/dha-islamabad"
              prefetch={true}
              className="hover:text-brand-azure py-1 transition-colors active:scale-95"
            >
              DHA
            </Link>
            <Link
              href="/contact"
              prefetch={true}
              className="hover:text-brand-azure py-1 transition-colors active:scale-95"
            >
              Contact
            </Link>
          </nav>

          {/* Actions & WhatsApp CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            )}

            <Link
              href="/contact"
              prefetch={true}
              className="inline-flex items-center gap-2 bg-brand-copper hover:bg-brand-copper-hover text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-95"
            >
              Consultation
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-brand-slate-600 hover:text-brand-slate-900 hover:bg-brand-slate-100 active:scale-95"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2 text-base font-medium text-brand-slate-800">
            <Link
              href="/"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-brand-slate-50 active:scale-95"
            >
              Home
            </Link>
            <Link
              href="/properties?purpose=sale"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-brand-slate-50 active:scale-95"
            >
              For Sale
            </Link>
            <Link
              href="/properties?purpose=rent"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-brand-slate-50 active:scale-95"
            >
              For Rent
            </Link>
            <Link
              href="/properties?category=residential_plot"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-brand-slate-50 active:scale-95"
            >
              Plots & Files
            </Link>
            <Link
              href="/locations/bahria-town"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-brand-slate-50 active:scale-95"
            >
              Bahria Town Properties
            </Link>
            <Link
              href="/locations/dha-islamabad"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-brand-slate-50 active:scale-95"
            >
              DHA Properties
            </Link>
            <Link
              href="/contact"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-brand-slate-50 active:scale-95"
            >
              Contact Us
            </Link>
            <Link
              href="/login"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-brand-azure font-semibold hover:bg-brand-slate-50 active:scale-95"
            >
              Staff Dashboard Sign In
            </Link>
          </div>

          <div className="pt-4 border-t border-brand-slate-100 flex flex-col gap-2">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 active:scale-95"
              >
                <MessageSquare className="w-5 h-5" />
                Contact via WhatsApp
              </a>
            )}
            <Link
              href="/contact"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 bg-brand-copper hover:bg-brand-copper-hover text-white rounded-lg font-semibold active:scale-95"
            >
              Submit Property Inquiry
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
