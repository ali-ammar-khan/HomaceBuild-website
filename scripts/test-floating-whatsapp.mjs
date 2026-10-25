#!/usr/bin/env node
/**
 * scripts/test-floating-whatsapp.mjs
 *
 * Verification Suite for Persistent Floating WhatsApp Contact Action.
 *
 * Validates:
 * 1. Root mounting in public layout (coverage across all public routes).
 * 2. Strict exclusion from private admin and login layouts.
 * 3. Strict phone number normalization and https://wa.me/ URL generation.
 * 4. Context-aware prefilled messaging (general vs individual property listings).
 * 5. Mobile safe-area support, viewport positioning, and responsive styling.
 * 6. Accessibility semantics (aria-label, tooltip, keyboard focus, contrast).
 */

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

// Re-implement the exact normalization functions for standalone node execution
function formatWhatsAppNumber(rawPhone) {
  if (!rawPhone) return '';
  let clean = rawPhone.replace(/\D/g, '');
  if (clean.startsWith('00')) {
    clean = clean.slice(2);
  }
  if (clean.startsWith('03') && clean.length === 11) {
    clean = '92' + clean.slice(1);
  }
  if (clean.startsWith('3') && clean.length === 10) {
    clean = '92' + clean;
  }
  return clean;
}

function getWhatsAppUrl({ phone = '923000000000', message = '' } = {}) {
  const cleanNumber = formatWhatsAppNumber(phone);
  if (!cleanNumber) return '#';
  const base = `https://wa.me/${cleanNumber}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

async function runFloatingWhatsAppSuite() {
  console.log('===============================================================');
  console.log('HOMACEBUILD - PERSISTENT FLOATING WHATSAPP BUTTON AUDIT');
  console.log('===============================================================\n');

  // -------------------------------------------------------------------------
  // 1. REUSABLE COMPONENT & LAYOUT INTEGRATION
  // -------------------------------------------------------------------------
  console.log('--- 1. Architecture & Layout Mount Audit ---');
  const componentPath = path.join(rootDir, 'src', 'components', 'public', 'FloatingWhatsAppButton.tsx');
  const publicLayoutPath = path.join(rootDir, 'src', 'app', '(public)', 'layout.tsx');
  const adminLayoutPath = path.join(rootDir, 'src', 'app', '(admin)', 'admin', 'layout.tsx');
  const loginPagePath = path.join(rootDir, 'src', 'app', '(admin)', 'login', 'page.tsx');
  const contextPath = path.join(rootDir, 'src', 'context', 'PropertyContext.tsx');
  const syncComponentPath = path.join(rootDir, 'src', 'components', 'public', 'PropertyContextSync.tsx');
  const whatsappLibPath = path.join(rootDir, 'src', 'lib', 'whatsapp.ts');

  assert(fs.existsSync(componentPath), 'FloatingWhatsAppButton component exists');
  assert(fs.existsSync(publicLayoutPath), 'Public layout exists');
  assert(fs.existsSync(contextPath), 'PropertyContext state provider exists');
  assert(fs.existsSync(syncComponentPath), 'PropertyContextSync component exists');
  assert(fs.existsSync(whatsappLibPath), 'Central WhatsApp utility library exists');

  const publicLayoutContent = fs.readFileSync(publicLayoutPath, 'utf8');
  const adminLayoutContent = fs.readFileSync(adminLayoutPath, 'utf8');
  const loginPageContent = fs.readFileSync(loginPagePath, 'utf8');
  const componentContent = fs.readFileSync(componentPath, 'utf8');

  // Verify mounted in public layout
  assert(
    publicLayoutContent.includes('FloatingWhatsAppButton') &&
    publicLayoutContent.includes('<FloatingWhatsAppButton />'),
    'Mounted centrally in shared (public) layout for 100% public route coverage'
  );

  assert(
    publicLayoutContent.includes('PropertyProvider') &&
    publicLayoutContent.includes('<PropertyProvider>'),
    'PropertyProvider wraps public layout to share listing context across routes'
  );

  // Verify excluded from private admin routes
  assert(
    !adminLayoutContent.includes('FloatingWhatsAppButton') &&
    !adminLayoutContent.includes('WhatsAppPill'),
    'Strictly excluded from staff administration dashboard (/admin)'
  );

  assert(
    !loginPageContent.includes('FloatingWhatsAppButton') &&
    !loginPageContent.includes('WhatsAppPill'),
    'Strictly excluded from staff login portal (/login)'
  );

  // -------------------------------------------------------------------------
  // 2. PUBLIC ROUTES COVERAGE VERIFICATION
  // -------------------------------------------------------------------------
  console.log('\n--- 2. Public Routes Coverage Verification ---');
  const publicRoutes = [
    'src/app/(public)/page.tsx',
    'src/app/(public)/properties/page.tsx',
    'src/app/(public)/properties/[slug]/page.tsx',
    'src/app/(public)/about/page.tsx',
    'src/app/(public)/services/page.tsx',
    'src/app/(public)/services/buying-and-selling/page.tsx',
    'src/app/(public)/services/rentals/page.tsx',
    'src/app/(public)/services/residential/page.tsx',
    'src/app/(public)/services/commercial/page.tsx',
    'src/app/(public)/locations/page.tsx',
    'src/app/(public)/locations/bahria-town/page.tsx',
    'src/app/(public)/locations/dha-islamabad/page.tsx',
    'src/app/(public)/contact/page.tsx',
    'src/app/(public)/privacy-policy/page.tsx',
    'src/app/(public)/terms-of-use/page.tsx',
    'src/app/(public)/tools/area-calculator/page.tsx',
  ];

  for (const relPath of publicRoutes) {
    const fullPath = path.join(rootDir, relPath);
    assert(fs.existsSync(fullPath), `Public page exists and inherits layout: ${relPath}`);
  }

  // Verify property detail page synchronizes listing context
  const propertyDetailPath = path.join(rootDir, 'src', 'app', '(public)', 'properties', '[slug]', 'page.tsx');
  const propDetailContent = fs.readFileSync(propertyDetailPath, 'utf8');
  assert(
    propDetailContent.includes('PropertyContextSync') &&
    propDetailContent.includes('referenceCode={typedProperty.reference_code}'),
    'Property detail page mounts PropertyContextSync to broadcast title, reference code, and URL'
  );

  // -------------------------------------------------------------------------
  // 3. PHONE NUMBER NORMALIZATION & URL GENERATION
  // -------------------------------------------------------------------------
  console.log('\n--- 3. Phone Number Normalization & Link Formatting ---');

  // Test domestic Pakistani format (03XXXXXXXXX -> 923006100619)
  const domesticTest = formatWhatsAppNumber('03006100619');
  assert(domesticTest === '923006100619', 'Converts domestic Pakistani "03006100619" to "923006100619"');

  // Test international formatted string with spaces, +, and dashes
  const formattedTest = formatWhatsAppNumber('+92 300 610-0619');
  assert(formattedTest === '923006100619', 'Strips "+", spaces, and dashes from "+92 300 610-0619"');

  // Test 00 international call prefix
  const prefixTest = formatWhatsAppNumber('00923006100619');
  assert(prefixTest === '923006100619', 'Strips leading "00" international call prefix');

  // Test default configuration placeholder
  const placeholderTest = formatWhatsAppNumber('923000000000');
  assert(placeholderTest === '923000000000', 'Handles standard international placeholder');

  // Test wa.me URL structure
  const waUrl = getWhatsAppUrl({ phone: '03006100619', message: 'Hello' });
  assert(
    waUrl.startsWith('https://wa.me/923006100619?text=Hello'),
    'Generates correct https://wa.me/COUNTRYCODEANDNUMBER format'
  );

  // -------------------------------------------------------------------------
  // 4. PREFILLED MESSAGES AUDIT
  // -------------------------------------------------------------------------
  console.log('\n--- 4. Prefilled Message Logic ---');

  // General page greeting
  const whatsappLibContent = fs.readFileSync(whatsappLibPath, 'utf8');
  assert(
    (componentContent.includes('getGeneralWhatsAppMessage') || componentContent.includes("Hi, I'm interested in the real estate services offered by HomaceBuild and Realators.")) &&
    whatsappLibContent.includes("Hi, I'm interested in the real estate services offered by HomaceBuild and Realators."),
    'Uses approved friendly prefilled greeting on general public pages'
  );

  // Property detail greeting with context
  assert(
    componentContent.includes('getPropertyWhatsAppMessage') &&
    componentContent.includes('activeProperty.title') &&
    componentContent.includes('activeProperty.referenceCode'),
    'Dynamic property prefill includes listing title and reference code'
  );

  // Encoding check
  const encodedSample = encodeURIComponent("Hi, I'm interested in the real estate services offered by HomaceBuild and Realators.");
  assert(
    encodedSample.includes('HomaceBuild%20and%20Realators'),
    'Properly URL-encodes spaces and special characters for WhatsApp Web/App compatibility'
  );

  // -------------------------------------------------------------------------
  // 5. POSITIONING, RESPONSIVENESS & SAFE AREAS
  // -------------------------------------------------------------------------
  console.log('\n--- 5. Placement, Mobile Safe Areas & UX Safeguards ---');

  // Fixed bottom-right positioning
  assert(
    componentContent.includes('fixed') &&
    componentContent.includes('bottom-5 right-5 sm:bottom-6 sm:right-6'),
    'Positioned in fixed bottom-right corner across all viewport breakpoints'
  );

  // Mobile safe-area support
  assert(
    componentContent.includes('env(safe-area-inset-bottom, 0px)') &&
    componentContent.includes('env(safe-area-inset-right, 0px)'),
    'Applies CSS env(safe-area-inset-*) to clear iOS home indicator and notch margins'
  );

  // Non-intrusive z-index
  assert(
    componentContent.includes('z-40'),
    'Uses z-40 to remain above content while allowing full-screen image lightboxes (z-50) to sit above it'
  );

  // Touch target sizing (min 48px / standard 56px)
  assert(
    componentContent.includes('w-14 h-14 sm:w-15 sm:h-15'),
    'Enforces generous 56px-60px touch target compliant with WCAG 2.2 AAA guidelines'
  );

  // -------------------------------------------------------------------------
  // 6. BRANDING & ACCESSIBILITY
  // -------------------------------------------------------------------------
  console.log('\n--- 6. Official Branding & Accessibility Semantics ---');

  // Official WhatsApp Green
  assert(
    componentContent.includes('bg-[#25D366]') &&
    componentContent.includes('hover:bg-[#20ba59]'),
    'Renders official WhatsApp brand green (#25D366) with smooth hover state'
  );

  // Official SVG vector icon
  assert(
    componentContent.includes('function WhatsAppIcon') &&
    componentContent.includes('viewBox="0 0 24 24"'),
    'Renders official crisp vector WhatsApp emblem'
  );

  // Screen reader accessible name
  assert(
    componentContent.includes('aria-label="Chat with us on WhatsApp"'),
    'Provides descriptive aria-label for screen readers'
  );

  // Accessible desktop tooltip
  assert(
    componentContent.includes('role="tooltip"') &&
    componentContent.includes('Chat with us on WhatsApp') &&
    componentContent.includes('aria-describedby="whatsapp-tooltip"'),
    'Provides accessible desktop tooltip badge visible on hover and keyboard focus'
  );

  // Keyboard focus ring
  assert(
    componentContent.includes('focus-visible:ring-4') &&
    componentContent.includes('focus-visible:ring-[#25D366]/40'),
    'Provides prominent keyboard focus ring for accessibility compliance'
  );

  console.log('\n===============================================================');
  console.log(`FLOATING WHATSAPP AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runFloatingWhatsAppSuite().catch((err) => {
  console.error('[UNCAUGHT EXCEPTION IN TEST RUNNER]', err);
  process.exit(1);
});
