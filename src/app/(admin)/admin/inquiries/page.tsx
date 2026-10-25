import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  Inbox,
  MessageSquare,
  Phone,
  Mail,
  Building,
} from 'lucide-react';

export default async function AdminInquiriesPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured =
    supabaseUrl &&
    !supabaseUrl.includes('placeholder') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let leadList: any[] = [];

  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      const { data: inquiries } = await supabase
        .from('inquiries')
        .select('*, properties(title, reference_code, slug)')
        .order('created_at', { ascending: false });

      leadList = inquiries || [];
    } catch (err) {
      console.error('Error fetching admin inquiries:', err);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Client Leads &amp; Property Inquiries
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Direct inquiries captured from website visitors. Role-based access enforced.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100">
          {leadList.length > 0 ? (
            leadList.map((lead) => {
              const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
              const whatsappReplyUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                `Hello ${lead.customer_name}, thank you for contacting HomaceBuild and Realators regarding your real estate inquiry.`
              )}`;

              return (
                <div key={lead.id} className="p-6 hover:bg-slate-50 transition-colors space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-bold text-slate-900 text-sm">
                        {lead.customer_name}
                      </span>
                      <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {lead.phone}
                      </span>
                      {lead.email && (
                        <span className="text-xs text-slate-500">
                          {lead.email}
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          lead.status === 'new'
                            ? 'bg-amber-100 text-amber-800'
                            : lead.status === 'contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : lead.status === 'qualified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={whatsappReplyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply on WhatsApp</span>
                      </a>

                      <form
                        action={async (formData) => {
                          'use server';
                          const newStatus = formData.get('status') as string;
                          const sb = createClient();
                          await sb
                            .from('inquiries')
                            .update({ status: newStatus })
                            .eq('id', lead.id);
                          revalidatePath('/admin/inquiries');
                        }}
                      >
                        <select
                          name="status"
                          defaultValue={lead.status}
                          onChange={(e) => e.target.form?.requestSubmit()}
                          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none"
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
                    <p className="font-semibold text-slate-900 mb-1">Inquiry Message:</p>
                    <p className="whitespace-pre-line">{lead.message}</p>
                  </div>

                  {/* Property Reference Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-2">
                    {lead.properties ? (
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-brand-copper" />
                        <span>Associated Property:</span>
                        <span className="font-semibold text-slate-700">
                          {lead.properties.title} (#{lead.properties.reference_code})
                        </span>
                      </div>
                    ) : (
                      <span>General Advisory Submission (Not tied to specific property)</span>
                    )}

                    <span>Received: {new Date(lead.created_at).toLocaleString()}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">
              <Inbox className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              No customer inquiries recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
