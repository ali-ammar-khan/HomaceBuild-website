'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { usePropertyContext } from '@/context/PropertyContext';
import { siteConfig } from '@/config/site';
import {
  getWhatsAppUrl,
  getGeneralWhatsAppMessage,
  getPropertyWhatsAppMessage,
} from '@/lib/whatsapp';
import {
  MessageSquare,
  X,
  Phone,
  ChevronUp,
} from 'lucide-react';

/**
 * Official vector glyph for WhatsApp
 */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="30"
      height="30"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m-3.53 3.65c-.19 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01" />
    </svg>
  );
}

/**
 * Official vector glyph for Facebook
 */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

/**
 * Official vector glyph for Instagram
 */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

/**
 * Official vector glyph for TikTok
 */
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.11V9.41a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75c1.45 1.04 3.22 1.66 5.12 1.68V6.98a4.84 4.84 0 0 1-1.35-.29z" />
    </svg>
  );
}

export default function FloatingWhatsAppButton() {
  const pathname = usePathname();
  const { activeProperty } = usePropertyContext();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Is current route an individual property detail page?
  const isPropertyPage = pathname?.startsWith('/properties/') && pathname !== '/properties';

  // Construct context-aware message
  let message: string;
  if (isPropertyPage && activeProperty) {
    message = getPropertyWhatsAppMessage({
      title: activeProperty.title,
      referenceCode: activeProperty.referenceCode,
      url: activeProperty.url || (typeof window !== 'undefined' ? window.location.href : undefined),
    });
  } else if (isPropertyPage && !activeProperty) {
    // Fallback if property context has not hydrated yet
    const slug = pathname.replace('/properties/', '');
    message = `Hi, I'm interested in the property listing (${slug}) on HomaceBuild and Realators.`;
  } else {
    message = getGeneralWhatsAppMessage();
  }

  const whatsappUrl = getWhatsAppUrl({ message });

  // Prevent hydration mismatch on initial render
  if (!mounted) {
    return null;
  }

  return (
    <aside
      aria-label="Direct WhatsApp Contact"
      className="fixed z-40 bottom-5 right-5 sm:bottom-6 sm:right-6 pointer-events-auto"
      style={{
        bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))',
        right: 'calc(1.25rem + env(safe-area-inset-right, 0px))',
      }}
    >
      <div
        ref={containerRef}
        className="relative group flex flex-col items-end"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {/* Expanded Speed-Dial Channels Menu */}
        <div
          className={`flex flex-col items-end gap-2.5 mb-3 transition-all duration-300 origin-bottom-right ${
            isOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
              : 'opacity-0 translate-y-4 pointer-events-none scale-95 md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:pointer-events-auto md:group-hover:scale-100'
          }`}
          role="menu"
          aria-label="Reach Us Channels"
        >
          {/* Channel 1: WhatsApp */}
          <div className="flex items-center gap-2 group/item">
            {/* Accessible Tooltip Badge (Visible on hover and keyboard focus on desktop) */}
            <span
              id="whatsapp-tooltip"
              role="tooltip"
              className="px-3 py-1.5 rounded-xl bg-slate-900/95 backdrop-blur-xs text-white text-xs font-semibold shadow-lg whitespace-nowrap transition-transform duration-200 group-hover/item:scale-105 border border-slate-800"
            >
              Chat with us on WhatsApp
            </span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
              aria-describedby="whatsapp-tooltip"
              className="relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1caa4f] text-white rounded-full shadow-[0_4px_16px_rgba(37,211,102,0.45)] hover:shadow-[0_6px_22px_rgba(37,211,102,0.6)] transform hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40"
            >
              {/* Official WhatsApp Vector Emblem */}
              <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-xs" />
              {/* Active Status Indicator Dot */}
              <span
                aria-hidden="true"
                className="absolute top-0.5 right-0.5 w-3 h-3 bg-emerald-300 border-2 border-white rounded-full"
              />
            </a>
          </div>

          {/* Channel 2: Facebook */}
          <div className="flex items-center gap-2 group/item">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900/95 backdrop-blur-xs text-white text-xs font-semibold shadow-lg whitespace-nowrap transition-transform duration-200 group-hover/item:scale-105 border border-slate-800">
              Facebook
            </span>
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Connect with us on Facebook"
              className="flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 bg-[#1877F2] hover:bg-[#156cd8] active:bg-[#125ebd] text-white rounded-full shadow-[0_4px_16px_rgba(24,119,242,0.4)] hover:shadow-[0_6px_22px_rgba(24,119,242,0.6)] transform hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1877F2]/40"
            >
              <FacebookIcon className="w-5 h-5 text-white" />
            </a>
          </div>

          {/* Channel 3: Instagram */}
          <div className="flex items-center gap-2 group/item">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900/95 backdrop-blur-xs text-white text-xs font-semibold shadow-lg whitespace-nowrap transition-transform duration-200 group-hover/item:scale-105 border border-slate-800">
              Instagram
            </span>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
              className="flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-95 text-white rounded-full shadow-[0_4px_16px_rgba(221,42,123,0.4)] hover:shadow-[0_6px_22px_rgba(221,42,123,0.6)] transform hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-500/40"
            >
              <InstagramIcon className="w-5 h-5 text-white" />
            </a>
          </div>

          {/* Channel 4: TikTok */}
          <div className="flex items-center gap-2 group/item">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900/95 backdrop-blur-xs text-white text-xs font-semibold shadow-lg whitespace-nowrap transition-transform duration-200 group-hover/item:scale-105 border border-slate-800">
              TikTok
            </span>
            <a
              href={siteConfig.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on TikTok"
              className="flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 bg-black hover:bg-zinc-900 border border-zinc-800 text-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:shadow-[0_6px_22px_rgba(0,0,0,0.7)] transform hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-zinc-600/40"
            >
              <TikTokIcon className="w-5 h-5 text-white" />
            </a>
          </div>

          {/* Channel 5: Direct Phone */}
          {siteConfig.contact.phone !== 'To be provided' && (
            <div className="flex items-center gap-2 group/item">
              <span className="px-3 py-1.5 rounded-xl bg-slate-900/95 backdrop-blur-xs text-white text-xs font-semibold shadow-lg whitespace-nowrap transition-transform duration-200 group-hover/item:scale-105 border border-slate-800">
                Call: {siteConfig.contact.phone}
              </span>
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s+/g, '')}`}
                aria-label={`Direct Call ${siteConfig.contact.phone}`}
                className="flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 bg-gradient-to-r from-brand-copper to-brand-copper-hover text-white rounded-full shadow-[0_4px_16px_rgba(217,107,39,0.4)] hover:shadow-[0_6px_22px_rgba(217,107,39,0.6)] transform hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-copper/40"
              >
                <Phone className="w-5 h-5 text-white" />
              </a>
            </div>
          )}
        </div>

        {/* Primary Interactive "Reach Us" Floating Action Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label="Reach Us - Connect via WhatsApp, Facebook, TikTok, Instagram"
          className="relative flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 bg-gradient-to-r from-brand-navy-dark via-brand-navy to-brand-navy-light text-white rounded-full shadow-[0_8px_24px_rgba(10,30,66,0.38)] hover:shadow-[0_10px_32px_rgba(217,107,39,0.45)] border-2 border-brand-copper hover:border-brand-copper-hover active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-copper/50 cursor-pointer select-none group/btn min-w-[120px] sm:min-w-[136px] h-13 sm:h-14 w-14 h-14 sm:w-15 sm:h-15"
        >
          {/* Ambient Pulsing Aura */}
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-brand-copper opacity-25 animate-ping duration-1000 -z-10 pointer-events-none"
          />

          {/* Active status pulse dot */}
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>

          {/* Icon toggles between MessageSquare and Close (X) */}
          {isOpen ? (
            <X className="w-4 h-4 text-brand-copper shrink-0 transition-transform duration-200 rotate-90" />
          ) : (
            <MessageSquare className="w-4 h-4 text-brand-copper shrink-0 group-hover/btn:scale-110 transition-transform duration-200" />
          )}

          {/* Label "Reach Us" */}
          <span className="font-bold text-xs sm:text-sm tracking-wide text-white whitespace-nowrap">
            Reach Us
          </span>

          <ChevronUp
            className={`w-3.5 h-3.5 text-brand-slate-300 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-brand-copper' : 'group-hover/btn:-translate-y-0.5'
            }`}
          />
        </button>
      </div>
    </aside>
  );
}
