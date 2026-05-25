/**
 * Compare mega-menu computed styles: clone vs https://www.velasca.com/
 * Run: node scripts/compare-mega-menu.mjs
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'screenshots', 'mega-menu-compare');
const CLONE_URL = `file:///${ROOT.replace(/\\/g, '/')}/index.html`;
const LIVE_URL = 'https://www.velasca.com/';

const MENUS = [
  { id: 'shoes', label: 'Shoes', hasImages: true },
  { id: 'collections', label: 'Collections', hasImages: true, multiImage: true },
  { id: 'clothing', label: 'Clothing', hasImages: false },
];

const STYLE_KEYS = [
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'line-height',
  'letter-spacing',
  'color',
  'text-transform',
  'text-decoration',
  'text-decoration-line',
  'background-color',
  'border-left',
  'border-left-width',
  'border-left-color',
  'margin-left',
  'padding-left',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'gap',
  'width',
  'height',
  'aspect-ratio',
  'object-fit',
  'transition',
  'transform',
  'overflow',
];

function pickStyles(cs) {
  const o = {};
  for (const k of STYLE_KEYS) o[k] = cs.getPropertyValue(k);
  return o;
}

function rectOf(el) {
  const r = el.getBoundingClientRect();
  return {
    width: Math.round(r.width * 10) / 10,
    height: Math.round(r.height * 10) / 10,
    left: Math.round(r.left),
    top: Math.round(r.top),
  };
}

/** Live site: extract mega-menu styles after hover */
function liveExtractFn(menuLabel) {
  return () => {
    const panel = document.querySelector('[data-testid="menu-links"]');
    if (!panel) return { error: 'menu-links panel not found' };

    const csPanel = window.getComputedStyle(panel);
    const columnsWrap =
      panel.querySelector('[class*="MenuColumns"]') ||
      panel.querySelector('[class*="columns"]') ||
      panel.firstElementChild;

    const columns = [...panel.querySelectorAll('[class*="MenuColumn"]')];
    const textCol = columns.find((c) => !c.querySelector('img'));
    const imageCol = columns.find((c) => c.querySelector('img'));

    const groupTitle = panel.querySelector(
      '[class*="SecondLevelMenuTitle"] a, [class*="SecondLevelMenuTitle"]'
    );
    const childLink = panel.querySelector(
      '[class*="SecondLevelMenuChildren"] a, [class*="ThirdLevel"] a'
    );
    const viewAll = [...panel.querySelectorAll('a')].find((a) =>
      /view all/i.test(a.textContent || '')
    );

    const imageWrap =
      panel.querySelector('[class*="MenuColumn"] img')?.parentElement ||
      panel.querySelector('a img')?.parentElement;
    const imageImg = panel.querySelector('[class*="MenuColumn"] img, a img');
    const imageLabel = imageImg?.closest('a');

    const imageLinks = [...panel.querySelectorAll('a')].filter((a) => a.querySelector('img'));

    const result = {
      panelBg: csPanel.backgroundColor,
      columnsPadding: columnsWrap ? pickStyles(window.getComputedStyle(columnsWrap)) : null,
      textColumn: textCol ? rectOf(textCol) : null,
      imageColumn: imageCol ? rectOf(imageCol) : null,
      groupTitle: groupTitle
        ? {
            text: groupTitle.textContent?.trim().slice(0, 40),
            ...pickStyles(window.getComputedStyle(groupTitle)),
            rect: rectOf(groupTitle),
          }
        : null,
      childLink: childLink
        ? {
            text: childLink.textContent?.trim().slice(0, 40),
            ...pickStyles(window.getComputedStyle(childLink)),
          }
        : null,
      viewAll: viewAll
        ? {
            ...pickStyles(window.getComputedStyle(viewAll)),
          }
        : null,
      imageWrap: imageWrap
        ? {
            ...pickStyles(window.getComputedStyle(imageWrap)),
            rect: rectOf(imageWrap),
          }
        : null,
      imageImg: imageImg
        ? {
            ...pickStyles(window.getComputedStyle(imageImg)),
            rect: rectOf(imageImg),
            transition: window.getComputedStyle(imageImg).transition,
          }
        : null,
      imageLabel: imageLabel
        ? {
            labelText: (imageLabel.textContent || '').trim().slice(0, 60),
            ...pickStyles(window.getComputedStyle(imageLabel)),
          }
        : null,
      imageColumnStyles: imageCol
        ? pickStyles(window.getComputedStyle(imageCol))
        : null,
      imageCount: imageLinks.length,
      imageLabels: imageLinks.map((a) => (a.textContent || '').trim().slice(0, 60)),
    };

    function pickStyles(cs) {
      const keys = [
        'font-family',
        'font-size',
        'font-weight',
        'font-style',
        'line-height',
        'letter-spacing',
        'color',
        'text-transform',
        'text-decoration',
        'text-decoration-line',
        'background-color',
        'border-left',
        'margin-left',
        'padding-left',
        'gap',
        'width',
        'height',
        'aspect-ratio',
        'object-fit',
        'transition',
        'transform',
        'overflow',
        'display',
        'flex-direction',
      ];
      const o = {};
      for (const k of keys) o[k] = cs.getPropertyValue(k);
      return o;
    }

    return result;
  };
}

