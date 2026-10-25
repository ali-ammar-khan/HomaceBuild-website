'use client';

import React, { useState } from 'react';
import { submitInquiry, ActionResponse } from '@/actions/inquiries';
import { Send, CheckCircle2, AlertCircle, MessageSquare, ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface InquiryFormProps {
  propertyId?: string;
  propertyTitle?: string;
  referenceCode?: string;
}

export default function InquiryForm({
  propertyId,
  propertyTitle,
  referenceCode,
}: InquiryFormProps) {
  const [status, setStatus] = useState<ActionResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const result = await submitInquiry(null, formData);

    setStatus(result);
    setSubmitting(false);

    if (result.success) {
      (e.target as HTMLFormElement).reset();
    }
  };

  const whatsappMessage = propertyTitle
    ? `Hello HomaceBuild & Realators, I am inquiring regarding "${propertyTitle}" (Ref: ${referenceCode || 'N/A'}).`
    : `Hello HomaceBuild & Realators, I would like to inquire about your property advisory services.`;

  const whatsappUrl = siteConfig.contact.whatsapp
    ? `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`
    : null;

  return (
    <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-copper mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Direct Advisory Desk</span>
        </div>
        <h3 className="text-xl font-bold text-brand-navy">
          {propertyTitle ? 'Inquire About This Property' : 'Property Consultation Request'}
        </h3>
        <p className="text-xs text-brand-slate-500 mt-1">
          {propertyTitle
            ? `Reference: #${referenceCode} • Verified consultation for acquisition and title transfer.`
            : 'Submit your requirements for residential plots, commercial properties, or investment opportunities.'}
        </p>
      </div>

      {status?.success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-emerald-800 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Inquiry Safely Received</p>
            <p className="text-xs text-emerald-700 mt-0.5">{status.message}</p>
          </div>
        </div>
      )}

      {status && !status.success && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to Submit</p>
            <p className="text-xs text-rose-700 mt-0.5">{status.message}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {propertyId && <input type="hidden" name="property_id" value={propertyId} />}

        {/* Honeypot field (hidden from genuine users) */}
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            name="company_fax"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-slate-700 uppercase tracking-wider mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="customer_name"
            required
            placeholder="e.g. Muhammad Ali"
            className="w-full px-3.5 py-2.5 bg-brand-slate-50 border border-brand-slate-200 rounded-lg text-sm text-brand-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40 focus:border-brand-azure"
          />
          {status?.errors?.customer_name && (
            <p className="text-xs text-rose-600 mt-1">{status.errors.customer_name[0]}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brand-slate-700 uppercase tracking-wider mb-1.5">
              Phone / Mobile <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="0300 1234567"
              className="w-full px-3.5 py-2.5 bg-brand-slate-50 border border-brand-slate-200 rounded-lg text-sm text-brand-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40 focus:border-brand-azure"
            />
            {status?.errors?.phone && (
              <p className="text-xs text-rose-600 mt-1">{status.errors.phone[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-slate-700 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-brand-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 bg-brand-slate-50 border border-brand-slate-200 rounded-lg text-sm text-brand-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40 focus:border-brand-azure"
            />
            {status?.errors?.email && (
              <p className="text-xs text-rose-600 mt-1">{status.errors.email[0]}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-slate-700 uppercase tracking-wider mb-1.5">
            Your Requirement / Message <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="message"
            required
            rows={4}
            placeholder={
              propertyTitle
                ? `I would like to inquire about availability and pricing for this property...`
                : `Specify plot size (e.g. 10 Marla in Bahria Town Phase 8 or DHA Phase 2), budget, or commercial requirements...`
            }
            className="w-full px-3.5 py-2.5 bg-brand-slate-50 border border-brand-slate-200 rounded-lg text-sm text-brand-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40 focus:border-brand-azure"
          />
          {status?.errors?.message && (
            <p className="text-xs text-rose-600 mt-1">{status.errors.message[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-brand-copper hover:bg-brand-copper-hover disabled:opacity-50 text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          {submitting ? (
            <span>Transmitting Inquiry...</span>
          ) : (
            <>
              <Send className="w-4 h-4 text-white" />
              <span>Submit Secure Inquiry</span>
            </>
          )}
        </button>

        {whatsappUrl && (
          <div className="pt-3 border-t border-brand-slate-100 text-center">
            <span className="text-xs text-brand-slate-500 block mb-2">Need an instant response?</span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Connect Directly on WhatsApp</span>
            </a>
          </div>
        )}
      </form>
    </div>
  );
}
