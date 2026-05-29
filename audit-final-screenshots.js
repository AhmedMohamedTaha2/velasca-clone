const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  const page = await context.newPage();
  const absPath = path.resolve('index.html');
  const filePath = 'file:///' + absPath.replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Full page
  await page.screenshot({ path: 'final-full.png', fullPage: true });

  // Category section
  await page.evaluate(() => {
    const el = document.querySelector('.category-grid');
    if (el) window.scrollTo(0, el.offsetTop + 200);
  });
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'final-category.png' });

  // Get Inspired + editorial
  await page.evaluate(() => {
    const el = document.querySelector('.get-inspired-section');
    if (el) window.scrollTo(0, el.offsetTop + 200);
  });
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'final-get-inspired.png' });

  // Newsletter
  await page.evaluate(() => {
    const el = document.querySelector('.newsletter-section');
    if (el) window.scrollTo(0, el.offsetTop - 100);
  });
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'final-newsletter.png' });

  // Footer
  await page.evaluate(() => {
    const el = document.querySelector('.site-footer');
    if (el) window.scrollTo(0, el.offsetTop - 50);
  });
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'final-footer.png' });

  console.log('All final screenshots saved.');
  await browser.close();
})().catch(console.error);
