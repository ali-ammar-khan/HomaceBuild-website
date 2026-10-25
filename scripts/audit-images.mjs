import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(file)) {
        results = results.concat(walk(full));
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      results.push(full);
    }
  }
  return results;
}

const files = walk('./src');
const imageRegex = /<(?:Image|SafeImage)\b([^>]*)/g;

let totalImages = 0;
let missingAlt = 0;

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    totalImages++;
    const props = match[1];
    const altMatch = props.match(/alt=\{?([\"'\`][^\"'\`]*[\"'\`]|[^>\s]+)\}?/);
    if (!altMatch || altMatch[0].includes('""') || altMatch[0].includes("''")) {
      console.log(`[FAIL] ${f}: missing or empty alt attribute`);
      missingAlt++;
    } else {
      console.log(`[PASS] ${f}: ${altMatch[0]}`);
    }
  }
});

console.log(`\nTotal Images Checked: ${totalImages}, Missing/Empty Alt: ${missingAlt}`);
