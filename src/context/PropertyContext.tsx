'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export interface ActivePropertyContextData {
  title: string;
  referenceCode: string;
  slug?: string;
  url?: string;
}

interface PropertyContextValue {
  activeProperty: ActivePropertyContextData | null;
  setActiveProperty: (property: ActivePropertyContextData | null) => void;
}

const PropertyContext = createContext<PropertyContextValue>({
  activeProperty: null,
  setActiveProperty: () => {},
});

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const [activeProperty, setActiveProperty] = useState<ActivePropertyContextData | null>(null);
  const pathname = usePathname();

  // Reset active property whenever user navigates away from a property detail page
  useEffect(() => {
    if (!pathname || !pathname.startsWith('/properties/')) {
      setActiveProperty(null);
    }
  }, [pathname]);

  return (
    <PropertyContext.Provider value={{ activeProperty, setActiveProperty }}>
      {children}
    </PropertyContext.Provider>
  );
}

export function usePropertyContext() {
  return useContext(PropertyContext);
}
