import React from 'react';
import { Metadata } from 'next';
import InquiryForm from '@/components/public/InquiryForm';
import { siteConfig } from '@/config/site';
import { MapPin, Phone, Mail, MessageSquare, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Property Advisory Desk | Islamabad & Rawalpindi',
  description: 'Connect with HomaceBuild and Realators for residential and commercial property acquisition, sales, and investments in Bahria Town and DHA.',
};

export default function ContactPage() {
  const whatsappUrl = siteConfig.contact.whatsapp
    ? `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
        'Hello HomaceBuild & Realators, I would like to schedule a real estate consultation.'
      )}`
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Page Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-bold text-brand-copper uppercase tracking-wider">
          Direct Advisory Desk
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mt-1">
          Connect with Our Property Specialists
        </h1>
        <p className="text-sm text-brand-slate-600 mt-2 leading-relaxed">
          Whether you are acquiring a residential plot in Bahria Town, evaluating commercial investment in DHA, or listing a property for sale or rent, our team provides transparent, verified consultation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Information & Channels */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 space-y-6 shadow-sm">
            <h3 className="text-base font-bold text-brand-navy border-b border-brand-slate-100 pb-3">
              Official Communication Channels
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-copper shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-brand-slate-800 block">Operational Territories</span>
                  <span className="text-brand-slate-500">Bahria Town, DHA, Islamabad & Rawalpindi</span>
                </div>
              </div>

              {siteConfig.contact.phone !== 'To be provided' && (
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-brand-copper shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-brand-slate-800 block">Telephone</span>
                    <a href={`tel:${siteConfig.contact.phone}`} className="text-brand-navy hover:underline">
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>
              )}

              {siteConfig.contact.email !== 'To be provided' && (
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-brand-copper shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-brand-slate-800 block">Email Inquiries</span>
                    <a href={`mailto:${siteConfig.contact.email}`} className="text-brand-navy hover:underline">
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {whatsappUrl && (
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg text-xs font-semibold transition-colors shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Start Direct WhatsApp Chat</span>
                </a>
              </div>
            )}
          </div>

          <div className="bg-brand-navy-dark text-white rounded-2xl p-6 space-y-3 border border-brand-slate-800">
            <div className="flex items-center gap-2 text-brand-copper text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-brand-cyan" />
              <span>Verified Listings Guarantee</span>
            </div>
            <p className="text-xs text-brand-slate-300 leading-relaxed">
              We never publish unverified files or speculative inventory. Every plot and structure in our portfolio is reviewed for authentic title documentation.
            </p>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="lg:col-span-2">
          <InquiryForm />
        </div>
      </div>
    </div>
  );
}
