import { z } from 'zod';

export const InquiryFormSchema = z.object({
  property_id: z.string().uuid('Invalid property reference').optional().nullable().or(z.literal('')),
  property_title: z.string().optional().nullable(),
  reference_code: z.string().optional().nullable(),
  customer_name: z
    .string()
    .trim()
    .min(2, 'Please enter your full name (minimum 2 characters)')
    .max(80, 'Name cannot exceed 80 characters'),
  phone: z
    .string()
    .trim()
    .transform((val) => val.replace(/[\s\-\(\)]/g, ''))
    .pipe(
      z
        .string()
        .regex(
          /^(\+92|0)?3[0-9]{9}$/,
          'Please enter a valid Pakistani mobile number (e.g., 0300 1234567 or +92 300 1234567)'
        )
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
  company_fax: z.string().max(0, 'Spam detected').optional(),
  turnstile_token: z.string().optional(),
});

function runTests() {
  console.log('--- RUNNING INQUIRY VALIDATION & SECURITY TESTS ---');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Valid Pakistani mobile number with spaces
  const t1 = InquiryFormSchema.safeParse({
    customer_name: 'Ahmed Khan',
    phone: '0300 1234567',
    message: 'Interested in 10 Marla plot in Bahria Town Phase 8.',
  });
  assert(t1.success === true && t1.data?.phone === '03001234567', 'Normalizes phone with spaces to 03001234567');

  // 2. Valid Pakistani mobile number with dashes
  const t2 = InquiryFormSchema.safeParse({
    customer_name: 'Usman Tariq',
    phone: '0321-9876543',
    message: 'Looking for a 1 Kanal corner plot in DHA Phase 2.',
  });
  assert(t2.success === true && t2.data?.phone === '03219876543', 'Normalizes phone with hyphens');

  // 3. Valid international Pakistani format
  const t3 = InquiryFormSchema.safeParse({
    customer_name: 'Zainab Bibi',
    phone: '+92 333 5554433',
    message: 'Need commercial office space in Bahria Town Civic Center.',
  });
  assert(t3.success === true && t3.data?.phone === '+923335554433', 'Normalizes international format');

  // 4. Invalid phone (too short)
  const t4 = InquiryFormSchema.safeParse({
    customer_name: 'Ali Raza',
    phone: '12345',
    message: 'General inquiry about plots.',
  });
  assert(t4.success === false && t4.error?.flatten().fieldErrors.phone !== undefined, 'Rejects too short phone');

  // 5. Invalid phone (landline)
  const t5 = InquiryFormSchema.safeParse({
    customer_name: 'Ali Raza',
    phone: '051-1234567',
    message: 'General inquiry about plots in Islamabad.',
  });
  assert(t5.success === false, 'Rejects landline numbers requiring mobile for WhatsApp');

  // 6. Name too short
  const t6 = InquiryFormSchema.safeParse({
    customer_name: 'A',
    phone: '0300 1234567',
    message: 'Inquiring regarding property specifications.',
  });
  assert(t6.success === false && t6.error?.flatten().fieldErrors.customer_name !== undefined, 'Rejects single-character name');

  // 7. Message too short (< 10 chars)
  const t7 = InquiryFormSchema.safeParse({
    customer_name: 'Bilal Chaudhry',
    phone: '0300 1234567',
    message: 'Hello',
  });
  assert(t7.success === false && t7.error?.flatten().fieldErrors.message !== undefined, 'Rejects message under 10 chars');

  // 8. Optional email format
  const t8_valid = InquiryFormSchema.safeParse({
    customer_name: 'Hamza Malik',
    phone: '0300 1234567',
    email: 'hamza@example.com',
    message: 'Inquiring about 5 Marla ready possession house.',
  });
  assert(t8_valid.success === true, 'Accepts valid email');

  const t8_invalid = InquiryFormSchema.safeParse({
    customer_name: 'Hamza Malik',
    phone: '0300 1234567',
    email: 'not-an-email',
    message: 'Inquiring about 5 Marla ready possession house.',
  });
  assert(t8_invalid.success === false, 'Rejects malformed email');

  // 9. Honeypot check
  const t9 = InquiryFormSchema.safeParse({
    customer_name: 'Spam Bot',
    phone: '0300 1234567',
    message: 'Buy cheap backlinks here now.',
    company_fax: '1-800-SPAMMER',
  });
  assert(t9.success === false, 'Honeypot schema check detects filled company_fax');

  // 10. Valid Property ID (UUID)
  const t10 = InquiryFormSchema.safeParse({
    property_id: 'e6b4f74d-1a8e-49b8-a6d1-cf19965ad481',
    customer_name: 'Taimoor Shah',
    phone: '0345 5551234',
    message: 'Can we schedule a physical site visit tomorrow?',
  });
  assert(t10.success === true, 'Accepts valid UUID property_id');

  console.log(`\nResults: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTests();
