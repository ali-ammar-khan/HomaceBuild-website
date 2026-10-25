import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { initialSampleProperties } from '@/data/initialProperties';
import { Property } from '@/types/database';
import PropertyForm from '@/components/admin/PropertyForm';

interface EditPropertyPageProps {
  params: {
    id: string;
  };
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  let property: Property | null = null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured =
    supabaseUrl &&
    !supabaseUrl.includes('placeholder') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', params.id)
        .single();

      if (!error && data) {
        property = data;
      }
    } catch (err) {
      console.error('Error fetching property for edit:', err);
    }
  }

  // Fallback to sample data for local development if not found in DB
  if (!property) {
    property = initialSampleProperties.find((p) => p.id === params.id) || null;
  }

  if (!property) {
    notFound();
  }

  return <PropertyForm initialData={property} isEditing />;
}
