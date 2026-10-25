'use client';

import React from 'react';
import { siteConfig } from '@/config/site';
import { MessageSquare } from 'lucide-react';

interface WhatsAppPillProps {
  propertyTitle?: string;
  referenceCode?: string;
}

export default function WhatsAppPill({ propertyTitle, referenceCode }: WhatsAppPillProps) {
  if (!siteConfig.contact.whatsapp) {
    return null;
  }

  const message = propertyTitle
    ? `Hello HomaceBuild & Realators, I am inquiring regarding "${propertyTitle}" (Ref: ${referenceCode || 'N/A'}). Please share availability and details.`
    : `Hello HomaceBuild & Realators, I am interested in property opportunities in Islamabad / Rawalpindi (Bahria Town / DHA).`;

  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <aside aria-label="WhatsApp Assistance" className="fixed bottom-6 right-6 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
        title="Chat with our property consultant on WhatsApp"
      >
        <MessageSquare className="w-5 h-5 fill-white" />
        <span className="text-sm font-semibold tracking-wide pr-1">
          WhatsApp Advisory
        </span>
      </a>
    </aside>
  );
}
