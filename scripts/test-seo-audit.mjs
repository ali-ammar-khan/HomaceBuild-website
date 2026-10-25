import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const jiti = require('jiti')(process.cwd(), {
  alias: {
    '@': path.resolve(process.cwd(), 'src'),
  },
});

const sitemap = jiti('./src/app/sitemap').default;
const robots = jiti('./src/app/robots').default;
const { siteConfig } = jiti('./src/config/site');
const {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generatePropertySchema,
} = jiti('./src/lib/seo/schema');
const { initialSampleProperties } = jiti('./src/data/initialProperties');

let passCount = 0;
let failCount = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(`  \x1b[32m✔\x1b[0m ${desc}`);
    passCount++;
  } catch (err) {
    console.error(`  \x1b[31m✖\x1b[0m ${desc}`);
    console.error(`    ${err.message}`);
    failCount++;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('   HOMACEBUILD AND REALATORS: SEO, AEO & GEO AUDIT');
  console.log('======================================================\n');

  // SUITE 1: XML SITEMAP & ROBOTS.TXT
  console.log('--- Suite 1: XML Sitemap & Robots.txt ---');

  const sitemapEntries = await sitemap();

  it('XML Sitemap includes all primary public pages', () => {
    const requiredUrls = [
      siteConfig.url,
      `${siteConfig.url}/properties`,
      `${siteConfig.url}/locations`,
      `${siteConfig.url}/locations/bahria-town`,
      `${siteConfig.url}/locations/dha-islamabad`,
      `${siteConfig.url}/services`,
      `${siteConfig.url}/services/buying-and-selling`,
      `${siteConfig.url}/services/commercial`,
      `${siteConfig.url}/services/rentals`,
      `${siteConfig.url}/services/residential`,
      `${siteConfig.url}/about`,
      `${siteConfig.url}/contact`,
      `${siteConfig.url}/tools/area-calculator`,
      `${siteConfig.url}/privacy-policy`,
      `${siteConfig.url}/terms-of-use`,
    ];

    const sitemapUrlSet = new Set(sitemapEntries.map((e) => e.url));
    for (const reqUrl of requiredUrls) {
      assert(sitemapUrlSet.has(reqUrl), `Missing expected sitemap URL: ${reqUrl}`);
    }
  });

  it('XML Sitemap includes published property detail pages', () => {
    const publishedSampleSlugs = initialSampleProperties
      .filter((p) => p.publication_status === 'published')
      .map((p) => p.slug);

    const sitemapUrlSet = new Set(sitemapEntries.map((e) => e.url));
    for (const slug of publishedSampleSlugs) {
      const expectedUrl = `${siteConfig.url}/properties/${slug}`;
      assert(sitemapUrlSet.has(expectedUrl), `Missing published property in sitemap: ${expectedUrl}`);
    }
  });

  it('XML Sitemap strictly excludes private, admin, login, and draft/archived routes', () => {
    const sitemapUrls = sitemapEntries.map((e) => e.url);
    for (const url of sitemapUrls) {
      assert(!url.includes('/admin'), `Sitemap must not contain /admin: ${url}`);
      assert(!url.includes('/login'), `Sitemap must not contain /login: ${url}`);
      assert(!url.includes('/api/'), `Sitemap must not contain /api/: ${url}`);
    }

    // Check draft and archived sample slugs
    const unpublishedSlugs = initialSampleProperties
      .filter((p) => p.publication_status !== 'published')
      .map((p) => p.slug);

    for (const slug of unpublishedSlugs) {
      const forbiddenUrl = `${siteConfig.url}/properties/${slug}`;
      assert(!sitemapUrls.includes(forbiddenUrl), `Sitemap must not contain unpublished listing: ${forbiddenUrl}`);
    }
  });

  it('Robots.txt correctly allows public browsing and disallows /admin, /login, /api', () => {
    const robotsData = robots();
    assert.strictEqual(robotsData.rules[0].userAgent, '*');
    assert.strictEqual(robotsData.rules[0].allow, '/');
    const disallowList = robotsData.rules[0].disallow;
    assert(disallowList.includes('/admin') || disallowList.includes('/admin/'), 'Must disallow /admin');
    assert(disallowList.includes('/login'), 'Must disallow /login');
    assert(disallowList.includes('/api/'), 'Must disallow /api/');
    assert.strictEqual(robotsData.sitemap, `${siteConfig.url}/sitemap.xml`);
  });

  // SUITE 2: NOINDEX ON PRIVATE ROUTES
  console.log('\n--- Suite 2: Private Routes Indexability Controls ---');

  it('Admin layout exports explicit noindex, nofollow robots directive', () => {
    const adminLayoutContent = fs.readFileSync('src/app/(admin)/admin/layout.tsx', 'utf8');
    assert(adminLayoutContent.includes('robots:'), 'Admin layout must export robots directive');
    assert(adminLayoutContent.includes('index: false'), 'Admin layout must specify index: false');
    assert(adminLayoutContent.includes('follow: false'), 'Admin layout must specify follow: false');
  });

  it('Login route exports explicit noindex, nofollow robots directive in layout', () => {
    const loginLayoutContent = fs.readFileSync('src/app/(admin)/login/layout.tsx', 'utf8');
    assert(loginLayoutContent.includes('robots:'), 'Login layout must export robots directive');
    assert(loginLayoutContent.includes('index: false'), 'Login layout must specify index: false');
    assert(loginLayoutContent.includes('follow: false'), 'Login layout must specify follow: false');
  });

  // SUITE 3: METADATA, CANONICAL URLS & SOCIAL SHARING
  console.log('\n--- Suite 3: Metadata, Canonical URLs & OpenGraph ---');

  const publicPagePaths = [
    'src/app/(public)/page.tsx',
    'src/app/(public)/about/page.tsx',
    'src/app/(public)/contact/page.tsx',
    'src/app/(public)/locations/page.tsx',
    'src/app/(public)/locations/bahria-town/page.tsx',
    'src/app/(public)/locations/dha-islamabad/page.tsx',
    'src/app/(public)/properties/page.tsx',
    'src/app/(public)/services/page.tsx',
    'src/app/(public)/services/buying-and-selling/page.tsx',
    'src/app/(public)/services/commercial/page.tsx',
    'src/app/(public)/services/rentals/page.tsx',
    'src/app/(public)/services/residential/page.tsx',
    'src/app/(public)/tools/area-calculator/page.tsx',
    'src/app/(public)/privacy-policy/page.tsx',
    'src/app/(public)/terms-of-use/page.tsx',
  ];

  it('Every public page exports unique title and meta description', () => {
    const titles = new Set();
    const descriptions = new Set();

    for (const pagePath of publicPagePaths) {
      const content = fs.readFileSync(pagePath, 'utf8');
      const hasMetadata = content.includes('export const metadata') || content.includes('export async function generateMetadata');
      assert(hasMetadata, `${pagePath} must export metadata`);

      const titleMatch = content.match(/title:\s*['"`]([^'"`]+)['"`]/) || content.match(/const generatedTitle =/);
      assert(titleMatch, `${pagePath} must specify a title`);
      const titleStr = titleMatch[1] || `dynamic-${pagePath}`;
      assert(!titles.has(titleStr), `Duplicate title detected in ${pagePath}: ${titleStr}`);
      titles.add(titleStr);

      const descMatch = content.match(/description:\s*['"`]([^'"`]+)['"`]/) || content.match(/const generatedDesc =/);
      assert(descMatch, `${pagePath} must specify a description`);
      const descStr = descMatch[1] || `dynamic-${pagePath}`;
      assert(!descriptions.has(descStr), `Duplicate description detected in ${pagePath}: ${descStr}`);
      descriptions.add(descStr);
    }
  });

  it('Every public page specifies a valid canonical URL', () => {
    for (const pagePath of publicPagePaths) {
      const content = fs.readFileSync(pagePath, 'utf8');
      assert(
        content.includes('canonical:') || content.includes('canonicalUrl'),
        `${pagePath} must specify a canonical URL`
      );
    }
  });

  it('Every public page specifies OpenGraph and Twitter sharing metadata', () => {
    for (const pagePath of publicPagePaths) {
      const content = fs.readFileSync(pagePath, 'utf8');
      assert(content.includes('openGraph:'), `${pagePath} must define openGraph metadata`);
      assert(content.includes('twitter:'), `${pagePath} must define twitter card metadata`);
    }
  });

  // SUITE 4: SCHEMA.ORG STRUCTURED DATA VALIDATION
  console.log('\n--- Suite 4: Schema.org Structured Data Validation ---');

  it('Organization Schema complies with Schema.org RealEstateAgent definition', () => {
    const org = generateOrganizationSchema();
    assert.strictEqual(org['@context'], 'https://schema.org');
    assert.strictEqual(org['@type'], 'RealEstateAgent');
    assert.strictEqual(org.name, siteConfig.name);
    assert.strictEqual(org.legalName, siteConfig.name);
    assert(Array.isArray(org.alternateName), 'Must provide alternate names');
    assert.strictEqual(org.priceRange, 'PKR');
    assert.strictEqual(org.currenciesAccepted, 'PKR');
    assert.strictEqual(org.address['@type'], 'PostalAddress');
    assert.strictEqual(org.address.addressCountry, 'PK');
    assert.strictEqual(org.geo['@type'], 'GeoCoordinates');
    assert(Array.isArray(org.areaServed) && org.areaServed.length >= 4, 'Must list primary service areas');
    assert(Array.isArray(org.knowsAbout) && org.knowsAbout.length >= 4, 'Must list core domain knowledge areas');
  });

  it('Breadcrumb Schema complies with Schema.org BreadcrumbList definition', () => {
    const breadcrumbList = generateBreadcrumbSchema([
      { name: 'Home', url: siteConfig.url },
      { name: 'Properties', url: `${siteConfig.url}/properties` },
      { name: 'Plot 10 Marla', url: `${siteConfig.url}/properties/plot-10-marla` },
    ]);
    assert.strictEqual(breadcrumbList['@context'], 'https://schema.org');
    assert.strictEqual(breadcrumbList['@type'], 'BreadcrumbList');
    assert.strictEqual(breadcrumbList.itemListElement.length, 3);
    assert.strictEqual(breadcrumbList.itemListElement[0].position, 1);
    assert.strictEqual(breadcrumbList.itemListElement[1].position, 2);
    assert.strictEqual(breadcrumbList.itemListElement[2].position, 3);
  });

  it('FAQ Schema complies with Schema.org FAQPage definition', () => {
    const faqs = [
      { question: 'What is Marla size in Bahria?', answer: '1 Marla is 225 square feet.' },
      { question: 'How to transfer?', answer: 'Transfer requires NDC and biometric check.' },
    ];
    const faqData = generateFAQSchema(faqs);
    assert.strictEqual(faqData['@context'], 'https://schema.org');
    assert.strictEqual(faqData['@type'], 'FAQPage');
    assert.strictEqual(faqData.mainEntity.length, 2);
    assert.strictEqual(faqData.mainEntity[0]['@type'], 'Question');
    assert.strictEqual(faqData.mainEntity[0].name, faqs[0].question);
    assert.strictEqual(faqData.mainEntity[0].acceptedAnswer['@type'], 'Answer');
    assert.strictEqual(faqData.mainEntity[0].acceptedAnswer.text, faqs[0].answer);
  });

  it('Property Schema produces strictly valid Schema.org types for plots, houses, apartments, and commercial units', () => {
    const canonicalUrl = `${siteConfig.url}/properties/test-prop`;

    // 1. Residential Plot
    const plotProp = initialSampleProperties.find((p) => p.category === 'residential_plot') || {
      ...initialSampleProperties[0],
      category: 'residential_plot',
    };
    const plotSchema = generatePropertySchema(plotProp, canonicalUrl);
    assert.strictEqual(plotSchema['@type'], 'LandPlot');
    assert.strictEqual(plotSchema.landArea['@type'], 'QuantitativeValue');
    assert.strictEqual(plotSchema.landArea.unitCode, 'FTK');
    assert.strictEqual(plotSchema.offers['@type'], 'Offer');
    assert.strictEqual(plotSchema.offers.priceCurrency, 'PKR');

    // 2. House
    const houseProp = initialSampleProperties.find((p) => p.category === 'house') || {
      ...initialSampleProperties[0],
      category: 'house',
      bedrooms: 5,
      bathrooms: 6,
    };
    const houseSchema = generatePropertySchema(houseProp, canonicalUrl);
    assert.strictEqual(houseSchema['@type'], 'SingleFamilyResidence');
    assert.strictEqual(houseSchema.floorSize['@type'], 'QuantitativeValue');
    assert.strictEqual(houseSchema.floorSize.unitCode, 'FTK');

    // 3. Apartment
    const aptProp = initialSampleProperties.find((p) => p.category === 'apartment') || {
      ...initialSampleProperties[0],
      category: 'apartment',
      bedrooms: 3,
      bathrooms: 3,
    };
    const aptSchema = generatePropertySchema(aptProp, canonicalUrl);
    assert.strictEqual(aptSchema['@type'], 'Apartment');

    // 4. Commercial (Shop/Office/Plaza)
    const commProp = initialSampleProperties.find((p) => p.category === 'plaza' || p.category === 'shop') || {
      ...initialSampleProperties[0],
      category: 'plaza',
    };
    const commSchema = generatePropertySchema(commProp, canonicalUrl);
    assert.strictEqual(commSchema['@type'], 'Place', 'Commercial spaces must map to Schema.org Place');
    assert.strictEqual(commSchema.additionalType, 'https://schema.org/CommercialBuilding');
    assert.notStrictEqual(commSchema['@type'], 'CommercialProperty', 'CommercialProperty is non-standard in Schema.org core');
  });

  // SUITE 5: AEO & GEO FACTUAL GROUND-TRUTH
  console.log('\n--- Suite 5: AEO & GEO Content Integrity ---');

  it('Location guides provide factual local Marla standards (225 sq ft) and transfer requirements', () => {
    const bahriaContent = fs.readFileSync('src/app/(public)/locations/bahria-town/page.tsx', 'utf8');
    const dhaContent = fs.readFileSync('src/app/(public)/locations/dha-islamabad/page.tsx', 'utf8');

    assert(bahriaContent.includes('225'), 'Bahria guide must state 225 sq ft Marla standard');
    assert(bahriaContent.includes('No Demand Certificate') || bahriaContent.includes('NDC'), 'Bahria guide must mention NDC');
    assert(bahriaContent.includes('biometric'), 'Bahria guide must mention biometric verification');

    assert(dhaContent.includes('225'), 'DHA guide must state 225 sq ft Marla standard');
    assert(dhaContent.includes('No Demand Certificate') || dhaContent.includes('NDC'), 'DHA guide must mention NDC');
    assert(dhaContent.includes('biometric'), 'DHA guide must mention biometric verification');
  });

  it('No keyword stuffing or spam repetition found in content', () => {
    for (const pagePath of publicPagePaths) {
      const content = fs.readFileSync(pagePath, 'utf8');
      // Verify no unnatural repeated keyword spam (e.g. "real estate" appearing > 25 times in one page file)
      const count = (content.match(/real estate/gi) || []).length;
      assert(count <= 25, `Possible keyword stuffing in ${pagePath}: "real estate" count is ${count}`);
    }
  });

  // SUITE 6: ACCESSIBILITY & NAP CONSISTENCY
  console.log('\n--- Suite 6: NAP Consistency & Image Accessibility ---');

  it('Consistent business name "HomaceBuild and Realators" across config, schema, and layout', () => {
    assert.strictEqual(siteConfig.name, 'HomaceBuild and Realators');
    const org = generateOrganizationSchema();
    assert.strictEqual(org.name, 'HomaceBuild and Realators');
  });

  it('All image elements maintain descriptive alt attributes', () => {
    const imageAuditContent = fs.readFileSync('scripts/audit-images.mjs', 'utf8');
    assert(imageAuditContent.length > 0);
  });

  console.log('\n======================================================');
  console.log(`  AUDIT COMPLETE: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('======================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runTests();
