import React from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'possession'
    | 'balloted'
    | 'file'
    | 'sale'
    | 'rent'
    | 'sold'
    | 'draft'
    | 'copper'
    | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'default',
  size = 'sm',
  children,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-semibold rounded uppercase tracking-wider select-none';

  const variants = {
    default: 'bg-brand-slate-100 text-brand-slate-800 border border-brand-slate-200',
    possession: 'bg-emerald-600 text-white shadow-sm',
    balloted: 'bg-brand-azure text-white shadow-sm',
    file: 'bg-brand-slate-600 text-white',
    sale: 'bg-brand-navy text-white border border-white/10',
    rent: 'bg-brand-azure-dark text-white',
    sold: 'bg-brand-slate-900 text-brand-slate-300',
    draft: 'bg-amber-100 text-amber-800 border border-amber-200',
    copper: 'bg-brand-copper/10 text-brand-copper border border-brand-copper/30',
    outline: 'border border-brand-slate-300 text-brand-slate-700 bg-transparent',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {variant === 'possession' && <ShieldCheck className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
}
