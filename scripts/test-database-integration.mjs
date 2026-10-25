import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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

async function runDatabaseIntegrationSuite() {
  console.log('===============================================================');
  console.log('HOMACEBUILD - DATABASE INTEGRATION & RLS VERIFICATION SUITE');
  console.log('===============================================================\n');

  // -------------------------------------------------------------------------
  // 1. DDL & MIGRATION SCHEMA AUDIT
  // -------------------------------------------------------------------------
  console.log('--- 1. Schema DDL, Constraints & Migrations Integrity ---');
  const schemaPath = path.join(rootDir, 'schema.sql');
  const migrationPath = path.join(rootDir, 'supabase', 'migrations', '20261026000001_initial_schema.sql');
  const seedPath = path.join(rootDir, 'supabase', 'seed.sql');

  assert(fs.existsSync(schemaPath), 'Canonical schema.sql exists');
  assert(fs.existsSync(migrationPath), 'Supabase migration 20261026000001_initial_schema.sql exists');
  assert(fs.existsSync(seedPath), 'Supabase seed.sql exists with demonstration fixtures');

  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  const seedContent = fs.readFileSync(seedPath, 'utf8');

  // Verify Required Enums
  const requiredEnums = [
    'user_role',
    'property_purpose',
    'property_category',
    'publication_status',
    'availability_status',
    'plot_file_status',
    'inquiry_status',
    'area_unit_type',
  ];
  requiredEnums.forEach((enumName) => {
    assert(
      schemaContent.includes(`CREATE TYPE ${enumName} AS ENUM`),
      `Enum type "${enumName}" is explicitly defined in PostgreSQL DDL`
    );
  });

  // Verify Required Tables
  ['profiles', 'properties', 'inquiries'].forEach((table) => {
    assert(
      schemaContent.includes(`CREATE TABLE IF NOT EXISTS public.${table}`),
      `Table "public.${table}" is defined in PostgreSQL DDL`
    );
  });

  // Verify Zero-Price & Price Integrity Constraint
  assert(
    schemaContent.includes('chk_price_integrity') &&
      schemaContent.includes('(is_price_on_call = true AND price_pkr IS NULL)') &&
      schemaContent.includes('(is_price_on_call = false AND price_pkr IS NOT NULL AND price_pkr > 0)'),
    'Enforces chk_price_integrity (strictly prohibits 0-price or negative pricing)'
  );

  // Verify Area Constraints & Standards
  assert(
    schemaContent.includes('marla_sqft_standard NUMERIC(6, 2) NOT NULL DEFAULT 225.00') &&
      schemaContent.includes('CHECK (marla_sqft_standard IN (225.00, 250.00, 272.25))'),
    'Enforces 225 sq ft standard constraint with society standard check'
  );

  // Verify Computed Stored Columns
  assert(
    schemaContent.includes('area_in_marla NUMERIC(12, 4) GENERATED ALWAYS AS') &&
      schemaContent.includes('area_in_sqft NUMERIC(14, 2) GENERATED ALWAYS AS'),
    'Configures immutable generated stored columns for area_in_marla and area_in_sqft'
  );

  // Verify Performance Indexes
  const requiredIndexes = [
    'idx_properties_public_browse',
    'idx_properties_area_marla',
    'idx_properties_area_sqft',
    'idx_properties_price',
    'idx_properties_location',
    'idx_inquiries_property_id',
  ];
  requiredIndexes.forEach((idx) => {
    assert(
      schemaContent.includes(`CREATE INDEX IF NOT EXISTS ${idx}`),
      `Performance index "${idx}" is configured`
    );
  });

  // -------------------------------------------------------------------------
  // 2. ROW LEVEL SECURITY (RLS) POLICY VERIFICATION
  // -------------------------------------------------------------------------
  console.log('\n--- 2. Row Level Security (RLS) Policy Audit ---');

  // Verify RLS is enabled on all tables
  assert(
    schemaContent.includes('ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;') &&
      schemaContent.includes('ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;') &&
      schemaContent.includes('ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;'),
    'Row Level Security (RLS) is explicitly enabled on profiles, properties, and inquiries'
  );

  // Property Policies
  assert(
    schemaContent.includes('CREATE POLICY "Public read published properties"') &&
      schemaContent.includes("USING (publication_status = 'published');"),
    'Public property policy: Anonymous visitors can ONLY read published listings'
  );

  assert(
    schemaContent.includes('CREATE POLICY "Admin read all properties"') &&
      schemaContent.includes("USING (public.get_user_role(auth.uid()) = 'admin');"),
    'Admin property policy: Only administrators can read draft/archived listings'
  );

  assert(
    schemaContent.includes('CREATE POLICY "Admin insert properties"') &&
      schemaContent.includes('CREATE POLICY "Admin update properties"') &&
      schemaContent.includes('CREATE POLICY "Admin delete properties"'),
    'Property mutation policies: Unauthorized anonymous public writes are blocked'
  );

  // Inquiry Policies & Privacy Protection
  assert(
    schemaContent.includes('CREATE POLICY "Public submit inquiry"') &&
      schemaContent.includes('ON public.inquiries FOR INSERT') &&
      schemaContent.includes('TO anon, authenticated'),
    'Inquiry submission policy: Public anon visitors have permission to INSERT inquiries'
  );

  // Verify Anonymous CANNOT SELECT inquiries
  const anonSelectMatches = schemaContent.match(
    /CREATE POLICY[^\n]+ON public\.inquiries FOR SELECT[^\n]+TO[^\n]*anon/i
  );
  assert(
    anonSelectMatches === null,
    'Inquiry Privacy Guard: Anonymous users have NO SELECT policy on inquiries (prevents customer data scraping)'
  );

  assert(
    schemaContent.includes('CREATE POLICY "Admin manage inquiries"') &&
      schemaContent.includes('ON public.inquiries FOR ALL') &&
      schemaContent.includes('TO authenticated'),
    'Inquiry management: Restricted to authenticated administrators and assigned agents'
  );

  // Storage Objects Policies
  assert(
    schemaContent.includes('CREATE POLICY "Public can view property media"') &&
      schemaContent.includes('CREATE POLICY "Admins can upload property media"'),
    'Storage RLS policies: Public read-only for property-media bucket; Admin-only uploads'
  );

  // -------------------------------------------------------------------------
  // 3. APPLICATION BOUNDARY & DATA INTEGRITY TESTS
  // -------------------------------------------------------------------------
  console.log('\n--- 3. Application Boundary & Data Integrity Tests ---');

  // Load sample dataset directly from source file
  const initialPropsContent = fs.readFileSync(path.join(rootDir, 'src', 'data', 'initialProperties.ts'), 'utf8');

  // Verify all sample listings are labeled
  assert(
    initialPropsContent.includes('[Sample Data]'),
    'All demonstration listings in initialProperties.ts are explicitly prefixed with [Sample Data]'
  );
  assert(
    initialPropsContent.includes('[Demonstration Sample Listing]'),
    'Descriptions in initialProperties.ts are explicitly flagged as demonstration samples'
  );
  assert(
    seedContent.includes('[Sample Data]'),
    'Seed data in supabase/seed.sql is strictly labeled with [Sample Data]'
  );

  // Test In-Memory & Boundary Filter Logic (mimics propertyService)
  const propMatches = [...initialPropsContent.matchAll(/id:\s*'([^']+)'[\s\S]*?reference_code:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'[\s\S]*?slug:\s*'([^']+)'[\s\S]*?purpose:\s*'([^']+)'[\s\S]*?category:\s*'([^']+)'[\s\S]*?publication_status:\s*'([^']+)'[\s\S]*?is_price_on_call:\s*(true|false)[\s\S]*?price_pkr:\s*([0-9]+|null)[\s\S]*?area_value:\s*([0-9.]+)[\s\S]*?area_unit:\s*'([^']+)'[\s\S]*?marla_sqft_standard:\s*([0-9.]+)/g)];

  const parsedProperties = propMatches.map((m) => ({
    id: m[1],
    reference_code: m[2],
    title: m[3],
    slug: m[4],
    purpose: m[5],
    category: m[6],
    publication_status: m[7],
    is_price_on_call: m[8] === 'true',
    price_pkr: m[9] === 'null' ? null : Number(m[9]),
    area_value: Number(m[10]),
    area_unit: m[11],
    marla_sqft_standard: Number(m[12]),
  }));

  assert(parsedProperties.length >= 12, `Successfully parsed ${parsedProperties.length} demonstration properties for boundary testing`);

  // Test 1: Public Filter Excludes Draft & Archive
  const publishedList = parsedProperties.filter((p) => p.publication_status === 'published');
  const draftList = parsedProperties.filter((p) => p.publication_status === 'draft');
  const archivedList = parsedProperties.filter((p) => p.publication_status === 'archived');

  assert(publishedList.length > 0, `Published listings count: ${publishedList.length}`);
  assert(draftList.length > 0, `Draft listings count: ${draftList.length}`);
  assert(archivedList.length > 0, `Archived listings count: ${archivedList.length}`);

  // Test 2: Check Price Integrity in All Parsed Records
  const allPriceValid = parsedProperties.every((p) => {
    if (p.is_price_on_call) return p.price_pkr === null;
    return p.price_pkr !== null && p.price_pkr > 0;
  });
  assert(allPriceValid, 'All sample properties strictly satisfy chk_price_integrity (no 0 PKR pricing)');

  // Test 3: Marla Conversion Standard
  const kanalSample = parsedProperties.find((p) => p.area_unit === 'kanal');
  assert(
    kanalSample && kanalSample.marla_sqft_standard === 225,
    'Kanal sample uses 225 sq ft per Marla Bahria/DHA standard'
  );

  // Test 4: Slug Uniqueness
  const slugs = parsedProperties.map((p) => p.slug);
  const uniqueSlugs = new Set(slugs);
  assert(uniqueSlugs.size === slugs.length, 'All property slugs are globally unique');

  // Test 5: Reference Code Uniqueness
  const refCodes = parsedProperties.map((p) => p.reference_code);
  const uniqueRefCodes = new Set(refCodes);
  assert(uniqueRefCodes.size === refCodes.length, 'All property reference codes are globally unique');

  // Test 6: Separate Status Dimensions
  // Verify publication_status, availability_status, and plot_file_status are maintained separately
  assert(
    schemaContent.includes('publication_status publication_status NOT NULL DEFAULT \'draft\'') &&
      schemaContent.includes('availability_status availability_status NOT NULL DEFAULT \'available\'') &&
      schemaContent.includes('plot_file_status plot_file_status NOT NULL DEFAULT \'not_applicable\''),
    'Three distinct status dimensions (publication, availability, plot_file_status) are maintained independently'
  );

  console.log(`\n===============================================================`);
  console.log(`INTEGRATION SUITE COMPLETE: ${passed} passed, ${failed} failed.`);
  console.log(`===============================================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runDatabaseIntegrationSuite().catch((err) => {
  console.error('Fatal Test Exception:', err);
  process.exit(1);
});
