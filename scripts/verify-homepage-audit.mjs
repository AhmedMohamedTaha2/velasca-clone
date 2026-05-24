/**
 * Static checks: clone vs Ai Guideline/velasca-homepage-audit.md
 * Run: node scripts/verify-homepage-audit.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function check(label, ok, detail) {
  return { label, ok, detail: ok ? undefined : detail };
}

const html = read('index.html');
const baseCss = read('css/base.css');
const navCss = read('css/component-nav.css');
const heroCss = read('css/component-hero.css');
const cardCss = read('css/component-card.css');
const carouselCss = read('css/component-carousel.css');
const footerCss = read('css/component-footer.css');
const sectionCss = read('css/section-home.css');
const buttonCss = read('css/component-button.css');
const scrollCss = read('css/scroll-behavior.css');
const mainJs = read('js/main.js');
const carouselJs = read('js/carousel-custom.js');

const results = [];

/* ── §1 Page structure ───────────────────────────── */
results.push(check('Main #homepage', /id="homepage"/.test(html)));
results.push(
  check('Main .content.side-collapse-container', /class="content side-collapse-container"/.test(html))
);
results.push(check('Promo .promotional-banner', /class="promotional-banner"/.test(html)));
results.push(check('Hero .hero-section', /class="hero-section"/.test(html)));
results.push(check('Category .category-grid', /class="category-grid"/.test(html)));
results.push(check('Carousel .editorial-carousel', /class="editorial-carousel"/.test(html)));
results.push(check('Get inspired section', /class="get-inspired-section"/.test(html)));
results.push(check('Newsletter #newsletter-section', /id="newsletter-section"/.test(html)));
results.push(
  check('Footer role=contentinfo', /role="contentinfo"/.test(html) && /id="footer-react"/.test(html))
);

/* ── §9 Accessibility ────────────────────────────── */
results.push(check('Skip to content link', /href="#skip-skip-to-content"/.test(html)));
results.push(check('Skip to footer link', /href="#footer-react"/.test(html)));
results.push(check('Skip target id', /id="skip-skip-to-content"/.test(html)));
results.push(check('Carousel sr-only prev next', /sr-only-carousel[^>]*>prev next</.test(html)));

/* ── §2.1 Layout tokens ──────────────────────────── */
for (const token of [
  '--container-max-width: 1280px',
  '--grid-max-width: 1250px',
  '--desktop-promotional-banner-height: 41px',
  '--drawer-width: 39rem',
]) {
  results.push(check(`Token ${token.split(':')[0]}`, baseCss.includes(token)));
}

/* ── §3–4 Theme tokens ───────────────────────────── */
for (const token of [
  '--theme-font-family',
  '--theme-secondary-font-family',
  '--theme-primary-color: #185674',
  '--theme-accent-color: #b0684f',
]) {
  results.push(check(`Theme alias ${token}`, baseCss.includes(token)));
}

/* ── §2.4 Hero heights ───────────────────────────── */
results.push(check('Hero mobile 570px', /height:\s*570px/.test(heroCss)));
results.push(check('Hero desktop 882px', /@media[\s\S]*882px/.test(heroCss)));

/* ── §5.5 Carousel ───────────────────────────────── */
results.push(check('Carousel desktop 617px', /height:\s*617px/.test(carouselCss)));
results.push(
  check(
    'Swiper nav buttons visible on homepage',
    /template-index[\s\S]*swiper-button-prev[\s\S]*display:\s*flex/.test(
      read('css/homepage-layout.css')
    )
  )
);
results.push(check('Swiper loop enabled', /loop:\s*true/.test(carouselJs)));
results.push(check('No carousel autoplay', !/autoplay/.test(carouselJs)));

/* ── §5.6 Editorial semantics ────────────────────── */
results.push(
  check('Editorial h3 eyebrow', (html.match(/<h3 class="editorial-card__eyebrow">/g) || []).length === 3)
);
results.push(
  check('Editorial h2 headline', (html.match(/<h2 class="editorial-card__headline">/g) || []).length === 3)
);
results.push(check('About block margin-bottom', /\.editorial-section--about[\s\S]*margin-bottom:\s*20px/.test(cardCss)));

