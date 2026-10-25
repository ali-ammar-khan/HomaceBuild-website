import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '@/config/site';
import { generateOrganizationSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Real Estate Advisory Islamabad & Rawalpindi`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'Real Estate Islamabad',
    'Bahria Town Rawalpindi',
    'DHA Islamabad',
    'Plots in Islamabad',
    'Houses for sale in Bahria Town',
    'Commercial Plots Islamabad',
    'HomaceBuild and Realators',
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    title: `${siteConfig.name} | Real Estate Advisory`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: '/HomaceLogo.png',
        width: 800,
        height: 600,
        alt: siteConfig.name,
      },
    ],
    locale: 'en_PK',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = generateOrganizationSchema();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
