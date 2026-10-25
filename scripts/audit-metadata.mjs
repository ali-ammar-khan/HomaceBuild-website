import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(walk(full));
    } else if (file === 'page.tsx' || file === 'layout.tsx') {
      results.push(full);
    }
  }
  return results;
}

const files = walk('./src/app');

console.log('--- METADATA AUDIT ---');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const hasMetadata = content.includes('export const metadata') || content.includes('export async function generateMetadata');
  const hasRobots = content.includes('robots:');
  const hasCanonical = content.includes('canonical:');
  const hasTitle = content.includes('title:');
  const hasDesc = content.includes('description:');
  const isClient = content.includes("'use client'");

  const rel = path.relative('./src/app', f);
  console.log(`${rel}:`);
  console.log(`  Client Component: ${isClient}`);
  console.log(`  Has Metadata Export: ${hasMetadata}`);
  console.log(`  Has Title: ${hasTitle}`);
  console.log(`  Has Description: ${hasDesc}`);
  console.log(`  Has Canonical: ${hasCanonical}`);
  console.log(`  Has Robots Directive: ${hasRobots}`);
});
