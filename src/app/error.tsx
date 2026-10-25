'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to internal monitoring service (without exposing sensitive tokens)
    console.error('Application Error Captured:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-2xl border border-brand-slate-200 p-8 text-center shadow-lg space-y-6">
        <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-brand-navy">
            Temporary Loading Issue
          </h2>
          <p className="text-xs text-brand-slate-600 leading-relaxed">
            A temporary error occurred while retrieving this real estate resource. Please retry or return to the main property directory.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-brand-slate-400">
              Diagnostic ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-brand-copper" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-slate-100 hover:bg-brand-slate-200 text-brand-slate-800 text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors active:scale-95"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
