'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ThemeMode = 'light' | 'dark';

interface ThemeToggleProps {
  className?: string;
  variant?: 'segmented' | 'compact';
}

export function ThemeToggle({ className, variant = 'segmented' }: ThemeToggleProps) {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check saved preference or system default
    const savedTheme = localStorage.getItem('homace_theme') as ThemeMode | null;
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      applyTheme('dark');
    } else {
      setTheme('light');
      applyTheme('light');
    }
  }, []);

  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const toggleTheme = (mode: ThemeMode) => {
    setTheme(mode);
    localStorage.setItem('homace_theme', mode);
    applyTheme(mode);
  };

  if (!mounted) {
    // Render placeholder to avoid layout shift and hydration mismatch
    return (
      <div className={cn('inline-flex items-center h-6 w-32 bg-brand-navy-light/40 rounded-full animate-pulse', className)} />
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
        className={cn(
          'p-1.5 rounded-full border border-brand-slate-700/80 bg-brand-navy-light/50 hover:bg-brand-navy-light text-brand-slate-300 hover:text-white transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-brand-cyan/50 active:scale-95',
          className
        )}
        title={theme === 'dark' ? 'Switch to Daylight Theme' : 'Switch to Dark Theme'}
        aria-label={theme === 'dark' ? 'Switch to Daylight Theme' : 'Switch to Dark Theme'}
      >
        {theme === 'dark' ? (
          <Sun className="w-3.5 h-3.5 text-amber-300 animate-in spin-in-90 duration-200" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-cyan-300 animate-in spin-in-90 duration-200" />
        )}
      </button>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme Selection"
      className={cn(
        'inline-flex items-center p-0.5 rounded-full bg-brand-navy-dark/90 border border-brand-slate-700/70 shadow-inner text-[10px] sm:text-[11px] font-semibold tracking-wide',
        className
      )}
    >
      {/* Daylight / Light Option */}
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'light'}
        onClick={() => toggleTheme('light')}
        className={cn(
          'flex items-center gap-1 px-2 py-0.5 rounded-full transition-all duration-200 select-none cursor-pointer',
          theme === 'light'
            ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
            : 'text-brand-slate-400 hover:text-slate-200'
        )}
        title="Daylight Theme"
        aria-label="Daylight Theme"
      >
        <Sun className={cn('w-3 h-3', theme === 'light' ? 'text-slate-950' : 'text-amber-400')} />
        <span>Daylight</span>
      </button>

      {/* Dark Theme Option */}
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'dark'}
        onClick={() => toggleTheme('dark')}
        className={cn(
          'flex items-center gap-1 px-2 py-0.5 rounded-full transition-all duration-200 select-none cursor-pointer',
          theme === 'dark'
            ? 'bg-brand-azure text-white font-bold shadow-xs'
            : 'text-brand-slate-400 hover:text-slate-200'
        )}
        title="Dark Theme"
        aria-label="Dark Theme"
      >
        <Moon className={cn('w-3 h-3', theme === 'dark' ? 'text-white' : 'text-cyan-400')} />
        <span>Dark</span>
      </button>
    </div>
  );
}
