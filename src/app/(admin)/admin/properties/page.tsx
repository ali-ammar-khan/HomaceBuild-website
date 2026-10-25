import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Property } from '@/types/database';
import { formatArea, formatPKR } from '@/config/measurements';
import { deleteProperty } from '@/actions/properties';
import {
  Building,
  PlusCircle,
  ExternalLink,
  Trash2,
  Edit3,
  CheckCircle,
  EyeOff,
} from 'lucide-react';

export default async function AdminPropertiesPage() {
  const supabase = createClient();

  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  const listings: Property[] = properties || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Property Listings Portfolio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage, publish, update, and review residential plots, houses, and commercial assets.
          </p>
        </div>

        <Link
          href="/admin/properties/new"
          className="inline-flex items-center gap-2 bg-brand-navy hover:bg-brand-navyLight text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-brand-gold" />
          <span>Add New Property</span>
        </Link>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Ref #</th>
                <th className="py-3.5 px-4">Title & Location</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Area</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {listings.length > 0 ? (
                listings.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                      #{prop.reference_code}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-semibold text-slate-900 block truncate">
                        {prop.title}
                      </span>
                      <span className="text-[11px] text-slate-400 block truncate">
                        {[prop.sector_block, prop.area_location, prop.city].filter(Boolean).join(', ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 capitalize">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                        {prop.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {formatArea(prop.area_value, prop.area_unit)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {formatPKR(prop.price_pkr, prop.is_price_on_call)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          prop.publication_status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {prop.publication_status === 'published' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                        {prop.publication_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {prop.publication_status === 'published' && (
                          <Link
                            href={`/properties/${prop.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded transition-colors"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}

                        <form
                          action={async () => {
                            'use server';
                            await deleteProperty(prop.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
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
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                    No properties in portfolio yet. Click &ldquo;Add New Property&rdquo; to publish your first verified listing.
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
