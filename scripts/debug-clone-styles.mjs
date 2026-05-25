import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLONE_URL = `file:///${ROOT.replace(/\\/g, '/')}/index.html`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(CLONE_URL, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);

for (const [id, label] of [
  ['shoes', 'Shoes'],
  ['collections', 'Collections'],
]) {
  await page.mouse.move(5, 5);
  await page.waitForTimeout(200);
  await page.locator(`.navbar__item[data-menu="${id}"]`).hover();
  await page.waitForTimeout(800);

  const data = await page.evaluate(() => {
    const panel = document.querySelector('#mega-menu-inner');
    const pick = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        text: (el.textContent || '').trim().slice(0, 50),
        color: cs.color,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        fontFamily: cs.fontFamily.split(',')[0],
        textTransform: cs.textTransform,
        textDecoration: cs.textDecoration,
        letterSpacing: cs.letterSpacing,
        lineHeight: cs.lineHeight,
        w: Math.round(r.width),
        h: Math.round(r.height),
        transform: cs.transform,
        transition: cs.transition,
        marginLeft: cs.marginLeft,
        borderLeft: cs.borderLeft,
        paddingLeft: cs.paddingLeft,
      };
    };

    return {
      groupTitle: pick(panel.querySelector('.mega-menu__group-title a')),
      childLink: pick(panel.querySelector('.mega-menu__link:not(.mega-menu__link--view-all)')),
      viewAll: pick(panel.querySelector('.mega-menu__link--view-all')),
      imageWrap: pick(panel.querySelector('.mega-menu__image-wrap')),
      imageImg: pick(panel.querySelector('.mega-menu__image-wrap img')),
      imageLabel: pick(panel.querySelector('.mega-menu__image-label')),
      imageCol: pick(panel.querySelector('.mega-menu__column--images')),
      columnsWrap: pick(panel.querySelector('.mega-menu__columns')),
      imageCount: panel.querySelectorAll('.mega-menu__image-link').length,
    };
  });

  console.log('\n===', label, '===\n', JSON.stringify(data, null, 2));
}

await page.locator('.navbar__item[data-menu="shoes"]').hover();
await page.waitForTimeout(600);
await page.locator('.mega-menu__image-link').first().hover();
await page.waitForTimeout(400);
const imgHover = await page.evaluate(() => {
  const img = document.querySelector('.mega-menu__image-wrap img');
  const cs = getComputedStyle(img);
  return { transform: cs.transform, transition: cs.transition, opacity: cs.opacity };
});
console.log('\n=== Clone image hover ===\n', imgHover);

const link = page.locator('.mega-menu__link').first();
await link.hover();
await page.waitForTimeout(200);
const linkHover = await page.evaluate(() => {
  const el = document.querySelector('.mega-menu__link');
  const cs = getComputedStyle(el);
  return { color: cs.color, textDecoration: cs.textDecoration };
});
console.log('\n=== Clone link hover ===\n', linkHover);

await browser.close();
