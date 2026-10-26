import { createPublicClient } from '@/lib/supabase/server';
import { Property } from '@/types/database';
import { initialSampleProperties } from '@/data/initialProperties';
import { SearchFilterInput, normalizeFilterAreaToMarla } from '@/lib/validations/searchFilters';

export interface PropertyFilterParams {
  purpose?: string;
  category_group?: string;
  category?: string;
  location?: string;
  min_price?: number;
  max_price?: number;
  min_area?: number;
  max_area?: number;
  area_unit?: string;
  bedrooms?: number;
  bathrooms?: number;
  plot_status?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedPropertiesResult {
  properties: Property[];
  total: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

const RESIDENTIAL_CATEGORIES = ['residential_plot', 'house', 'apartment'];
const COMMERCIAL_CATEGORIES = ['commercial_plot', 'shop', 'office', 'plaza'];

export async function searchPublishedProperties(
  params: PropertyFilterParams = {}
): Promise<PaginatedPropertiesResult> {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.max(1, Math.min(50, Number(params.limit) || 9));

  // Convert area filter to normalized Marla
  const minMarla = normalizeFilterAreaToMarla(
    params.min_area,
    (params.area_unit as any) || 'marla'
  );
  const maxMarla = normalizeFilterAreaToMarla(
    params.max_area,
    (params.area_unit as any) || 'marla'
  );

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured =
    supabaseUrl &&
    !supabaseUrl.includes('placeholder') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (isSupabaseConfigured) {
    try {
      const supabase = createPublicClient();
      let query = supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .eq('publication_status', 'published');

      if (params.purpose) {
        query = query.eq('purpose', params.purpose);
      }

      if (params.category) {
        query = query.eq('category', params.category);
      } else if (params.category_group === 'residential') {
        query = query.in('category', RESIDENTIAL_CATEGORIES);
      } else if (params.category_group === 'commercial') {
        query = query.in('category', COMMERCIAL_CATEGORIES);
      }

      if (params.location) {
        const loc = params.location.trim();
        query = query.or(
          `area_location.ilike.%${loc}%,sector_block.ilike.%${loc}%,city.ilike.%${loc}%`
        );
      }

      if (params.min_price !== undefined && params.min_price > 0) {
        query = query.gte('price_pkr', params.min_price);
      }
      if (params.max_price !== undefined && params.max_price > 0) {
        query = query.lte('price_pkr', params.max_price);
      }

      if (minMarla !== undefined) {
        query = query.gte('area_in_marla', minMarla);
      }
      if (maxMarla !== undefined) {
        query = query.lte('area_in_marla', maxMarla);
      }

      if (params.bedrooms !== undefined && params.bedrooms > 0) {
        query = query.gte('bedrooms', params.bedrooms);
      }
      if (params.bathrooms !== undefined && params.bathrooms > 0) {
        query = query.gte('bathrooms', params.bathrooms);
      }

      if (params.plot_status && params.plot_status !== 'all') {
        query = query.eq('plot_file_status', params.plot_status);
      }

      // Ordering
      switch (params.sort) {
        case 'price_asc':
          query = query.order('price_pkr', { ascending: true, nullsFirst: false });
          break;
        case 'price_desc':
          query = query.order('price_pkr', { ascending: false, nullsFirst: false });
          break;
        case 'area_desc':
          query = query.order('area_in_marla', { ascending: false });
          break;
        case 'area_asc':
          query = query.order('area_in_marla', { ascending: true });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      // Pagination range
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const timeoutPromise = new Promise<{ data: null; count: null; error: any }>((resolve) =>
        setTimeout(() => resolve({ data: null, count: null, error: 'timeout' }), 2000)
      );

      const result = await Promise.race([query, timeoutPromise]);

      if (result.data) {
        const total = result.count || result.data.length;
        return {
          properties: result.data as Property[],
          total,
          currentPage: page,
          totalPages: Math.ceil(total / limit) || 1,
          limit,
        };
      }
    } catch (err) {
      console.warn('Supabase query deferred, applying in-memory catalogue filtering:', err);
    }
  }

  // Robust In-Memory Filter Engine (Zero-latency fallback when Supabase is not connected)
  let list = initialSampleProperties.filter((p) => p.publication_status === 'published');

  if (params.purpose) {
    list = list.filter((p) => p.purpose === params.purpose);
  }

  if (params.category) {
    list = list.filter((p) => p.category === params.category);
  } else if (params.category_group === 'residential') {
    list = list.filter((p) => RESIDENTIAL_CATEGORIES.includes(p.category));
  } else if (params.category_group === 'commercial') {
    list = list.filter((p) => COMMERCIAL_CATEGORIES.includes(p.category));
  }

  if (params.location) {
    const locLower = params.location.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.area_location.toLowerCase().includes(locLower) ||
        p.city.toLowerCase().includes(locLower) ||
        (p.sector_block && p.sector_block.toLowerCase().includes(locLower))
    );
  }

  if (params.min_price !== undefined && params.min_price > 0) {
    list = list.filter((p) => (p.price_pkr || 0) >= params.min_price!);
  }
  if (params.max_price !== undefined && params.max_price > 0) {
    list = list.filter((p) => p.price_pkr !== null && p.price_pkr <= params.max_price!);
  }

  if (minMarla !== undefined) {
    list = list.filter((p) => p.area_in_marla >= minMarla);
  }
  if (maxMarla !== undefined) {
    list = list.filter((p) => p.area_in_marla <= maxMarla);
  }

  if (params.bedrooms !== undefined && params.bedrooms > 0) {
    list = list.filter((p) => p.bedrooms !== null && p.bedrooms >= params.bedrooms!);
  }
  if (params.bathrooms !== undefined && params.bathrooms > 0) {
    list = list.filter((p) => p.bathrooms !== null && p.bathrooms >= params.bathrooms!);
  }

  if (params.plot_status && params.plot_status !== 'all') {
    list = list.filter((p) => p.plot_file_status === params.plot_status);
  }

  // Sort
  switch (params.sort) {
    case 'price_asc':
      list.sort((a, b) => (a.price_pkr || 999999999) - (b.price_pkr || 999999999));
      break;
    case 'price_desc':
      list.sort((a, b) => (b.price_pkr || 0) - (a.price_pkr || 0));
      break;
    case 'area_desc':
      list.sort((a, b) => b.area_in_marla - a.area_in_marla);
      break;
    case 'area_asc':
      list.sort((a, b) => a.area_in_marla - b.area_in_marla);
      break;
    case 'newest':
    default:
      list.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      break;
  }

  const total = list.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedProperties = list.slice(startIndex, startIndex + limit);

  return {
    properties: paginatedProperties,
    total,
    currentPage: page,
    totalPages,
    limit,
  };
}

/**
 * Backward-compatible helper for simple listing fetches
 */
export async function getPublishedProperties(
  params: PropertyFilterParams = {}
): Promise<Property[]> {
  const result = await searchPublishedProperties(params);
  return result.properties;
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured =
    supabaseUrl &&
    !supabaseUrl.includes('placeholder') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (isSupabaseConfigured) {
    try {
      const supabase = createPublicClient();
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
  const found = initialSampleProperties.find(
    (p) => p.slug === slug && p.publication_status === 'published'
  );
  return found || null;
}
