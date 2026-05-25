/**
 * Scrapes velasca.com desktop mega-menu (Shoes, Clothing, Accessories, Collections)
 * and writes js/mega-menu-data.js + downloads panel images.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'images', 'scraped');
const OUTPUT = path.join(ROOT, 'js', 'mega-menu-data.js');

const MENU_LABELS = {
  shoes: 'Shoes',
  clothing: 'Clothing',
  accessories: 'Accessories',
  collections: 'Collections',
};

function downloadFile(url, filepath) {
  return new Promise((resolve) => {
    https
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          downloadFile(response.headers.location, filepath).then(resolve);
          return;
        }
        if (response.statusCode !== 200) {
          resolve(null);
          return;
        }
        const stream = fs.createWriteStream(filepath);
        response.pipe(stream);
        stream.on('finish', () => {
          stream.close();
          resolve(filepath);
        });
      })
      .on('error', () => resolve(null));
  });
}

function cleanUrl(src) {
  if (!src) return '';
  return src.replace(/&width=\d+/, '').split('?')[0] + (src.includes('?') ? '?' + src.split('?')[1].split('&').find((p) => p.startsWith('v=')) || '' : '');
}

function localImagePath(src) {
  const filename = path.basename(src.split('?')[0]);
  return `./public/images/scraped/${filename}`;
}

function mapLinks(children) {
  return (children || []).map((c) => ({
    title: c.title,
    href: c.href,
    ...(c.title === 'View all' ? { viewAll: true } : {}),
  }));
}

function mapGroups(groups) {
  return groups.map((g) => ({
    title: g.title,
    href: g.href,
    links: mapLinks(g.children),
  }));
}

async function extractMenu(page, label) {
  await page
    .locator('[data-testid="desktop-navigation"]')
    .getByText(label, { exact: true })
    .first()
    .hover();
  await page.waitForTimeout(600);

  return page.evaluate(() => {
    const panel = document.querySelector('[data-testid="menu-links"]');
    const columns = [...(panel?.querySelectorAll('[class*="MenuColumn"]') || [])];
    const colData = columns.map((col) => {
      const groups = [...col.querySelectorAll('[class*="SecondLevelGroup"]')];
      return {
        groups: groups.map((g) => {
          const titleEl = g.querySelector(
            '[class*="SecondLevelMenuTitle"] a, [class*="SecondLevelMenuTitle"]'
          );
          const title = titleEl?.textContent?.trim();
          const href = titleEl?.getAttribute('href') || g.querySelector('a')?.getAttribute('href');
          const children = [
            ...g.querySelectorAll(
              '[class*="SecondLevelMenuChildren"] a, [class*="ThirdLevel"] a'
            ),
          ].map((a) => ({
            title: a.textContent?.trim(),
            href: a.getAttribute('href'),
          }));
          return { title, href, children };
        }),
      };
    });

    const images = [];
    const seen = new Set();

    function pushImage({ href, src, alt, label }) {
      if (!src || seen.has(src)) return;
      seen.add(src);
      images.push({ href, src, alt, label });
    }

    panel?.querySelectorAll('[class*="ImageLink"]').forEach((a) => {
      const img = a.querySelector('img');
      if (!img) return;
      const labelEl = a.querySelector('[class*="ImageLabel"]');
      pushImage({
        href: a.getAttribute('href'),
        src: img.currentSrc || img.src,
        alt: img.alt || '',
        label: labelEl?.textContent?.trim() || a.textContent?.trim(),
      });
    });

    const mediaCol = panel?.querySelector('[class*="MediaColumn"]');
    mediaCol?.querySelectorAll('.conditional-link-void').forEach((block) => {
      const img = block.querySelector('img');
      if (!img) return;
      const titleEl = block.querySelector('[class*="ImageTitle"], [class*="ImageLabel"]');
      const innerA = block.querySelector('a[href]');
      pushImage({
        href: innerA?.getAttribute('href') || '',
        src: img.currentSrc || img.src,
        alt: img.alt || '',
        label: titleEl?.textContent?.trim() || block.textContent?.trim(),
      });
    });

    return { columns: colData, images };
  });
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto('https://www.velasca.com/', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(2000);
  const accept = page.locator('#onetrust-accept-btn-handler');
  if (await accept.count()) await accept.click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(1000);

  const menus = {};

  for (const [id, label] of Object.entries(MENU_LABELS)) {
    console.log(`Extracting ${label}...`);
    const data = await extractMenu(page, label);
    await page.mouse.move(10, 10);
    await page.waitForTimeout(200);

    const columns = data.columns.map((col) => ({ groups: mapGroups(col.groups) }));
    const images = [];

    for (const img of data.images) {
      const fullSrc = (img.src || '').replace(/&width=\d+/, '&width=800');
      const filename = path.basename(fullSrc.split('?')[0]);
      const localFile = path.join(IMAGES_DIR, filename);
      if (!fs.existsSync(localFile)) {
        console.log(`  Downloading ${filename}`);
        await downloadFile(fullSrc, localFile);
      }
      images.push({
        href: img.href,
        src: localImagePath(fullSrc),
        alt: img.alt,
        label: img.label,
      });
    }

    menus[id] = { columns };
    if (images.length === 1) menus[id].image = images[0];
    else if (images.length > 1) menus[id].images = images;
  }

  await browser.close();

  const js = `/**
 * Desktop mega-menu content — scraped from velasca.com (${new Date().toISOString().slice(0, 10)}).
 * Regenerate: node scripts/scrape-mega-menu.js
 */
window.VELASCA_MEGA_MENU = ${JSON.stringify(menus, null, 2)};
`;

  fs.writeFileSync(OUTPUT, js, 'utf8');
  console.log(`\nWrote ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
