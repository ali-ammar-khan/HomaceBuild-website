import { z } from 'zod';

export const InquiryFormSchema = z.object({
  property_id: z.string().uuid().optional().nullable(),
  customer_name: z
    .string()
    .trim()
    .min(2, 'Please enter your full name')
    .max(80, 'Name is too long'),
  phone: z
    .string()
    .trim()
    .regex(
      /^(\+92|0)?3[0-9]{9}$/,
      'Please enter a valid Pakistani mobile number (e.g., 03001234567 or +923001234567)'
    ),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message cannot exceed 1000 characters'),
  // Anti-bot honeypot field (must remain empty)
  company_fax: z.string().max(0, 'Spam detected').optional(),
  turnstile_token: z.string().optional(),
});

export type InquiryInput = z.infer<typeof InquiryFormSchema>;
