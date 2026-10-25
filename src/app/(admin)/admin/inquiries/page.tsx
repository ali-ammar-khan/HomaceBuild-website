import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { updateInquiryStatus } from '@/actions/inquiries';
import {
  Inbox,
  MessageSquare,
  Phone,
  Mail,
  Building,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface AdminInquiriesPageProps {
  searchParams?: {
    status?: string;
  };
}

export default async function AdminInquiriesPage({ searchParams }: AdminInquiriesPageProps) {
  const selectedStatus = searchParams?.status || 'all';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured =
    supabaseUrl &&
    !supabaseUrl.includes('placeholder') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let leadList: any[] = [];

  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      let query = supabase
        .from('inquiries')
        .select('*, properties(id, title, reference_code, slug, area_location)')
        .order('created_at', { ascending: false });

      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus);
      }

      const { data: inquiries } = await query;
      leadList = inquiries || [];
    } catch (err) {
      console.error('Error fetching admin inquiries:', err);
    }
  }

  // Count inquiries by status
  const totalCount = leadList.length;
  const newCount = leadList.filter((l) => l.status === 'new').length;
  const contactedCount = leadList.filter((l) => l.status === 'contacted').length;
  const qualifiedCount = leadList.filter((l) => l.status === 'qualified').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Client Inquiries &amp; Lead Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Private inbox of buyer and tenant leads captured from property pages and general contact forms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">New Leads:</span>
          <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full text-xs">
            {newCount} pending
          </span>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-2.5 rounded-2xl border border-slate-200 text-xs shadow-xs">
        <Link
          href="/admin/inquiries?status=all"
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            selectedStatus === 'all'
              ? 'bg-brand-navy text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Leads ({totalCount})
        </Link>
        <Link
          href="/admin/inquiries?status=new"
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            selectedStatus === 'new'
              ? 'bg-amber-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          New ({newCount})
        </Link>
        <Link
          href="/admin/inquiries?status=contacted"
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            selectedStatus === 'contacted'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Contacted ({contactedCount})
        </Link>
        <Link
          href="/admin/inquiries?status=qualified"
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            selectedStatus === 'qualified'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Qualified ({qualifiedCount})
        </Link>
        <Link
          href="/admin/inquiries?status=closed"
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            selectedStatus === 'closed'
              ? 'bg-slate-700 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Closed
        </Link>
      </div>

      {/* Leads List Container */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100">
          {leadList.length > 0 ? (
            leadList.map((lead) => {
              const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
              const propertyContext = lead.properties
                ? ` regarding "${lead.properties.title}" (Ref #${lead.properties.reference_code})`
                : '';
              const whatsappReplyUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                `Hello ${lead.customer_name}, thank you for contacting HomaceBuild and Realators${propertyContext}. How can our advisory desk assist you today?`
              )}`;

              return (
                <div key={lead.id} className="p-6 hover:bg-slate-50/80 transition-colors space-y-4">
                  {/* Top Row: Customer Info & Status Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-bold text-slate-900 text-sm">
                        {lead.customer_name}
                      </span>
                      <a
                        href={`tel:${lead.phone}`}
                        className="font-mono text-xs text-slate-700 hover:text-brand-azure bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1"
                        title="Click to Call"
                      >
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{lead.phone}</span>
                      </a>
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                          title="Click to Email"
                        >
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{lead.email}</span>
                        </a>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          lead.status === 'new'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : lead.status === 'contacted'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : lead.status === 'qualified'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : lead.status === 'closed'
                            ? 'bg-slate-100 text-slate-600 border border-slate-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>

                    {/* Quick WhatsApp & Status Select */}
                    <div className="flex items-center gap-2">
                      <a
                        href={whatsappReplyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-xs active:scale-95"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply on WhatsApp</span>
                      </a>

                      {/* Status Dropdown Server Action */}
                      <form
                        action={async (formData) => {
                          'use server';
                          const newStatus = formData.get('status') as string;
                          await updateInquiryStatus(lead.id, newStatus);
                        }}
                      >
                        <select
                          name="status"
                          defaultValue={lead.status}
                          onChange={(e) => e.target.form?.requestSubmit()}
                          className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-azure cursor-pointer"
                        >
                          <option value="new">Mark: New</option>
                          <option value="contacted">Mark: Contacted</option>
                          <option value="qualified">Mark: Qualified</option>
                          <option value="closed">Mark: Closed</option>
                          <option value="spam">Mark: Spam</option>
                        </select>
                      </form>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <p className="font-semibold text-slate-900 mb-1">Customer Inquiry Message:</p>
                    <p className="whitespace-pre-line">{lead.message}</p>
                  </div>

                  {/* Associated Property Context Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-2 pt-1 border-t border-slate-100">
                    {lead.properties ? (
                      <div className="flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-brand-copper" />
                        <span>Associated Listing:</span>
                        <Link
                          href={`/admin/properties/${lead.properties.id}`}
                          className="font-bold text-slate-800 hover:text-brand-azure"
                        >
                          {lead.properties.title} (#{lead.properties.reference_code})
                        </Link>
                        {lead.properties.slug && (
                          <Link
                            href={`/properties/${lead.properties.slug}`}
                            target="_blank"
                            className="text-slate-400 hover:text-brand-azure"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    ) : (
                      <span>General Advisory Submission (Website Contact Form)</span>
                    )}

                    <span>Received: {new Date(lead.created_at).toLocaleString()}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-16 text-center space-y-3">
              <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No leads in this view</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Customer inquiries submitted via property pages or the contact desk will appear here with instant WhatsApp reply actions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
