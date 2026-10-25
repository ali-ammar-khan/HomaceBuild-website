import React from 'react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import InquiryForm from '@/components/public/InquiryForm';
import { siteConfig } from '@/config/site';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { CallButton } from '@/components/ui/CallButton';
import { MapPin, Phone, Mail, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Property Advisory Desk | HomaceBuild and Realators',
  description:
    'Connect directly with HomaceBuild and Realators for residential plots, luxury villas, and commercial property acquisitions in Bahria Town and DHA Islamabad.',
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
  openGraph: {
    title: 'Contact Property Advisory Desk | HomaceBuild and Realators',
    description:
      'Direct consultation for residential plots, luxury villas, and commercial property acquisitions in Bahria Town and DHA Islamabad.',
    url: `${siteConfig.url}/contact`,
    siteName: siteConfig.name,
    type: 'website',
    images: [
      {
        url: `${siteConfig.url}/HomaceLogo.png`,
        width: 738,
        height: 396,
        alt: 'Contact Homace Advisory Desk',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Property Advisory Desk | HomaceBuild',
    description:
      'Direct consultation for plots, luxury villas, and commercial investments in Bahria Town and DHA.',
    images: [`${siteConfig.url}/HomaceLogo.png`],
  },
};

export default function ContactPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Contact', url: `${siteConfig.url}/contact` },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Breadcrumbs items={[{ label: 'Contact Advisory Desk' }]} />

      {/* Page Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-copper uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Direct Advisory Desk</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy leading-tight">
          Connect with Our Property Specialists
        </h1>
        <p className="text-sm sm:text-base text-brand-slate-600 leading-relaxed">
          Whether you are acquiring a residential plot in Bahria Town, evaluating a commercial investment in DHA, or listing a property for sale or rent, our team provides transparent, verified consultation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Information & Channels */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-brand-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="text-base font-bold text-brand-navy border-b border-brand-slate-100 pb-3">
              Official Communication Channels
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-copper shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-brand-slate-900 block">Territories Served</span>
                  <span className="text-brand-slate-500 leading-relaxed">
                    Bahria Town (Phases 1–8), DHA (Phases 1–5), Islamabad & Rawalpindi
                  </span>
                </div>
              </div>

              {siteConfig.contact.phone !== 'To be provided' && (
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-brand-copper shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-brand-slate-900 block">Direct Telephone</span>
                    <a
                      href={`tel:${siteConfig.contact.phone}`}
                      className="text-brand-navy font-bold hover:underline"
                    >
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>
              )}

              {siteConfig.contact.email !== 'To be provided' && (
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-brand-copper shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-brand-slate-900 block">Email Inquiries</span>
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="text-brand-navy font-semibold hover:underline"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-brand-copper shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-brand-slate-900 block">Consultation Hours</span>
                  <span className="text-brand-slate-500">
                    Monday to Saturday: 10:00 AM – 7:00 PM (PKT)
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <WhatsAppButton size="lg" fullWidth>
                Direct WhatsApp Discussion
              </WhatsAppButton>
            </div>
          </div>

          <div className="bg-brand-navy-dark text-white rounded-3xl p-6 sm:p-8 space-y-3 border border-brand-slate-800">
            <div className="flex items-center gap-2 text-brand-copper text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-brand-cyan" />
              <span>Authentic Listings Standard</span>
            </div>
            <p className="text-xs text-brand-slate-300 leading-relaxed">
              We never publish unverified files or speculative inventory. Every plot and structure in our portfolio is reviewed for authentic title documentation prior to transaction.
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
