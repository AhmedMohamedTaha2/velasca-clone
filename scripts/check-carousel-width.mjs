import { chromium } from 'playwright';

const browser = await chromium.launch();

for (const width of [375, 768, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto('http://127.0.0.1:3456/', {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForTimeout(2000);
  await page.locator('.editorial-carousel').first().scrollIntoViewIfNeeded();

  const clone = await page.evaluate(() => {
    const root = document.querySelector('.editorial-carousel');
    const img = root?.querySelector('.editorial-slide__image');
    const r = root.getBoundingClientRect();
    const ir = img?.getBoundingClientRect();
    return {
      rootW: Math.round(r.width),
      rootH: Math.round(r.height),
      imgW: Math.round(ir?.width || 0),
      imgH: Math.round(ir?.height || 0),
      ratio: (r.width / r.height).toFixed(3),
      left: Math.round(r.left),
      vw: window.innerWidth,
    };
  });

  const page2 = await browser.newPage({ viewport: { width, height: 900 } });
  await page2.goto('https://www.velasca.com/', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await page2.waitForTimeout(2000);
  await page2
    .locator('[class*="CollectionFocusBlockstyles__Layout"]')
    .first()
    .scrollIntoViewIfNeeded();

  const live = await page2.evaluate(() => {
    const root = document.querySelector(
      '[class*="CollectionFocusBlockstyles__Layout"]'
    );
    const r = root.getBoundingClientRect();
    return {
      rootW: Math.round(r.width),
      rootH: Math.round(r.height),
      ratio: (r.width / r.height).toFixed(3),
      left: Math.round(r.left),
      vw: window.innerWidth,
    };
  });

  console.log({ width, live, clone, match: live.rootW === clone.rootW && live.rootH === clone.rootH });
  await page.close();
  await page2.close();
}

await browser.close();
