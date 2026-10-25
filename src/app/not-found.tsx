import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Search, MapPin, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-slate-50 flex flex-col justify-between text-brand-slate-900">
      {/* Top Header Minimal */}
      <header className="border-b border-brand-slate-200 bg-white/90 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="relative h-14 w-48 block">
            <Image
              src="/HomaceLogo.png"
              alt="HomaceBuild and Realators"
              fill
              priority
              className="object-contain object-left"
            />
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold text-brand-navy hover:text-brand-copper transition-colors flex items-center gap-1"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </header>

      {/* Main 404 Visual Content */}
      <main className="max-w-3xl mx-auto px-6 py-16 text-center space-y-8 flex-1 flex flex-col justify-center">
        <div className="space-y-3">
          <span className="text-xs font-bold text-brand-copper uppercase tracking-widest bg-brand-copper/10 px-3.5 py-1.5 rounded-full inline-block border border-brand-copper/20">
            404 Error • Page Not Located
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-navy tracking-tight">
            Property or Route Not Found
          </h1>
          <p className="text-sm sm:text-base text-brand-slate-600 max-w-xl mx-auto leading-relaxed">
            The property listing or destination you are searching for may have been archived, transferred, or updated with a new reference code.
          </p>
        </div>

        {/* Action Direct Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto w-full">
          <Link
            href="/properties"
            className="p-5 bg-white rounded-2xl border border-brand-slate-200 shadow-sm hover:shadow-md hover:border-brand-azure transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-azure-tint text-brand-azure flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-brand-navy group-hover:text-brand-azure transition-colors">
              Property Directory
            </h3>
            <p className="text-xs text-brand-slate-500 mt-1">
              Browse all verified plots, villas, and commercial real estate.
            </p>
          </Link>

          <Link
            href="/locations/bahria-town"
            className="p-5 bg-white rounded-2xl border border-brand-slate-200 shadow-sm hover:shadow-md hover:border-brand-copper transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-copper/10 text-brand-copper flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-brand-navy group-hover:text-brand-copper transition-colors">
              Bahria Town Guide
            </h3>
            <p className="text-xs text-brand-slate-500 mt-1">
              Phases 1–8 residential plots and commercial plazas.
            </p>
          </Link>

          <Link
            href="/locations/dha-islamabad"
            className="p-5 bg-white rounded-2xl border border-brand-slate-200 shadow-sm hover:shadow-md hover:border-brand-azure transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-azure-tint text-brand-azure flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-brand-navy group-hover:text-brand-azure transition-colors">
              DHA Islamabad
            </h3>
            <p className="text-xs text-brand-slate-500 mt-1">
              Phases 1–5 plots, balloted files, and luxury homes.
            </p>
          </Link>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-semibold px-6 py-3 rounded-lg shadow-sm transition-all active:scale-95"
          >
            <span>Return to Homepage</span>
            <ArrowRight className="w-4 h-4 text-brand-copper" />
          </Link>
        </div>
      </main>

      {/* Bottom Sub-footer */}
      <footer className="border-t border-brand-slate-200 py-6 text-center text-xs text-brand-slate-500 bg-white">
        <p>© {new Date().getFullYear()} HomaceBuild and Realators. All rights reserved.</p>
      </footer>
    </div>
  );
}
