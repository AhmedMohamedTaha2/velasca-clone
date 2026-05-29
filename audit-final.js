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

  const data = await page.evaluate(() => {
    const get = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        w: Math.round(rect.width), h: Math.round(rect.height),
        x: Math.round(rect.x),
        display: cs.display,
        fontSize: cs.fontSize, fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing,
        color: cs.color, bg: cs.backgroundColor,
        paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom,
        paddingLeft: cs.paddingLeft, paddingRight: cs.paddingRight,
        marginTop: cs.marginTop, marginBottom: cs.marginBottom,
        textAlign: cs.textAlign, textTransform: cs.textTransform,
        border: cs.border,
      };
    };

    return {
      // Newsletter form details
      newsletterInputWrap: get('.newsletter-input-wrap'),
      newsletterInput: get('.newsletter-input'),
      newsletterSubmit: get('.newsletter-submit'),
      newsletterConsent: get('.newsletter-consent'),
      newsletterConsentP: get('.newsletter-consent p'),
      newsletterBg: get('.newsletter-bg'),
      newsletterBgContainer: get('.newsletter-bg-container'),

      // Category label row
      catLabelRow: get('.category-card__label-row'),
      catLabelRowGap: window.getComputedStyle(document.querySelector('.category-card__label-row') || document.createElement('div')).gap,
      catArrow: get('.category-card__arrow'),

      // Hero CTA details
      heroCta: get('.btn-white'),
      heroCtaAlt: get('.hero-cta'),
      heroCtaText: (() => {
        const el = document.querySelector('.hero-section a, .hero-slide a, .hero a');
        if (!el) return null;
        const cs = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          w: Math.round(rect.width), h: Math.round(rect.height),
          text: el.textContent.trim().substring(0, 50),
          fontSize: cs.fontSize, fontWeight: cs.fontWeight,
          bg: cs.backgroundColor, color: cs.color,
          border: cs.border, padding: cs.padding,
          letterSpacing: cs.letterSpacing,
        };
      })(),

      // Category card label row gap
      catLabelRowStyle: (() => {
        const el = document.querySelector('.category-card__label-row');
        if (!el) return null;
        const cs = window.getComputedStyle(el);
        return { gap: cs.gap, columnGap: cs.columnGap };
      })(),

      // Inspired card arrow
      inspiredArrow: get('.inspired-card__arrow'),

      // Get inspired heading
      getInspiredHeading: get('.get-inspired-heading'),

      // Check promo banner text
      promoBannerText: (() => {
        const el = document.querySelector('.promotional-banner');
        return el ? { text: el.textContent.trim().substring(0, 100), ...(() => {
          const cs = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return { w: Math.round(rect.width), h: Math.round(rect.height), bg: cs.backgroundColor, color: cs.color, fontSize: cs.fontSize };
        })() } : null;
      })(),
    };
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})().catch(console.error);
