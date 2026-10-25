import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  className?: string;
  variant?: 'inline' | 'card' | 'fullscreen';
}

export function LoadingState({
  message = 'Loading verified listings...',
  className,
  variant = 'card',
}: LoadingStateProps) {
  if (variant === 'inline') {
    return (
      <div className={cn('inline-flex items-center gap-2 text-xs text-brand-slate-500', className)}>
        <Loader2 className="w-4 h-4 animate-spin text-brand-copper" />
        <span>{message}</span>
      </div>
    );
  }

  if (variant === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 animate-spin text-brand-copper mb-3" />
        <p className="text-sm font-semibold text-brand-navy">{message}</p>
      </div>
    );
  }

  return (
    <div
      role="status"
      className={cn(
        'w-full bg-white rounded-2xl border border-brand-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-3',
        className
      )}
    >
      <Loader2 className="w-8 h-8 animate-spin text-brand-copper" />
      <p className="text-xs sm:text-sm font-medium text-brand-slate-600">{message}</p>
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
}
