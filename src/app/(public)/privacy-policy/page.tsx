import React from 'react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import { siteConfig } from '@/config/site';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import { ShieldCheck, Lock, AlertCircle, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | HomaceBuild and Realators',
  description:
    'Privacy Policy for HomaceBuild and Realators. Learn how we handle customer inquiry information, phone numbers, and communications in accordance with Pakistani digital standards.',
  alternates: {
    canonical: `${siteConfig.url}/privacy-policy`,
  },
  openGraph: {
    title: 'Privacy Policy | HomaceBuild and Realators',
    description:
      'Learn how HomaceBuild and Realators protects user information and inquiry privacy.',
    url: `${siteConfig.url}/privacy-policy`,
    siteName: siteConfig.name,
    type: 'website',
    images: [
      {
        url: `${siteConfig.url}/HomaceLogo.png`,
        width: 738,
        height: 396,
        alt: 'Homace Privacy Policy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | HomaceBuild',
    description:
      'Privacy Policy and data protection standards for HomaceBuild and Realators.',
    images: [`${siteConfig.url}/HomaceLogo.png`],
  },
};

export default function PrivacyPolicyPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Privacy Policy', url: `${siteConfig.url}/privacy-policy` },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-brand-slate-200">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-copper uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Data Handling & Privacy Standards</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy">
          Privacy Policy
        </h1>
        <p className="text-xs text-brand-slate-500">
          Last updated: October 2026 • Governing territory: Islamabad & Rawalpindi, Pakistan
        </p>
      </div>

      {/* Legal Notice Disclaimer Box */}
      <div className="bg-brand-slate-50 border border-brand-slate-200 rounded-2xl p-5 text-xs text-brand-slate-600 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-brand-copper shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-brand-slate-900">Informational Notice Regarding This Policy</p>
          <p className="leading-relaxed">
            This document sets forth the information practices and data handling protocols of {siteConfig.name}. This policy is provided for transparency regarding real estate inquiry data and does not constitute formal legal counsel. For specific legal inquiries regarding property transactions or contracts in Pakistan, parties should consult an advocate of the High Court.
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-8 text-sm text-brand-slate-700 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">1. Information We Collect</h2>
          <p>
            When you interact with {siteConfig.name} through our website, inquiry forms, or WhatsApp channels, we collect information you voluntarily provide to facilitate real estate consultations. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-brand-slate-600">
            <li><strong>Contact Identification:</strong> Full name, phone/mobile number, and email address.</li>
            <li><strong>Property Requirements:</strong> Preferred property category (residential, commercial, plot, file), target location (Bahria Town, DHA, Islamabad), budget range, and specific inquiries.</li>
            <li><strong>Technical Security Data:</strong> Cryptographic IP hashes and timestamp logs collected strictly for rate limiting, anti-spam honeypot verification, and prevention of fraudulent submissions.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">2. How We Use Your Information</h2>
          <p>
            The information you submit is utilized exclusively for genuine real estate advisory purposes:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-brand-slate-600">
            <li>Responding directly to your property inquiries and scheduling site inspections.</li>
            <li>Confirming availability, title verification, and society transfer details for requested listings.</li>
            <li>Connecting you directly with an authorized HomaceBuild real estate advisor.</li>
          </ul>
          <p className="text-xs bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-emerald-900 font-medium">
            <strong>Zero Telemarketing Resale Guarantee:</strong> We do NOT sell, rent, lease, or distribute your phone number or contact information to third-party telemarketers, bulk SMS aggregators, or unauthorized external broker chains.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">3. Direct WhatsApp & Communication Protocols</h2>
          <p>
            When you initiate contact through WhatsApp links on our website, communication is governed by WhatsApp&apos;s end-to-end encryption and terms of service. Conversations with our advisory desk are retained solely for transaction record-keeping, site inspection scheduling, and client support.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">4. Data Security & Storage</h2>
          <p>
            All submitted inquiry forms and listing data are processed using secure HTTPS protocols with server-side Zod validation. Administrative access to inquiry databases is restricted strictly to authenticated personnel with database-enforced Row Level Security (RLS).
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">5. Cookies and Web Analytics</h2>
          <p>
            Our website utilizes minimal essential session cookies required for core routing, navigation prefetching, and security. We do not engage in invasive cross-site behavioural ad-tracking.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">6. Governing Law & Contact</h2>
          <p>
            This Privacy Policy is governed by the laws applicable in Islamabad Capital Territory and the Islamic Republic of Pakistan, including the Prevention of Electronic Crimes Act (PECA). If you have questions regarding your data or wish to request deletion of your inquiry record, please contact our administrative desk:
          </p>
          <div className="bg-brand-slate-50 border border-brand-slate-200 rounded-xl p-4 text-xs space-y-1 text-brand-slate-800">
            <p><strong>{siteConfig.name} — Data Privacy Desk</strong></p>
            <p>Territories: Islamabad, Rawalpindi, Bahria Town & DHA</p>
            {siteConfig.contact.email !== 'To be provided' && <p>Email: {siteConfig.contact.email}</p>}
            {siteConfig.contact.phone !== 'To be provided' && <p>Phone: {siteConfig.contact.phone}</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
