const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
  });
  const page = await context.newPage();

  const absPath = path.resolve('index.html');
  const filePath = 'file:///' + absPath.replace(/\\/g, '/');
  console.log('Loading:', filePath);
  await page.goto(filePath, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'clone-mobile-390-full.png', fullPage: true });
  console.log('Clone full screenshot taken');

  const cloneStyles = await page.evaluate(() => {
    const get = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const scrollY = window.scrollY;
      return {
        rect: { w: Math.round(rect.width), h: Math.round(rect.height), x: Math.round(rect.x), absY: Math.round(rect.top + scrollY) },
        fontSize: cs.fontSize, fontWeight: cs.fontWeight, lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing,
        color: cs.color, bg: cs.backgroundColor,
        paddingT: cs.paddingTop, paddingR: cs.paddingRight, paddingB: cs.paddingBottom, paddingL: cs.paddingLeft,
        display: cs.display, flexDir: cs.flexDirection,
        gridTemplateColumns: cs.gridTemplateColumns, rowGap: cs.rowGap, columnGap: cs.columnGap,
        height: cs.height, width: cs.width,
        position: cs.position, top: cs.top, zIndex: cs.zIndex,
        textAlign: cs.textAlign, textTransform: cs.textTransform,
        border: cs.border,
      };
    };

    return {
      header: get('.site-header'),
      promoBanner: get('.promotional-banner'),
      navbar: get('.site-header__navbar'),
      heroSection: get('.hero-section'),
      heroBtn: get('.btn-white'),
      catGrid: get('.category-grid'),
      catCard: get('.category-card'),
      catLabel: get('h3.category-card__label'),
      getInspiredSection: get('.get-inspired-section'),
      getInspiredGrid: get('.get-inspired-grid'),
      newsletterSection: get('.newsletter-section'),
      newsletterLayout: get('.newsletter-layout'),
      newsletterFormWrap: get('.newsletter-form-wrap'),
      newsletterImageWrap: get('.newsletter-image-wrap'),
      newsletterInput: get('.newsletter-input'),
      newsletterSubmit: get('.newsletter-submit'),
      newsletterHeading: get('.newsletter-heading'),
      footerInner: get('.footer-inner'),
      footerCols: get('.footer-cols'),
    };
  });
  console.log('Clone styles:', JSON.stringify(cloneStyles, null, 2));
  await browser.close();
})().catch(console.error);
