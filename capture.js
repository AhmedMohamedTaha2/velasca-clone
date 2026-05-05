const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });

  // ── 1. Live velasca.com ───────────────────────────────────────────────────
  const page1 = await browser.newPage();
  await page1.setViewportSize({ width: 1440, height: 900 });
  await page1.goto('https://www.velasca.com', { waitUntil: 'networkidle', timeout: 60000 });

  // Full-page screenshot
  await page1.screenshot({ path: 'D:\\Claude\\velasca-clone\\fresh-original.png', fullPage: true });
  console.log('✓ fresh-original.png saved');

  // ── Measurements ──────────────────────────────────────────────────────────
  const measurements = await page1.evaluate(() => {
    const rect = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      return el.getBoundingClientRect();
    };
    const height = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      return el.getBoundingClientRect().height;
    };

    // Try various selectors for announcement / utility / nav bars
    const announcementSelectors = [
      '[data-section-type="announcement-bar"]',
      '.announcement-bar',
      '#shopify-section-announcement-bar',
      '[id*="announcement"]',
      '.site-header__announcement-bar',
      'div[class*="announcement"]',
    ];
    const utilitySelectors = [
      '.utility-bar',
      '[class*="utility-bar"]',
      '.header__utility-bar',
      '[data-utility-bar]',
    ];
    const navSelectors = [
      'nav',
      '.site-nav',
      'header nav',
      '.main-nav',
      '[class*="main-nav"]',
      '.header__nav',
    ];
    const heroSelectors = [
      '.hero',
      '[class*="hero"]',
      '.slideshow',
      '[class*="slideshow"]',
      '.banner',
      '[class*="banner"]',
      'section:first-of-type',
    ];

    const findFirst = (sels) => {
      for (const s of sels) {
        try {
          const el = document.querySelector(s);
          if (el) return { selector: s, height: el.getBoundingClientRect().height, outerHTML: el.outerHTML.substring(0, 500) };
        } catch(e) {}
      }
      return null;
    };

    // Header inner HTML
    const header = document.querySelector('header');
    const headerHTML = header ? header.innerHTML.substring(0, 2000) : 'NOT FOUND';

    // Body classes
    const bodyClasses = document.body.className;

    // Shipping selector
    const allText = document.body.innerText;
    const hasShipping = allText.includes('Shipping:') || allText.includes('Ship to') || document.querySelector('[class*="country"]') !== null;
    const shippingEl = document.querySelector('[class*="country"]') || document.querySelector('[data-country]');
    const shippingText = shippingEl ? shippingEl.innerText : '';

    // Newsletter section
    const newsletterSelectors = ['[class*="newsletter"]', '[class*="email-signup"]', 'section[class*="newsletter"]', '#newsletter'];
    let newsletterInfo = null;
    for (const s of newsletterSelectors) {
      const el = document.querySelector(s);
      if (el) {
        const cols = el.querySelectorAll('img, picture').length;
        newsletterInfo = {
          selector: s,
          hasTwoColumns: el.querySelectorAll('[class*="col"], [class*="column"], [class*="grid"]').length >= 2,
          hasImage: cols > 0,
          html: el.outerHTML.substring(0, 1000),
        };
        break;
      }
    }

    // Footer
    const footer = document.querySelector('footer');
    const footerHTML = footer ? footer.outerHTML.substring(0, 2000) : 'NOT FOUND';

    // Try to measure specific bars
    // Velasca uses Shopify sections - look for them
    const allSections = Array.from(document.querySelectorAll('[id^="shopify-section-"]')).map(el => ({
      id: el.id,
      height: el.getBoundingClientRect().height,
      firstChildClass: el.firstElementChild ? el.firstElementChild.className : '',
    }));

    // Header element measurements
    const headerEl = document.querySelector('header');
    const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : null;

    // Look for sticky/fixed elements
    const fixedEls = Array.from(document.querySelectorAll('*')).filter(el => {
      const s = window.getComputedStyle(el);
      return (s.position === 'fixed' || s.position === 'sticky') && el.getBoundingClientRect().height > 10;
    }).slice(0, 10).map(el => ({
      tag: el.tagName,
      class: el.className.substring(0, 100),
      height: el.getBoundingClientRect().height,
      top: el.getBoundingClientRect().top,
    }));

    return {
      bodyClasses,
      headerHTML,
      headerHeight,
      allSections,
      fixedEls,
      announcementBar: findFirst(announcementSelectors),
      utilityBar: findFirst(utilitySelectors),
      nav: findFirst(navSelectors),
      hero: findFirst(heroSelectors),
      hasShipping,
      shippingText,
      newsletterInfo,
      footerHTML,
    };
  });

  fs.writeFileSync('D:\\Claude\\velasca-clone\\measurements.json', JSON.stringify(measurements, null, 2));
  console.log('✓ measurements.json saved');

  await page1.close();

  // ── 2. Local clone ────────────────────────────────────────────────────────
  const page2 = await browser.newPage();
  await page2.setViewportSize({ width: 1440, height: 900 });
  await page2.goto('file:///d:/Claude/velasca-clone/index.html', { waitUntil: 'networkidle', timeout: 30000 });
  await page2.screenshot({ path: 'D:\\Claude\\velasca-clone\\fresh-clone.png', fullPage: true });
  console.log('✓ fresh-clone.png saved');

  await browser.close();
  console.log('Done.');
})();
