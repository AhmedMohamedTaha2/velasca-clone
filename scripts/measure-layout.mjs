import { chromium } from 'playwright';

const URL = process.argv[2] || 'https://www.velasca.com/';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(2000);

const data = await page.evaluate(() => {
  const measure = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const c = getComputedStyle(el);
    return {
      w: Math.round(r.width),
      h: Math.round(r.height),
      y: Math.round(r.top + window.scrollY),
      padding: c.padding,
      margin: c.margin,
      gap: c.columnGap || c.gap,
      maxWidth: c.maxWidth,
    };
  };
  const q = (sel) => document.querySelector(sel);
  return {
    promo: measure(q('[class*="Promotional"], .promotional-banner')),
    hero: measure(q('[class*="PageIntro"], .hero-section')),
    category: measure(q('[class*="CategoriesGrid"], .category-grid')),
    carousel: measure(q('[class*="CollectionFocus"], .editorial-carousel')),
    inspired: measure(q('.get-inspired-section')),
    editorial: measure(q('[class*="AboutUs"], .editorial-section')),
    newsletter: measure(q('#newsletter-section, [class*="Newsletter"]')),
    footer: measure(q('footer, [role="contentinfo"]')),
    card: measure(q('.category-card, [class*="CategoriesGrid"] a')),
    cardImg: measure(q('.category-card__image-wrap') || q('[class*="CategoriesGrid"] img')?.parentElement),
  };
});

console.log(JSON.stringify(data, null, 2));
await browser.close();
