/**
 * Scrape Clothing + Accessories mega-menu images from velasca.com
 * (uses conditional-link-void + ImageTitle, not ImageLink anchors)
 * Run: node scripts/scrape-menu-images.mjs
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'images', 'scraped');
const DATA_FILE = path.join(ROOT, 'js', 'mega-menu-data.js');

const MENUS = [
  { id: 'clothing', label: 'Clothing', fallbackHref: '/collections/all-clothing' },
  { id: 'accessories', label: 'Accessories', fallbackHref: '/collections/all-accessories' },
];

const HREF_BY_LABEL = {
  Clothing: '/collections/all-clothing',
  Accessories: '/collections/all-accessories',
  Shoes: '/collections/all-shoes',
};

function downloadFile(url, filepath) {
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      if (
        response.statusCode >= 300 &&
        response.statusCode < 400 &&
        response.headers.location
      ) {
        downloadFile(response.headers.location, filepath).then(resolve);
        return;
      }
      if (response.statusCode !== 200) {
        console.warn(`  Failed HTTP ${response.statusCode}: ${url}`);
        resolve(null);
        return;
      }
      const stream = fs.createWriteStream(filepath);
      response.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        resolve(filepath);
      });
    });
    req.on('error', (err) => {
      console.warn(`  Download error: ${err.message}`);
      resolve(null);
    });
  });
}

function localImagePath(filename) {
  return `./public/images/scraped/${filename}`;
}

function normalizeSrc(src) {
  if (!src) return '';
  let url = src.startsWith('//') ? `https:${src}` : src;
  try {
    const u = new URL(url);
    // Prefer largest srcset entry or bump width param
    return `${u.origin}${u.pathname}${u.search ? u.search.replace(/width=\d+/, 'width=1200') : '?width=1200'}`;
  } catch {
    return url;
  }
}

async function extractImages(page, label, fallbackHref) {
  await page.mouse.move(10, 10);
  await page.waitForTimeout(300);

  await page
    .locator('[data-testid="desktop-navigation"]')
    .getByText(label, { exact: true })
    .first()
    .hover();

  await page.waitForTimeout(1000);

  await page
    .locator('[data-testid="menu-links"] img')
    .first()
    .waitFor({ state: 'visible', timeout: 12000 })
    .catch(() => {});

  return page.evaluate((fallback) => {
    const panel = document.querySelector('[data-testid="menu-links"]');
    if (!panel) return { error: 'menu-links not found', images: [] };

    const images = [];
    const seen = new Set();

    function addImage({ src, href, alt, label }) {
      if (!src || seen.has(src)) return;
      seen.add(src);
      images.push({ src, href: href || fallback, alt: alt || '', label: label || '' });
    }

    // Standard anchor cards (Shoes, Collections)
    for (const a of panel.querySelectorAll('[class*="ImageLink"]')) {
      const img = a.querySelector('img');
      if (!img) continue;
      const labelEl = a.querySelector('[class*="ImageLabel"]');
      addImage({
        src: img.currentSrc || img.src,
        href: a.getAttribute('href') || '',
        alt: img.alt || '',
        label: labelEl?.textContent?.trim() || a.textContent?.trim() || '',
      });
    }

    // Clothing / Accessories: conditional-link-void + ImageTitle
    const mediaCol = panel.querySelector('[class*="MediaColumn"]');
    if (mediaCol) {
      for (const block of mediaCol.querySelectorAll('.conditional-link-void, [class*="ImageLink"]')) {
        const img = block.querySelector('img');
        if (!img) continue;
        const titleEl =
          block.querySelector('[class*="ImageTitle"]') ||
          block.querySelector('[class*="ImageLabel"]');
        const innerLink = block.querySelector('a[href]');
        addImage({
          src: img.currentSrc || img.src,
          href: innerLink?.getAttribute('href') || '',
          alt: img.alt || '',
          label: titleEl?.textContent?.trim() || block.textContent?.trim() || '',
        });
      }

      // Fallback: any img in media column not yet captured
      for (const img of mediaCol.querySelectorAll('img')) {
        const src = img.currentSrc || img.src;
        if (seen.has(src)) continue;
        const block = img.closest('.conditional-link-void, [class*="ImageLink"], [class*="ImageContainer"]');
        const titleEl = block?.querySelector('[class*="ImageTitle"], [class*="ImageLabel"]');
        addImage({
          src,
          href: block?.querySelector('a[href]')?.getAttribute('href') || '',
          alt: img.alt || '',
          label: titleEl?.textContent?.trim() || '',
        });
      }
    }

    return { images };
  }, fallbackHref);
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Loading https://www.velasca.com/ ...');
  await page.goto('https://www.velasca.com/', {
    waitUntil: 'networkidle',
    timeout: 90000,
  });
  await page.waitForTimeout(2000);

  const accept = page.locator('#onetrust-accept-btn-handler');
  if (await accept.count()) {
    await accept.click({ timeout: 5000 }).catch(() => {});
    console.log('Accepted cookies');
    await page.waitForTimeout(1000);
  }

  const scraped = {};

  for (const { id, label, fallbackHref } of MENUS) {
    console.log(`\nScraping ${label}...`);
    const { images, error } = await extractImages(page, label, fallbackHref);
    if (error) console.warn(`  ${error}`);
    console.log(`  Found ${images.length} image(s)`);

    const processed = [];
    for (const img of images) {
      const href =
        img.href ||
        HREF_BY_LABEL[img.label] ||
        fallbackHref;

      const fullSrc = normalizeSrc(img.src);
      const url = new URL(fullSrc);
      const filename = path.basename(url.pathname);
      const version = url.searchParams.get('v');
      const diskName = version ? `${filename.replace(/\.[^.]+$/, '')}_v${version}${path.extname(filename)}` : filename;
      // Use simple filename like existing shoes asset
      const simpleName = path.basename(img.src.split('?')[0].replace(/^\/\//, 'https://'));
      const localFile = path.join(IMAGES_DIR, simpleName);

      console.log(`    - ${img.label} → ${simpleName}`);

      if (!fs.existsSync(localFile)) {
        console.log(`  Downloading ${simpleName} ...`);
        const ok = await downloadFile(fullSrc, localFile);
        if (!ok) {
          // retry without width mutation
          await downloadFile(img.src.startsWith('//') ? `https:${img.src}` : img.src, localFile);
        }
      } else {
        console.log(`  Already have ${simpleName}`);
      }

      processed.push({
        href,
        src: localImagePath(simpleName),
        alt: img.alt,
        label: img.label,
      });
    }

    scraped[id] = processed;
  }

  await browser.close();

  const dataContent = fs.readFileSync(DATA_FILE, 'utf8');
  const match = dataContent.match(/window\.VELASCA_MEGA_MENU\s*=\s*(\{[\s\S]*\});?/);
  if (!match) throw new Error('Could not parse mega-menu-data.js');
  const existing = JSON.parse(match[1]);

  for (const [id, images] of Object.entries(scraped)) {
    if (!existing[id]) existing[id] = { columns: [] };
    delete existing[id].image;
    delete existing[id].images;
    if (images.length === 1) {
      existing[id].image = images[0];
      console.log(`\n${id}: added image "${images[0].label}"`);
    } else if (images.length > 1) {
      existing[id].images = images;
      console.log(`\n${id}: added ${images.length} images`);
    } else {
      console.warn(`\n${id}: no images — skipped`);
    }
  }

  const date = new Date().toISOString().slice(0, 10);
  const js = `/**
 * Desktop mega-menu content — scraped from velasca.com (${date}).
 * Regenerate: node scripts/scrape-mega-menu.js
 * Menu images (clothing/accessories): node scripts/scrape-menu-images.mjs
 */
window.VELASCA_MEGA_MENU = ${JSON.stringify(existing, null, 2)};
`;

  fs.writeFileSync(DATA_FILE, js, 'utf8');
  console.log(`\nUpdated ${DATA_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
