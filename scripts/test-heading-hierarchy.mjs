import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const publicPages = [
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

console.log('--- HEADING HIERARCHY ACCESSIBILITY AUDIT ---');

let hasErrors = false;

publicPages.forEach((relPath) => {
  const filePath = path.join(rootDir, relPath);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');

  // Count h1 tags
  const h1Matches = content.match(/<h1[\s>]/g) || [];
  const h2Matches = content.match(/<h2[\s>]/g) || [];
  const h3Matches = content.match(/<h3[\s>]/g) || [];

  const h1Count = h1Matches.length;
  const h2Count = h2Matches.length;
  const h3Count = h3Matches.length;

  const pageName = path.basename(path.dirname(filePath)) + '/' + path.basename(filePath);

  if (h1Count !== 1) {
    console.error(`[FAIL] ${pageName}: Expected exactly 1 <h1>, found ${h1Count}`);
    hasErrors = true;
  } else {
    console.log(`[PASS] ${pageName}: Exactly 1 <h1> (h2: ${h2Count}, h3: ${h3Count})`);
  }
});

if (hasErrors) {
  process.exit(1);
} else {
  console.log('\nAll public pages satisfy the single <h1> accessibility requirement.');
}
