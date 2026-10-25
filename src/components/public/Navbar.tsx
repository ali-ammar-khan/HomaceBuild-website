'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import {
  Menu,
  X,
  Phone,
  ShieldCheck,
  ChevronDown,
  Calendar,
  Building2,
  KeyRound,
  Home as HomeIcon,
  MapPin,
  Users,
  Compass,
  ArrowRight,
  Calculator,
  Mail,
  Lock,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHomeActive = pathname === '/';
  const isForSaleActive = pathname === '/properties';
  const isServicesActive = pathname?.startsWith('/services');
  const isLocationsActive = pathname?.startsWith('/locations');
  const isAboutActive = pathname?.startsWith('/about');
  const isContactActive = pathname?.startsWith('/contact');

  const renderActiveDot = (isActive: boolean) => {
    if (!isActive) return null;
    return (
      <span className="w-1.5 h-1.5 rounded-full bg-brand-copper shrink-0 animate-in fade-in zoom-in duration-200" />
    );
  };

  const getNavLinkClasses = (isActive: boolean) =>
    cn(
      'relative px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-full text-xs xl:text-sm font-semibold tracking-wide transition-all duration-200 group inline-flex items-center gap-1.5 select-none whitespace-nowrap shrink-0',
      isActive
        ? 'bg-white text-brand-navy font-bold shadow-[0_2px_8px_rgba(10,30,66,0.08)] border border-brand-slate-200/90'
        : 'text-brand-slate-600 hover:text-brand-navy hover:bg-white/80'
    );

  return (
    <header className="sticky top-0 z-40 bg-white/96 backdrop-blur-xl border-b border-brand-slate-200/80 shadow-[0_4px_24px_-4px_rgba(10,30,66,0.07)] transition-all">
      {/* Top Advisory Bar - Deep Navy with Subtle Status Accents */}
      <div className="bg-gradient-to-r from-brand-navy-dark via-brand-navy to-brand-navy-dark text-brand-slate-300 text-xs py-2 px-4 border-b border-brand-navy-light/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-navy-light/50 border border-brand-cyan/20 text-brand-cyan text-[11px] font-semibold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
              Verified Advisory
            </span>
            <span className="hidden md:inline text-brand-slate-600">•</span>
            <span className="hidden md:inline text-[11px] uppercase tracking-wider text-brand-slate-300 font-medium">
              Bahria Town & DHA Islamabad Specialists
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {siteConfig.contact.phone !== 'To be provided' && (
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s+/g, '')}`}
                className="hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap group"
                title={`Direct Telephone: ${siteConfig.contact.phone}`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <Phone className="w-3 h-3 text-brand-copper group-hover:text-brand-copper-hover transition-colors" />
                <span className="font-semibold text-brand-slate-200 group-hover:text-white tracking-wide">
                  {siteConfig.contact.phone}
                </span>
              </a>
            )}
            <Link
              href="/login"
              prefetch={true}
              className="text-brand-slate-400 hover:text-white transition-colors border-l border-brand-slate-700/80 pl-3 active:scale-95 whitespace-nowrap flex items-center gap-1 group"
            >
              <Lock className="w-3 h-3 text-brand-slate-500 group-hover:text-brand-cyan transition-colors" />
              <span className="font-medium text-[11px]">Staff Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-22 sm:h-26 lg:h-26 gap-3 xl:gap-6 flex-nowrap">
          {/* Company Brand Logo - Large, Razor-Sharp, Prominent */}
          <Link
            href="/"
            prefetch={true}
            className="flex items-center group py-2 active:scale-[0.98] transition-transform shrink-0"
            title="HomaceBuild and Realators"
          >
            <div className="relative h-20 w-56 sm:h-24 sm:w-72 md:h-26 md:w-80 lg:h-26 lg:w-96 max-w-[250px] sm:max-w-[300px] md:max-w-[340px] lg:max-w-[300px] xl:max-w-[370px] 2xl:max-w-none flex items-center shrink-0">
              <Image
                src="/HomaceLogo.png"
                alt="HomaceBuild and Realators - We Engineer Your Dreams"
                fill
                priority
                className="object-contain object-left transition-transform duration-200 group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 250px, (max-width: 1280px) 340px, 400px"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links - Segmented Pill Bar (Single Clean Line) */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 p-1.5 bg-brand-slate-100/80 backdrop-blur-md rounded-full border border-brand-slate-200/90 shadow-[inset_0_1px_3px_rgba(10,30,66,0.04)] whitespace-nowrap shrink-0">
            {/* 1. Home */}
            <Link
              href="/"
              prefetch={true}
              className={getNavLinkClasses(isHomeActive)}
            >
              {renderActiveDot(isHomeActive)}
              <span className="whitespace-nowrap">Home</span>
            </Link>

            {/* 2. For Sale */}
            <Link
              href="/properties?purpose=sale"
              prefetch={true}
              className={getNavLinkClasses(Boolean(isForSaleActive))}
            >
              {renderActiveDot(Boolean(isForSaleActive))}
              <span className="whitespace-nowrap">For Sale</span>
            </Link>

            {/* 3. For Rent */}
            <Link
              href="/properties?purpose=rent"
              prefetch={true}
              className={getNavLinkClasses(false)}
            >
              <span className="whitespace-nowrap">For Rent</span>
            </Link>

            {/* 4. Services (with Interactive Dropdown) */}
            <div className="relative group shrink-0">
              <Link
                href="/services"
                prefetch={true}
                className={getNavLinkClasses(Boolean(isServicesActive))}
              >
                {renderActiveDot(Boolean(isServicesActive))}
                <span className="whitespace-nowrap">Services</span>
                <ChevronDown className="w-3.5 h-3.5 text-brand-slate-400 group-hover:text-brand-navy transition-transform duration-200 group-hover:rotate-180 shrink-0" />
              </Link>

              {/* Services Dropdown Panel */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50 min-w-[310px]">
                <div className="bg-white/98 backdrop-blur-xl rounded-2xl border border-brand-slate-200 shadow-[0_16px_40px_-6px_rgba(10,30,66,0.16)] p-2.5 space-y-1">
                  <div className="h-0.5 w-full bg-gradient-to-r from-brand-azure via-brand-cyan to-brand-copper rounded-full mb-1 opacity-90" />
                  
                  <Link
                    href="/services/buying-and-selling"
                    prefetch={true}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-brand-azure-tint/70 group/item transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-brand-copper/10 text-brand-copper group-hover/item:bg-brand-navy group-hover/item:text-brand-cyan transition-colors shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-brand-navy group-hover/item:text-brand-azure whitespace-nowrap">
                        Buying & Selling
                      </div>
                      <p className="text-[11px] text-brand-slate-500 line-clamp-1">
                        Verified title checks & transfer guidance
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/services/rentals"
                    prefetch={true}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-brand-azure-tint/70 group/item transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-brand-copper/10 text-brand-copper group-hover/item:bg-brand-navy group-hover/item:text-brand-cyan transition-colors shrink-0">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-brand-navy group-hover/item:text-brand-azure whitespace-nowrap">
                        Rentals & Tenancy
                      </div>
                      <p className="text-[11px] text-brand-slate-500 line-clamp-1">
                        Executive homes & commercial leases
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/services/residential"
                    prefetch={true}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-brand-azure-tint/70 group/item transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-brand-copper/10 text-brand-copper group-hover/item:bg-brand-navy group-hover/item:text-brand-cyan transition-colors shrink-0">
                      <HomeIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-brand-navy group-hover/item:text-brand-azure whitespace-nowrap">
                        Residential Advisory
                      </div>
                      <p className="text-[11px] text-brand-slate-500 line-clamp-1">
                        Plots & villas in Bahria & DHA
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/services/commercial"
                    prefetch={true}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-brand-azure-tint/70 group/item transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-brand-copper/10 text-brand-copper group-hover/item:bg-brand-navy group-hover/item:text-brand-cyan transition-colors shrink-0">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-brand-navy group-hover/item:text-brand-azure whitespace-nowrap">
                        Commercial Real Estate
                      </div>
                      <p className="text-[11px] text-brand-slate-500 line-clamp-1">
                        Commercial plots, shops & plazas
                      </p>
                    </div>
                  </Link>

                  <div className="pt-2 border-t border-brand-slate-100 mt-1">
                    <Link
                      href="/services"
                      prefetch={true}
                      className="flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold text-brand-azure hover:text-brand-copper transition-colors whitespace-nowrap"
                    >
                      <span>Explore All Advisory Services</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Locations (with Interactive Dropdown) */}
            <div className="relative group shrink-0">
              <Link
                href="/locations"
                prefetch={true}
                className={getNavLinkClasses(Boolean(isLocationsActive))}
              >
                {renderActiveDot(Boolean(isLocationsActive))}
                <span className="whitespace-nowrap">Locations</span>
                <ChevronDown className="w-3.5 h-3.5 text-brand-slate-400 group-hover:text-brand-navy transition-transform duration-200 group-hover:rotate-180 shrink-0" />
              </Link>

              {/* Locations Dropdown Panel */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50 min-w-[300px]">
                <div className="bg-white/98 backdrop-blur-xl rounded-2xl border border-brand-slate-200 shadow-[0_16px_40px_-6px_rgba(10,30,66,0.16)] p-2.5 space-y-1">
                  <div className="h-0.5 w-full bg-gradient-to-r from-brand-copper via-brand-cyan to-brand-azure rounded-full mb-1 opacity-90" />

                  <Link
                    href="/locations/bahria-town"
                    prefetch={true}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-brand-azure-tint/70 group/item transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-brand-copper/10 text-brand-copper group-hover/item:bg-brand-navy group-hover/item:text-brand-cyan transition-colors shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-brand-navy group-hover/item:text-brand-azure whitespace-nowrap">
                        Bahria Town (Phases 1–8)
                      </div>
                      <p className="text-[11px] text-brand-slate-500 line-clamp-1">
                        Sector guides, NDCs & authentic plots
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/locations/dha-islamabad"
                    prefetch={true}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-brand-azure-tint/70 group/item transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-brand-copper/10 text-brand-copper group-hover/item:bg-brand-navy group-hover/item:text-brand-cyan transition-colors shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-brand-navy group-hover/item:text-brand-azure whitespace-nowrap">
                        DHA Islamabad & Rawalpindi
                      </div>
                      <p className="text-[11px] text-brand-slate-500 line-clamp-1">
                        Phases 1 to 5 verified inventory
                      </p>
                    </div>
                  </Link>

                  <div className="pt-2 border-t border-brand-slate-100 mt-1">
                    <Link
                      href="/locations"
                      prefetch={true}
                      className="flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold text-brand-azure hover:text-brand-copper transition-colors whitespace-nowrap"
                    >
                      <span>View All Areas Served</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. About Us */}
            <Link
              href="/about"
              prefetch={true}
              className={getNavLinkClasses(Boolean(isAboutActive))}
            >
              {renderActiveDot(Boolean(isAboutActive))}
              <span className="whitespace-nowrap">About Us</span>
            </Link>

            {/* 7. Contact Us */}
            <Link
              href="/contact"
              prefetch={true}
              className={getNavLinkClasses(Boolean(isContactActive))}
            >
              {renderActiveDot(Boolean(isContactActive))}
              <span className="whitespace-nowrap">Contact Us</span>
            </Link>
          </nav>

          {/* Desktop Consultation Action - Rich Copper Gradient CTA */}
          <div className="hidden sm:flex items-center shrink-0">
            <Link
              href="/contact"
              prefetch={true}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-copper via-[#E27632] to-brand-copper-hover text-white px-5 py-2.5 rounded-full text-xs xl:text-sm font-bold tracking-wide transition-all duration-200 shadow-[0_4px_16px_rgba(217,107,39,0.32)] hover:shadow-[0_8px_24px_rgba(217,107,39,0.46)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 border border-amber-600/30 whitespace-nowrap shrink-0 group"
            >
              <Calendar className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-white shrink-0 group-hover:rotate-6 transition-transform" />
              <span className="whitespace-nowrap">Consultation</span>
            </Link>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex lg:hidden shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl bg-brand-slate-100 hover:bg-brand-slate-200 text-brand-navy border border-brand-slate-200/80 active:scale-95 transition-all shadow-2xs"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Hairline Gradient Divider along Header Bottom */}
      <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-brand-azure/20 via-brand-copper/30 to-transparent" />

      {/* Responsive Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-slate-200 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4">
          <div className="flex flex-col space-y-1 text-sm font-medium text-brand-slate-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-brand-copper px-3 py-1">
              Properties & Explore
            </div>
            
            <Link
              href="/"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors active:scale-95 whitespace-nowrap',
                isHomeActive
                  ? 'bg-brand-azure-tint text-brand-azure font-bold'
                  : 'hover:bg-brand-slate-50 text-brand-slate-700'
              )}
            >
              <HomeIcon className="w-4 h-4 text-brand-copper shrink-0" />
              <span>Home</span>
            </Link>

            <Link
              href="/properties?purpose=sale"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-brand-slate-50 text-brand-slate-700 active:scale-95 transition-colors whitespace-nowrap"
            >
              <Building2 className="w-4 h-4 text-brand-copper shrink-0" />
              <span>For Sale</span>
            </Link>

            <Link
              href="/properties?purpose=rent"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-brand-slate-50 text-brand-slate-700 active:scale-95 transition-colors whitespace-nowrap"
            >
              <KeyRound className="w-4 h-4 text-brand-copper shrink-0" />
              <span>For Rent</span>
            </Link>

            <div className="pt-2 text-[11px] font-bold uppercase tracking-wider text-brand-copper px-3 py-1">
              Advisory & Locations
            </div>

            <Link
              href="/services"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors active:scale-95 whitespace-nowrap',
                isServicesActive
                  ? 'bg-brand-azure-tint text-brand-azure font-bold'
                  : 'hover:bg-brand-slate-50 text-brand-slate-700'
              )}
            >
              <Compass className="w-4 h-4 text-brand-copper shrink-0" />
              <span>Our Services</span>
            </Link>

            <Link
              href="/locations"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors active:scale-95 whitespace-nowrap',
                isLocationsActive
                  ? 'bg-brand-azure-tint text-brand-azure font-bold'
                  : 'hover:bg-brand-slate-50 text-brand-slate-700'
              )}
            >
              <MapPin className="w-4 h-4 text-brand-copper shrink-0" />
              <span>Areas Served & Locations</span>
            </Link>

            <Link
              href="/tools/area-calculator"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-brand-slate-50 text-brand-slate-700 active:scale-95 transition-colors whitespace-nowrap"
            >
              <Calculator className="w-4 h-4 text-brand-copper shrink-0" />
              <span>Marla & Area Calculator</span>
            </Link>

            <div className="pt-2 text-[11px] font-bold uppercase tracking-wider text-brand-copper px-3 py-1">
              Company
            </div>

            <Link
              href="/about"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors active:scale-95 whitespace-nowrap',
                isAboutActive
                  ? 'bg-brand-azure-tint text-brand-azure font-bold'
                  : 'hover:bg-brand-slate-50 text-brand-slate-700'
              )}
            >
              <Users className="w-4 h-4 text-brand-copper shrink-0" />
              <span>About Us</span>
            </Link>

            <Link
              href="/contact"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors active:scale-95 whitespace-nowrap',
                isContactActive
                  ? 'bg-brand-azure-tint text-brand-azure font-bold'
                  : 'hover:bg-brand-slate-50 text-brand-slate-700'
              )}
            >
              <Mail className="w-4 h-4 text-brand-copper shrink-0" />
              <span>Contact Us</span>
            </Link>

            <Link
              href="/login"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-brand-azure font-semibold hover:bg-brand-slate-50 active:scale-95 transition-colors whitespace-nowrap"
            >
              <Lock className="w-4 h-4 text-brand-azure shrink-0" />
              <span>Staff Dashboard Sign In</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-brand-slate-100 flex flex-col gap-2">
            {siteConfig.contact.phone !== 'To be provided' && (
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s+/g, '')}`}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-brand-navy text-white rounded-full font-bold flex items-center justify-center gap-2 active:scale-95 shadow-sm transition-all whitespace-nowrap text-sm"
              >
                <Phone className="w-4 h-4 text-brand-copper shrink-0" />
                <span>Call {siteConfig.contact.phone}</span>
              </a>
            )}
            <Link
              href="/contact"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 bg-gradient-to-r from-brand-copper via-[#E27632] to-brand-copper-hover text-white rounded-full font-bold flex items-center justify-center gap-2 active:scale-95 shadow-md transition-all whitespace-nowrap text-sm"
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Schedule Consultation</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
