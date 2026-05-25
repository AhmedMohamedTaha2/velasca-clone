/**
 * Side-by-side audit: clone vs velasca.com mega-menu (1440×900)
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'screenshots', 'mega-menu-compare');
const CLONE = `file:///${ROOT.replace(/\\/g, '/')}/index.html`;

const CHECKS = [];

function record(name, live, clone, ok) {
  CHECKS.push({ name, live, clone, ok });
}

async function auditSite(page, site) {
  const pick = async (menu) => {
    if (site === 'live') {
      await page.locator('#onetrust-accept-btn-handler').click().catch(() => {});
      await page.waitForTimeout(500);
      await page
        .locator('[data-testid="desktop-navigation"]')
        .getByText(menu, { exact: true })
        .first()
        .hover();
    } else {
      const id = menu.toLowerCase();
      await page.locator(`.navbar__item[data-menu="${id}"]`).hover();
    }
    await page.waitForTimeout(750);
    return page.evaluate(() => {
      const isLive = !!document.querySelector('[data-testid="menu-links"]');
      const panel = isLive
        ? document.querySelector('[data-testid="menu-links"]')
        : document.querySelector('#mega-menu-inner');
      const title = isLive
        ? panel.querySelector('[class*="SecondLevelMenuTitle"]')
        : panel.querySelector('.mega-menu__group-title a');
      const link = isLive
        ? panel.querySelector('[class*="SecondLevelMenuChildren"] a')
        : panel.querySelector('.mega-menu__link:not(.mega-menu__link--view-all)');
      const label = isLive
        ? panel.querySelector('[class*="ImageLabel"]')
        : panel.querySelector('.mega-menu__image-label');
      const img = panel.querySelector(
        isLive ? '[class*="ImageLink"] img' : '.mega-menu__image-wrap img'
      );
      const p = (el) =>
        el
          ? ((cs) => ({
              color: cs.color,
              fontSize: cs.fontSize,
              fontWeight: cs.fontWeight,
              lineHeight: cs.lineHeight,
              textTransform: cs.textTransform,
              textDecoration: cs.textDecoration,
              letterSpacing: cs.letterSpacing,
              w: Math.round(el.getBoundingClientRect().width),
              h: Math.round(el.getBoundingClientRect().height),
              transition: cs.transition,
            }))(getComputedStyle(el))
          : null;
      return { title: p(title), link: p(link), label: p(label), img: p(img) };
    });
  };

  if (site === 'live') {
    await page.goto('https://www.velasca.com/', { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForTimeout(2000);
  } else {
    await page.goto(CLONE, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);
  }

  const shoes = await pick('Shoes');
  await page.screenshot({ path: path.join(OUT, `${site}-shoes.png`) });
  await page.mouse.move(5, 5);
  await page.waitForTimeout(250);

  const collections = await pick('Collections');
  await page.screenshot({ path: path.join(OUT, `${site}-collections.png`) });

  return { shoes, collections };
}

function same(a, b, keys) {
  if (!a || !b) return false;
  return keys.every((k) => a[k] === b[k]);
}

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const livePage = await ctx.newPage();
const clonePage = await ctx.newPage();

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const live = await auditSite(livePage, 'live');
const clone = await auditSite(clonePage, 'clone');

const textKeys = ['color', 'fontSize', 'fontWeight', 'lineHeight', 'textTransform'];
const labelKeys = [...textKeys, 'textDecoration', 'letterSpacing'];
const imgKeys = ['w', 'h', 'transition'];

record('Shoes — group title', live.shoes.title, clone.shoes.title, same(live.shoes.title, clone.shoes.title, textKeys));
record('Shoes — child link', live.shoes.link, clone.shoes.link, same(live.shoes.link, clone.shoes.link, textKeys));
record('Shoes — image label', live.shoes.label, clone.shoes.label, same(live.shoes.label, clone.shoes.label, labelKeys));
record('Shoes — image size', live.shoes.img, clone.shoes.img, same(live.shoes.img, clone.shoes.img, imgKeys));
record(
  'Collections — image label',
  live.collections.label,
  clone.collections.label,
  same(live.collections.label, clone.collections.label, labelKeys)
);
record(
  'Collections — image size',
  live.collections.img,
  clone.collections.img,
  same(live.collections.img, clone.collections.img, imgKeys)
);

await browser.close();

console.log('\nMega-menu parity (clone vs velasca.com @ 1440px)\n');
for (const c of CHECKS) {
  console.log(`${c.ok ? '✓' : '✗'} ${c.name}`);
  if (!c.ok) {
    console.log(`    live:  ${JSON.stringify(c.live)}`);
    console.log(`    clone: ${JSON.stringify(c.clone)}`);
  }
}
const passed = CHECKS.filter((c) => c.ok).length;
console.log(`\n${passed}/${CHECKS.length} checks matched`);
console.log(`Screenshots: ${OUT}`);

process.exit(passed === CHECKS.length ? 0 : 1);
