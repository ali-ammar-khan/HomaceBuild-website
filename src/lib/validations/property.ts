import { z } from 'zod';

export const PropertyFormSchema = z
  .object({
    reference_code: z
      .string()
      .min(3, 'Reference code must be at least 3 characters')
      .max(20, 'Reference code too long'),
    title: z
      .string()
      .min(5, 'Title must be at least 5 characters')
      .max(120, 'Title cannot exceed 120 characters'),
    description: z.string().optional(),
    purpose: z.enum(['sale', 'rent']),
    category: z.enum([
      'residential_plot',
      'house',
      'apartment',
      'commercial_plot',
      'shop',
      'office',
      'plaza',
    ]),
    publication_status: z.enum(['draft', 'published', 'archived']).default('draft'),
    availability_status: z
      .enum(['available', 'under_offer', 'sold', 'rented'])
      .default('available'),
    plot_file_status: z
      .enum(['not_applicable', 'file', 'allocated', 'balloted', 'possession'])
      .default('not_applicable'),

    is_price_on_call: z.boolean().default(false),
    price_pkr: z.number().int().positive('Price must be greater than 0').nullable(),

    area_value: z.number().positive('Area must be greater than 0'),
    area_unit: z.enum(['marla', 'kanal', 'sqft', 'sqyd']),
    marla_sqft_standard: z.number().refine((val) => [225, 250, 272.25].includes(val), {
      message: 'Marla standard must be 225, 250, or 272.25 sq ft',
    }),

    city: z.string().default('Islamabad'),
    area_location: z.string().min(2, 'Location is required (e.g. Bahria Town Phase 8, DHA Phase 2)'),
    sector_block: z.string().optional().nullable(),

    bedrooms: z.number().int().nonnegative().optional().nullable(),
    bathrooms: z.number().int().nonnegative().optional().nullable(),
    features: z.array(z.string()).default([]),
    images: z.array(z.string()).default([]),
    featured_image: z.string().optional().nullable(),
    agent_id: z.string().uuid().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.is_price_on_call) {
        return data.price_pkr === null || data.price_pkr === undefined;
      }
      return data.price_pkr !== null && data.price_pkr !== undefined && data.price_pkr > 0;
    },
    {
      message: 'When Price on Call is active, price must be empty. Otherwise, a valid price is required.',
      path: ['price_pkr'],
    }
  );

export type PropertyInput = z.infer<typeof PropertyFormSchema>;
