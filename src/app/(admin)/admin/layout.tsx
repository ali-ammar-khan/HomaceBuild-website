import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import {
  LayoutDashboard,
  Building,
  PlusCircle,
  Inbox,
  LogOut,
  Shield,
  ExternalLink,
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch role and profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const role = profile?.role || 'agent';
  const fullName = profile?.full_name || user.email || 'Staff User';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-brand-navyDark text-slate-300 flex flex-col border-r border-slate-800">
        {/* Brand Header with Clean Logo Display */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link href="/admin" className="relative h-14 w-44 block bg-white p-2 rounded-xl shadow-sm">
            <Image
              src="/HomaceLogo.png"
              alt="Homace Logo"
              fill
              className="object-contain object-center"
            />
          </Link>
          <span className="text-[10px] font-mono bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded uppercase">
            {role}
          </span>
        </div>

        {/* User Badge */}
        <div className="p-4 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center font-bold text-xs uppercase">
            {fullName.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">{fullName}</p>
            <p className="text-[11px] text-slate-400 capitalize">{role} Account</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="p-4 space-y-1.5 flex-1 text-xs font-medium">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-brand-gold" />
            <span>Dashboard Overview</span>
          </Link>

          <Link
            href="/admin/properties"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Building className="w-4 h-4 text-brand-gold" />
            <span>All Properties</span>
          </Link>

          <Link
            href="/admin/properties/new"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-brand-gold" />
            <span>Add New Listing</span>
          </Link>

          <Link
            href="/admin/inquiries"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Inbox className="w-4 h-4 text-brand-gold" />
            <span>Leads & Inquiries</span>
          </Link>

          <div className="pt-4 mt-4 border-t border-slate-800">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Public Website</span>
            </Link>
          </div>
        </nav>

        {/* Sign Out Action */}
        <div className="p-4 border-t border-slate-800">
          <form
            action={async () => {
              'use server';
              const sb = createClient();
              await sb.auth.signOut();
              redirect('/login');
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