/* ── §5.8 Footer grid ────────────────────────────── */
results.push(check('Footer gap 42px', /gap:\s*42px/.test(footerCss)));
results.push(check('Footer padding 17px', /padding:\s*17px/.test(footerCss)));

/* ── §5.3 CTA button ─────────────────────────────── */
results.push(check('btn-white min-width 300px', /min-width:\s*300px/.test(buttonCss)));
results.push(check('btn-white 1px white border', /\.btn-white[\s\S]*border:\s*1px solid/.test(buttonCss)));

/* ── §6 Scroll behavior ──────────────────────────── */
results.push(check('scroll-behavior auto', /scroll-behavior:\s*auto/.test(scrollCss)));
results.push(check('Nav dock threshold 200px', /DOCK_THRESHOLD\s*=\s*200/.test(mainJs)));
results.push(check('Nav initial top 90px', /top:\s*90px/.test(navCss)));
results.push(check('Promo banner fixed z-index 150', /\.promotional-banner[\s\S]*z-index:\s*150/.test(navCss)));

/* ── §5.9 Back to top ────────────────────────────── */
results.push(check('Back to top 35×35', /#back-to-top[\s\S]*width:\s*35px[\s\S]*height:\s*35px/.test(navCss)));
results.push(check('Back to top z-index 1000', /#back-to-top[\s\S]*z-index:\s*1000/.test(navCss)));

/* ── §2.3 Category grid ──────────────────────────── */
results.push(
  check(
    'Grid gap 10px',
    /gap:\s*10px/.test(sectionCss) ||
      /--hp-grid-gap:\s*10px/.test(read('css/homepage-layout.css'))
  )
);
results.push(check('Card margin-bottom 35px', /margin:\s*0 0 35px/.test(cardCss)));
results.push(check('Image height 560px', /height:\s*560px/.test(cardCss)));

/* ── §11 Content links ───────────────────────────── */
const requiredHrefs = [
  '/collections/all-products',
  '/collections/all-shoes',
  '/collections/all-clothing',
  '/collections/all-accessories',
  '/collections/lace-ups',
  '/collections/knitwear',
  '/collections/tassel-and-belgian-loafers',
  '/collections/pants',
  '/collections/sneakers',
  '/collections/jackets',
  '/pages/s-s-2025-style-edit',
  '/pages/spring-summer-2026',
  '/pages/spring-summer-2026-in-sicily',
  '/pages/winter-in-the-dolomites',
  '/pages/fall-winter-2025-in-the-dolomites',
  '/pages/fall-winter-2025',
  '/pages/by-the-amalfi-coast',
  '/pages/s-s-in-apulia',
  '/pages/about-us',
  '/pages/all-our-stores',
  'https://www.velascawomen.com/',
];
for (const href of requiredHrefs) {
  results.push(check(`Link ${href}`, html.includes(`href="${href}"`)));
}

results.push(check('No Collections nav item', !/href="\/collections"[^/]/.test(html)));

/* ── §5.7 Newsletter ─────────────────────────────── */
results.push(
  check(
    'Newsletter min-height 427px',
    /min-height:\s*427px/.test(sectionCss) ||
      read('css/homepage-layout.css').includes('min-height: 427px')
  )
);
results.push(check('Input 301×44', /\.newsletter-input[\s\S]*width:\s*301px[\s\S]*height:\s*44px/.test(sectionCss)));
results.push(check('Submit 44×44 primary', /\.newsletter-submit[\s\S]*width:\s*44px[\s\S]*background:\s*var\(--color-primary\)/.test(sectionCss)));

const failed = results.filter((r) => !r.ok);

if (failed.length === 0) {
  console.log(`✓ All ${results.length} audit checks passed (project ↔ velasca-homepage-audit.md)`);
  process.exit(0);
}

console.error(`✗ ${failed.length} of ${results.length} audit checks failed:\n`);
for (const f of failed) {
  console.error(`  - ${f.label}${f.detail ? `: ${f.detail}` : ''}`);
}
process.exit(1);
