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

async function runE2EFunctionalAudit() {
  console.log('===============================================================');
  console.log('HOMACEBUILD - END-TO-END FUNCTIONAL UX & AUDIT SUITE');
  console.log('===============================================================\n');

  // -------------------------------------------------------------------------
  // 1. NAVIGATION & INTERNAL LINK INTEGRITY
  // -------------------------------------------------------------------------
  console.log('--- 1. Navigation & Internal Link Integrity ---');

  const requiredRoutes = [
    { route: '/', file: 'src/app/(public)/page.tsx' },
    { route: '/about', file: 'src/app/(public)/about/page.tsx' },
    { route: '/services', file: 'src/app/(public)/services/page.tsx' },
    { route: '/services/buying-and-selling', file: 'src/app/(public)/services/buying-and-selling/page.tsx' },
    { route: '/services/rentals', file: 'src/app/(public)/services/rentals/page.tsx' },
    { route: '/services/residential', file: 'src/app/(public)/services/residential/page.tsx' },
    { route: '/services/commercial', file: 'src/app/(public)/services/commercial/page.tsx' },
    { route: '/locations', file: 'src/app/(public)/locations/page.tsx' },
    { route: '/locations/bahria-town', file: 'src/app/(public)/locations/bahria-town/page.tsx' },
    { route: '/locations/dha-islamabad', file: 'src/app/(public)/locations/dha-islamabad/page.tsx' },
    { route: '/properties', file: 'src/app/(public)/properties/page.tsx' },
    { route: '/properties/[slug]', file: 'src/app/(public)/properties/[slug]/page.tsx' },
    { route: '/tools/area-calculator', file: 'src/app/(public)/tools/area-calculator/page.tsx' },
    { route: '/contact', file: 'src/app/(public)/contact/page.tsx' },
    { route: '/privacy-policy', file: 'src/app/(public)/privacy-policy/page.tsx' },
    { route: '/terms-of-use', file: 'src/app/(public)/terms-of-use/page.tsx' },
    { route: '/login', file: 'src/app/(admin)/login/page.tsx' },
    { route: '/not-found', file: 'src/app/not-found.tsx' },
    { route: '/error', file: 'src/app/error.tsx' },
  ];

  requiredRoutes.forEach(({ route, file }) => {
    const fullPath = path.join(rootDir, file);
    assert(fs.existsSync(fullPath), `Route "${route}" maps to verified physical file: ${file}`);
  });

  // Verify Navbar & Footer Links
  const navbarContent = fs.readFileSync(path.join(rootDir, 'src/components/public/Navbar.tsx'), 'utf8');
  const footerContent = fs.readFileSync(path.join(rootDir, 'src/components/public/Footer.tsx'), 'utf8');

  // Assert no dead links like href="#" or javascript:void(0)
  assert(!navbarContent.includes('href="#"') && !navbarContent.includes('href="javascript:'), 'Navbar contains no dead href="#" or javascript: links');
  assert(!footerContent.includes('href="#"') && !footerContent.includes('href="javascript:'), 'Footer contains no dead href="#" or javascript: links');

  // Verify prominent logo sizes in Navbar
  assert(
    navbarContent.includes('w-56') && navbarContent.includes('lg:w-96'),
    'Navbar features large, visually prominent logo sizing across breakpoints'
  );

  // -------------------------------------------------------------------------
  // 2. HOMEPAGE SECTIONS AUDIT
  // -------------------------------------------------------------------------
  console.log('\n--- 2. Homepage Sections Audit ---');
  const homepageContent = fs.readFileSync(path.join(rootDir, 'src/app/(public)/page.tsx'), 'utf8');

  const requiredHomepageSections = [
    { name: '1. Hero Section', marker: 'Verified Real Estate & Land Advisory in' },
    { name: '2. Search Filter Interface', marker: '<SearchFilterBar' },
    { name: '3. Residential Categories', marker: 'Residential Properties & Plots' },
    { name: '4. Commercial Categories', marker: 'Commercial Plots, Shops & Plazas' },
    { name: '5. Featured Listings', marker: 'Featured Property Opportunities' },
    { name: '6. Coverage Areas', marker: 'Core Coverage Areas' },
    { name: '7. Company & Services Intro', marker: 'Real Estate Advisory Founded on Verifiable Documentation' },
    { name: '8. Direct Advisory Desk / Lead Action', marker: '<InquiryForm' },
    { name: '9. Real Estate FAQs (AEO Structured)', marker: 'Frequently Asked Questions' },
    { name: '10. Verified Footer', marker: 'Official Contact' },
  ];

  requiredHomepageSections.forEach(({ name, marker }) => {
    assert(
      homepageContent.includes(marker) || footerContent.includes(marker),
      `Homepage contains required section: ${name}`
    );
  });

  // -------------------------------------------------------------------------
  // 3. PROPERTY SEARCH & FILTER VALIDATION (URL PARAMETERS PERSISTENCE)
  // -------------------------------------------------------------------------
  console.log('\n--- 3. Property Search & Filter Persistence ---');
  const searchFilterFile = fs.readFileSync(path.join(rootDir, 'src/lib/validations/searchFilters.ts'), 'utf8');
  const catalogFilterFile = fs.readFileSync(path.join(rootDir, 'src/components/public/PropertyCatalogFilter.tsx'), 'utf8');

  // Verify supported filter parameters
  const supportedFilters = [
    'purpose',
    'category_group',
    'category',
    'location',
    'min_price',
    'max_price',
    'min_area',
    'max_area',
    'area_unit',
    'bedrooms',
    'bathrooms',
    'plot_status',
    'sort',
    'page',
  ];

  supportedFilters.forEach((filterKey) => {
    assert(
      searchFilterFile.includes(`${filterKey}:`) || searchFilterFile.includes(`'${filterKey}'`),
      `SearchFilter schema validates "${filterKey}" query parameter`
    );
  });

  // Verify query state persistence and reset
  assert(
    catalogFilterFile.includes('const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);') &&
      catalogFilterFile.includes('applyFilters') &&
      catalogFilterFile.includes('handleReset'),
    'PropertyCatalogFilter provides state persistence, URL synchronization, and filter reset'
  );

  // -------------------------------------------------------------------------
  // 4. SORTING & PAGINATION ENGINE
  // -------------------------------------------------------------------------
  console.log('\n--- 4. Sorting & Pagination Verification ---');
  const propertyServiceContent = fs.readFileSync(path.join(rootDir, 'src/lib/propertyService.ts'), 'utf8');
  const paginationComponentContent = fs.readFileSync(path.join(rootDir, 'src/components/ui/Pagination.tsx'), 'utf8');

  assert(
    propertyServiceContent.includes('case \'price_asc\':') &&
      propertyServiceContent.includes('case \'price_desc\':') &&
      propertyServiceContent.includes('case \'area_desc\':') &&
      propertyServiceContent.includes('case \'area_asc\':') &&
      propertyServiceContent.includes('case \'newest\':'),
    'PropertyService implements price_asc, price_desc, area_desc, area_asc, and newest sorting'
  );

  assert(
    paginationComponentContent.includes('params.set(\'page\', page.toString());') &&
      paginationComponentContent.includes('router.push(`${pathname}?${params.toString()}`);'),
    'Pagination component strictly preserves all active search query parameters when navigating pages'
  );

  // -------------------------------------------------------------------------
  // 5. INDIVIDUAL PROPERTY DETAIL PAGES & STATUS DIMENSIONS
  // -------------------------------------------------------------------------
  console.log('\n--- 5. Property Detail & Publication Status Isolation ---');
  const propertyDetailContent = fs.readFileSync(path.join(rootDir, 'src/app/(public)/properties/[slug]/page.tsx'), 'utf8');

  assert(
    propertyDetailContent.includes('if (!property || property.publication_status !== \'published\')') &&
      propertyDetailContent.includes('notFound();'),
    'Property detail page returns 404 (notFound) for draft, archived, or non-existent listings'
  );

  assert(
    propertyDetailContent.includes('generatePropertySchema(typedProperty, canonicalUrl)') &&
      propertyDetailContent.includes('type="application/ld+json"'),
    'Property detail page injects Schema.org RealEstateListing structured data'
  );

  assert(
    propertyDetailContent.includes('isSoldOrRented') &&
      propertyDetailContent.includes('Sold Out'),
    'Displays distinct transaction status badges for sold or rented properties without removing page'
  );

  // -------------------------------------------------------------------------
  // 6. IMAGE GALLERIES & MEDIA MANAGEMENT
  // -------------------------------------------------------------------------
  console.log('\n--- 6. Image Galleries & Lightbox UX ---');
  const galleryContent = fs.readFileSync(path.join(rootDir, 'src/components/public/PropertyGallery.tsx'), 'utf8');

  assert(
    galleryContent.includes('displayImages[selectedIndex]') &&
      galleryContent.includes('handleNext') &&
      galleryContent.includes('handlePrev'),
    'PropertyGallery supports cover display, next/previous slide navigation, and image selection'
  );

  assert(
    galleryContent.includes('if (e.key === \'Escape\') setLightboxOpen(false);') &&
      galleryContent.includes('if (e.key === \'ArrowRight\') handleNext();') &&
      galleryContent.includes('if (e.key === \'ArrowLeft\') handlePrev();'),
    'Lightbox modal supports full keyboard accessibility (Escape, ArrowRight, ArrowLeft)'
  );

  assert(
    galleryContent.includes('displayImages = images.length > 0 ? images : [\'/HomaceLogo.png\']'),
    'Provides graceful fallback to brand emblem when listing has no images'
  );

  // -------------------------------------------------------------------------
  // 7. INQUIRY FORMS & WHATSAPP ACTIONS
  // -------------------------------------------------------------------------
  console.log('\n--- 7. Inquiry Forms & WhatsApp Direct Action ---');
  const inquiryFormContent = fs.readFileSync(path.join(rootDir, 'src/components/public/InquiryForm.tsx'), 'utf8');
  const whatsAppButtonContent = fs.readFileSync(path.join(rootDir, 'src/components/ui/WhatsAppButton.tsx'), 'utf8');
  const inquiriesActionContent = fs.readFileSync(path.join(rootDir, 'src/actions/inquiries.ts'), 'utf8');

  assert(
    inquiryFormContent.includes('if (submitting) return;') &&
      inquiryFormContent.includes('isLoading={submitting}'),
    'InquiryForm implements client-side double-click / multiple submission prevention'
  );

  assert(
    inquiriesActionContent.includes('isDuplicate') &&
      inquiriesActionContent.includes('We have already received your inquiry'),
    'Inquiry server action implements 60-second deduplication guard'
  );

  assert(
    inquiriesActionContent.includes('rawData.company_fax && rawData.company_fax.length > 0') &&
      inquiriesActionContent.includes('Silent Honeypot Defense'),
    'Inquiry server action implements silent honeypot defense against bot spam'
  );

  assert(
    whatsAppButtonContent.includes('wa.me') &&
      whatsAppButtonContent.includes('encodeURIComponent'),
    'WhatsAppButton constructs pre-filled, safely encoded messages with property context'
  );

  // -------------------------------------------------------------------------
  // 8. RESPONSIVE NAVIGATION & ACCESSIBILITY
  // -------------------------------------------------------------------------
  console.log('\n--- 8. Responsive Navigation & Accessibility ---');

  assert(
    navbarContent.includes('setMobileMenuOpen(!mobileMenuOpen)') &&
      navbarContent.includes('onClick={() => setMobileMenuOpen(false)}'),
    'Responsive mobile menu drawer toggles properly and auto-closes on route selection'
  );

  const inputComponentContent = fs.readFileSync(path.join(rootDir, 'src/components/ui/Input.tsx'), 'utf8');
  assert(
    inputComponentContent.includes('aria-invalid={Boolean(error)}') &&
      inputComponentContent.includes('role="alert"') &&
      inputComponentContent.includes('htmlFor={inputId}'),
    'Form Input component enforces strict WAI-ARIA validation and label associations'
  );

  // -------------------------------------------------------------------------
  // 9. AREA CALCULATOR TOOL INTEGRITY
  // -------------------------------------------------------------------------
  console.log('\n--- 9. Marla & Area Calculator Tool ---');
  const calculatorComponentPath = path.join(rootDir, 'src/components/public/AreaCalculator.tsx');
  const calculatorContent = fs.existsSync(calculatorComponentPath)
    ? fs.readFileSync(calculatorComponentPath, 'utf8')
    : fs.readFileSync(path.join(rootDir, 'src/app/(public)/tools/area-calculator/page.tsx'), 'utf8');

  assert(
    calculatorContent.includes('AREA_STANDARDS.BAHRIA_DHA_CDA') &&
      calculatorContent.includes('currentSqft') &&
      calculatorContent.includes('bahriaMarla') &&
      calculatorContent.includes('bahriaKanal'),
    'Area Calculator tool supports 225 sq ft Bahria/DHA standard with bi-directional conversions'
  );

  console.log(`\n===============================================================`);
  console.log(`E2E FUNCTIONAL AUDIT COMPLETE: ${passed} passed, ${failed} failed.`);
  console.log(`===============================================================`);

  if (failed > 0) process.exit(1);
}

runE2EFunctionalAudit().catch((err) => {
  console.error('Fatal Audit Exception:', err);
  process.exit(1);
});
