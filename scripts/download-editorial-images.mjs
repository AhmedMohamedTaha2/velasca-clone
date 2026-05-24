import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'images', 'editorial');

const images = [
  {
    file: 'made_in_italy_mobile.jpg',
    url: 'https://www.velasca.com/cdn/shop/files/blocco_made_in_italy_mobile_0f963232-9673-43b6-bf2f-6c202b163482.jpg?v=1728573605&width=1400',
  },
  {
    file: 'made_in_italy_desktop.jpg',
    url: 'https://www.velasca.com/cdn/shop/files/lug_2025_blocco_made_in_italy.jpg?v=1756993685&width=1920',
  },
  {
    file: 'bottega_mobile.jpg',
    url: 'https://www.velasca.com/cdn/shop/files/lug2025_blocco_rimando_bottega_mobile.jpg?v=1753777076&width=1400',
  },
  {
    file: 'bottega_desktop.jpg',
    url: 'https://www.velasca.com/cdn/shop/files/lug2025_blocco_rimando_bottega.jpg?v=1753777081&width=1920',
  },
];

fs.mkdirSync(outDir, { recursive: true });

for (const { file, url } of images) {
  const dest = path.join(outDir, file);
  console.log(`Downloading ${file}...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`  → ${dest} (${buf.length} bytes)`);
}

console.log('Done.');
