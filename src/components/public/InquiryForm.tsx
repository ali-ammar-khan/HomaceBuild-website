'use client';

import React, { useState } from 'react';
import { submitInquiry, ActionResponse } from '@/actions/inquiries';
import { Send, ShieldCheck, User, Phone, Mail } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Notification } from '@/components/ui/Notification';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

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

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const result = await submitInquiry(null, formData);

    setStatus(result);
    setSubmitting(false);

    if (result.success) {
      formElement.reset();
    }
  };

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
        <div className="mb-6">
          <Notification
            variant="success"
            title="Inquiry Safely Received"
            message={status.message}
            onDismiss={() => setStatus(null)}
          />
        </div>
      )}

      {status && !status.success && (
        <div className="mb-6">
          <Notification
            variant="error"
            title="Unable to Submit"
            message={status.message}
            onDismiss={() => setStatus(null)}
          />
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

        <Input
          label="Full Name"
          name="customer_name"
          required
          placeholder="e.g. Muhammad Ali"
          error={status?.errors?.customer_name?.[0]}
          leftIcon={<User className="w-4 h-4 text-brand-slate-400" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone / Mobile"
            type="tel"
            name="phone"
            required
            placeholder="0300 1234567"
            error={status?.errors?.phone?.[0]}
            leftIcon={<Phone className="w-4 h-4 text-brand-slate-400" />}
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="name@example.com"
            helperText="Optional"
            error={status?.errors?.email?.[0]}
            leftIcon={<Mail className="w-4 h-4 text-brand-slate-400" />}
          />
        </div>

        <Textarea
          label="Your Requirement / Message"
          name="message"
          required
          rows={4}
          placeholder={
            propertyTitle
              ? `I would like to inquire about availability and pricing for this property...`
              : `Specify plot size (e.g. 10 Marla in Bahria Town Phase 8 or DHA Phase 2), budget, or commercial requirements...`
          }
          error={status?.errors?.message?.[0]}
        />

        <Button
          type="submit"
          variant="accent"
          size="lg"
          isLoading={submitting}
          className="w-full shadow-sm"
          leftIcon={<Send className="w-4 h-4" />}
        >
          {submitting ? 'Transmitting Inquiry...' : 'Submit Secure Inquiry'}
        </Button>

        {siteConfig.contact.whatsapp && (
          <div className="pt-3 border-t border-brand-slate-100 text-center">
            <span className="text-xs text-brand-slate-500 block mb-2">Need an instant response?</span>
            <WhatsAppButton
              propertyTitle={propertyTitle}
              referenceCode={referenceCode}
              fullWidth
            >
              Connect Directly on WhatsApp
            </WhatsAppButton>
          </div>
        )}
      </form>
    </div>
  );
}
