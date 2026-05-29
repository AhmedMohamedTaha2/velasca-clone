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
  await page.screenshot({ path: 'mobile-full-latest.png', fullPage: true });
  console.log('Screenshot saved: mobile-full-latest.png');
  await browser.close();
})().catch(console.error);
