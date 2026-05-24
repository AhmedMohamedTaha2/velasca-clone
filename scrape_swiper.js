const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.velasca.com', { waitUntil: 'networkidle' });

  // Use a flexible selector that matches the main carousel wrapper
  const carouselSelector = '.editorial-swiper, .swiper-container, .swiper, [data-carousel]';
  await page.waitForSelector(carouselSelector, { timeout: 30000 });
  const carouselHTML = await page.$eval(carouselSelector, el => el.outerHTML);

  // Capture all style elements (including those injected by Shopify)
  const styleContents = await page.$$eval('style', nodes => nodes.map(n => n.innerHTML).join('\n'));

  const outDir = path.resolve(__dirname);
  fs.writeFileSync(path.join(outDir, 'velasca_swiper.html'), carouselHTML);
  fs.writeFileSync(path.join(outDir, 'velasca_swiper.css'), styleContents);
  console.log('Saved velasca_swiper.html and .css');

  // Download images within the carousel
  const imgSrcs = await page.$$eval(`${carouselSelector} img`, imgs =>
    imgs.map(i => i.getAttribute('src')).filter(Boolean)
  );
  const imgDir = path.join(outDir, 'public', 'images', 'velasca');
  fs.mkdirSync(imgDir, { recursive: true });
  const download = (url, dest) => new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      if (res.statusCode !== 200) return reject(new Error('Failed to get ' + url));
      res.pipe(file);
    });
    file.on('finish', () => file.close(resolve));
    file.on('error', reject);
  });
  for (const src of imgSrcs) {
    // Resolve relative URLs against the site base
    const resolvedUrl = src.startsWith('http') ? src : new URL(src, 'https://www.velasca.com').href;
    const filename = path.basename(new URL(resolvedUrl).pathname);
    const destPath = path.join(imgDir, filename);
    try {
      await download(resolvedUrl, destPath);
      console.log('Downloaded', resolvedUrl);
    } catch (e) {
      console.error('Error downloading', resolvedUrl, e);
    }
  }

  await browser.close();
})();
