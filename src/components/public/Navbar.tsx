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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Advisory Bar */}
      <div className="bg-brand-navy text-slate-300 text-xs py-2 px-4 border-b border-brand-navyLight">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-brand-gold font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Real Estate Advisory
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline">Specialists in Bahria Town & DHA (Islamabad / Rawalpindi)</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {siteConfig.contact.phone !== 'To be provided' && (
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <Phone className="w-3 h-3 text-brand-gold" />
                {siteConfig.contact.phone}
              </a>
            )}
            <Link
              href="/login"
              className="text-slate-400 hover:text-white transition-colors border-l border-slate-700 pl-3"
            >
              Staff Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Company Brand & Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-14 w-40 flex items-center">
              <Image
                src="/HomaceLogo.png"
                alt="HomaceBuild and Realators Logo"
                fill
                priority
                className="object-contain object-left transition-transform duration-200 group-hover:scale-102"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-700">
            <Link
              href="/"
              className="hover:text-brand-gold transition-colors py-1"
            >
              Home
            </Link>
            <Link
              href="/properties?purpose=sale"
              className="hover:text-brand-gold transition-colors py-1"
            >
              For Sale
            </Link>
            <Link
              href="/properties?purpose=rent"
              className="hover:text-brand-gold transition-colors py-1"
            >
              For Rent
            </Link>
            <Link
              href="/properties?category=residential_plot"
              className="hover:text-brand-gold transition-colors py-1"
            >
              Plots
            </Link>
            <Link
              href="/properties?location=Bahria+Town"
              className="hover:text-brand-gold transition-colors py-1"
            >
              Bahria Town
            </Link>
            <Link
              href="/properties?location=DHA"
              className="hover:text-brand-gold transition-colors py-1"
            >
              DHA
            </Link>
            <Link
              href="/contact"
              className="hover:text-brand-gold transition-colors py-1"
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
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            )}

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-brand-navy hover:bg-brand-navyLight text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all border border-brand-navyLight shadow-sm"
            >
              Schedule Consultation
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2 text-base font-medium text-slate-800">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              href="/properties?purpose=sale"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50"
            >
              For Sale
            </Link>
            <Link
              href="/properties?purpose=rent"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50"
            >
              For Rent
            </Link>
            <Link
              href="/properties?category=residential_plot"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Plots & Files
            </Link>
            <Link
              href="/properties?location=Bahria+Town"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Bahria Town Properties
            </Link>
            <Link
              href="/properties?location=DHA"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50"
            >
              DHA Properties
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Contact Us
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-brand-gold font-semibold hover:bg-slate-50"
            >
              Staff Dashboard Sign In
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Contact via WhatsApp
              </a>
            )}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 bg-brand-navy hover:bg-brand-navyLight text-white rounded-lg font-medium"
            >
              Submit Property Inquiry
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
