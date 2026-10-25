import React from 'react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import AreaCalculator from '@/components/public/AreaCalculator';
import { siteConfig } from '@/config/site';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import { Calculator } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Real Estate Area & Marla Calculator | HomaceBuild and Realators',
  description:
    'Convert Marla, Kanal, Square Feet, and Square Yards accurately. Features verified 225 sq ft Bahria Town & DHA Islamabad master plan standards and 272.25 sq ft traditional comparisons.',
  alternates: {
    canonical: `${siteConfig.url}/tools/area-calculator`,
  },
  openGraph: {
    title: 'Real Estate Area & Marla Calculator | HomaceBuild and Realators',
    description:
      'Accurately calculate plot sizes in Marla, Kanal, Sq. Ft., and Sq. Yds. using the verified 225 sq ft standard for Bahria Town and DHA Islamabad.',
    url: `${siteConfig.url}/tools/area-calculator`,
    siteName: siteConfig.name,
    type: 'website',
    images: [
      {
        url: `${siteConfig.url}/HomaceLogo.png`,
        width: 738,
        height: 396,
        alt: 'Homace Real Estate Area Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate Area & Marla Calculator | HomaceBuild',
    description:
      'Convert plot sizes in Marla, Kanal, Sq. Ft., and Sq. Yds. based on the 225 sq ft Bahria Town & DHA standard.',
    images: [`${siteConfig.url}/HomaceLogo.png`],
  },
};

export default function AreaCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Tools', url: `${siteConfig.url}/tools/area-calculator` },
    { name: 'Area Calculator', url: `${siteConfig.url}/tools/area-calculator` },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-12">
      {/* Schema.org Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Tools' },
          { label: 'Marla & Area Calculator' },
        ]}
      />

      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-copper uppercase tracking-wider">
          <Calculator className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Land Measurement Utility</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy leading-tight">
          Marla & Land Area Calculator
        </h1>
        <p className="text-sm sm:text-base text-brand-slate-600 leading-relaxed">
          Accurately convert plot and property sizes across Marla, Kanal, Square Feet, and Square Yards according to the verified 225 sq ft Bahria Town & DHA standard.
        </p>
      </div>

      {/* Interactive Client Calculator Component */}
      <AreaCalculator />
    </div>
  );
}
