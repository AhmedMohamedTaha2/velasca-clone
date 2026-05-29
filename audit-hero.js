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

  // Screenshot from top of page (hero)
  await page.screenshot({ path: 'audit-hero-viewport.png' });

  // Detailed measurements
  const data = await page.evaluate(() => {
    const get = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const scrollY = window.scrollY;
      return {
        w: Math.round(rect.width), h: Math.round(rect.height),
        x: Math.round(rect.x), absY: Math.round(rect.top + scrollY),
        display: cs.display, position: cs.position,
        fontSize: cs.fontSize, fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing,
        color: cs.color, bg: cs.backgroundColor,
        paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom,
        paddingLeft: cs.paddingLeft, paddingRight: cs.paddingRight,
        marginTop: cs.marginTop, marginBottom: cs.marginBottom,
        textTransform: cs.textTransform, textAlign: cs.textAlign,
        zIndex: cs.zIndex, overflow: cs.overflow,
      };
    };

    return {
      promoBanner: get('.promotional-banner'),
      header: get('.site-header'),
      navbar: get('.site-header__navbar'),
      logo: get('.site-header__logo'),
      hamburger: get('.hamburger'),
      heroSection: get('.hero-section'),
      heroSlide: get('.hero-slide'),
      heroCta: get('.hero-slide__cta'),
      heroHeadline: get('.hero-slide__headline'),
      categoryGrid: get('.category-grid'),
      carouselSection: get('.editorial-carousel'),
      carouselTrack: get('.carousel-track'),
      editorialAbout: get('.editorial-section--about'),
    };
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})().catch(console.error);
