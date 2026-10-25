import React from 'react';
import { MessageSquare } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { getWhatsAppUrl, getPropertyWhatsAppMessage, formatWhatsAppNumber } from '@/lib/whatsapp';

export interface WhatsAppButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  propertyTitle?: string;
  referenceCode?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function WhatsAppButton({
  propertyTitle,
  referenceCode,
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...props
}: WhatsAppButtonProps) {
  if (!siteConfig.contact.whatsapp) {
    return null;
  }

  const message = propertyTitle
    ? getPropertyWhatsAppMessage({ title: propertyTitle, referenceCode })
    : `Hello HomaceBuild & Realators, I would like to inquire about real estate opportunities in Islamabad/Rawalpindi (Bahria Town / DHA).`;

  const cleanPhone = formatWhatsAppNumber(siteConfig.contact.whatsapp);
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
    : '#';

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-xs sm:text-sm px-4 py-2.5 gap-2 h-10',
    lg: 'text-sm sm:text-base px-6 py-3 gap-2.5 h-12',
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-all duration-150 active:scale-[0.98] select-none',
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      <MessageSquare className="w-4 h-4 shrink-0" />
      <span>{children || 'Inquire on WhatsApp'}</span>
    </a>
  );
}
