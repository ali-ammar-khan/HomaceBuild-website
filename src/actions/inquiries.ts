'use server';

import { InquiryFormSchema } from '@/lib/validations/inquiry';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import crypto from 'crypto';

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function submitInquiry(prevState: any, formData: FormData): Promise<ActionResponse> {
  try {
    const rawData = {
      property_id: formData.get('property_id')?.toString() || null,
      customer_name: formData.get('customer_name')?.toString() || '',
      phone: formData.get('phone')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      message: formData.get('message')?.toString() || '',
      company_fax: formData.get('company_fax')?.toString() || '',
      turnstile_token: formData.get('turnstile_token')?.toString() || '',
    };

    // 1. Silent Honeypot defense: discard bot submissions immediately
    if (rawData.company_fax && rawData.company_fax.length > 0) {
      return {
        success: true,
        message: 'Your inquiry has been submitted successfully. Our advisory team will contact you shortly.',
      };
    }

    // 2. Validate payload with Zod
    const validationResult = InquiryFormSchema.safeParse(rawData);
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Please correct the highlighted errors.',
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    const validData = validationResult.data;

    // 3. Create IP hash for privacy-safe rate limiting
    const headerList = headers();
    const forwardedFor = headerList.get('x-forwarded-for') || '127.0.0.1';
    const clientIp = forwardedFor.split(',')[0].trim();
    const ipHash = crypto.createHash('sha256').update(clientIp).digest('hex').substring(0, 16);

    const supabase = createClient();

    // 4. Rate-limiting check: Reject if more than 4 submissions in last 10 minutes from this IP hash
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from('inquiries')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', tenMinutesAgo);

    if (!countError && count !== null && count >= 4) {
      return {
        success: false,
        message: 'Too many submissions received. Please contact us directly via WhatsApp or telephone.',
      };
    }

    // 5. Insert inquiry record
    const { error: insertError } = await supabase.from('inquiries').insert({
      property_id: validData.property_id || null,
      customer_name: validData.customer_name,
      phone: validData.phone,
      email: validData.email || null,
      message: validData.message,
      status: 'new',
      ip_hash: ipHash,
    });

    if (insertError) {
      console.error('Supabase Inquiry Insert Error:', insertError);
      return {
        success: false,
        message: 'Unable to submit your inquiry at this moment. Please reach out via WhatsApp.',
      };
    }

    return {
      success: true,
      message: 'Thank you! Your inquiry has been safely received. Our property specialist will contact you shortly.',
    };
  } catch (err: any) {
    console.error('Unexpected Inquiry Error:', err);
    return {
      success: false,
      message: 'A temporary error occurred while processing your request. Please contact us directly.',
    };
  }
}
