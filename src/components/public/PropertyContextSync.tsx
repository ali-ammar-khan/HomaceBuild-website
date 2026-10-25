'use client';

import { useEffect } from 'react';
import { usePropertyContext } from '@/context/PropertyContext';

interface PropertyContextSyncProps {
  title: string;
  referenceCode: string;
  slug?: string;
  url?: string;
}

export function PropertyContextSync({
  title,
  referenceCode,
  slug,
  url,
}: PropertyContextSyncProps) {
  const { setActiveProperty } = usePropertyContext();

  useEffect(() => {
    setActiveProperty({
      title,
      referenceCode,
      slug,
      url,
    });

    return () => {
      setActiveProperty(null);
    };
  }, [title, referenceCode, slug, url, setActiveProperty]);

  return null;
}
