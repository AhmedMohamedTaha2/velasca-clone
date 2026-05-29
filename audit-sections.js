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

  const sections = await page.evaluate(() => {
    const sections = {};
    const selectors = [
      '.newsletter-section',
      '.newsletter-image-wrap',
      '.newsletter-form-wrap',
      '.newsletter-content',
      '.newsletter-heading',
      '.editorial-section--promo',
      '.editorial-section--redirect',
      '.get-inspired-grid',
      '.get-inspired-section',
      '.site-header',
      '.site-header__navbar',
      '.hero-section',
      '.category-grid',
      '.editorial-carousel',
    ];

    selectors.forEach(sel => {
      const el = document.querySelector(sel);
      if (!el) { sections[sel] = null; return; }
      const cs = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const scrollY = window.scrollY;
      sections[sel] = {
        w: Math.round(rect.width), h: Math.round(rect.height),
        x: Math.round(rect.x), absY: Math.round(rect.top + scrollY),
        display: cs.display, flexDir: cs.flexDirection,
        gridTemplateColumns: cs.gridTemplateColumns,
        gap: cs.gap, rowGap: cs.rowGap, columnGap: cs.columnGap,
        paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom,
        paddingLeft: cs.paddingLeft, paddingRight: cs.paddingRight,
        order: cs.order,
        alignSelf: cs.alignSelf,
        overflow: cs.overflow,
      };
    });

    // Also check newsletter img
    const img = document.querySelector('.newsletter-image-wrap img');
    if (img) {
      sections['newsletter-img'] = {
        src: img.src,
        naturalW: img.naturalWidth, naturalH: img.naturalHeight,
        complete: img.complete,
        w: Math.round(img.getBoundingClientRect().width),
        h: Math.round(img.getBoundingClientRect().height),
      };
    }

    // Check get-inspired cards
    const cards = document.querySelectorAll('.inspired-card');
    sections['inspired-card-count'] = cards.length;
    if (cards[0]) {
      const cs = window.getComputedStyle(cards[0]);
      const rect = cards[0].getBoundingClientRect();
      sections['first-inspired-card'] = {
        w: Math.round(rect.width), h: Math.round(rect.height),
        display: cs.display,
        marginBottom: cs.marginBottom,
      };
    }

    // Check get-inspired labels
    const label = document.querySelector('h3.inspired-card-label');
    if (label) {
      const cs = window.getComputedStyle(label);
      sections['inspired-label'] = {
        fontSize: cs.fontSize, fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing,
        textTransform: cs.textTransform, color: cs.color,
      };
    }

    return sections;
  });

  console.log(JSON.stringify(sections, null, 2));

  // Scroll to and screenshot newsletter
  await page.evaluate(() => {
    const el = document.querySelector('.newsletter-section');
    if (el) window.scrollTo(0, el.offsetTop - 100);
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'audit-newsletter-viewport.png' });

  // Scroll to get-inspired
  await page.evaluate(() => {
    const el = document.querySelector('.get-inspired-section');
    if (el) window.scrollTo(0, el.offsetTop - 50);
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'audit-get-inspired-viewport.png' });

  // Scroll to editorial promo
  await page.evaluate(() => {
    const el = document.querySelector('.editorial-section--promo');
    if (el) window.scrollTo(0, el.offsetTop - 50);
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'audit-editorial-promo-viewport.png' });

  await browser.close();
  console.log('All screenshots saved.');
})().catch(console.error);
