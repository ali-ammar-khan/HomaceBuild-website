import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { initialSampleProperties } from '@/data/initialProperties';
import { Property } from '@/types/database';
import { formatArea, formatPKR } from '@/config/measurements';
import { deleteProperty, setPublicationStatus, setAvailabilityStatus } from '@/actions/properties';
import {
  Building,
  PlusCircle,
  ExternalLink,
  Trash2,
  Edit3,
  CheckCircle,
  EyeOff,
  Archive,
  Search,
  Filter,
} from 'lucide-react';

interface AdminPropertiesPageProps {
  searchParams?: {
    status?: string;
    q?: string;
  };
}

export default async function AdminPropertiesPage({ searchParams }: AdminPropertiesPageProps) {
  const selectedStatus = searchParams?.status || 'all';
  const query = searchParams?.q?.toLowerCase() || '';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured =
    supabaseUrl &&
    !supabaseUrl.includes('placeholder') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let allProperties: Property[] = [];

  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      let queryBuilder = supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedStatus !== 'all') {
        queryBuilder = queryBuilder.eq('publication_status', selectedStatus);
      }

      const { data } = await queryBuilder;
      allProperties = data || [];
    } catch (err) {
      console.error('Error fetching admin properties:', err);
      allProperties = initialSampleProperties;
    }
  } else {
    allProperties = initialSampleProperties;
    if (selectedStatus !== 'all') {
      allProperties = allProperties.filter((p) => p.publication_status === selectedStatus);
    }
  }

  // Filter by search query if provided
  if (query) {
    allProperties = allProperties.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.reference_code.toLowerCase().includes(query) ||
        p.area_location.toLowerCase().includes(query)
    );
  }

  // Calculate totals
  const totalCount = allProperties.length;
  const publishedCount = allProperties.filter((p) => p.publication_status === 'published').length;
  const draftCount = allProperties.filter((p) => p.publication_status === 'draft').length;
  const archivedCount = allProperties.filter((p) => p.publication_status === 'archived').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Property Listings Portfolio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage, publish, update, and review residential plots, luxury villas, and commercial assets.
          </p>
        </div>

        <Link
          href="/admin/properties/new"
          className="inline-flex items-center gap-2 bg-brand-navy hover:bg-brand-navy-light text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-colors active:scale-95"
        >
          <PlusCircle className="w-4 h-4 text-brand-copper" />
          <span>Add New Property</span>
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <Link
            href="/admin/properties?status=all"
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedStatus === 'all'
                ? 'bg-brand-navy text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Listings ({totalCount})
          </Link>
          <Link
            href="/admin/properties?status=published"
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedStatus === 'published'
                ? 'bg-emerald-700 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Published ({publishedCount})
          </Link>
          <Link
            href="/admin/properties?status=draft"
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedStatus === 'draft'
                ? 'bg-amber-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Drafts ({draftCount})
          </Link>
          <Link
            href="/admin/properties?status=archived"
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedStatus === 'archived'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Archived ({archivedCount})
          </Link>
        </div>

        {/* Search Input Form */}
        <form method="GET" className="relative flex items-center">
          <input type="hidden" name="status" value={selectedStatus} />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search ref #, title, location..."
            className="w-full sm:w-64 pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-azure"
          />
        </form>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Ref #</th>
                <th className="py-3.5 px-4">Title &amp; Location</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Area</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Transaction</th>
                <th className="py-3.5 px-4">Publication</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allProperties.length > 0 ? (
                allProperties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      #{prop.reference_code}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <Link
                        href={`/admin/properties/${prop.id}`}
                        className="font-bold text-slate-900 hover:text-brand-azure block truncate"
                        title={prop.title}
                      >
                        {prop.title}
                      </Link>
                      <span className="text-[11px] text-slate-400 block truncate">
                        {[prop.sector_block, prop.area_location, prop.city]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 capitalize">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                        {prop.category.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {formatArea(prop.area_value, prop.area_unit)}
                      <span className="text-[10px] text-slate-400 block">
                        {prop.marla_sqft_standard} sq ft/M
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {formatPKR(prop.price_pkr, prop.is_price_on_call)}
                    </td>

                    {/* Transaction / Availability Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          prop.availability_status === 'available'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : prop.availability_status === 'under_offer'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {prop.availability_status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Publication Status with Fast Toggle */}
                    <td className="py-3.5 px-4">
                      <form
                        action={async (formData) => {
                          'use server';
                          const nextStatus = formData.get('pub_status') as any;
                          await setPublicationStatus(prop.id, nextStatus);
                        }}
                      >
                        <select
                          name="pub_status"
                          defaultValue={prop.publication_status}
                          onChange={(e) => e.target.form?.requestSubmit()}
                          className={`text-[11px] font-bold uppercase rounded-lg px-2 py-1 border focus:outline-none cursor-pointer ${
                            prop.publication_status === 'published'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : prop.publication_status === 'archived'
                              ? 'bg-slate-100 text-slate-600 border-slate-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      </form>
                    </td>

                    {/* Actions Column */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Button */}
                        <Link
                          href={`/admin/properties/${prop.id}`}
                          className="p-1.5 text-slate-600 hover:text-brand-navy hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Listing Specifications"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>

                        {/* View Public Button (if published) */}
                        {prop.publication_status === 'published' && (
                          <Link
                            href={`/properties/${prop.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-brand-azure hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Live Listing on Website"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}

                        {/* Delete Button */}
                        <form
                          action={async () => {
                            'use server';
                            await deleteProperty(prop.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No properties match the selected criteria.{' '}
                    <Link
                      href="/admin/properties/new"
                      className="text-brand-azure font-semibold hover:underline"
                    >
                      Post a new listing →
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
