'use server';

import { InquiryFormSchema } from '@/lib/validations/inquiry';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import crypto from 'crypto';
import { dispatchInquiryNotification } from '@/lib/notifications/inquiryNotification';

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

// In-memory cache for fast zero-database deduplication & rate limiting fallback
interface SubmissionRecord {
  timestamp: number;
  ipHash: string;
  phone: string;
  propertyId: string | null;
}

const recentSubmissionsCache: SubmissionRecord[] = [];

function cleanOldCacheEntries() {
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  while (recentSubmissionsCache.length > 0 && recentSubmissionsCache[0].timestamp < tenMinutesAgo) {
    recentSubmissionsCache.shift();
  }
}

export async function submitInquiry(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const rawData = {
      property_id: formData.get('property_id')?.toString() || undefined,
      property_title: formData.get('property_title')?.toString() || undefined,
      reference_code: formData.get('reference_code')?.toString() || undefined,
      customer_name: formData.get('customer_name')?.toString() || '',
      phone: formData.get('phone')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      message: formData.get('message')?.toString() || '',
      company_fax: formData.get('company_fax')?.toString() || '',
      turnstile_token: formData.get('turnstile_token')?.toString() || '',
    };

    // 1. Silent Honeypot Defense: Reject bot submissions quietly
    if (rawData.company_fax && rawData.company_fax.length > 0) {
      console.warn('[SECURITY] Bot submission trapped by hidden honeypot field.');
      return {
        success: true,
        message: 'Your inquiry has been submitted successfully. Our advisory team will contact you shortly.',
      };
    }

    // 2. Validate payload strictly with Zod
    const validationResult = InquiryFormSchema.safeParse(rawData);
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Please correct the highlighted errors.',
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    const validData = validationResult.data;
    const cleanPropertyId = validData.property_id || null;

    // 3. Create Salted SHA-256 IP Hash for privacy-preserving rate limiting
    const headerList = headers();
    const forwardedFor = headerList.get('x-forwarded-for') || headerList.get('x-real-ip') || '127.0.0.1';
    const clientIp = forwardedFor.split(',')[0].trim();
    const salt = process.env.SUPABASE_SERVICE_ROLE_KEY || 'homace_inquiry_privacy_salt';
    const ipHash = crypto
      .createHash('sha256')
      .update(`${clientIp}:${salt}`)
      .digest('hex')
      .substring(0, 16);

    const now = Date.now();
    cleanOldCacheEntries();

    // 4. In-Memory Deduplication: Prevent accidental double-submits within 60 seconds
    const oneMinuteAgo = now - 60 * 1000;
    const isDuplicate = recentSubmissionsCache.some(
      (entry) =>
        entry.ipHash === ipHash &&
        entry.phone === validData.phone &&
        entry.propertyId === cleanPropertyId &&
        entry.timestamp >= oneMinuteAgo
    );

    if (isDuplicate) {
      return {
        success: true,
        message:
          'We have already received your inquiry. Our property specialist is reviewing your requirements and will contact you shortly.',
      };
    }

    // 5. In-Memory Rate Limiting: Max 4 submissions per 10 minutes per IP hash
    const tenMinutesAgo = now - 10 * 60 * 1000;
    const ipSubmissionsIn10Min = recentSubmissionsCache.filter(
      (entry) => entry.ipHash === ipHash && entry.timestamp >= tenMinutesAgo
    ).length;

    if (ipSubmissionsIn10Min >= 4) {
      return {
        success: false,
        message:
          'Submission limit reached. To discuss your property requirement immediately, please contact our advisory desk directly via WhatsApp or phone.',
      };
    }

    // Record submission into memory cache
    recentSubmissionsCache.push({
      timestamp: now,
      ipHash,
      phone: validData.phone,
      propertyId: cleanPropertyId,
    });

    // 6. Database Storage & Persistence
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured =
      supabaseUrl &&
      !supabaseUrl.includes('placeholder') &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let submissionTimestamp = new Date().toISOString();

    if (isSupabaseConfigured) {
      try {
        const supabase = createClient();

        // Database-level rate limiting check (10 minutes)
        const dbTenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
        const { count, error: countError } = await supabase
          .from('inquiries')
          .select('id', { count: 'exact', head: true })
          .eq('ip_hash', ipHash)
          .gte('created_at', dbTenMinutesAgo);

        if (!countError && count !== null && count >= 4) {
          return {
            success: false,
            message:
              'Too many inquiries submitted from your network. Please reach out directly on WhatsApp for prompt assistance.',
          };
        }

        // Database insertion
        const { data: inserted, error: insertError } = await supabase
          .from('inquiries')
          .insert({
            property_id: cleanPropertyId,
            customer_name: validData.customer_name,
            phone: validData.phone,
            email: validData.email || null,
            message: validData.message,
            status: 'new',
            ip_hash: ipHash,
          })
          .select('id, created_at')
          .single();

        if (insertError) {
          console.error('[DATABASE INQUIRY INSERT ERROR]', insertError.message);
          return {
            success: false,
            message:
              'Unable to store your inquiry at this moment. Please connect with our advisory desk directly via WhatsApp.',
          };
        }

        if (inserted?.created_at) {
          submissionTimestamp = inserted.created_at;
        }
      } catch (dbErr: any) {
        console.error('[DATABASE CONNECTIVITY EXCEPTION]', dbErr?.message || dbErr);
        return {
          success: false,
          message:
            'A database connectivity issue occurred. Please reach out via WhatsApp or phone directly.',
        };
      }
    } else {
      console.info(
        `[LOCAL DEV MODE] Inquiry captured (Database credentials not configured): Customer="${validData.customer_name}", Phone="${validData.phone}", Property="${cleanPropertyId || 'General'}"`
      );
    }

    // 7. Transactional Lead Notification Dispatch (Guarded & Non-blocking)
    await dispatchInquiryNotification({
      customer_name: validData.customer_name,
      phone: validData.phone,
      email: validData.email || null,
      message: validData.message,
      property_id: cleanPropertyId,
      property_title: validData.property_title,
      reference_code: validData.reference_code,
      ip_hash: ipHash,
      created_at: submissionTimestamp,
    });

    return {
      success: true,
      message:
        'Thank you! Your inquiry has been safely received. Our property specialist will contact you shortly.',
    };
  } catch (err: any) {
    console.error('[UNEXPECTED INQUIRY EXCEPTION]', err?.message || err);
    return {
      success: false,
      message:
        'A temporary service error occurred while processing your request. Please contact us directly via WhatsApp or phone.',
    };
  }
}
