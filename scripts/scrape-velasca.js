/**
 * Velasca Homepage Scraper
 * Uses Playwright to navigate velasca.com, extract images, fonts, and text content.
 * Downloads all images to public/images/scraped/
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const BASE_DIR = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(BASE_DIR, 'public', 'images', 'scraped');
const OUTPUT_FILE = path.join(BASE_DIR, 'scraped-data.json');

// Ensure output directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Download a file from URL
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    if (!url || url.startsWith('data:')) {
      resolve(null);
      return;
    }
    
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 30000
    }, (response) => {
      // Follow redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        resolve(null);
        return;
      }
      
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(filepath);
      });
      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Get a clean filename from URL
function getFilenameFromUrl(url) {
  try {
    const urlObj = new URL(url);
    let filename = path.basename(urlObj.pathname);
    // Remove query params from filename
    filename = filename.split('?')[0];
    // Clean up the filename
    filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    if (!filename || filename === '_') {
      filename = 'image_' + Date.now() + '.jpg';
    }
    return filename;
  } catch {
    return 'image_' + Date.now() + '.jpg';
  }
}

async function main() {
  console.log('🚀 Starting Velasca.com scraper...\n');
  
  ensureDir(IMAGES_DIR);
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  console.log('📡 Navigating to velasca.com...');
  await page.goto('https://www.velasca.com/', { 
    waitUntil: 'networkidle',
    timeout: 60000
  });
  
  // Wait for page to fully load
  await page.waitForTimeout(3000);
  
  // Scroll to bottom to trigger lazy-loaded images
  console.log('📜 Scrolling page to load all lazy images...');
  await autoScroll(page);
  await page.waitForTimeout(2000);
  
  // ============================================================
  // 1. EXTRACT ALL IMAGE SOURCES
  // ============================================================
  console.log('\n🖼️  Extracting image URLs...');
  
  const imageData = await page.evaluate(() => {
    const images = [];
    const seen = new Set();
    
    // Get all <img> tags
    document.querySelectorAll('img').forEach(img => {
      const src = img.src || img.currentSrc;
      const srcset = img.getAttribute('srcset') || '';
      const alt = img.alt || '';
      const className = img.className || '';
      const parentSection = img.closest('section')?.getAttribute('aria-label') || 
                           img.closest('section')?.className || 'unknown';
      
      if (src && !seen.has(src)) {
        seen.add(src);
        // Get the highest resolution from srcset
        let bestSrc = src;
        if (srcset) {
          const srcsetParts = srcset.split(',').map(s => s.trim());
          let maxWidth = 0;
          srcsetParts.forEach(part => {
            const [url, descriptor] = part.split(/\s+/);
            const width = parseInt(descriptor) || 0;
            if (width > maxWidth) {
              maxWidth = width;
              bestSrc = url;
            }
          });
        }
        
        images.push({
          src: bestSrc || src,
          originalSrc: src,
          srcset: srcset,
          alt: alt,
          className: className,
          section: parentSection,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height
        });
      }
    });
    
    // Get background images from CSS
    document.querySelectorAll('*').forEach(el => {
      const style = window.getComputedStyle(el);
      const bgImage = style.backgroundImage;
      if (bgImage && bgImage !== 'none') {
        const urlMatch = bgImage.match(/url\(["']?(.*?)["']?\)/);
        if (urlMatch && urlMatch[1] && !seen.has(urlMatch[1])) {
          seen.add(urlMatch[1]);
          images.push({
            src: urlMatch[1],
            originalSrc: urlMatch[1],
            alt: '',
            className: el.className || '',
            section: el.closest('section')?.getAttribute('aria-label') || 'background',
            type: 'background-image'
          });
        }
      }
    });
    
    // Get <source> elements in <picture> tags
    document.querySelectorAll('picture source').forEach(source => {
      const srcset = source.getAttribute('srcset') || '';
      if (srcset) {
        const srcsetParts = srcset.split(',').map(s => s.trim());
        srcsetParts.forEach(part => {
          const [url] = part.split(/\s+/);
          if (url && !seen.has(url)) {
            seen.add(url);
            const parentSection = source.closest('section')?.getAttribute('aria-label') || 'picture-source';
            images.push({
              src: url,
              originalSrc: url,
              alt: '',
              className: '',
              section: parentSection,
              type: 'picture-source',
              media: source.getAttribute('media') || ''
            });
          }
        });
      }
    });
    
    return images;
  });
  
  console.log(`   Found ${imageData.length} images`);
  
  // ============================================================
  // 2. EXTRACT FONT INFORMATION
  // ============================================================
  console.log('\n🔤 Extracting font information...');
  
  const fontData = await page.evaluate(() => {
    const fonts = {};
    const elements = document.querySelectorAll('*');
    
    elements.forEach(el => {
      const style = window.getComputedStyle(el);
      const fontFamily = style.fontFamily;
      const fontSize = style.fontSize;
      const fontWeight = style.fontWeight;
      const letterSpacing = style.letterSpacing;
      const textTransform = style.textTransform;
      const lineHeight = style.lineHeight;
      
      if (fontFamily && !fonts[fontFamily]) {
        fonts[fontFamily] = {
          fontFamily,
          weights: new Set(),
          sizes: new Set(),
          examples: []
        };
      }
      
      if (fontFamily && fonts[fontFamily]) {
        fonts[fontFamily].weights.add(fontWeight);
        fonts[fontFamily].sizes.add(fontSize);
        
        if (fonts[fontFamily].examples.length < 3 && el.textContent.trim().length > 0 && el.textContent.trim().length < 100) {
          fonts[fontFamily].examples.push({
            text: el.textContent.trim().substring(0, 80),
            tag: el.tagName,
            className: el.className,
            fontSize,
            fontWeight,
            letterSpacing,
            textTransform,
            lineHeight
          });
        }
      }
    });
    
    // Convert Sets to Arrays for JSON serialization
    Object.keys(fonts).forEach(key => {
      fonts[key].weights = [...fonts[key].weights];
      fonts[key].sizes = [...fonts[key].sizes];
    });
    
    // Also get @font-face declarations
    const fontFaces = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule instanceof CSSFontFaceRule) {
            fontFaces.push({
              fontFamily: rule.style.fontFamily,
              src: rule.style.src,
              fontWeight: rule.style.fontWeight,
              fontStyle: rule.style.fontStyle
            });
          }
        }
      } catch (e) {
        // Cross-origin stylesheet, skip
      }
    }
    
    return { computedFonts: fonts, fontFaces };
  });
  
  console.log(`   Found ${Object.keys(fontData.computedFonts).length} font families`);
  console.log(`   Found ${fontData.fontFaces.length} @font-face rules`);
  
  // ============================================================
  // 3. EXTRACT ALL TEXT CONTENT (section by section)
  // ============================================================
  console.log('\n📝 Extracting text content...');
  
  const textContent = await page.evaluate(() => {
    const sections = [];
    
    // Promotional banner
    const banner = document.querySelector('.announcement-bar, [class*="promotional"], [class*="banner"], [class*="ticker"]');
    if (banner) {
      sections.push({
        name: 'Promotional Banner',
        selector: banner.className,
        text: banner.textContent.trim()
      });
    }
    
    // Header / Nav
    const nav = document.querySelector('header, nav, [class*="header"]');
    if (nav) {
      const navLinks = [];
      nav.querySelectorAll('a, button, span').forEach(el => {
        const text = el.textContent.trim();
        if (text && text.length < 50) {
          navLinks.push({
            text: text,
            href: el.getAttribute('href') || '',
            tag: el.tagName
          });
        }
      });
      sections.push({
        name: 'Header / Navigation',
        links: navLinks
      });
    }
    
    // All sections on the page
    document.querySelectorAll('section, [class*="section"], [class*="block"]').forEach(section => {
      const label = section.getAttribute('aria-label') || section.className || '';
      const headings = [];
      section.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
        headings.push({
          tag: h.tagName,
          text: h.textContent.trim(),
          className: h.className
        });
      });
      
      const paragraphs = [];
      section.querySelectorAll('p').forEach(p => {
        const text = p.textContent.trim();
        if (text) paragraphs.push(text);
      });
      
      const buttons = [];
      section.querySelectorAll('a[class*="btn"], button, a[class*="cta"]').forEach(btn => {
        const text = btn.textContent.trim();
        if (text) {
          buttons.push({
            text: text,
            href: btn.getAttribute('href') || '',
            className: btn.className
          });
        }
      });
      
      const labels = [];
      section.querySelectorAll('[class*="label"], [class*="title"], [class*="heading"]').forEach(el => {
        const text = el.textContent.trim();
        if (text && text.length < 100) {
          labels.push({
            text: text,
            className: el.className,
            tag: el.tagName
          });
        }
      });
      
      if (headings.length > 0 || paragraphs.length > 0 || buttons.length > 0) {
        sections.push({
          name: label,
          headings,
          paragraphs,
          buttons,
          labels
        });
      }
    });
    
    // Footer
    const footer = document.querySelector('footer, [class*="footer"]');
    if (footer) {
      const footerData = {
        name: 'Footer',
        headings: [],
        paragraphs: [],
        links: []
      };
      
      footer.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
        footerData.headings.push({ tag: h.tagName, text: h.textContent.trim() });
      });
      
      footer.querySelectorAll('p').forEach(p => {
        const text = p.textContent.trim();
        if (text) footerData.paragraphs.push(text);
      });
      
      footer.querySelectorAll('a').forEach(a => {
        const text = a.textContent.trim();
        if (text) {
          footerData.links.push({
            text: text,
            href: a.getAttribute('href') || ''
          });
        }
      });
      
      sections.push(footerData);
    }
    
    return sections;
  });
  
  console.log(`   Found ${textContent.length} content sections`);
  
  // ============================================================
  // 4. EXTRACT CSS VARIABLES / COLOR PALETTE
  // ============================================================
  console.log('\n🎨 Extracting color palette and CSS variables...');
  
  const styleData = await page.evaluate(() => {
    const root = document.documentElement;
    const rootStyle = getComputedStyle(root);
    const cssVars = {};
    
    // Try to get CSS custom properties
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText === ':root' || rule.selectorText === ':root, :host') {
            for (let i = 0; i < rule.style.length; i++) {
              const prop = rule.style[i];
              if (prop.startsWith('--')) {
                cssVars[prop] = rule.style.getPropertyValue(prop).trim();
              }
            }
          }
        }
      } catch (e) {
        // Cross-origin stylesheet
      }
    }
    
    // Get key element colors
    const colorSamples = {};
    const samplesToGet = {
      'body-bg': 'body',
      'body-text': 'body',
      'header-bg': 'header',
      'nav-link': 'nav a',
      'heading': 'h1, h2',
      'button-primary': 'a[class*="btn"], button[class*="btn"]',
      'footer-bg': 'footer',
      'footer-text': 'footer'
    };
    
    Object.entries(samplesToGet).forEach(([name, selector]) => {
      const el = document.querySelector(selector);
      if (el) {
        const style = getComputedStyle(el);
        colorSamples[name] = {
          color: style.color,
          backgroundColor: style.backgroundColor,
          borderColor: style.borderColor
        };
      }
    });
    
    return { cssVars, colorSamples };
  });
  
  console.log(`   Found ${Object.keys(styleData.cssVars).length} CSS variables`);
  
  // ============================================================
  // 5. TAKE FULL-PAGE SCREENSHOT
  // ============================================================
  console.log('\n📸 Taking full-page screenshot...');
  const screenshotPath = path.join(BASE_DIR, 'velasca-homepage-full.png');
  await page.screenshot({ 
    path: screenshotPath, 
    fullPage: true 
  });
  console.log(`   Saved to: ${screenshotPath}`);
  
  // ============================================================
  // 6. DOWNLOAD ALL IMAGES
  // ============================================================
  console.log('\n⬇️  Downloading images...');
  
  const downloadedImages = [];
  let downloadCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  
  for (const img of imageData) {
    let url = img.src;
    
    // Skip data URIs, SVGs inline, tiny tracking pixels
    if (!url || url.startsWith('data:') || url.length < 10) {
      skipCount++;
      continue;
    }
    
    // Make absolute URL
    if (url.startsWith('//')) {
      url = 'https:' + url;
    } else if (url.startsWith('/')) {
      url = 'https://www.velasca.com' + url;
    }
    
    // For Shopify CDN images, get the highest resolution
    if (url.includes('cdn.shopify.com') || url.includes('velasca.com/cdn')) {
      // Remove width parameter to get full resolution, or set to 1800
      url = url.replace(/&width=\d+/, '&width=1800');
      if (!url.includes('width=')) {
        url += (url.includes('?') ? '&' : '?') + 'width=1800';
      }
    }
    
    const filename = getFilenameFromUrl(url);
    const filepath = path.join(IMAGES_DIR, filename);
    
    // Skip if already downloaded
    if (fs.existsSync(filepath)) {
      downloadedImages.push({
        ...img,
        localPath: `public/images/scraped/${filename}`,
        downloaded: true,
        skipped: true
      });
      skipCount++;
      continue;
    }
    
    try {
      const result = await downloadFile(url, filepath);
      if (result) {
        downloadCount++;
        downloadedImages.push({
          ...img,
          localPath: `public/images/scraped/${filename}`,
          downloaded: true
        });
        process.stdout.write(`   ✅ [${downloadCount}] ${filename}\n`);
      } else {
        skipCount++;
      }
    } catch (err) {
      errorCount++;
      console.log(`   ❌ Failed: ${filename} - ${err.message}`);
    }
  }
  
  console.log(`\n   Downloaded: ${downloadCount}, Skipped: ${skipCount}, Errors: ${errorCount}`);
  
  // ============================================================
  // 7. SAVE ALL SCRAPED DATA
  // ============================================================
  const scrapedData = {
    timestamp: new Date().toISOString(),
    url: 'https://www.velasca.com/',
    images: downloadedImages,
    allImageUrls: imageData,
    fonts: fontData,
    textContent: textContent,
    styles: styleData,
    summary: {
      totalImages: imageData.length,
      downloadedImages: downloadCount,
      fontFamilies: Object.keys(fontData.computedFonts),
      contentSections: textContent.length
    }
  };
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(scrapedData, null, 2));
  console.log(`\n💾 Scraped data saved to: ${OUTPUT_FILE}`);
  
  // ============================================================
  // 8. PRINT SUMMARY
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('📊 SCRAPING SUMMARY');
  console.log('='.repeat(60));
  console.log(`\n🖼️  Images: ${imageData.length} found, ${downloadCount} downloaded`);
  console.log(`🔤 Font families: ${Object.keys(fontData.computedFonts).join(', ')}`);
  console.log(`📝 Content sections: ${textContent.length}`);
  console.log(`🎨 CSS variables: ${Object.keys(styleData.cssVars).length}`);
  
  // Print font details
  console.log('\n--- FONT DETAILS ---');
  Object.entries(fontData.computedFonts).forEach(([family, data]) => {
    console.log(`  ${family}`);
    console.log(`    Weights: ${data.weights.join(', ')}`);
    console.log(`    Sizes: ${data.sizes.slice(0, 5).join(', ')}${data.sizes.length > 5 ? '...' : ''}`);
  });
  
  if (fontData.fontFaces.length > 0) {
    console.log('\n--- @FONT-FACE DECLARATIONS ---');
    fontData.fontFaces.forEach(face => {
      console.log(`  ${face.fontFamily} (${face.fontWeight || 'normal'}, ${face.fontStyle || 'normal'})`);
    });
  }
  
  // Print text content summary
  console.log('\n--- TEXT CONTENT SECTIONS ---');
  textContent.forEach(section => {
    console.log(`  📌 ${section.name}`);
    if (section.headings) {
      section.headings.forEach(h => console.log(`     ${h.tag}: "${h.text}"`));
    }
    if (section.paragraphs) {
      section.paragraphs.forEach(p => console.log(`     p: "${p.substring(0, 80)}..."`));
    }
    if (section.buttons) {
      section.buttons.forEach(b => console.log(`     btn: "${b.text}" → ${b.href}`));
    }
  });
  
  await browser.close();
  console.log('\n✅ Scraping complete!');
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 500;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          // Scroll back to top
          window.scrollTo(0, 0);
          resolve();
        }
      }, 200);
    });
  });
}

main().catch(console.error);
