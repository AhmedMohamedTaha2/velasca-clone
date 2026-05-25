import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const URL = `file:///${ROOT.replace(/\\/g, '/')}/index.html`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);

async function colors(scrollY, label, hover) {
  await page.evaluate((y) => window.scrollTo(0, y), scrollY);
  await page.waitForTimeout(400);
  await page.mouse.move(10, 10);
  await page.waitForTimeout(150);
  const loc = page.locator('.navbar__center .nav-link__entry', { hasText: label }).first();
  if (hover) {
    await loc.hover();
    await page.waitForTimeout(350);
  }
  return loc.evaluate((el) => ({
    color: getComputedStyle(el).color,
    fontWeight: getComputedStyle(el).fontWeight,
  }));
}

for (const scrollY of [0, 400]) {
  console.log(`\nscrollY=${scrollY}`);
  for (const label of ['Shoes', 'New Arrivals', 'Woman']) {
    const d = await colors(scrollY, label, false);
    const h = await colors(scrollY, label, true);
    console.log(`  ${label}: ${d.color} (${d.fontWeight}) → hover ${h.color} (${h.fontWeight})`);
  }
}

await browser.close();