/** Clone: extract after hover */
function cloneExtractFn() {
  return () => {
    const panel = document.querySelector('#mega-menu-inner');
    if (!panel || !panel.innerHTML.trim()) return { error: 'mega-menu-inner empty' };

    const columnsWrap = panel.querySelector('.mega-menu__columns');
    const textCol = panel.querySelector('.mega-menu__column:not(.mega-menu__column--images)');
    const imageCol = panel.querySelector('.mega-menu__column--images');

    const groupTitle = panel.querySelector('.mega-menu__group-title a');
    const childLink = panel.querySelector('.mega-menu__link:not(.mega-menu__link--view-all)');
    const viewAll = panel.querySelector('.mega-menu__link--view-all');

    const imageWrap = panel.querySelector('.mega-menu__image-wrap');
    const imageImg = panel.querySelector('.mega-menu__image-wrap img');
    const imageLabel = panel.querySelector('.mega-menu__image-label');
    const imageLinks = [...panel.querySelectorAll('.mega-menu__image-link')];

    function pickStyles(cs) {
      const keys = [
        'font-family',
        'font-size',
        'font-weight',
        'font-style',
        'line-height',
        'letter-spacing',
        'color',
        'text-transform',
        'text-decoration',
        'text-decoration-line',
        'background-color',
        'border-left',
        'margin-left',
        'padding-left',
        'gap',
        'width',
        'height',
        'aspect-ratio',
        'object-fit',
        'transition',
        'transform',
        'overflow',
        'display',
        'flex-direction',
      ];
      const o = {};
      for (const k of keys) o[k] = cs.getPropertyValue(k);
      return o;
    }

    function rectOf(el) {
      const r = el.getBoundingClientRect();
      return {
        width: Math.round(r.width * 10) / 10,
        height: Math.round(r.height * 10) / 10,
        left: Math.round(r.left),
        top: Math.round(r.top),
      };
    }

    return {
      panelBg: window.getComputedStyle(document.querySelector('.mega-menu__bg')).backgroundColor,
      columnsPadding: columnsWrap ? pickStyles(window.getComputedStyle(columnsWrap)) : null,
      textColumn: textCol ? rectOf(textCol) : null,
      imageColumn: imageCol ? rectOf(imageCol) : null,
      groupTitle: groupTitle
        ? {
            text: groupTitle.textContent?.trim().slice(0, 40),
            ...pickStyles(window.getComputedStyle(groupTitle)),
            rect: rectOf(groupTitle),
          }
        : null,
      childLink: childLink
        ? {
            text: childLink.textContent?.trim().slice(0, 40),
            ...pickStyles(window.getComputedStyle(childLink)),
          }
        : null,
      viewAll: viewAll ? pickStyles(window.getComputedStyle(viewAll)) : null,
      imageWrap: imageWrap
        ? { ...pickStyles(window.getComputedStyle(imageWrap)), rect: rectOf(imageWrap) }
        : null,
      imageImg: imageImg
        ? {
            ...pickStyles(window.getComputedStyle(imageImg)),
            rect: rectOf(imageImg),
          }
        : null,
      imageLabel: imageLabel
        ? {
            labelText: imageLabel.textContent?.trim().slice(0, 60),
            ...pickStyles(window.getComputedStyle(imageLabel)),
          }
        : null,
      imageColumnStyles: imageCol ? pickStyles(window.getComputedStyle(imageCol)) : null,
      imageCount: imageLinks.length,
      imageLabels: imageLinks.map((a) =>
        a.querySelector('.mega-menu__image-label')?.textContent?.trim()
      ),
    };
  };
}

async function hoverLive(page, label) {
  const nav = page.locator('[data-testid="desktop-navigation"]');
  if (label === 'Collections') {
    await nav.getByText(label, { exact: true }).first().hover();
  } else {
    await nav.getByRole('link', { name: label }).first().hover();
  }
  await page.waitForTimeout(700);
}

async function hoverClone(page, id) {
  const item = page.locator(`.navbar__item[data-menu="${id}"]`);
  await item.hover();
  await page.waitForTimeout(700);
}

