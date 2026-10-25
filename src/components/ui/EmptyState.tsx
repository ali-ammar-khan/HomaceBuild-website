import React from 'react';
import Link from 'next/link';
import { Building2, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = Building2,
  actionLabel,
  actionHref,
  onActionClick,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-brand-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto flex flex-col items-center justify-center space-y-4 shadow-sm',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-brand-slate-100 text-brand-slate-400 flex items-center justify-center">
        <Icon className="w-7 h-7 text-brand-slate-400" aria-hidden="true" />
      </div>

      <div className="space-y-1.5 max-w-sm">
        <h3 className="text-base font-bold text-brand-slate-900">{title}</h3>
        <p className="text-xs text-brand-slate-500 leading-relaxed">{description}</p>
      </div>

      {(actionLabel && actionHref) && (
        <div className="pt-2">
          <Link href={actionHref}>
            <Button variant="primary" size="sm">
              {actionLabel}
            </Button>
          </Link>
        </div>
      )}

      {(actionLabel && onActionClick && !actionHref) && (
        <div className="pt-2">
          <Button variant="primary" size="sm" onClick={onActionClick}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
