import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Unable to Load Data',
  message = 'A temporary connection error occurred while loading this section. Please retry.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'bg-rose-50/60 border border-rose-200 rounded-2xl p-6 sm:p-8 text-center max-w-md mx-auto space-y-4',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" aria-hidden="true" />
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-bold text-rose-900">{title}</h3>
        <p className="text-xs text-rose-700 leading-relaxed">{message}</p>
      </div>

      {onRetry && (
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-rose-700" />}
            className="border-rose-300 hover:bg-rose-100 text-rose-800"
          >
            Retry Loading
          </Button>
        </div>
      )}
    </div>
  );
}
