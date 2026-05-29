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

  // Scroll to footer
  await page.evaluate(() => {
    const el = document.querySelector('.site-footer');
    if (el) window.scrollTo(0, el.offsetTop - 50);
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'audit-footer-viewport.png' });

  const data = await page.evaluate(() => {
    const get = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        w: Math.round(rect.width), h: Math.round(rect.height),
        x: Math.round(rect.x), absY: Math.round(rect.top + window.scrollY),
        display: cs.display, flexDir: cs.flexDirection,
        gridTemplateColumns: cs.gridTemplateColumns,
        gap: cs.gap, rowGap: cs.rowGap,
        bg: cs.backgroundColor, color: cs.color,
        paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom,
        paddingLeft: cs.paddingLeft, paddingRight: cs.paddingRight,
        fontSize: cs.fontSize, fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
      };
    };

    const footerLinks = document.querySelectorAll('.footer-col a');
    const firstLink = footerLinks[0];
    let linkStyle = null;
    if (firstLink) {
      const cs = window.getComputedStyle(firstLink);
      linkStyle = {
        fontSize: cs.fontSize, fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing,
        color: cs.color, textDecoration: cs.textDecoration,
        textTransform: cs.textTransform,
      };
    }

    const footerColHeadings = document.querySelectorAll('.footer-col__heading, .footer-col h4');
    let headingStyle = null;
    if (footerColHeadings[0]) {
      const cs = window.getComputedStyle(footerColHeadings[0]);
      headingStyle = {
        fontSize: cs.fontSize, fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing,
        textTransform: cs.textTransform, color: cs.color,
      };
    }

    return {
      footer: get('.site-footer'),
      footerInner: get('.footer-inner'),
      footerCols: get('.footer-cols'),
      footerCol1: get('.footer-col:first-child'),
      footerCol2: get('.footer-col:nth-child(2)'),
      footerBottom: get('.footer-bottom'),
      linkStyle,
      headingStyle,
      colCount: document.querySelectorAll('.footer-col').length,
    };
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})().catch(console.error);
