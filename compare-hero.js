/**
 * compare-hero.js
 * Extracts computed CSS values for hero sections from:
 *   1. Local clone:  file:///D:/Claude/velasca-clone/index.html
 *   2. Live site:    https://www.velasca.com/
 * at viewport widths 375, 768, 1440.
 * Screenshots saved to D:/Claude/velasca-clone/screenshots/
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const VIEWPORTS = [375, 768, 1440];

// CSS properties to collect
const CSS_PROPS = [
  'width', 'height', 'min-height', 'max-height',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'position', 'top', 'right', 'bottom', 'left',
  'transform',
  'font-size', 'font-weight', 'font-family', 'letter-spacing',
  'line-height', 'color', 'text-transform',
  'background-color', 'border', 'border-radius',
  'object-fit', 'object-position',
  'transition',
  'display', 'flex-direction', 'flex-wrap', 'align-items',
  'justify-content', 'flex', 'gap', 'flex-grow', 'flex-shrink', 'flex-basis',
  'overflow', 'overflow-x', 'overflow-y',
  'z-index', 'opacity',
];

/**
 * Extract computed styles for a CSS selector (or evaluator function) in the page.
 * Returns an object { propName: value } or null if element not found.
 */
async function extractStyles(page, selectorOrFn) {
  try {
    // Resolve the element handle
    let handle;
    if (typeof selectorOrFn === 'string') {
      handle = await page.$(selectorOrFn);
    } else {
      const h = await page.evaluateHandle(selectorOrFn);
      // evaluateHandle returns a JSHandle; convert to ElementHandle if it's an element
      const el = h.asElement();
      if (!el) { await h.dispose(); return null; }
      handle = el;
    }

    if (!handle) return null;

    // Pass props via closure: inject them as a global then clean up
    // Use elementHandle.evaluate(fn) — single-arg pattern supported by Playwright
    const styles = await handle.evaluate((el) => {
      const props = [
        'width', 'height', 'min-height', 'max-height',
        'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
        'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
        'position', 'top', 'right', 'bottom', 'left',
        'transform',
        'font-size', 'font-weight', 'font-family', 'letter-spacing',
        'line-height', 'color', 'text-transform',
        'background-color', 'border', 'border-radius',
        'object-fit', 'object-position',
        'transition',
        'display', 'flex-direction', 'flex-wrap', 'align-items',
        'justify-content', 'flex', 'gap', 'flex-grow', 'flex-shrink', 'flex-basis',
        'overflow', 'overflow-x', 'overflow-y',
        'z-index', 'opacity',
      ];
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const result = {};
      for (const prop of props) {
        result[prop] = cs.getPropertyValue(prop);
      }
      const rect = el.getBoundingClientRect();
      result['_boundingRect'] = {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
      };
      return result;
    });

    await handle.dispose();
    return styles;
  } catch (e) {
    return { _error: e.message };
  }
}

/**
 * Pretty-print a styles object.
 */
