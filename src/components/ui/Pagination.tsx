'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const handlePageSelect = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    if (onPageChange) {
      onPageChange(page);
      return;
    }

    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Generate page numbers array with ellipsis
  const pages: (number | string)[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <nav aria-label="Pagination Navigation" className={cn('flex items-center justify-center gap-1.5', className)}>
      {/* Previous Page Button */}
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => handlePageSelect(currentPage - 1)}
        className="p-2 rounded-lg border border-brand-slate-200 text-brand-slate-600 hover:bg-brand-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Number Buttons */}
      {pages.map((p, idx) => {
        if (p === '...') {
          return (
            <span key={idx} className="px-2 text-xs text-brand-slate-400 select-none">
              ...
            </span>
          );
        }

        const pageNum = p as number;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={idx}
            type="button"
            onClick={() => handlePageSelect(pageNum)}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'w-8 h-8 rounded-lg text-xs font-semibold transition-all',
              isActive
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-brand-slate-700 hover:bg-brand-slate-100 border border-transparent'
            )}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next Page Button */}
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageSelect(currentPage + 1)}
        className="p-2 rounded-lg border border-brand-slate-200 text-brand-slate-600 hover:bg-brand-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label="Next Page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
