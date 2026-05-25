import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://www.velasca.com/', { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(3000);

for (const sel of [
  '#onetrust-accept-btn-handler',
  'button[id*="accept"]',
  '[aria-label="Close"]',
]) {
  const loc = page.locator(sel).first();
  if (await loc.count()) {
    try {
      await loc.click({ timeout: 3000 });
      console.log('clicked', sel);
      break;
    } catch {
      /* */
    }
  }
}
await page.waitForTimeout(1500);

const navCount = await page.locator('[data-testid="desktop-navigation"]').count();
console.log('desktop-navigation:', navCount);

await page
  .locator('[data-testid="desktop-navigation"]')
  .getByText('Shoes', { exact: true })
  .first()
  .hover();
await page.waitForTimeout(1000);

const info = await page.evaluate(() => {
  const panel = document.querySelector('[data-testid="menu-links"]');
  const rect = panel?.getBoundingClientRect();
  return {
    menuLinks: !!panel,
    rect: rect ? { w: rect.width, h: rect.height, top: rect.top } : null,
    imgCount: panel?.querySelectorAll('img').length ?? 0,
    classSample: panel?.className,
    columnCount: panel?.querySelectorAll('[class*="MenuColumn"]').length,
    allTestIds: [...new Set([...document.querySelectorAll('[data-testid]')].map((e) => e.getAttribute('data-testid')))],
  };
});
console.log(JSON.stringify(info, null, 2));

await page.screenshot({ path: 'screenshots/debug-live-shoes.png' });
await browser.close();
