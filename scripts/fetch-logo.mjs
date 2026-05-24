import fs from 'fs';
import path from 'path';

const dir = 'public/images/www.velasca.com_096fb55f-7f73-4c01-8dcf-f5957d8887c8';
const html = await fetch('https://www.velasca.com/').then((r) => r.text());
const re = /<svg[^>]*viewBox="0 0 1555\.96 603\.49"[\s\S]*?<\/svg>/;
const m = html.match(re);
if (!m) {
  console.error('Logo SVG not found in HTML');
  process.exit(1);
}
const out = path.join(dir, 'velasca-logo-extended-white.svg');
fs.writeFileSync(out, m[0]);
console.log('Saved', out, m[0].length, 'bytes');
