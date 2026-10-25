'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { usePropertyContext } from '@/context/PropertyContext';
import {
  getWhatsAppUrl,
  getGeneralWhatsAppMessage,
  getPropertyWhatsAppMessage,
} from '@/lib/whatsapp';

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

export default function FloatingWhatsAppButton() {
  const pathname = usePathname();
  const { activeProperty } = usePropertyContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
      <div className="relative group flex items-center">
        {/* Accessible Tooltip Badge (Visible on hover and keyboard focus on desktop) */}
        <span
          id="whatsapp-tooltip"
          role="tooltip"
          className="pointer-events-none absolute right-full mr-3.5 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center px-3.5 py-1.5 rounded-xl bg-slate-900/95 backdrop-blur-xs text-white text-xs font-semibold shadow-lg whitespace-nowrap opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0 transition-all duration-200"
        >
          Chat with us on WhatsApp
          {/* Subtle right-pointing arrow pointer */}
          <span
            aria-hidden="true"
            className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-slate-900/95"
          />
        </span>

        {/* Ambient Pulsing Aura */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping duration-1000 -z-10 pointer-events-none"
        />

        {/* Primary Interactive WhatsApp Floating Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          aria-describedby="whatsapp-tooltip"
          className="relative flex items-center justify-center w-14 h-14 sm:w-15 sm:h-15 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1caa4f] text-white rounded-full shadow-[0_6px_20px_rgba(37,211,102,0.45)] hover:shadow-[0_8px_28px_rgba(37,211,102,0.6)] transform hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 focus-visible:ring-offset-2"
        >
          {/* Official WhatsApp Vector Emblem */}
          <WhatsAppIcon className="w-8 h-8 text-white drop-shadow-xs" />

          {/* Active Status Indicator Dot */}
          <span
            aria-hidden="true"
            className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-300 border-2 border-white rounded-full"
          />
        </a>
      </div>
    </aside>
  );
}