async function extractHoverStyles(page, linkSelector, imageSelector, site) {
  return page.evaluate(
    ({ linkSel, imgSel, site }) => {
      function pick(cs) {
        return {
          color: cs.color,
          'text-decoration': cs.textDecoration,
          'text-decoration-line': cs.textDecorationLine,
          transform: cs.transform,
          transition: cs.transition,
        };
      }
      const link = document.querySelector(linkSel);
      const img = document.querySelector(imgSel);
      const out = { link: null, img: null };
      if (link) out.link = { default: pick(getComputedStyle(link)) };
      if (img) out.img = { default: pick(getComputedStyle(img)) };
      return out;
    },
    { linkSel: linkSelector, imgSel: imageSelector, site }
  );
}

function diffObjects(live, clone, prefix = '') {
  const diffs = [];
  const allKeys = new Set([...Object.keys(live || {}), ...Object.keys(clone || {})]);
  for (const k of allKeys) {
    const a = live?.[k];
    const b = clone?.[k];
    if (a && typeof a === 'object' && !Array.isArray(a) && b && typeof b === 'object') {
      diffs.push(...diffObjects(a, b, `${prefix}${k}.`));
    } else if (JSON.stringify(a) !== JSON.stringify(b)) {
      diffs.push({ path: `${prefix}${k}`, live: a, clone: b });
    }
  }
  return diffs;
}

function normalizeFontFamily(f) {
  return (f || '')
    .replace(/"/g, '')
    .split(',')[0]
    .trim()
    .toLowerCase();
}

function compareMenu(menuId, live, clone) {
  const report = { menu: menuId, diffs: [], matches: [], warnings: [] };

  const sections = [
    ['groupTitle', 'Group title'],
    ['childLink', 'Child link'],
    ['viewAll', 'View all link'],
    ['imageWrap', 'Image wrap'],
    ['imageImg', 'Image img'],
    ['imageLabel', 'Image label'],
    ['imageColumnStyles', 'Image column'],
    ['columnsPadding', 'Columns container'],
  ];

  for (const [key, label] of sections) {
    if (!live?.[key] && !clone?.[key]) continue;
    if (!live?.[key]) {
      report.warnings.push(`${label}: missing on live`);
      continue;
    }
    if (!clone?.[key]) {
      report.warnings.push(`${label}: missing on clone`);
      continue;
    }
    const d = diffObjects(live[key], clone[key]);
    const significant = d.filter((x) => {
      if (x.path.endsWith('text') || x.path.endsWith('labelText')) return false;
      if (x.path.includes('font-family')) {
        return normalizeFontFamily(x.live) !== normalizeFontFamily(x.clone);
      }
      if (x.path.includes('rect')) {
        const wLive = x.live?.width;
        const wClone = x.clone?.width;
        if (wLive && wClone && Math.abs(wLive - wClone) <= 2) return false;
      }
      return true;
    });
    if (significant.length) report.diffs.push({ section: label, items: significant });
    else report.matches.push(label);
  }

  if (live.imageCount !== clone.imageCount) {
    report.diffs.push({
      section: 'Image count',
      items: [{ path: 'imageCount', live: live.imageCount, clone: clone.imageCount }],
    });
  }

  return report;
}

async function dismissPopups(page) {
  try {
    const close = page.locator(
      'button[aria-label*="close" i], button[aria-label*="Close" i], [data-testid*="close"]'
    );
    if ((await close.count()) > 0) await close.first().click({ timeout: 2000 });
  } catch {
    /* ignore */
  }
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(500);
}

async function testLinkHover(page, site, menuId, label) {
  if (site === 'live') {
    await hoverLive(page, label);
    const sel =
      '[data-testid="menu-links"] [class*="SecondLevelMenuChildren"] a, [data-testid="menu-links"] [class*="ThirdLevel"] a';
    const link = page.locator(sel).first();
    await link.hover();
    await page.waitForTimeout(200);
    return page.evaluate((s) => {
      const el = document.querySelector(s);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        color: cs.color,
        textDecoration: cs.textDecoration,
        textDecorationLine: cs.textDecorationLine,
      };
    }, sel);
  }

  await hoverClone(page, menuId);
  const link = page.locator('.mega-menu__link').first();
  await link.hover();
  await page.waitForTimeout(200);
  return page.evaluate(() => {
    const el = document.querySelector('.mega-menu__link');
    if (!el) return null;
    const cs = getComputedStyle(el);
    return {
      color: cs.color,
      textDecoration: cs.textDecoration,
      textDecorationLine: cs.textDecorationLine,
    };
  });
}

