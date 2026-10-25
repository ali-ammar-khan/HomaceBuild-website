import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold text-brand-slate-700 uppercase tracking-wider"
          >
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            id={textareaId}
            ref={ref}
            rows={rows}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
            className={cn(
              'w-full px-3.5 py-2.5 bg-brand-slate-50 border border-brand-slate-200 rounded-lg text-base sm:text-sm text-brand-slate-900 placeholder:text-brand-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-cyan/40 focus:border-brand-azure disabled:opacity-50 disabled:bg-brand-slate-100',
              error && 'border-rose-400 focus:ring-rose-200 focus:border-rose-500 bg-rose-50/20',
              className
            )}
            {...props}
          />
        </div>

        {error ? (
          <p id={`${textareaId}-error`} role="alert" className="text-xs text-rose-600 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p id={`${textareaId}-helper`} className="text-xs text-brand-slate-500 mt-1">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
