/**
 * Verify index.html visible copy against Ai Guideline/velasca-homepage-text.md
 * Run: node scripts/verify-homepage-copy.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const HTML = path.join(ROOT, 'index.html');

/** Canonical strings from velasca-homepage-text.md */
const EXPECTED = {
  title: 'Velasca | Italian style, made to last',
  metaDescription:
    "Men's shoes and clothing, artisanal quality and timeless style. Online and in store.",
  promotionalBanner:
    'Velasca Days: 20% off all shoes and clothing.',
  utility: [
    'United States',
    'Join the community',
    'Orders by: +1 929 384 6040',
    'WhatsApp',
  ],
  nav: [
    'New Arrivals',
    'Shoes',
    'Clothing',
    'Accessories',
    'Stores',
    'Archive',
    'Woman',
  ],
  navMustNotInclude: ['Collections'],
  heroCta: 'Discover all products',
  categories: ['Shoes', 'Clothing', 'Accessories'],
  carouselSlides: [
    "P/E '25 Style Edit",
    "Spring/Summer '26",
    "S/S '26 in Sicily",
    'Winter in the Dolomites',
    "F/W '25 in Cortina",
    "Fall/Winter '25",
    'By the Amalfi Coast',
    'A trip to Apulia',
  ],
  getInspiredHeading: 'Get inspired',
  getInspiredCards: [
    'Lace-ups',
    'Knitwear',
    'Tassel and Belgian Loafers',
    'Pants',
    'Sneakers',
    'Jackets',
  ],
  editorial: [
    { eyebrow: 'Artisanal craftmanship', headline: 'Made in Italy' },
    { eyebrow: 'Come visit us', headline: 'In store' },
    { eyebrow: 'Velasca', headline: 'For her' },
  ],
  newsletter: {
    heading: "Let's keep in touch",
    body: "News and inspiration straight to your inbox, every week. Let's have some fun, with style.",
    placeholder: 'Enter your email',
    consent:
      "By clicking you agree to Velasca's terms of service and consent to the processing of your data.",
  },
  footer: {
    breadcrumb: 'Home',
    brandHeading: "We're here for you",
    brandBody:
      'Velasca was created to offer you artisanal quality shoes and clothing at a fair price. To be worn for a lifetime. We really care, so if you have any doubts, do get in touch.',
    help: [
      'Impact report',
      'Accessibility Statement',
      'Shipping and returns',
      'Make a return',
      'Mob: +1 929 384 6040',
      'Email: hello@velasca.com',
    ],
    about: ['All our stores', 'About us', 'Work with us', 'Archive'],
    copyright:
      '© All rights reserved: Velasca LLC, 250 Elizabeth Street, New York, NY 10012, United States',
    legal: [
      'Terms & Conditions',
      'Privacy Policy',
      'Cookie Policy',
      'Whistleblowing',
    ],
  },
};

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalize(s) {
  return s
    .replace(/\s+([.,!?;:])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function includesText(haystack, needle) {
  return normalize(haystack).includes(normalize(needle));
}

function check(label, ok, detail) {
  return { label, ok, detail: ok ? undefined : detail };
}

const html = fs.readFileSync(HTML, 'utf8');
const text = stripTags(html);
const results = [];

// Title & meta
const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
results.push(
  check(
    'Page title',
    titleMatch?.[1] === EXPECTED.title,
    `got "${titleMatch?.[1]}"`
  )
);
const metaMatch = html.match(/name="description"\s+content="([^"]*)"/i);
results.push(
  check(
    'Meta description',
    metaMatch?.[1] === EXPECTED.metaDescription,
    `got "${metaMatch?.[1]}"`
  )
);

// Promotional banner
results.push(
  check(
    'Promotional banner',
    includesText(text, EXPECTED.promotionalBanner)
  )
);

// Utility row
for (const s of EXPECTED.utility) {
  results.push(check(`Utility: ${s}`, includesText(text, s)));
}

// Nav
for (const s of EXPECTED.nav) {
  results.push(check(`Nav: ${s}`, includesText(text, s)));
}
for (const s of EXPECTED.navMustNotInclude) {
  const navBlock = html.match(/site-header__nav[\s\S]*?<\/nav>/i)?.[0] ?? '';
  results.push(
    check(
      `Nav must not include: ${s}`,
      !stripTags(navBlock).includes(s),
      'found in main nav'
    )
  );
}

// Hero, categories, carousel
results.push(check('Hero CTA', includesText(text, EXPECTED.heroCta)));
for (const s of EXPECTED.categories) {
  results.push(check(`Category: ${s}`, includesText(text, s)));
}
for (const s of EXPECTED.carouselSlides) {
  results.push(check(`Carousel: ${s}`, includesText(text, s)));
}

// Get inspired
results.push(
  check('Get inspired heading', includesText(text, EXPECTED.getInspiredHeading))
);
for (const s of EXPECTED.getInspiredCards) {
  results.push(check(`Inspired card: ${s}`, includesText(text, s)));
}

// Editorial blocks
for (const { eyebrow, headline } of EXPECTED.editorial) {
  results.push(check(`Editorial eyebrow: ${eyebrow}`, includesText(text, eyebrow)));
  results.push(check(`Editorial headline: ${headline}`, includesText(text, headline)));
}

// Newsletter
results.push(
  check('Newsletter heading', includesText(text, EXPECTED.newsletter.heading))
);
results.push(check('Newsletter body', includesText(text, EXPECTED.newsletter.body)));
results.push(
  check(
    'Newsletter placeholder',
    html.includes(`placeholder="${EXPECTED.newsletter.placeholder}"`)
  )
);
results.push(
  check('Newsletter consent', includesText(text, EXPECTED.newsletter.consent))
);

// Footer
results.push(
  check('Footer breadcrumb', includesText(text, EXPECTED.footer.breadcrumb))
);
results.push(
  check('Footer brand heading', includesText(text, EXPECTED.footer.brandHeading))
);
results.push(check('Footer brand body', includesText(text, EXPECTED.footer.brandBody)));
for (const s of EXPECTED.footer.help) {
  results.push(check(`Footer Help: ${s}`, includesText(text, s)));
}
for (const s of EXPECTED.footer.about) {
  results.push(check(`Footer About: ${s}`, includesText(text, s)));
}
results.push(
  check('Footer copyright', includesText(text, EXPECTED.footer.copyright))
);
for (const s of EXPECTED.footer.legal) {
  results.push(check(`Footer legal: ${s}`, includesText(text, s)));
}

const failed = results.filter((r) => !r.ok);

if (failed.length === 0) {
  console.log(`✓ All ${results.length} copy checks passed (index.html ↔ velasca-homepage-text.md)`);
  process.exit(0);
}

console.error(`✗ ${failed.length} of ${results.length} checks failed:\n`);
for (const f of failed) {
  console.error(`  - ${f.label}${f.detail ? `: ${f.detail}` : ''}`);
}
process.exit(1);
