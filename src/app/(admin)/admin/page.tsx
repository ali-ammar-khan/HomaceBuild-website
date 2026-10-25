import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
  Building,
  Inbox,
  FileEdit,
  Clock,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default async function AdminDashboardOverview() {
  const supabase = createClient();

  // Fetch counts
  const { count: publishedCount } = await supabase
    .from('properties')
    .select('id', { count: 'exact', head: true })
    .eq('publication_status', 'published');

  const { count: draftCount } = await supabase
    .from('properties')
    .select('id', { count: 'exact', head: true })
    .eq('publication_status', 'draft');

  const { count: newInquiriesCount } = await supabase
    .from('inquiries')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'new');

  const { count: totalInquiriesCount } = await supabase
    .from('inquiries')
    .select('id', { count: 'exact', head: true });

  // Fetch recent inquiries
  const { data: recentInquiries } = await supabase
    .from('inquiries')
    .select('*, properties(title, reference_code)')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Administrative Command
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Overview of active listings, pending files, and buyer/investor leads.
          </p>
        </div>

        <Link
          href="/admin/properties/new"
          className="inline-flex items-center gap-2 bg-brand-navy hover:bg-brand-navyLight text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-brand-gold" />
          <span>Post New Property Listing</span>
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Published Listings
            </span>
            <Building className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold text-slate-900 mt-2 block">
            {publishedCount || 0}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Active on public catalog
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Draft Properties
            </span>
            <FileEdit className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-slate-900 mt-2 block">
            {draftCount || 0}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Under preparation or review
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              New Inquiries
            </span>
            <Clock className="w-4 h-4 text-brand-gold" />
          </div>
          <span className="text-2xl font-bold text-brand-navy mt-2 block">
            {newInquiriesCount || 0}
          </span>
          <span className="text-[11px] text-brand-gold font-medium mt-0.5 block">
            Awaiting response
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Inquiries
            </span>
            <Inbox className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-2xl font-bold text-slate-900 mt-2 block">
            {totalInquiriesCount || 0}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            All-time captured leads
          </span>
        </div>
      </div>

      {/* Recent Leads Preview Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Recent Lead Inquiries
            </h3>
            <p className="text-[11px] text-slate-500">
              Direct form submissions from property pages and contact channels.
            </p>
          </div>
          <Link
            href="/admin/inquiries"
            className="text-xs font-semibold text-brand-navy hover:text-brand-gold flex items-center gap-1 transition-colors"
          >
            <span>View All Leads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {recentInquiries && recentInquiries.length > 0 ? (
            recentInquiries.map((inquiry: any) => (
              <div key={inquiry.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50 transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{inquiry.customer_name}</span>
                    <span className="font-mono text-slate-500">{inquiry.phone}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      inquiry.status === 'new' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-1 italic">
                    "{inquiry.message}"
                  </p>
                  {inquiry.properties && (
                    <p className="text-slate-400 text-[11px]">
                      Regarding: <span className="font-medium text-slate-700">{inquiry.properties.title}</span> (#{inquiry.properties.reference_code})
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400 block">
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </span>
                  <a
                    href={`https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 font-semibold hover:underline mt-0.5 inline-block"
                  >
                    Reply on WhatsApp →
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              No inquiries received yet. When visitors submit the inquiry form, leads appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
