import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-brand-slate-500 mb-4">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li className="flex items-center">
          <Link
            href="/"
            className="hover:text-brand-azure flex items-center gap-1 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only sm:not-sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-brand-slate-400 shrink-0" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-brand-azure transition-colors truncate max-w-[150px] sm:max-w-xs"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-semibold text-brand-slate-800 truncate max-w-[180px] sm:max-w-sm">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
