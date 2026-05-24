import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'images', 'newsletter');

const images = [
  {
    file: 'blocco_nwsltr_uomo_background.jpg',
    url: 'https://www.velasca.com/cdn/shop/files/blocco_nwsltr_uomo_background.jpg?v=1757501401&width=1800',
  },
  {
    file: 'blocco_nwsltr_uomo_foto_2.png',
    url: 'https://www.velasca.com/cdn/shop/files/blocco_nwsltr_uomo_foto_2.png?v=1757501406&width=800',
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
