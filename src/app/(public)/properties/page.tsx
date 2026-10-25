import React from 'react';
import { Metadata } from 'next';
import { searchPublishedProperties, PropertyFilterParams } from '@/lib/propertyService';
import { searchFilterSchema } from '@/lib/validations/searchFilters';
import PropertyCard from '@/components/public/PropertyCard';
import PropertyCatalogFilter from '@/components/public/PropertyCatalogFilter';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import { siteConfig } from '@/config/site';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Building2, ShieldCheck, MapPin } from 'lucide-react';

export const revalidate = 60;

interface PropertiesPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export async function generateMetadata({ searchParams }: PropertiesPageProps): Promise<Metadata> {
  const purpose = typeof searchParams.purpose === 'string' ? searchParams.purpose : undefined;
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const location = typeof searchParams.location === 'string' ? searchParams.location : undefined;

  const titleSegments: string[] = [];
  if (category) {
    titleSegments.push(category.replace('_', ' '));
  } else {
    titleSegments.push('Properties');
  }

  if (purpose) {
    titleSegments.push(`for ${purpose === 'sale' ? 'Sale' : 'Rent'}`);
  }

  if (location) {
    titleSegments.push(`in ${location}`);
  } else {
    titleSegments.push('in Bahria Town & DHA Islamabad');
  }

  const generatedTitle = `${titleSegments.join(' ')} | ${siteConfig.name}`;
  const generatedDesc = `Explore authenticated ${titleSegments.join(' ').toLowerCase()} with developer-verified land titles and transparent 225 sq ft Marla standards.`;

  return {
    title: generatedTitle,
    description: generatedDesc,
    alternates: {
      canonical: `${siteConfig.url}/properties`,
    },
    openGraph: {
      title: generatedTitle,
      description: generatedDesc,
      url: `${siteConfig.url}/properties`,
      siteName: siteConfig.name,
      type: 'website',
      images: [
        {
          url: `${siteConfig.url}/HomaceLogo.png`,
          width: 738,
          height: 396,
          alt: 'Homace Property Catalogue',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: generatedTitle,
      description: generatedDesc,
      images: [`${siteConfig.url}/HomaceLogo.png`],
    },
  };
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  // Flatten string arrays from Next.js query parameters
  const rawParams: Record<string, string> = {};
  Object.entries(searchParams).forEach(([k, v]) => {
    if (typeof v === 'string') rawParams[k] = v;
    else if (Array.isArray(v) && v[0]) rawParams[k] = v[0];
  });

  // Server-side filter validation
  const validationResult = searchFilterSchema.safeParse(rawParams);
  const validatedFilters: PropertyFilterParams = validationResult.success
    ? (validationResult.data as PropertyFilterParams)
    : {};

  // Execute database search with applied filters and pagination
  const { properties, total, totalPages, currentPage, limit } =
    await searchPublishedProperties(validatedFilters);

  const startRecord = total > 0 ? (currentPage - 1) * limit + 1 : 0;
  const endRecord = Math.min(currentPage * limit, total);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Properties', url: `${siteConfig.url}/properties` },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Breadcrumbs items={[{ label: 'Property Catalogue' }]} />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-copper uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Authenticated Inventory Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
            Property Directory & Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate-500 mt-1 max-w-2xl">
            Search genuine residential plots, luxury villas, commercial avenues, and files across Bahria Town, DHA, and Islamabad.
          </p>
        </div>

        {/* Local Standard Assurance Pill */}
        <div className="hidden lg:flex items-center gap-2 bg-brand-slate-50 border border-brand-slate-200 px-3.5 py-2 rounded-xl text-xs text-brand-slate-600">
          <MapPin className="w-4 h-4 text-brand-copper shrink-0" />
          <span>Bahria / DHA Standard: <strong>1 Marla = 225 Sq. Ft.</strong></span>
        </div>
      </div>

      {/* Robust Search & Filter Interface */}
      <PropertyCatalogFilter
        initialValues={rawParams}
        totalResults={total}
      />

      {/* Results Header / Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <p className="text-xs sm:text-sm text-brand-slate-600 font-medium">
          {total > 0 ? (
            <>
              Showing <span className="font-bold text-brand-navy">{startRecord}–{endRecord}</span> of{' '}
              <span className="font-bold text-brand-navy">{total}</span> verified listing{total === 1 ? '' : 's'}
              {totalPages > 1 && (
                <span className="text-brand-slate-400 ml-1.5 font-normal">
                  (Page {currentPage} of {totalPages})
                </span>
              )}
            </>
          ) : (
            <span>No listings match the selected search criteria</span>
          )}
        </p>
      </div>

      {/* Property Cards Grid */}
      {properties.length > 0 ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* Accessible Synced Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      ) : (
        <EmptyState
          title="No Properties Match Your Search Filter"
          description="We could not find any published listings matching your specific combination of filters. Try widening your price range, choosing 'Any Status', or clearing specific criteria."
          icon={Building2}
          actionLabel="Clear All Filters"
          actionHref="/properties"
        />
      )}
    </div>
  );
}
