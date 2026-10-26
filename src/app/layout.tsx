import type { Metadata, Viewport } from 'next';
import './globals.css';
import { siteConfig } from '@/config/site';
import { generateOrganizationSchema } from '@/lib/seo/schema';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0A1E42',
};

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
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | Real Estate Advisory`,
    description: siteConfig.description,
    images: ['/HomaceLogo.png'],
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
      <body className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900 w-full max-w-full overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
