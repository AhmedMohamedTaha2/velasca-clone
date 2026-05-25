/**
 * Audit velasca.com navbar link hover colors — top vs scrolled
 * Run: node scripts/audit-navbar-hover.mjs
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'screenshots', 'navbar-hover-audit');

const NAV_ITEMS = ['New Arrivals', 'Shoes', 'Clothing', 'Accessories', 'Collections', 'Stores', 'Archive', 'Woman'];

async function readNavColors(page, label, hover) {
  const loc = page
    .locator('[data-testid="desktop-navigation"]')
    .getByText(label, { exact: true })
    .first();

  if (hover) await loc.hover();
  else await page.mouse.move(15, 15);

  return loc.evaluate((el) => {
    const entry = el.closest('[class*="MenuEntry"]') || el;
    const cs = getComputedStyle(entry);
    return {
      color: cs.color,
      fontWeight: cs.fontWeight,
      textDecoration: cs.textDecoration,
    };
  });
}

async function readHeaderChrome(page) {
  return page.evaluate(() => {
    const nav = document.querySelector('[data-testid="desktop-navigation"]');
    const navBar = nav?.closest('[class*="Navbar"], nav')?.parentElement;
    const help = document.querySelector('[class*="HelpMenu"], [class*="help-menu"]');
    const promo = document.querySelector('[class*="Promotional"], [class*="promo"]');
    const pick = (el) =>
      el
        ? {
            bg: getComputedStyle(el).backgroundColor,
            color: getComputedStyle(el).color,
          }
        : null;

    return {
      scrollY: window.scrollY,
      navBg: nav ? getComputedStyle(nav.closest('[class*="Navbar"]') || nav.parentElement).backgroundColor : null,
      navbarParent: pick(nav?.parentElement?.parentElement),
      helpMenu: pick(help),
      bodyClass: document.body.className?.slice(0, 100),
    };
  });
}

async function sampleAll(page, scrollY, stateLabel) {
  await page.evaluate((y) => window.scrollTo(0, y), scrollY);
  await page.waitForTimeout(500);
  await page.mouse.move(15, 15);
  await page.waitForTimeout(300);

  const chrome = await readHeaderChrome(page);
  const rows = [];

  for (const label of NAV_ITEMS) {
    const def = await readNavColors(page, label, false);
    await page.mouse.move(15, 15);
    await page.waitForTimeout(120);
    const hov = await readNavColors(page, label, true);
    await page.mouse.move(15, 15);
    await page.waitForTimeout(120);
    rows.push({ label, default: def, hover: hov });
  }

  return { stateLabel, scrollY: chrome.scrollY, chrome, rows };
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('https://www.velasca.com/', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(2500);
  await page.locator('#onetrust-accept-btn-handler').click().catch(() => {});
  await page.waitForTimeout(1000);

  const freshTop = await sampleAll(page, 0, 'fresh top — no prior nav hover');
  await page.screenshot({ path: path.join(OUT, 'fresh-top.png'), fullPage: false });

  await page.locator('[data-testid="desktop-navigation"]').getByText('Shoes', { exact: true }).first().hover();
  await page.waitForTimeout(400);
  const shoesHoverTop = await readNavColors(page, 'Shoes', true);
  const headerOnMenuHover = await readHeaderChrome(page);
  await page.screenshot({ path: path.join(OUT, 'fresh-top-shoes-hover.png') });

  await page.mouse.move(15, 15);
  await page.waitForTimeout(400);

  const scrolled = await sampleAll(page, 350, 'scrolled ~350px');
  await page.screenshot({ path: path.join(OUT, 'scrolled-350.png') });

  await page.locator('[data-testid="desktop-navigation"]').getByText('Shoes', { exact: true }).first().hover();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, 'scrolled-shoes-hover.png') });

  await browser.close();

  const TEAL = 'rgb(24, 86, 116)'; // #185674
  const WHITE = 'rgb(255, 255, 255)';
  const DARK = 'rgb(49, 51, 50)';

  console.log('\n══════════════════════════════════════════════════════');
  console.log('VELASCA.COM navbar hover — Playwright audit @ 1440px');
  console.log('══════════════════════════════════════════════════════\n');

  for (const block of [freshTop, scrolled]) {
    console.log(`\n── ${block.stateLabel} (scrollY=${block.scrollY}) ──`);
    console.log(`   Help menu link color: ${block.chrome.helpMenu?.color || 'n/a'}`);
    for (const r of block.rows) {
      const ch = r.default.color !== r.hover.color;
      console.log(
        `   ${r.label.padEnd(14)} default: ${r.default.color} (${r.default.fontWeight})` +
          `  →  hover: ${r.hover.color} (${r.hover.fontWeight})${ch ? '  *' : ''}`
      );
    }
  }

  console.log('\n── Mega-menu item hover @ top (Shoes) ──');
  console.log(`   Shoes color while hovered: ${shoesHoverTop.color}`);
  console.log(`   Header nav area bg: ${headerOnMenuHover.navbarParent?.bg || headerOnMenuHover.navBg}`);

  console.log('\n── Key colors ──');
  console.log(`   Brand teal (hover): ${TEAL} = #185674`);
  console.log(`   Body text:          ${DARK} = #313332`);
  console.log(`   Overlay white:      ${WHITE}`);

  const report = { freshTop, scrolled, shoesHoverTop, headerOnMenuHover };
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  console.log(`\nSaved: ${OUT}/report.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
