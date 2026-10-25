import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, AlertCircle } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, leftIcon, id, children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-brand-slate-700 uppercase tracking-wider"
          >
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-slate-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <select
            id={selectId}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
            className={cn(
              'w-full px-3.5 py-2.5 bg-brand-slate-50 border border-brand-slate-200 rounded-lg text-sm text-brand-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-cyan/40 focus:border-brand-azure appearance-none pr-10 cursor-pointer disabled:opacity-50 disabled:bg-brand-slate-100',
              leftIcon && 'pl-10',
              error && 'border-rose-400 focus:ring-rose-200 focus:border-rose-500 bg-rose-50/20',
              className
            )}
            {...props}
          >
            {children}
          </select>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-slate-400 pointer-events-none flex items-center">
            {error ? <AlertCircle className="w-4 h-4 text-rose-500" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>

        {error ? (
          <p id={`${selectId}-error`} role="alert" className="text-xs text-rose-600 mt-1">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${selectId}-helper`} className="text-xs text-brand-slate-500 mt-1">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
