import React from 'react';
import { Metadata } from 'next';
import { getPublishedProperties } from '@/lib/propertyService';
import PropertyCard from '@/components/public/PropertyCard';
import SearchFilterBar from '@/components/public/SearchFilterBar';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import { siteConfig } from '@/config/site';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
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
    page?: string;
  };
}

const ITEMS_PER_PAGE = 9;

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const listings = await getPublishedProperties(searchParams);

  const currentPage = Math.max(1, parseInt(searchParams.page || '1', 10) || 1);
  const totalItems = listings.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedListings = listings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
          Showing <span className="font-bold text-brand-navy">{totalItems}</span> verified listing{totalItems === 1 ? '' : 's'}
          {totalItems > ITEMS_PER_PAGE && (
            <span className="text-brand-slate-400 ml-1">
              (Page {currentPage} of {totalPages})
            </span>
          )}
        </p>
      </div>

      {/* Properties Grid */}
      {paginatedListings.length > 0 ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedListings.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* Accessible Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      ) : (
        <EmptyState
          title="No Listings Found Matching Criteria"
          description="Try adjusting your location or category filters, or contact our advisory desk directly to source specific off-market opportunities."
          icon={Building2}
          actionLabel="Clear All Filters"
          actionHref="/properties"
        />
      )}
    </div>
  );
}
