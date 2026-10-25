import React from 'react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import { siteConfig } from '@/config/site';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import { ShieldAlert, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Use | HomaceBuild and Realators',
  description:
    'Terms of Use governing the HomaceBuild and Realators website. Understand listing representation, developer transfer policies, and measurement standards.',
  alternates: {
    canonical: `${siteConfig.url}/terms-of-use`,
  },
};

export default function TermsOfUsePage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Terms of Use', url: `${siteConfig.url}/terms-of-use` },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Breadcrumbs items={[{ label: 'Terms of Use' }]} />

      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-brand-slate-200">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-copper uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5 text-brand-copper" />
          <span>Website & Advisory Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy">
          Terms of Use
        </h1>
        <p className="text-xs text-brand-slate-500">
          Last updated: October 2026 • Governing jurisdiction: Islamabad Capital Territory, Pakistan
        </p>
      </div>

      {/* Legal Notice Disclaimer Box */}
      <div className="bg-brand-slate-50 border border-brand-slate-200 rounded-2xl p-5 text-xs text-brand-slate-600 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-brand-copper shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-brand-slate-900">Important Disclaimer Regarding Legal & Financial Advice</p>
          <p className="leading-relaxed">
            The information, listings, measurements, and market analyses published on this website are provided for informational and preliminary advisory purposes only. They do not constitute formal legal, taxation, or certified financial advice. Property transactions in Pakistan require independent due diligence, official society record verification, and execution at the relevant developer or registrar office.
          </p>
        </div>
      </div>

      {/* Terms Sections */}
      <div className="space-y-8 text-sm text-brand-slate-700 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the website of {siteConfig.name} ({siteConfig.url}), you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree with these terms, you should discontinue use of the website.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">2. Nature of Property Listings & Pricing</h2>
          <p>
            {siteConfig.name} takes every reasonable measure to ensure that listings published on this website represent genuine, currently available properties with authentic developer titles. However:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-brand-slate-600">
            <li><strong>Price Fluctuations:</strong> Property prices in Pakistani real estate are subject to market conditions, seller revisions, and developer society fee updates without prior notice.</li>
            <li><strong>Price on Call Listings:</strong> Where a property is marked &ldquo;Price on Call&rdquo;, this reflects variable commercial value, high-value assets, or fluctuating file rates where an authentic live quotation must be confirmed directly with our advisory desk.</li>
            <li><strong>Availability:</strong> A listing marked &ldquo;Available&rdquo; is subject to prior sale, token placement, or seller withdrawal prior to formal society transfer.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">3. Measurement Standards & Marla Conversion Convention</h2>
          <p>
            Real estate measurements across Pakistan vary by local administrative practice:
          </p>
          <div className="bg-brand-azure-tint border border-brand-azure/20 p-4 rounded-xl text-xs space-y-2 text-brand-slate-800">
            <p className="font-bold text-brand-navy">Standard Conversion Standard (225 Sq. Ft. Marla):</p>
            <p className="leading-relaxed">
              Unless explicitly specified otherwise in writing for rural revenue land, all properties listed on this website in Bahria Town (Phases 1–8) and DHA Islamabad/Rawalpindi adhere to the approved urban town planning standard: <strong>1 Marla = 225 Square Feet</strong> and <strong>1 Kanal = 20 Marlas = 4,500 Square Feet</strong>.
            </p>
            <p className="text-brand-slate-600">
              Users acknowledge that traditional Punjab revenue land (272.25 sq ft) and municipal standards (250 sq ft) do not apply to these master-planned societies.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">4. Developer & Regulatory Disclaimers</h2>
          <p>
            {siteConfig.name} operates as an independent private real estate consultancy and brokerage firm. We are not a subsidiary or corporate affiliate of Bahria Town (Pvt) Ltd or Defence Housing Authority (DHA).
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-brand-slate-600">
            <li>Transfer procedures, No Demand Certificate (NDC) fees, capital value taxes (CVT), stamp duties, and possession timelines are determined exclusively by the respective developer and governing municipal authorities.</li>
            <li>Clients are responsible for fulfilling society membership requirements and attending official biometric transfer appointments in person or through a legally attested Special Power of Attorney (SPA).</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">5. Intellectual Property & Brand Protection</h2>
          <p>
            The official logo, branding tokens, website design, original descriptions, and curated photographic assets displayed on this website are the property of {siteConfig.name} and are protected under copyright and trademark laws of Pakistan. Unauthorized reproduction, automated scraping, or re-publishing without express written consent is prohibited.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-navy">6. Limitation of Liability & Governing Law</h2>
          <p>
            {siteConfig.name} shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this website, including but not limited to reliance on listing descriptions prior to formal verification.
          </p>
          <p>
            These terms are governed by and construed in accordance with the laws of the Islamic Republic of Pakistan. Any legal proceedings arising under these terms shall be subject to the exclusive jurisdiction of the competent courts of Islamabad.
          </p>
        </section>
      </div>
    </div>
  );
}