function printStyles(label, styles) {
  if (!styles) { console.log(`  ${label}: [NOT FOUND]`); return; }
  if (styles._error) { console.log(`  ${label}: [ERROR] ${styles._error}`); return; }

  console.log(`\n  ── ${label} ──`);
  if (styles._boundingRect) {
    const r = styles._boundingRect;
    console.log(`    [BoundingRect] width:${r.width.toFixed(1)}  height:${r.height.toFixed(1)}  top:${r.top.toFixed(1)}  left:${r.left.toFixed(1)}`);
  }
  for (const [k, v] of Object.entries(styles)) {
    if (k === '_boundingRect') continue;
    if (v && v !== '' && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px') {
      console.log(`    ${k}: ${v}`);
    } else {
      // Still print layout-critical ones even when "auto"/"0px"
      if (['width','height','display','position','padding-top','padding-bottom',
           'margin-top','margin-bottom','overflow','object-fit'].includes(k)) {
        console.log(`    ${k}: ${v}`);
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CLONE selectors
// ─────────────────────────────────────────────────────────────────────────────
const CLONE_ELEMENTS = [
  { label: '.hero',            selector: '.hero' },
  { label: '.hero__image-wrap', selector: '.hero__image-wrap' },
  { label: '.hero__image',     selector: '.hero__image' },
  { label: '.hero__cta-wrap',  selector: '.hero__cta-wrap' },
  { label: '.btn.btn--light',  selector: '.btn.btn--light' },
];

// ─────────────────────────────────────────────────────────────────────────────
// LIVE SITE element finders (by evaluating in page context)
// ─────────────────────────────────────────────────────────────────────────────
const LIVE_ELEMENTS = [
  {
    label: 'Hero Container (PageIntrostyles__Container)',
    fn: () => document.querySelector('[class*="PageIntrostyles__Container"]')
          || document.querySelector('[class*="PageIntro"][class*="Container"]')
          || document.querySelector('[class*="HeroContainer"]')
          || document.querySelector('[class*="hero-container"]'),
  },
  {
    label: 'Hero Picture/Img',
    fn: () => {
      const hero = document.querySelector('[class*="PageIntrostyles__Container"]')
               || document.querySelector('[class*="PageIntro"]');
      if (hero) {
        return hero.querySelector('picture') || hero.querySelector('img');
      }
      return document.querySelector('[class*="PageIntro"] img')
          || document.querySelector('[class*="hero"] picture')
          || document.querySelector('[class*="hero"] img');
    },
  },
  {
    label: 'CTA Button [data-testid="homepage-hero-cta"]',
    fn: () => document.querySelector('[data-testid="homepage-hero-cta"]'),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
(async () => {
  const browser = await chromium.launch({ headless: true });

  // ── 1. LOCAL CLONE ────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(72));
  console.log('  LOCAL CLONE  →  file:///D:/Claude/velasca-clone/index.html');
  console.log('═'.repeat(72));

  for (const vw of VIEWPORTS) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`  VIEWPORT: ${vw}px`);
    console.log('─'.repeat(60));

    const page = await browser.newPage();
    await page.setViewportSize({ width: vw, height: 900 });
    await page.goto('file:///D:/Claude/velasca-clone/index.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    for (const el of CLONE_ELEMENTS) {
      const styles = await extractStyles(page, el.selector);
      printStyles(el.label, styles);
    }

    // Screenshots at 375 and 1440 only
    if (vw === 375 || vw === 1440) {
      // Scroll to hero top
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(200);

      // Hero element clip
      const heroEl = await page.$('.hero');
      if (heroEl) {
        const box = await heroEl.boundingBox();
        if (box) {
          const clip = { x: box.x, y: box.y, width: Math.min(box.width, vw), height: Math.min(box.height, 900) };
          await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, `clone-hero-${vw}.png`),
            clip,
          });
          console.log(`\n  [Screenshot saved] clone-hero-${vw}.png  (${clip.width}×${clip.height})`);
        }
      } else {
        // Full page fallback
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `clone-hero-${vw}.png`), fullPage: false });
        console.log(`\n  [Screenshot saved] clone-hero-${vw}.png  (full viewport fallback)`);
      }
    }

    await page.close();
  }

  // ── 2. LIVE VELASCA SITE ─────────────────────────────────────────────────
  console.log('\n\n' + '═'.repeat(72));
  console.log('  LIVE SITE  →  https://www.velasca.com/');
  console.log('═'.repeat(72));

  for (const vw of VIEWPORTS) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`  VIEWPORT: ${vw}px`);
    console.log('─'.repeat(60));

    const page = await browser.newPage();
    await page.setViewportSize({ width: vw, height: 900 });

    // Set extra headers to appear like a real browser
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });

    try {
      await page.goto('https://www.velasca.com/', {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });
      // Wait for hero content to appear
      await page.waitForTimeout(3000);

      // Try to dismiss any cookie/popup overlays
      try {
        const cookieBtn = await page.$('[class*="cookie"] button, [id*="cookie"] button, [class*="consent"] button, button[aria-label*="Accept"], button[aria-label*="accept"]');
        if (cookieBtn) { await cookieBtn.click(); await page.waitForTimeout(500); }
      } catch (_) {}

      // Log what hero-related classes exist on page
      const heroClasses = await page.evaluate(() => {
        const all = Array.from(document.querySelectorAll('*'));
        const matches = all
          .filter(el => el.className && typeof el.className === 'string' &&
            (el.className.includes('PageIntro') || el.className.includes('hero') ||
             el.className.includes('Hero') || el.className.includes('intro')))
          .map(el => ({ tag: el.tagName, cls: el.className.substring(0, 120) }))
          .slice(0, 20);
        return matches;
      });
      console.log('\n  [Hero-related classes found on live page]:');
      heroClasses.forEach(h => console.log(`    <${h.tag}> ${h.cls}`));

      // Also check for the CTA
      const ctaExists = await page.evaluate(() => !!document.querySelector('[data-testid="homepage-hero-cta"]'));
      console.log(`\n  [CTA data-testid="homepage-hero-cta" found]: ${ctaExists}`);

      for (const el of LIVE_ELEMENTS) {
        const styles = await extractStyles(page, el.fn);
        printStyles(el.label, styles);
      }

      // Screenshots at 375 and 1440
      if (vw === 375 || vw === 1440) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(300);

        // Try to find hero bounding box
        const heroBox = await page.evaluate(() => {
          const el = document.querySelector('[class*="PageIntrostyles__Container"]')
                  || document.querySelector('[class*="PageIntro"]')
                  || document.querySelector('[class*="hero"]');
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { x: r.left, y: r.top, width: r.width, height: r.height };
        });

        if (heroBox && heroBox.height > 0) {
          await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, `live-hero-${vw}.png`),
            clip: {
              x: heroBox.x,
              y: heroBox.y,
              width: Math.min(heroBox.width, vw),
              height: Math.min(heroBox.height, 1000),
            },
          });
          console.log(`\n  [Screenshot saved] live-hero-${vw}.png`);
        } else {
          await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, `live-hero-${vw}.png`),
          });
          console.log(`\n  [Screenshot saved] live-hero-${vw}.png  (viewport fallback)`);
        }
      }

    } catch (err) {
      console.log(`\n  [ERROR loading live site at ${vw}px]: ${err.message}`);
    }

    await page.close();
  }

  await browser.close();

  console.log('\n\n' + '═'.repeat(72));
  console.log('  DONE — screenshots in:', SCREENSHOTS_DIR);
  console.log('═'.repeat(72) + '\n');
})();
