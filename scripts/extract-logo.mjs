import fs from 'fs';
import path from 'path';

const marker = 'viewBox="0 0 1555.96 603.49"';
const out = path.join(
  'public/images/www.velasca.com_096fb55f-7f73-4c01-8dcf-f5957d8887c8',
  'velasca-logo-extended-white.svg'
);

async function fromPlaywrightPage() {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://www.velasca.com/', { waitUntil: 'networkidle' });
  const svg = await page.evaluate(() => {
    const el = document.querySelector('svg[viewBox="0 0 1555.96 603.49"]');
    return el ? el.outerHTML : null;
  });
  await browser.close();
  return svg;
}

let svg = null;
if (fs.existsSync('velasca-body.html')) {
  const html = fs.readFileSync('velasca-body.html', 'utf8');
  const idx = html.indexOf(marker);
  if (idx >= 0) {
    const start = html.lastIndexOf('<svg', idx);
    const end = html.indexOf('</svg>', idx) + 6;
    svg = html.slice(start, end);
  }
}

if (!svg) {
  svg = await fromPlaywrightPage();
}

if (!svg) {
  console.error('Could not extract logo SVG');
  process.exit(1);
}

fs.writeFileSync(out, svg);
console.log('Saved', out, svg.length, 'bytes');
