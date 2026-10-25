import React from 'react';
import { Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

export interface CallButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function CallButton({
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...props
}: CallButtonProps) {
  if (siteConfig.contact.phone === 'To be provided' || !siteConfig.contact.phone) {
    return null;
  }

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-xs sm:text-sm px-4 py-2.5 gap-2 h-10',
    lg: 'text-sm sm:text-base px-6 py-3 gap-2.5 h-12',
  };

  return (
    <a
      href={`tel:${siteConfig.contact.phone}`}
      className={cn(
        'inline-flex items-center justify-center bg-brand-navy hover:bg-brand-navy-light text-white font-semibold rounded-lg shadow-sm transition-all duration-150 active:scale-[0.98] select-none border border-brand-navy-light',
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      <Phone className="w-4 h-4 text-brand-copper shrink-0" />
      <span>{children || siteConfig.contact.phone}</span>
    </a>
  );
}
