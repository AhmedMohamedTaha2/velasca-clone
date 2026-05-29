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

  // Scroll to carousel
  await page.evaluate(() => {
    const el = document.querySelector('.editorial-carousel');
    if (el) window.scrollTo(0, el.offsetTop - 50);
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'audit-carousel-viewport.png' });

  // Scroll to category section
  await page.evaluate(() => {
    const el = document.querySelector('.category-grid');
    if (el) window.scrollTo(0, el.offsetTop + 50);
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'audit-category-viewport.png' });

  // Measure carousel details
  const data = await page.evaluate(() => {
    const get = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        w: Math.round(rect.width), h: Math.round(rect.height),
        x: Math.round(rect.x), absY: Math.round(rect.top + window.scrollY),
        display: cs.display, position: cs.position,
        overflow: cs.overflow, bg: cs.backgroundColor,
        paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom,
        paddingLeft: cs.paddingLeft, paddingRight: cs.paddingRight,
      };
    };

    const carouselItems = document.querySelectorAll('.carousel-item, .carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot, .carousel-dots button');
    const prevBtn = document.querySelector('.carousel-btn--prev, .carousel-prev');
    const nextBtn = document.querySelector('.carousel-btn--next, .carousel-next');

    // Category card details
    const catCards = document.querySelectorAll('.category-card');
    let firstCard = null;
    if (catCards[0]) {
      const cs = window.getComputedStyle(catCards[0]);
      const rect = catCards[0].getBoundingClientRect();
      firstCard = {
        w: Math.round(rect.width), h: Math.round(rect.height),
        display: cs.display, margin: cs.margin,
        marginBottom: cs.marginBottom,
      };
    }
    let firstImg = null;
    const imgEl = document.querySelector('.category-card .vertical-image');
    if (imgEl) {
      const cs = window.getComputedStyle(imgEl);
      const rect = imgEl.getBoundingClientRect();
      firstImg = {
        w: Math.round(rect.width), h: Math.round(rect.height),
        aspectRatio: cs.aspectRatio,
      };
    }
    const catLabel = document.querySelector('h3.category-card__label');
    let labelStyle = null;
    if (catLabel) {
      const cs = window.getComputedStyle(catLabel);
      const rect = catLabel.getBoundingClientRect();
      labelStyle = {
        w: Math.round(rect.width), h: Math.round(rect.height),
        fontSize: cs.fontSize, fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing,
        textTransform: cs.textTransform, color: cs.color,
        marginTop: cs.marginTop, marginBottom: cs.marginBottom,
      };
    }

    return {
      carousel: get('.editorial-carousel'),
      carouselInner: get('.carousel-inner'),
      carouselSlides: carouselItems.length,
      prevBtn: prevBtn ? 'exists' : null,
      nextBtn: nextBtn ? 'exists' : null,
      dots: dots.length,
      firstCatCard: firstCard,
      firstCatImg: firstImg,
      catLabel: labelStyle,
      catCardCount: catCards.length,
    };
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})().catch(console.error);
