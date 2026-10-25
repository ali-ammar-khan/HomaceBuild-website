import fs from 'fs';
import path from 'path';

const publicPages = [
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

const titles = new Map();
const descriptions = new Map();

publicPages.forEach((filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract title
  const titleMatch = content.match(/title:\s*['"`]([^'"`]+)['"`]/) || content.match(/titleSegments\.push\([^)]+\)/);
  const title = titleMatch ? titleMatch[1] || 'Dynamic Title' : 'NOT FOUND';

  // Extract description
  const descMatch = content.match(/description:\s*['"`]([^'"`]+)['"`]/) || content.match(/const generatedDesc =/);
  const desc = descMatch ? descMatch[1] || 'Dynamic Description' : 'NOT FOUND';

  console.log(`Page: ${filePath}`);
  console.log(`  Title: ${title}`);
  console.log(`  Description: ${desc.substring(0, 80)}...`);

  if (titles.has(title)) {
    console.error(`  [DUPLICATE TITLE] Matches ${titles.get(title)}`);
  } else {
    titles.set(title, filePath);
  }

  if (descriptions.has(desc)) {
    console.error(`  [DUPLICATE DESCRIPTION] Matches ${descriptions.get(desc)}`);
  } else {
    descriptions.set(desc, filePath);
  }
});

console.log(`\nChecked ${publicPages.length} public pages.`);
console.log(`Unique titles: ${titles.size} / ${publicPages.length}`);
console.log(`Unique descriptions: ${descriptions.size} / ${publicPages.length}`);
