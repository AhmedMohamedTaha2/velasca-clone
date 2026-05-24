import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const outDir = path.join(rootDir, 'public', 'images', 'swiper');
const indexPath = path.join(rootDir, 'index.html');
const imageBase = './public/images/swiper';

const slides = [
  {
    file: 'lug_2025_rimando_lookbook_pe25.jpg',
    url: 'https://www.velasca.com/cdn/shop/files/lug_2025_rimando_lookbook_pe25.jpg?v=1753785789&width=1920',
    alt: "P/E '25 Style Edit",
    cta: "P/E '25 Style Edit",
    href: '/pages/s-s-2025-style-edit',
  },
  {
    file: 'mar2026_rimando_lookbook_pe26.jpg',
    url: 'https://www.velasca.com/cdn/shop/files/mar2026_rimando_lookbook_pe26.jpg?v=1773654472&width=1920',
    alt: 'Inside a historic apartment with Sicilian majolica floors, a man is seated wearing a dark grey Velasca suit with a bordeaux shirt.',
    cta: "Spring/Summer '26",
    href: '/pages/spring-summer-2026',
  },
  {
    file: 'mar2026_rimando_campagna_pe26_sicilia.jpg',
    url: 'https://www.velasca.com/cdn/shop/files/mar2026_rimando_campagna_pe26_sicilia.jpg?v=1773654467&width=1920',
    alt: 'A man in the Sicilian coastal countryside is wearing a beige ribbed double-breasted cardigan and a striped bowling-collar shirt.',
    cta: "S/S '26 in Sicily",
    href: '/pages/spring-summer-2026-in-sicily',
  },
  {
    file: 'dic_2025_blocco_rimando_inverno_sulle_dolomiti.jpg',
    url: 'https://www.velasca.com/cdn/shop/files/dic_2025_blocco_rimando_inverno_sulle_dolomiti.jpg?v=1765964143&width=1920',
    alt: 'A man and a woman ride a wooden sled down a snowy valley. She wears an oversized Velasca Women shearling jacket, he wears an aviator shearling from the Velasca menswear collection.',
    cta: 'Winter in the Dolomites',
    href: '/pages/winter-in-the-dolomites',
  },
  {
    file: 'sett2025_rimando_campagna_ai25_dolomiti.jpg',
    url: 'https://www.velasca.com/cdn/shop/files/sett2025_rimando_campagna_ai25_dolomiti.jpg?v=1758198227&width=1920',
    alt: 'A man wears a double-breasted Prince of Wales check wool blazer with a ribbed crewneck sweater, among mountain pastures with cows in the background.',
    cta: "F/W '25 in Cortina",
    href: '/pages/fall-winter-2025-in-the-dolomites',
  },
  {
    file: 'sett_2025_rimando_lookbook_ai25.jpg',
    url: 'https://www.velasca.com/cdn/shop/files/sett_2025_rimando_lookbook_ai25.jpg?v=1758198418&width=1920',
    alt: 'A man wears a brown single-breasted wool coat paired with a beige crewneck sweater and a light blue shirt. Inside a mountain lodge with wooden furniture.',
    cta: "Fall/Winter '25",
    href: '/pages/fall-winter-2025',
  },
  {
    file: 'lug_2025_rimando_estate_in_costiera.jpg',
    url: 'https://www.velasca.com/cdn/shop/files/lug_2025_rimando_estate_in_costiera.jpg?v=1753785755&width=1920',
    alt: 'By the Amalfi Coast',
    cta: 'By the Amalfi Coast',
    href: '/pages/by-the-amalfi-coast',
  },
  {
    file: 'lug_2025_rimando_campagna_pe25_puglia.jpg',
    url: 'https://www.velasca.com/cdn/shop/files/lug_2025_rimando_campagna_pe25_puglia.jpg?v=1753785770&width=1920',
    alt: 'A trip to Apulia',
    cta: 'A trip to Apulia',
    href: '/pages/s-s-in-apulia',
  },
];

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildSlidesHtml() {
  return slides
    .map((slide, i) => {
      const loading = i === 0 ? 'eager' : 'lazy';
      const fetchpriority = i === 0 ? '\n                fetchpriority="high"' : '';
      return `            <div class="swiper-slide">
              <img
                src="${imageBase}/${slide.file}"
                alt="${escapeHtml(slide.alt)}"
                loading="${loading}"${fetchpriority}
              />
              <a href="${slide.href}" class="btn-white swiper-slide__cta"
                >${escapeHtml(slide.cta)}</a
              >
            </div>`;
    })
    .join('\n');
}

function syncIndexHtml() {
  const html = fs.readFileSync(indexPath, 'utf8');
  const start = '          <!-- SWIPER-SLIDES-START -->';
  const end = '          <!-- SWIPER-SLIDES-END -->';
  const startIdx = html.indexOf(start);
  const endIdx = html.indexOf(end);

  if (startIdx === -1 || endIdx === -1) {
    console.error('Could not find SWIPER-SLIDES markers in index.html');
    process.exit(1);
  }

  const updated =
    html.slice(0, startIdx + start.length) +
    '\n' +
    buildSlidesHtml() +
    '\n' +
    html.slice(endIdx);

  fs.writeFileSync(indexPath, updated);
  console.log(`Updated swiper slides in index.html (${slides.length} slides)`);
}

fs.mkdirSync(outDir, { recursive: true });

for (const slide of slides) {
  const dest = path.join(outDir, slide.file);
  process.stdout.write(`Downloading ${slide.file}... `);
  const res = await fetch(slide.url);
  if (!res.ok) {
    console.log(`FAILED (${res.status})`);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`OK (${(buf.length / 1024).toFixed(0)} KB)`);
}

console.log(`\nSaved ${slides.length} images to public/images/swiper/`);
syncIndexHtml();
