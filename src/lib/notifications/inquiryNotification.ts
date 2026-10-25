import { siteConfig } from '@/config/site';

export interface InquiryNotificationPayload {
  customer_name: string;
  phone: string;
  email?: string | null;
  message: string;
  property_id?: string | null;
  property_title?: string | null;
  reference_code?: string | null;
  ip_hash: string;
  created_at: string;
}

export interface NotificationResult {
  dispatched: boolean;
  provider: 'resend' | 'none';
  reason?: string;
  error?: string;
}

/**
 * Dispatches an administrative lead notification.
 * Uses Resend transactional email API when RESEND_API_KEY is configured.
 * When unconfigured, safely logs the lead for administrative dashboard retrieval.
 * Never throws an error to the caller, ensuring customer submission integrity.
 */
export async function dispatchInquiryNotification(
  payload: InquiryNotificationPayload
): Promise<NotificationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const recipientEmail =
    process.env.NOTIFICATION_ALERT_EMAIL || siteConfig.contact.email || 'advisory@homacebuild.com';
  const fromEmail =
    process.env.NOTIFICATION_FROM_EMAIL || 'HomaceBuild Advisory <leads@homacebuild.com>';

  // Clean phone for WhatsApp 1-click quick-reply link
  const rawDigits = payload.phone.replace(/[^0-9]/g, '');
  const internationalPhone = rawDigits.startsWith('0')
    ? `92${rawDigits.slice(1)}`
    : rawDigits.startsWith('92')
    ? rawDigits
    : `92${rawDigits}`;

  const whatsappReplyUrl = `https://wa.me/${internationalPhone}?text=${encodeURIComponent(
    `Hello ${payload.customer_name}, thank you for contacting HomaceBuild and Realators regarding your inquiry.`
  )}`;

  // If no provider key is configured, log safely for audit and skip external dispatch
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('placeholder')) {
    console.info(
      `[INQUIRY NOTIFICATION SKIPPED] No transactional email provider configured (RESEND_API_KEY missing). Lead for "${payload.customer_name}" (${payload.phone}) is safely preserved in database.`
    );
    return {
      dispatched: false,
      provider: 'none',
      reason: 'RESEND_API_KEY is not configured. Saved in database for admin dashboard.',
    };
  }

  const subject = payload.property_title
    ? `[New Property Lead] #${payload.reference_code || 'REF'} - ${payload.property_title}`
    : `[New General Lead] Property Consultation Request from ${payload.customer_name}`;

  const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F7FB; margin: 0; padding: 24px; color: #0F172A; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { background-color: #0A1E42; padding: 24px; color: #ffffff; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 700; }
        .header p { margin: 6px 0 0; font-size: 13px; color: #94A3B8; }
        .content { padding: 24px; }
        .badge { display: inline-block; background-color: #D96B27; color: #ffffff; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; margin-bottom: 16px; }
        .lead-detail { margin-bottom: 16px; border-bottom: 1px solid #F1F5F9; padding-bottom: 12px; }
        .lead-detail dt { font-size: 11px; text-transform: uppercase; color: #64748B; font-weight: 600; margin-bottom: 4px; }
        .lead-detail dd { font-size: 14px; color: #0F172A; font-weight: 500; margin: 0; }
        .message-box { background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; color: #334155; margin-top: 16px; white-space: pre-wrap; }
        .actions { margin-top: 24px; text-align: center; }
        .btn-whatsapp { display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px; }
        .footer { padding: 16px 24px; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; font-size: 11px; color: #94A3B8; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>HomaceBuild &amp; Realators</h1>
          <p>Direct Advisory Desk • Inbound Lead Notification</p>
        </div>
        <div class="content">
          <div class="badge">New Inquiry Received</div>
          
          <dl>
            <div class="lead-detail">
              <dt>Client Name</dt>
              <dd><strong>${payload.customer_name}</strong></dd>
            </div>
            
            <div class="lead-detail">
              <dt>Phone / Mobile</dt>
              <dd><a href="tel:${payload.phone}" style="color: #0066B2; text-decoration: none; font-weight: bold;">${payload.phone}</a></dd>
            </div>

            ${
              payload.email
                ? `
            <div class="lead-detail">
              <dt>Email Address</dt>
              <dd><a href="mailto:${payload.email}" style="color: #0066B2; text-decoration: none;">${payload.email}</a></dd>
            </div>
            `
                : ''
            }

            ${
              payload.property_title
                ? `
            <div class="lead-detail">
              <dt>Inquired Property</dt>
              <dd><strong>${payload.property_title}</strong> (Ref: #${payload.reference_code || 'N/A'})</dd>
            </div>
            `
                : `
            <div class="lead-detail">
              <dt>Inquiry Scope</dt>
              <dd>General Advisory Consultation</dd>
            </div>
            `
            }

            <div class="lead-detail" style="border-bottom: none;">
              <dt>Customer Requirements / Message</dt>
              <div class="message-box">${payload.message}</div>
            </div>
          </dl>

          <div class="actions">
            <a href="${whatsappReplyUrl}" class="btn-whatsapp" target="_blank" rel="noopener noreferrer">
              Open Direct WhatsApp Conversation
            </a>
          </div>
        </div>
        
        <div class="footer">
          Received at ${payload.created_at} UTC • Privacy Protected IP Hash: ${payload.ip_hash}
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [recipientEmail],
        subject: subject,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[RESEND API ERROR]', response.status, errorText);
      return {
        dispatched: false,
        provider: 'resend',
        error: `Provider returned HTTP ${response.status}: ${errorText}`,
      };
    }

    const data = await response.json();
    console.info('[INQUIRY NOTIFICATION DISPATCHED]', data?.id);
    return {
      dispatched: true,
      provider: 'resend',
    };
  } catch (err: any) {
    console.error('[INQUIRY NOTIFICATION NETWORK ERROR]', err?.message || err);
    return {
      dispatched: false,
      provider: 'resend',
      error: err?.message || 'Network transport failure',
    };
  }
}
