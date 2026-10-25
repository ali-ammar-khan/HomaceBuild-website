import React from 'react';
import { Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

export interface CallButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  variant?: 'primary' | 'copper' | 'outline' | 'slate';
}

export function CallButton({
  size = 'md',
  fullWidth = false,
  variant = 'primary',
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

  const variants = {
    primary: 'bg-brand-navy hover:bg-brand-navy-light text-white border border-brand-navy-light',
    copper: 'bg-brand-copper hover:bg-brand-copper-hover text-white border border-brand-copper-dark',
    outline: 'bg-transparent hover:bg-white/10 text-white border border-white/20',
    slate: 'bg-brand-slate-100 hover:bg-brand-navy text-brand-navy hover:text-white border border-brand-slate-200',
  };

  const cleanPhone = siteConfig.contact.phone.replace(/\s+/g, '');

  return (
    <a
      href={`tel:${cleanPhone}`}
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-lg shadow-sm transition-all duration-150 active:scale-[0.98] select-none',
        variants[variant],
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