async function testImageHover(page, site, menuId, label) {
  if (site === 'live') {
    await hoverLive(page, label);
    const img = page.locator('[data-testid="menu-links"] a img').first();
    const box = await img.boundingBox();
    if (!box) return null;
    const card = page.locator('[data-testid="menu-links"] a').filter({ has: img }).first();
    await card.hover();
    await page.waitForTimeout(350);
    return page.evaluate(() => {
      const img = document.querySelector('[data-testid="menu-links"] a img');
      if (!img) return null;
      const cs = getComputedStyle(img);
      return {
        transform: cs.transform,
        transition: cs.transition,
        width: cs.width,
        height: cs.height,
      };
    });
  }

  await hoverClone(page, menuId);
  await page.locator('.mega-menu__image-link').first().hover();
  await page.waitForTimeout(350);
  return page.evaluate(() => {
    const img = document.querySelector('.mega-menu__image-wrap img');
    if (!img) return null;
    const cs = getComputedStyle(img);
    return {
      transform: cs.transform,
      transition: cs.transition,
      width: cs.width,
      height: cs.height,
    };
  });
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  const livePage = await context.newPage();
  const clonePage = await context.newPage();

  console.log('Loading live site…');
  await livePage.goto(LIVE_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await livePage.waitForTimeout(3000);
  await dismissPopups(livePage);

  console.log('Loading clone…');
  await clonePage.goto(CLONE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await clonePage.waitForTimeout(1500);

  const allReports = [];
  const jsonOut = { capturedAt: new Date().toISOString(), menus: {} };

  for (const menu of MENUS) {
    console.log(`\n══ ${menu.label} ══`);

    await hoverLive(livePage, menu.label);
    const liveData = await livePage.evaluate(liveExtractFn(menu.label));
    await livePage.screenshot({
      path: path.join(OUT_DIR, `live-${menu.id}.png`),
      fullPage: false,
    });
    await livePage.mouse.move(5, 5);
    await livePage.waitForTimeout(300);

    await hoverClone(clonePage, menu.id);
    const cloneData = await clonePage.evaluate(cloneExtractFn());
    await clonePage.screenshot({
      path: path.join(OUT_DIR, `clone-${menu.id}.png`),
      fullPage: false,
    });
    await clonePage.mouse.move(5, 5);
    await clonePage.waitForTimeout(300);

    jsonOut.menus[menu.id] = { live: liveData, clone: cloneData };
    const report = compareMenu(menu.id, liveData, cloneData);
    allReports.push(report);

    console.log(`  Matches: ${report.matches.join(', ') || '(none)'}`);
    if (report.warnings.length) console.log(`  Warnings: ${report.warnings.join('; ')}`);
    if (report.diffs.length) {
      console.log('  DIFFERENCES:');
      for (const block of report.diffs) {
        console.log(`    [${block.section}]`);
        for (const item of block.items.slice(0, 12)) {
          console.log(`      ${item.path}: live=${JSON.stringify(item.live)} clone=${JSON.stringify(item.clone)}`);
        }
      }
    } else {
      console.log('  ✓ No significant style diffs');
    }

    if (menu.hasImages) {
      const liveImgHover = await testImageHover(livePage, 'live', menu.id, menu.label);
      const cloneImgHover = await testImageHover(clonePage, 'clone', menu.id, menu.label);
      jsonOut.menus[menu.id].imageHover = { live: liveImgHover, clone: cloneImgHover };
      console.log('  Image hover transform:');
      console.log(`    live:  ${liveImgHover?.transform}`);
      console.log(`    clone: ${cloneImgHover?.transform}`);
      const liveScale = liveImgHover?.transform?.includes('matrix') && !liveImgHover.transform.includes('1, 0, 0, 1');
      const cloneScale = cloneImgHover?.transform?.includes('1.03');
      if (liveScale || cloneScale) {
        console.log(
          liveScale && cloneScale
            ? '    ✓ Both apply scale on image hover'
            : '    ⚠ Scale transform may differ'
        );
      }
    }

    const liveLinkHover = await testLinkHover(livePage, 'live', menu.id, menu.label);
    const cloneLinkHover = await testLinkHover(clonePage, 'clone', menu.id, menu.label);
    jsonOut.menus[menu.id].linkHover = { live: liveLinkHover, clone: cloneLinkHover };
    console.log('  Link hover:');
    console.log(`    live:  color=${liveLinkHover?.color} underline=${liveLinkHover?.textDecorationLine}`);
    console.log(`    clone: color=${cloneLinkHover?.color} underline=${cloneLinkHover?.textDecorationLine}`);
  }

  fs.writeFileSync(path.join(OUT_DIR, 'comparison.json'), JSON.stringify(jsonOut, null, 2));

  const totalDiffs = allReports.reduce((n, r) => n + r.diffs.length, 0);
  console.log(`\n${'═'.repeat(50)}`);
  console.log(`Screenshots + JSON: ${OUT_DIR}`);
  console.log(
    totalDiffs === 0
      ? 'VERDICT: PASS — mega-menu styles align with velasca.com'
      : `VERDICT: GAPS — ${totalDiffs} section(s) with differences (see above)`
  );

  await browser.close();
  process.exit(totalDiffs === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
