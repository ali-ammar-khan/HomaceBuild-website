import { siteConfig } from '@/config/site';

/**
 * Formats a domestic or international phone number into the strict
 * international format required by WhatsApp (https://wa.me/<number>):
 * - Digits only
 * - No leading '+'
 * - No dashes, brackets, spaces, or symbols
 * - Converts Pakistani domestic numbers (03XXXXXXXXX) to 923XXXXXXXXX
 *
 * Example:
 *   "03006100619"      -> "923006100619"
 *   "+92 300 6100619"  -> "923006100619"
 *   "923000000000"     -> "923000000000"
 */
export function formatWhatsAppNumber(rawPhone: string): string {
  if (!rawPhone) return '';

  // 1. Strip all non-digit characters
  let clean = rawPhone.replace(/\D/g, '');

  // 2. Remove international call prefix '00' (e.g., 0092...)
  if (clean.startsWith('00')) {
    clean = clean.slice(2);
  }

  // 3. Convert Pakistani domestic format (03XXXXXXXXX -> 923XXXXXXXXX)
  if (clean.startsWith('03') && clean.length === 11) {
    clean = '92' + clean.slice(1);
  }

  // 4. Handle 10-digit mobile number missing country code (3XXXXXXXXX -> 923XXXXXXXXX)
  if (clean.startsWith('3') && clean.length === 10) {
    clean = '92' + clean;
  }

  return clean;
}

/**
 * Friendly prefilled greeting for general public pages
 */
export function getGeneralWhatsAppMessage(): string {
  return "Hi, I'm interested in the real estate services offered by HomaceBuild and Realators.";
}

/**
 * Context-aware prefilled inquiry for specific property listings
 */
export function getPropertyWhatsAppMessage({
  title,
  referenceCode,
  url,
}: {
  title: string;
  referenceCode?: string;
  url?: string;
}): string {
  const refText = referenceCode ? ` (Ref: ${referenceCode})` : '';
  const urlText = url ? `\nLink: ${url}` : '';
  return `Hi, I'm interested in "${title}"${refText} on HomaceBuild and Realators.${urlText}`;
}

/**
 * Constructs a fully qualified https://wa.me/ URL with URL-encoded draft message
 */
export function getWhatsAppUrl(options: {
  phone?: string;
  message?: string;
} = {}): string {
  const rawNumber = options.phone || siteConfig.contact.whatsapp || '923000000000';
  const cleanNumber = formatWhatsAppNumber(rawNumber);

  if (!cleanNumber) {
    return '#';
  }

  const base = `https://wa.me/${cleanNumber}`;
  if (!options.message) {
    return base;
  }

  return `${base}?text=${encodeURIComponent(options.message)}`;
}
