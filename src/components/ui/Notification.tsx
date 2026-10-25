'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export type NotificationVariant = 'info' | 'success' | 'warning' | 'error';

export interface NotificationProps {
  variant?: NotificationVariant;
  title?: string;
  message: string;
  isDismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const variantStyles: Record<
  NotificationVariant,
  {
    container: string;
    icon: string;
    iconComponent: React.ComponentType<{ className?: string }>;
    titleColor: string;
    textColor: string;
    role: 'alert' | 'status';
    ariaLive: 'assertive' | 'polite';
  }
> = {
  info: {
    container: 'bg-blue-50 border-brand-azure/30 text-blue-900',
    icon: 'text-brand-azure',
    iconComponent: Info,
    titleColor: 'text-brand-azure-dark font-semibold',
    textColor: 'text-blue-800',
    role: 'status',
    ariaLive: 'polite',
  },
  success: {
    container: 'bg-emerald-50 border-emerald-300 text-emerald-950',
    icon: 'text-emerald-600',
    iconComponent: CheckCircle2,
    titleColor: 'text-emerald-900 font-semibold',
    textColor: 'text-emerald-800',
    role: 'status',
    ariaLive: 'polite',
  },
  warning: {
    container: 'bg-amber-50 border-brand-copper/30 text-amber-950',
    icon: 'text-brand-copper',
    iconComponent: AlertTriangle,
    titleColor: 'text-amber-950 font-semibold',
    textColor: 'text-amber-900',
    role: 'alert',
    ariaLive: 'assertive',
  },
  error: {
    container: 'bg-rose-50 border-rose-300 text-rose-950',
    icon: 'text-rose-600',
    iconComponent: AlertCircle,
    titleColor: 'text-rose-950 font-semibold',
    textColor: 'text-rose-800',
    role: 'alert',
    ariaLive: 'assertive',
  },
};

export function Notification({
  variant = 'info',
  title,
  message,
  isDismissible = true,
  onDismiss,
  className = '',
  action,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const config = variantStyles[variant];
  const Icon = config.iconComponent;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <aside
      role={config.role}
      aria-live={config.ariaLive}
      className={`relative flex items-start gap-3.5 rounded-xl border p-4 shadow-xs transition-all duration-200 ${config.container} ${className}`}
    >
      <div className="shrink-0 mt-0.5">
        <Icon className={`w-5 h-5 ${config.icon}`} />
      </div>

      <div className="flex-1 text-sm">
        {title && <h4 className={`text-sm mb-1 ${config.titleColor}`}>{title}</h4>}
        <p className={`leading-relaxed ${config.textColor}`}>{message}</p>

        {action && (
          <div className="mt-3">
            <button
              type="button"
              onClick={action.onClick}
              className="text-xs font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              {action.label}
            </button>
          </div>
        )}
      </div>

      {isDismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss notification"
          className="shrink-0 -mr-1 -mt-1 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors focus:outline-hidden focus:ring-2 focus:ring-brand-azure"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </aside>
  );
}
