import { z } from 'zod';
import { AREA_STANDARDS, calculateMarla } from '@/config/measurements';
import { AreaUnitType } from '@/types/database';

export const searchFilterSchema = z.object({
  purpose: z.enum(['sale', 'rent']).optional(),
  category_group: z.enum(['residential', 'commercial']).optional(),
  category: z
    .enum([
      'residential_plot',
      'house',
      'apartment',
      'commercial_plot',
      'shop',
      'office',
      'plaza',
    ])
    .optional(),
  location: z.string().max(100).optional(),
  min_price: z.coerce.number().min(0).optional(),
  max_price: z.coerce.number().min(0).optional(),
  min_area: z.coerce.number().min(0).optional(),
  max_area: z.coerce.number().min(0).optional(),
  area_unit: z.enum(['marla', 'kanal', 'sqft', 'sqyd']).default('marla'),
  bedrooms: z.coerce.number().min(0).max(20).optional(),
  bathrooms: z.coerce.number().min(0).max(20).optional(),
  plot_status: z
    .enum(['possession', 'balloted', 'allocated', 'file', 'not_applicable'])
    .optional(),
  sort: z
    .enum(['newest', 'price_asc', 'price_desc', 'area_desc', 'area_asc'])
    .default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(9),
});

export type SearchFilterInput = z.infer<typeof searchFilterSchema>;

/**
 * Normalizes input area into Marlas based on selected unit and 225 sq ft standard.
 */
export function normalizeFilterAreaToMarla(
  value: number | undefined,
  unit: AreaUnitType = 'marla'
): number | undefined {
  if (value === undefined || value <= 0) return undefined;
  return calculateMarla(value, unit, AREA_STANDARDS.BAHRIA_DHA_CDA);
}
