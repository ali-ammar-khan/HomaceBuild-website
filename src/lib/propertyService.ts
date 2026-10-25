import { createClient } from '@/lib/supabase/server';
import { Property } from '@/types/database';
import { initialSampleProperties } from '@/data/initialProperties';

export interface PropertyFilterParams {
  purpose?: string;
  category?: string;
  location?: string;
  plot_status?: string;
  sort?: string;
  limit?: number;
}

export async function getPublishedProperties(
  params: PropertyFilterParams = {}
): Promise<Property[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured =
    supabaseUrl &&
    !supabaseUrl.includes('placeholder') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      let query = supabase
        .from('properties')
        .select('*')
        .eq('publication_status', 'published');

      if (params.purpose) {
        query = query.eq('purpose', params.purpose);
      }
      if (params.category) {
        query = query.eq('category', params.category);
      }
      if (params.location) {
        query = query.ilike('area_location', `%${params.location}%`);
      }
      if (params.plot_status) {
        query = query.eq('plot_file_status', params.plot_status);
      }

      if (params.sort === 'price_asc') {
        query = query.order('price_pkr', { ascending: true, nullsFirst: false });
      } else if (params.sort === 'price_desc') {
        query = query.order('price_pkr', { ascending: false, nullsFirst: false });
      } else if (params.sort === 'area_desc') {
        query = query.order('area_in_marla', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      if (params.limit) {
        query = query.limit(params.limit);
      }

      // Add a quick 2-second timeout to prevent network stalls
      const timeoutPromise = new Promise<{ data: null; error: any }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: 'timeout' }), 2000)
      );

      const result = await Promise.race([query, timeoutPromise]);

      if (result.data && result.data.length > 0) {
        return result.data as Property[];
      }
    } catch (err) {
      console.warn('Supabase query deferred, using instant catalog fallback:', err);
    }
  }

  // Instant zero-latency fallback
  let list = [...initialSampleProperties];

  if (params.purpose) {
    list = list.filter((p) => p.purpose === params.purpose);
  }
  if (params.category) {
    list = list.filter((p) => p.category === params.category);
  }
  if (params.location) {
    const locLower = params.location.toLowerCase();
    list = list.filter(
      (p) =>
        p.area_location.toLowerCase().includes(locLower) ||
        p.city.toLowerCase().includes(locLower)
    );
  }
  if (params.plot_status) {
    list = list.filter((p) => p.plot_file_status === params.plot_status);
  }

  if (params.sort === 'price_asc') {
    list.sort((a, b) => (a.price_pkr || 999999999) - (b.price_pkr || 999999999));
  } else if (params.sort === 'price_desc') {
    list.sort((a, b) => (b.price_pkr || 0) - (a.price_pkr || 0));
  } else if (params.sort === 'area_desc') {
    list.sort((a, b) => b.area_in_marla - a.area_in_marla);
  }

  if (params.limit) {
    list = list.slice(0, params.limit);
  }

  return list;
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured =
    supabaseUrl &&
    !supabaseUrl.includes('placeholder') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      const timeoutPromise = new Promise<{ data: null; error: any }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: 'timeout' }), 2000)
      );

      const queryPromise = supabase
        .from('properties')
        .select('*')
        .eq('slug', slug)
        .eq('publication_status', 'published')
        .single();

      const result = await Promise.race([queryPromise, timeoutPromise]);

      if (result.data) {
        return result.data as Property;
      }
    } catch (err) {
      console.warn('Supabase fetch deferred for slug:', slug);
    }
  }

  // Fallback search
  const found = initialSampleProperties.find((p) => p.slug === slug);
  return found || null;
}
