import React from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import FloatingWhatsAppButton from '@/components/public/FloatingWhatsAppButton';
import { PropertyProvider } from '@/context/PropertyContext';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PropertyProvider>
      <div className="flex min-h-screen flex-col w-full max-w-full overflow-x-hidden">
        <Navbar />
        <main className="flex-1 w-full max-w-full overflow-x-hidden">{children}</main>
        <Footer />
        <FloatingWhatsAppButton />
      </div>
    </PropertyProvider>
  );
}
