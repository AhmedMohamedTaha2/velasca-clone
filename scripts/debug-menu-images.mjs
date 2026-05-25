import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://www.velasca.com/', { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(2000);
await page.locator('#onetrust-accept-btn-handler').click().catch(() => {});
await page.waitForTimeout(1000);

await page.locator('[data-testid=desktop-navigation]').getByText('Clothing', { exact: true }).first().hover();
await page.waitForTimeout(1200);

const info = await page.evaluate(() => {
  const panel = document.querySelector('[data-testid=menu-links]');
  const img = panel?.querySelector('img');
  const anchor = img?.closest('a');
  const mediaCol = panel?.querySelector('[class*=MediaColumn]');
  return {
    imgSrc: img?.currentSrc || img?.src,
    anchorHref: anchor?.getAttribute('href'),
    anchorClass: anchor?.className?.toString?.().slice(0, 120),
    anchorText: anchor?.textContent?.trim(),
    mediaColHTML: mediaCol?.innerHTML?.slice(0, 800),
    parentChain: (() => {
      let el = img;
      const chain = [];
      for (let i = 0; i < 8 && el; i++) {
        chain.push({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 80) });
        el = el.parentElement;
      }
      return chain;
    })(),
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
