import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { initialSampleProperties } from '@/data/initialProperties';
import {
  Building,
  Inbox,
  FileEdit,
  Clock,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  Archive,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

export default async function AdminDashboardOverview() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured =
    supabaseUrl &&
    !supabaseUrl.includes('placeholder') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let publishedCount = 0;
  let draftCount = 0;
  let archivedCount = 0;
  let totalPropertiesCount = 0;
  let newInquiriesCount = 0;
  let totalInquiriesCount = 0;
  let recentInquiries: any[] = [];

  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();

      const [pubRes, draftRes, archRes, totalPropRes, newInqRes, totalInqRes, recentInqRes] =
        await Promise.all([
          supabase.from('properties').select('id', { count: 'exact', head: true }).eq('publication_status', 'published'),
          supabase.from('properties').select('id', { count: 'exact', head: true }).eq('publication_status', 'draft'),
          supabase.from('properties').select('id', { count: 'exact', head: true }).eq('publication_status', 'archived'),
          supabase.from('properties').select('id', { count: 'exact', head: true }),
          supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
          supabase.from('inquiries').select('id', { count: 'exact', head: true }),
          supabase
            .from('inquiries')
            .select('*, properties(title, reference_code)')
            .order('created_at', { ascending: false })
            .limit(5),
        ]);

      publishedCount = pubRes.count || 0;
      draftCount = draftRes.count || 0;
      archivedCount = archRes.count || 0;
      totalPropertiesCount = totalPropRes.count || 0;
      newInquiriesCount = newInqRes.count || 0;
      totalInquiriesCount = totalInqRes.count || 0;
      recentInquiries = recentInqRes.data || [];
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
    }
  } else {
    // Local dev mock calculations
    publishedCount = initialSampleProperties.filter((p) => p.publication_status === 'published').length;
    draftCount = initialSampleProperties.filter((p) => p.publication_status === 'draft').length;
    archivedCount = initialSampleProperties.filter((p) => p.publication_status === 'archived').length;
    totalPropertiesCount = initialSampleProperties.length;
  }

  return (
    <div className="space-y-8">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-copper uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Administrative Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Portfolio &amp; Operational Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time control desk for HomaceBuild listings, inquiry routing, and asset status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 bg-brand-navy hover:bg-brand-navy-light text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-colors active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-brand-copper" />
            <span>Post New Listing</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Published */}
        <Link
          href="/admin/properties?status=published"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Published Listings
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-slate-900 mt-2 block">
            {publishedCount}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1 group-hover:underline">
            <span>View active catalogue</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        {/* Drafts */}
        <Link
          href="/admin/properties?status=draft"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Draft Properties
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileEdit className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-slate-900 mt-2 block">
            {draftCount}
          </span>
          <span className="text-[11px] text-amber-700 font-semibold mt-1 flex items-center gap-1 group-hover:underline">
            <span>Pending preparation</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        {/* New Leads */}
        <Link
          href="/admin/inquiries?status=new"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-brand-copper transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              New Inquiries
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-copper/10 text-brand-copper flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-brand-navy mt-2 block">
            {newInquiriesCount}
          </span>
          <span className="text-[11px] text-brand-copper font-bold mt-1 flex items-center gap-1 group-hover:underline">
            <span>Action required</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        {/* Total Inquiries */}
        <Link
          href="/admin/inquiries"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Inquiries
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-slate-900 mt-2 block">
            {totalInquiriesCount}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:underline">
            <span>All recorded leads</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
      </div>

      {/* Operational Shortcuts Bar */}
      <div className="bg-brand-navy-dark text-white rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-brand-copper uppercase tracking-wider">
            Listing Quick Controls
          </h3>
          <p className="text-xs text-slate-300">
            Total inventory under management: <strong>{totalPropertiesCount} properties</strong> ({publishedCount} published, {draftCount} drafts, {archivedCount} archived).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/properties"
            className="text-xs bg-slate-800 hover:bg-slate-700 text-white font-semibold px-3.5 py-2 rounded-xl transition-colors"
          >
            Manage All Properties
          </Link>
          <Link
            href="/admin/inquiries"
            className="text-xs bg-slate-800 hover:bg-slate-700 text-white font-semibold px-3.5 py-2 rounded-xl transition-colors"
          >
            Open Lead Inbox
          </Link>
          <Link
            href="/tools/area-calculator"
            target="_blank"
            className="text-xs bg-brand-copper/20 hover:bg-brand-copper/30 text-brand-copper font-semibold px-3.5 py-2 rounded-xl transition-colors"
          >
            Area Calculator
          </Link>
        </div>
      </div>

      {/* Recent Leads Preview Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Recent Lead Inquiries
            </h3>
            <p className="text-[11px] text-slate-500">
              Direct form submissions captured from website property pages and contact channels.
            </p>
          </div>
          <Link
            href="/admin/inquiries"
            className="text-xs font-bold text-brand-azure hover:text-brand-navy flex items-center gap-1 transition-colors"
          >
            <span>View All Leads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {recentInquiries.length > 0 ? (
            recentInquiries.map((inquiry: any) => {
              const cleanPhone = inquiry.phone ? inquiry.phone.replace(/[^0-9]/g, '') : '';
              const whatsappReplyUrl = cleanPhone
                ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Hello ${inquiry.customer_name}, thank you for contacting HomaceBuild and Realators.`
                  )}`
                : null;

              return (
                <div
                  key={inquiry.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:bg-slate-50/80 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{inquiry.customer_name}</span>
                      <span className="font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {inquiry.phone}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          inquiry.status === 'new'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {inquiry.status}
                      </span>
                    </div>

                    <p className="text-slate-600 line-clamp-1 italic">
                      &ldquo;{inquiry.message}&rdquo;
                    </p>

                    {inquiry.properties && (
                      <p className="text-slate-400 text-[11px]">
                        Regarding listing: <span className="font-semibold text-slate-700">{inquiry.properties.title}</span> (#{inquiry.properties.reference_code})
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-slate-400">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </span>

                    {whatsappReplyUrl && (
                      <a
                        href={whatsappReplyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply on WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">
              No inquiries in inbox yet. Customer form submissions will appear here automatically.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
