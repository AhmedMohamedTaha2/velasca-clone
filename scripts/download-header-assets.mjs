/**
 * Download header SVG assets from velasca.com homepage HTML.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public/images/header');
const iconDir = path.join(root, 'public/icons');

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(iconDir, { recursive: true });

const html = await fetch('https://www.velasca.com/').then((r) => r.text());

const patterns = [
  {
    name: 'velasca-logo-extended-white.svg',
    dir: outDir,
    re: /<svg[^>]*viewBox="0 0 1555\.96 603\.49"[\s\S]*?<\/svg>/,
  },
  {
    name: 'velasca-logo-short.svg',
    dir: outDir,
    re: /<svg[^>]*viewBox="0 0 188 188"[^>]*class="[^"]*StyledBrandLogoShort[^"]*"[\s\S]*?<\/svg>/,
  },
  {
    name: 'icon-search.svg',
    dir: iconDir,
    re: /<svg width="18" height="18" viewBox="0 0 18 18"[\s\S]*?<\/svg>/,
  },
];

for (const { name, dir, re } of patterns) {
  const m = html.match(re);
  if (!m) {
    console.warn('Not found:', name);
    continue;
  }
  const out = path.join(dir, name);
  fs.writeFileSync(out, m[0]);
  console.log('Saved', out, `(${m[0].length} bytes)`);
}
