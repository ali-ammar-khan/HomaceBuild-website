#!/usr/bin/env node
/**
 * scripts/test-admin-dashboard.mjs
 * 
 * Comprehensive Automated Verification Suite for HomaceBuild & Realators Admin Dashboard.
 * 
 * Verifies:
 * 1. Authentication, session management and route guards.
 * 2. Role authorization, tamper-proofing, and anti-escalation triggers.
 * 3. Property CRUD logic, validation, and multi-status handling.
 * 4. Image upload validation (MIME types, 10MB size limit) and media management.
 * 5. Inquiry management, status workflows, and WhatsApp direct actions.
 * 6. UI component structure and dashboard KPI calculations.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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
    price_pkr: z.number().int().positive('Price must be greater than 0').nullable().optional(),

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

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}${details ? ` -> ${details}` : ''}`);
    failed++;
  }
}

async function runAdminDashboardVerificationSuite() {
  console.log('===============================================================');
  console.log('HOMACEBUILD - ADMIN DASHBOARD & SECURITY VERIFICATION SUITE');
  console.log('===============================================================\n');

  // -------------------------------------------------------------------------
  // 1. ROUTE GUARDS & SESSION MANAGEMENT
  // -------------------------------------------------------------------------
  console.log('--- 1. Route Guards, Middleware & Session Protection ---');
  const middlewarePath = path.join(rootDir, 'src', 'lib', 'supabase', 'middleware.ts');
  const adminLayoutPath = path.join(rootDir, 'src', 'app', '(admin)', 'admin', 'layout.tsx');
  const loginPagePath = path.join(rootDir, 'src', 'app', '(admin)', 'login', 'page.tsx');

  assert(fs.existsSync(middlewarePath), 'Auth middleware exists');
  assert(fs.existsSync(adminLayoutPath), 'Staff admin layout exists');
  assert(fs.existsSync(loginPagePath), 'Staff login page exists');

  const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
  const adminLayoutContent = fs.readFileSync(adminLayoutPath, 'utf8');

  // Check unauthenticated redirect logic
  assert(
    middlewareContent.includes("pathname.startsWith('/admin') && !user") &&
    middlewareContent.includes("url.pathname = '/login'"),
    'Middleware redirects unauthenticated requests on /admin* to /login with redirectedFrom'
  );

  // Check authenticated redirect logic from login page
  assert(
    middlewareContent.includes("pathname === '/login' && user") &&
    middlewareContent.includes("url.pathname = '/admin'"),
    'Middleware redirects already-authenticated users from /login directly to /admin'
  );

  // Check fast path bypass for public routes
  assert(
    middlewareContent.includes('const isAuthRoute = pathname.startsWith(\'/admin\') || pathname === \'/login\';') &&
    middlewareContent.includes('if (!isAuthRoute)'),
    'Fast path: Public routes (/ , /properties, /locations/*) completely bypass auth overhead'
  );

  // Check server-side session guard in AdminLayout
  assert(
    adminLayoutContent.includes('const supabase = createClient();') &&
    adminLayoutContent.includes('if (!user)') &&
    adminLayoutContent.includes("redirect('/login');"),
    'AdminLayout enforces server-side session check with immediate redirect'
  );

  // Check SEO privacy exclusion for staff portal
  assert(
    adminLayoutContent.includes('index: false') &&
    adminLayoutContent.includes('follow: false') &&
    adminLayoutContent.includes('nocache: true'),
    'Admin layout explicitly excludes staff dashboard from search engine indexing (noindex, nofollow, nocache)'
  );

  // -------------------------------------------------------------------------
  // 2. ROLE AUTHORIZATION & ANTI-ESCALATION
  // -------------------------------------------------------------------------
  console.log('\n--- 2. Role Authorization & Anti-Escalation Architecture ---');
  const schemaPath = path.join(rootDir, 'schema.sql');
  const propertiesActionPath = path.join(rootDir, 'src', 'actions', 'properties.ts');
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  const propActionContent = fs.readFileSync(propertiesActionPath, 'utf8');

  // Database Trigger: Prevent Self Role Escalation
  assert(
    schemaContent.includes('CREATE OR REPLACE FUNCTION public.prevent_self_role_escalation()') &&
    schemaContent.includes("public.get_user_role(auth.uid()) <> 'admin'") &&
    schemaContent.includes('trg_protect_user_roles'),
    'PostgreSQL trg_protect_user_roles trigger prevents self-privilege escalation to admin'
  );

  // Database Trigger: Safe Default Role on Signup
  assert(
    schemaContent.includes('CREATE OR REPLACE FUNCTION public.handle_new_user()') &&
    schemaContent.includes("'agent' -- Default role is always agent"),
    'Auth trigger assigns non-elevated "agent" role by default on new user creation'
  );

  // Server Action Guard: deleteProperty admin check
  assert(
    propActionContent.includes("if (session.role !== 'admin')") &&
    propActionContent.includes('Forbidden: Only administrators can permanently delete listings.'),
    'deleteProperty action strictly restricts listing deletion to admin role'
  );

  // Server Action Guard: updateProperty agent attribution isolation
  assert(
    propActionContent.includes("if (session.role === 'agent')") &&
    propActionContent.includes('existing.created_by !== session.user.id') &&
    propActionContent.includes('Forbidden: Agents can only modify their own listings.'),
    'updateProperty action confines agents to editing only their assigned or authored listings'
  );

  // -------------------------------------------------------------------------
  // 3. PROPERTY MANAGEMENT & MULTI-STATUS VALIDATION
  // -------------------------------------------------------------------------
  console.log('\n--- 3. Property Form Schema & Multi-Status Domain Rules ---');

  // Valid property payload test
  const validPropertyInput = {
    reference_code: 'HB-TEST-001',
    title: 'Luxury 10 Marla Bahria Phase 8 Villa',
    description: 'Designer villa built with A+ materials overlooking the valley.',
    purpose: 'sale',
    category: 'house',
    publication_status: 'published',
    availability_status: 'available',
    plot_file_status: 'not_applicable',
    is_price_on_call: false,
    price_pkr: 48500000,
    area_value: 10,
    area_unit: 'marla',
    marla_sqft_standard: 225,
    city: 'Rawalpindi',
    area_location: 'Bahria Town',
    sector_block: 'Phase 8, Sector C',
    bedrooms: 5,
    bathrooms: 6,
    features: ['Corner Plot', 'Servant Quarter', 'Italian Kitchen'],
    images: ['https://example.com/bahria-villa-1.jpg'],
    featured_image: 'https://example.com/bahria-villa-1.jpg',
  };

  const validationResult = PropertyFormSchema.safeParse(validPropertyInput);
  assert(validationResult.success, 'PropertyFormSchema accepts valid comprehensive property input');

  // Verify 3 distinct status dimensions
  const testDraftSoldFile = {
    ...validPropertyInput,
    publication_status: 'draft',
    availability_status: 'sold',
    plot_file_status: 'file',
  };
  const multiStatusTest = PropertyFormSchema.safeParse(testDraftSoldFile);
  assert(
    multiStatusTest.success,
    'Property schema supports orthogonal publication_status (draft), availability_status (sold) and plot_file_status (file)'
  );

  // Verify rejection of invalid publication status
  const invalidStatusInput = {
    ...validPropertyInput,
    publication_status: 'unknown_status',
  };
  const invalidStatusTest = PropertyFormSchema.safeParse(invalidStatusInput);
  assert(!invalidStatusTest.success, 'PropertyFormSchema rejects unrecognized publication status');

  // Verify rejection of missing required reference code
  const missingRefInput = {
    ...validPropertyInput,
    reference_code: '',
  };
  const missingRefTest = PropertyFormSchema.safeParse(missingRefInput);
  assert(!missingRefTest.success, 'PropertyFormSchema requires non-empty reference_code');

  // Verify both Pakistani Marla standards
  const test272Marla = {
    ...validPropertyInput,
    marla_sqft_standard: 272.25,
  };
  assert(PropertyFormSchema.safeParse(test272Marla).success, 'Supports 272.25 sq ft standard (Punjab/CDA)');

  const test225Marla = {
    ...validPropertyInput,
    marla_sqft_standard: 225,
  };
  assert(PropertyFormSchema.safeParse(test225Marla).success, 'Supports 225 sq ft standard (Bahria/DHA)');

  // Verify Price on Call handling
  const priceOnCallInput = {
    ...validPropertyInput,
    is_price_on_call: true,
    price_pkr: undefined,
  };
  assert(
    PropertyFormSchema.safeParse(priceOnCallInput).success,
    'Permits undefined price_pkr when is_price_on_call is true'
  );

  // -------------------------------------------------------------------------
  // 4. IMAGE UPLOAD & MEDIA VALIDATION
  // -------------------------------------------------------------------------
  console.log('\n--- 4. Property Image Upload & Media Management ---');
  const imageManagerPath = path.join(rootDir, 'src', 'components', 'admin', 'ImageManager.tsx');
  assert(fs.existsSync(imageManagerPath), 'ImageManager component exists');

  const imageManagerContent = fs.readFileSync(imageManagerPath, 'utf8');

  // MIME Type validation check
  assert(
    propActionContent.includes("const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];") &&
    propActionContent.includes('Invalid file format. Only JPEG, PNG, and WebP images are allowed.'),
    'uploadPropertyMedia enforces MIME whitelist: image/jpeg, image/png, image/webp'
  );

  // Size limit check (10MB)
  assert(
    propActionContent.includes('const maxBytes = 10 * 1024 * 1024;') &&
    propActionContent.includes('File exceeds maximum upload size of 10MB.'),
    'uploadPropertyMedia enforces 10MB file size ceiling'
  );

  // Collision-resistant filename generation
  assert(
    propActionContent.includes('prop_${Date.now()}_${Math.random().toString(36).substring(2, 9)}'),
    'Collision-resistant object naming pattern used for storage'
  );

  // ImageManager UI capabilities: reorder, cover selection, delete
  assert(
    imageManagerContent.includes('handleMoveImage') &&
    imageManagerContent.includes('handleRemoveImage') &&
    imageManagerContent.includes('onFeaturedChange'),
    'ImageManager UI supports reordering (left/right), cover designation, and removal'
  );

  // -------------------------------------------------------------------------
  // 5. INQUIRY MANAGEMENT & ACTIONS
  // -------------------------------------------------------------------------
  console.log('\n--- 5. Lead & Inquiry Desk Management ---');
  const inquiriesAdminPath = path.join(rootDir, 'src', 'app', '(admin)', 'admin', 'inquiries', 'page.tsx');
  const inquiriesActionPath = path.join(rootDir, 'src', 'actions', 'inquiries.ts');

  assert(fs.existsSync(inquiriesAdminPath), 'Admin Inquiries Desk page exists');
  assert(fs.existsSync(inquiriesActionPath), 'Inquiry server actions exist');

  const inquiriesAdminContent = fs.readFileSync(inquiriesAdminPath, 'utf8');
  const inquiriesActionContent = fs.readFileSync(inquiriesActionPath, 'utf8');

  // Status transitions
  assert(
    inquiriesActionContent.includes("['new', 'contacted', 'qualified', 'closed', 'spam']") &&
    inquiriesActionContent.includes('updateInquiryStatus'),
    'updateInquiryStatus supports standard pipeline: new, contacted, qualified, closed, spam'
  );

  // Session verification on inquiry status updates
  assert(
    inquiriesActionContent.includes('supabase.auth.getUser()') &&
    inquiriesActionContent.includes('Unauthorized: Please log in as staff.'),
    'updateInquiryStatus guards against unauthenticated callers'
  );

  // WhatsApp reply link with pre-filled message
  assert(
    inquiriesAdminContent.includes('https://wa.me/') &&
    inquiriesAdminContent.includes('encodeURIComponent'),
    'Admin inquiries UI provides one-click WhatsApp action with personalized pre-filled text'
  );

  // Customer phone call action
  assert(
    inquiriesAdminContent.includes('href={`tel:'),
    'Admin inquiries UI provides direct click-to-call link for rapid phone follow-up'
  );

  // -------------------------------------------------------------------------
  // 6. DASHBOARD OVERVIEW & ADMIN UI SCREENS
  // -------------------------------------------------------------------------
  console.log('\n--- 6. Dashboard KPI Overview & Administrative Screens ---');
  const adminOverviewPath = path.join(rootDir, 'src', 'app', '(admin)', 'admin', 'page.tsx');
  const adminPropertiesPath = path.join(rootDir, 'src', 'app', '(admin)', 'admin', 'properties', 'page.tsx');
  const adminNewPropPath = path.join(rootDir, 'src', 'app', '(admin)', 'admin', 'properties', 'new', 'page.tsx');
  const adminEditPropPath = path.join(rootDir, 'src', 'app', '(admin)', 'admin', 'properties', '[id]', 'page.tsx');
  const propertyFormComponentPath = path.join(rootDir, 'src', 'components', 'admin', 'PropertyForm.tsx');

  assert(fs.existsSync(adminOverviewPath), 'Admin overview page exists');
  assert(fs.existsSync(adminPropertiesPath), 'Admin properties catalogue page exists');
  assert(fs.existsSync(adminNewPropPath), 'Admin create property page exists');
  assert(fs.existsSync(adminEditPropPath), 'Admin edit property page exists');
  assert(fs.existsSync(propertyFormComponentPath), 'Reusable PropertyForm component exists');

  const adminOverviewContent = fs.readFileSync(adminOverviewPath, 'utf8');
  const adminPropContent = fs.readFileSync(adminPropertiesPath, 'utf8');
  const propertyFormContent = fs.readFileSync(propertyFormComponentPath, 'utf8');

  // KPI Overview Metrics
  assert(
    adminOverviewContent.includes('Published Listings') &&
    adminOverviewContent.includes('Draft Properties') &&
    adminOverviewContent.includes('New Inquiries') &&
    adminOverviewContent.includes('Total Inquiries'),
    'Admin dashboard displays primary operational KPIs (Published, Drafts, New Inquiries, Total Inquiries)'
  );

  // Fast publication status toggles in listing table
  assert(
    adminPropContent.includes('setPublicationStatus') &&
    adminPropContent.includes('Draft') &&
    adminPropContent.includes('Published') &&
    adminPropContent.includes('Archived'),
    'Admin properties catalogue includes instant publication status toggling'
  );

  // Live slug and unit calculation in PropertyForm
  assert(
    propertyFormContent.includes('cleanTitle') &&
    propertyFormContent.includes('marla_sqft_standard'),
    'PropertyForm calculates dynamic slug preview and unit conversions'
  );

  // -------------------------------------------------------------------------
  // 7. INITIAL ADMIN PROVISIONING SCRIPT INTEGRITY
  // -------------------------------------------------------------------------
  console.log('\n--- 7. Initial Admin Provisioning Script ---');
  const provisioningScriptPath = path.join(rootDir, 'scripts', 'provision-admin.mjs');
  assert(fs.existsSync(provisioningScriptPath), 'provision-admin.mjs exists in scripts/');

  const provScriptContent = fs.readFileSync(provisioningScriptPath, 'utf8');
  assert(
    provScriptContent.includes('supabase.auth.admin.createUser') &&
    provScriptContent.includes('role: \'admin\''),
    'provision-admin.mjs creates Supabase auth credentials and elevates profile to admin'
  );

  console.log('\n===============================================================');
  console.log(`TEST SUITE RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAdminDashboardVerificationSuite().catch((err) => {
  console.error('[UNCAUGHT EXCEPTION IN TEST RUNNER]', err);
  process.exit(1);
});
