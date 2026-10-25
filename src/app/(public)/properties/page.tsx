import React from 'react';
import { Metadata } from 'next';
import { getPublishedProperties } from '@/lib/propertyService';
import { Property } from '@/types/database';
import PropertyCard from '@/components/public/PropertyCard';
import SearchFilterBar from '@/components/public/SearchFilterBar';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import { siteConfig } from '@/config/site';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import { Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Properties for Sale & Rent in Islamabad & Bahria Town',
  description: 'Search verified residential plots, houses, apartments, and commercial properties across Bahria Town and DHA Islamabad with transparent 225 sq ft Marla calculations.',
  alternates: {
    canonical: `${siteConfig.url}/properties`,
  },
};

export const revalidate = 60;

interface PropertiesPageProps {
  searchParams: {
    purpose?: string;
    category?: string;
    location?: string;
    plot_status?: string;
    sort?: string;
  };
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const listings = await getPublishedProperties(searchParams);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Properties', url: `${siteConfig.url}/properties` },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Breadcrumbs items={[{ label: 'Property Catalogue' }]} />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
          Property Directory
        </h1>
        <p className="text-xs sm:text-sm text-brand-slate-500 mt-1">
          Explore genuine residential and commercial opportunities across Bahria Town, DHA, and Islamabad.
        </p>
      </div>

      {/* Filter Component */}
      <SearchFilterBar
        initialPurpose={searchParams.purpose}
        initialCategory={searchParams.category}
        initialLocation={searchParams.location}
      />

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-brand-slate-200">
        <p className="text-xs sm:text-sm text-brand-slate-600 font-medium">
          Showing <span className="font-bold text-brand-navy">{listings.length}</span> verified listing{listings.length === 1 ? '' : 's'}
        </p>
      </div>

      {/* Properties Grid */}
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-brand-slate-200 p-12 text-center max-w-lg mx-auto">
          <Building2 className="w-12 h-12 text-brand-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-brand-slate-800">
            No Listings Found Matching Criteria
          </h3>
          <p className="text-xs text-brand-slate-500 mt-1">
            Try adjusting your location or category filters, or contact our advisory desk directly to source specific off-market opportunities.
          </p>
        </div>
      )}
    </div>
  );
}
