# Velasca Homepage — Complete System Design for HTML/CSS Refactoring
> Feed this document directly to Cursor AI as a system prompt or attach it to every refactoring session. Every decision below is derived from direct CSS source analysis (4,464 lines), brand extraction data, and visual audit of velasca.com.

---

## PART 1 — DESIGN TOKENS & CSS VARIABLE SYSTEM

### 1.1 Paste this `:root` block verbatim into your `base.css` or `theme.css`

```css
:root {
  /* ─── LAYOUT ──────────────────────────────────────── */
  --container-max-width: 1200px;
  --grid-max-width: 1250px;
  --site-max-width: 1280px;
  --gutter: 15px;
  --section-spacing: 60px;
  --component-spacing: 30px;

  /* ─── PROMOTIONAL BANNER ──────────────────────────── */
  --promo-banner-height-desktop: 41px;
  --promo-banner-height-mobile: 41px;

  /* ─── BRAND PRIMARY ───────────────────────────────── */
  --color-primary: #185674;       /* Deep teal — nav, CTA fill, headings */
  --color-primary-light: #427892; /* Hover/active tint (+15% lighter) */

  /* ─── ACCENT ──────────────────────────────────────── */
  --color-accent: #b0684f;        /* Terracotta — links, borders, error */

  /* ─── SURFACES ────────────────────────────────────── */
  --color-bg: #ffffff;            /* Page base — NEVER tinted */
  --color-bg-warm: #F9F8F7;       /* Product cards, review widget */
  --color-bg-light: #f5f5f5;      /* Alternating sections, inputs */
  --color-bg-cream: #F7E7D4;      /* Newsletter popup, campaigns */
  --color-bg-button-light: #f2f2f2;

  /* ─── FOOTER ──────────────────────────────────────── */
  --color-bg-footer: #313332;     /* Footer main — warm near-black */
  --color-bg-footer-sub: #454746; /* Footer sub-sections */

  /* ─── TEXT ────────────────────────────────────────── */
  --color-text: #313332;          /* Primary body text */
  --color-text-inverted: #ffffff; /* On dark BG */
  --color-text-muted: #777777;    /* Captions, metadata */
  --color-text-subdued: #8B959A;  /* Secondary labels */
  --color-text-placeholder: #a4abad;

  /* ─── BORDERS ─────────────────────────────────────── */
  --color-border: #e3e3e3;        /* Light UI borders */
  --color-border-dark: #b9bbbb;   /* Heavier dividers */
  --color-neutral-300: #D9D9D9;

  /* ─── ART DIRECTION (photography only) ───────────── */
  --color-leather: #c59872;
  --color-tobacco: #685646;
  --color-slate: #354551;

  /* ─── SKELETON LOADING ────────────────────────────── */
  --color-skeleton-base: #5f889c;
  --color-skeleton-shine: #a8bdc7;

  /* ─── TYPOGRAPHY ──────────────────────────────────── */
  --font-primary: "Jost", serif;
  --font-display: Jomolhari, serif;

  /* ─── TRANSITIONS ─────────────────────────────────── */
  --transition-micro: all 0.2s linear;
  --transition-overlay: all 0.4s ease-in-out;
  --transition-drawer: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}
```

### 1.2 Color Application Rules (Non-Negotiable)

| Token | Hex | UI Target | Rule |
|---|---|---|---|
| `--color-primary` | `#185674` | Nav links, CTA fills, headings, focus rings | **Trust & Authority** — every action the user takes |
| `--color-primary-light` | `#427892` | Button `:hover` bg, active carousel dot | **Feedback** — never jarring |
| `--color-accent` | `#b0684f` | Hyperlinks (`.a-default`), decorative rules | **< 10% of interactive elements** — scarcity is its power |
| `--color-bg` | `#ffffff` | `<body>`, modals, cards, form fields | Never tinted |
| `--color-bg-warm` | `#F9F8F7` | Product cards, reviews widget | Artisanal warmth signal |
| `--color-bg-cream` | `#F7E7D4` | Newsletter popup, campaigns | Editorial only |
| `--color-bg-footer` | `#313332` | `<footer>` | **Always this value** — not `#000`, not `#222` |
| `--color-text` | `#313332` | All `<p>`, `<span>`, `<a>` at rest | No pure black anywhere |
| `--color-text-muted` | `#777777` | Captions, review dates | Never interactive elements |
| `--color-border` | `#e3e3e3` | Input borders, card outlines | Invisible structure |

**Hard rules:**
1. **Zero `#000000`** anywhere — replace all with `--color-text` or `--color-bg-footer`
2. **`--color-accent` cap** — count per page; if >10% of interactive elements, remove instances
3. **Footer is always `#313332`** — warm cast is part of brand identity
4. **Supplementary palette** (`--color-leather`, `--color-tobacco`, `--color-slate`) — photography/art direction only, never UI backgrounds or text

---

## PART 2 — TYPOGRAPHY SYSTEM

### 2.1 Font Loading (add to `<head>` in `theme.liquid` / `index.html`)

```html
<!-- Preconnect -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Jost — primary font, weights 300/400/500 ONLY -->
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />

<!-- Jomolhari — display/editorial font, load non-blocking -->
<link href="https://fonts.googleapis.com/css2?family=Jomolhari&display=swap" rel="stylesheet" />
```

### 2.2 Type Scale

```css
/* ── HEADINGS (Jost) ───────────────────────────────── */
h1 { font-family: var(--font-primary); font-size: 50px; font-weight: 400; line-height: 1.1; color: var(--color-text); margin: 0; }
h2 { font-family: var(--font-primary); font-size: 36px; font-weight: 400; line-height: 1.2; color: var(--color-text); margin: 0; }
h3 { font-family: var(--font-primary); font-size: 30px; font-weight: 400; line-height: 1.2; color: var(--color-text); margin: 0; }
h4 { font-family: var(--font-primary); font-size: 24px; font-weight: 400; line-height: 1.3; color: var(--color-text); margin: 0; }
h5 { font-family: var(--font-primary); font-size: 20px; font-weight: 400; line-height: 1.4; color: var(--color-text); margin: 0; }

/* ── EDITORIAL DISPLAY (Jomolhari — 3 sections MAX) ── */
.heading-display {
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 400;
  color: var(--color-primary);
  font-style: italic;
}

/* ── BODY ──────────────────────────────────────────── */
body, p, span, a {
  font-family: var(--font-primary);
  font-size: 20px;
  line-height: 34px;
  font-weight: 400;
  color: var(--color-text);
}

/* ── UTILITY CLASSES ───────────────────────────────── */
.text-xl   { font-size: 20px; }
.text-lg   { font-size: 18px; }
.text-md   { font-size: 16px; }
.text-base { font-size: 14px; }
.text-sm   { font-size: 12px; }
.text-xs   { font-size: 9px; }  /* Category labels ONLY */
.text-xxs  { font-size: 8px; }

.font-light   { font-weight: 300; }
.font-regular { font-weight: 400; }
.font-medium  { font-weight: 500; } /* MAXIMUM in system */

/* ── MOBILE OVERRIDES ──────────────────────────────── */
@media (max-width: 767px) {
  h1, h2, h3 { font-size: 28px; }
  body, p, span, a { font-size: 18px; line-height: 30px; }
}
```

> **CRITICAL RULE:** Maximum font weight in the ENTIRE system is `500`. Never use `600`, `700`, or `bold`. Boldness is expressed through spacing and color — not stroke weight.

---

## PART 3 — LAYOUT & CONTAINER SYSTEM

### 3.1 Container CSS

```css
/* ── PAGE-WIDE SECTIONS (hero, editorial) ─────────── */
.section-full-bleed {
  width: 100%;
  max-width: 100%;
}

/* ── STANDARD CONTENT CONTAINER ───────────────────── */
.container,
.page-width {
  width: 100%;
  max-width: var(--container-max-width); /* 1200px */
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--gutter);           /* 15px */
  padding-right: var(--gutter);
}

/* ── GRID CONTAINER ───────────────────────────────── */
.grid-container {
  width: 100%;
  max-width: var(--grid-max-width);       /* 1250px */
  margin-left: auto;
  margin-right: auto;
}

/* ── SECTION RHYTHM ───────────────────────────────── */
section,
.shopify-section,
.section-inner {
  padding-top: var(--section-spacing);   /* 60px */
  padding-bottom: var(--section-spacing);
}

/* ── EDITORIAL (no padding) ────────────────────────── */
.section-editorial {
  padding-top: 0;
  padding-bottom: 0;
}
```

### 3.2 Breakpoint System

```css
/* Mobile-first. Hover states ONLY at 992px+ */

/* SM — Tablet portrait */
@media (min-width: 768px) { }

/* MD — Hover-capable devices (CRITICAL) */
/* ALL :hover styles MUST be inside this query */
@media (min-width: 992px) {
  a:hover { text-decoration: none; }
}

/* LG — Full desktop */
@media (min-width: 1200px) { }
```

---

## PART 4 — HOMEPAGE SECTION-BY-SECTION BLUEPRINT

### SECTION A — Promotional Banner

```
┌─────────────────────────────────────────────────────┐
│   "Duties are on us! No extra charges at delivery"  │
│             height: 41px | bg: #185674              │
└─────────────────────────────────────────────────────┘
```

```css
.promotional-banner {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 9999;
  height: var(--promo-banner-height-desktop); /* 41px */
  background-color: var(--color-primary);     /* #185674 */
  color: var(--color-text-inverted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-primary);
  font-size: 14px;
  font-weight: 400;
  text-align: center;
}
```

**Specs:** Height `41px` (both desktop & mobile) | bg `#185674` | text `#ffffff` | font-size `14px` | weight `400` | position `fixed` | z-index `9999`

---

### SECTION B — Header / Navigation

```
┌─────────────────────────────────────────────────────┐
│ [Ship: US]          Velasca          [Join/Orders]  │
│ NEW ARRIVALS  SHOES  CLOTHING  ACCESSORIES  [👤][🛒] │
└─────────────────────────────────────────────────────┘
```

```css
.site-header {
  position: fixed;
  top: 41px; /* Below promo banner */
  left: 0; right: 0;
  z-index: 999;
  background-color: transparent; /* Homepage default */
  transition: background-color 0.3s ease-in-out;
}

/* Scrolled state */
.site-header.is-scrolled,
.site-header.is-sticky {
  background-color: var(--color-bg-light); /* #f5f5f5 */
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

/* Nav link base */
.site-header .nav-link {
  font-family: var(--font-primary);
  font-size: 14px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--color-text-inverted); /* white over hero */
  transition: color 0.2s ease-in-out;
}

/* Nav link on scrolled header */
.site-header.is-scrolled .nav-link,
.site-header.is-sticky .nav-link {
  color: var(--color-text-muted); /* #777777 */
}

@media (min-width: 992px) {
  .site-header .nav-link:hover {
    color: var(--color-text); /* #313332 */
  }
}
```

**Key specs:**
- Top bar height: `41px` (same as promo banner)
- Nav links: `14px` | weight `400` | `uppercase` | `letter-spacing: 2px`
- Homepage: transparent, transitions to `#f5f5f5` on scroll
- Product/cart pages: `position: sticky`, `background: #f5f5f5`

**Sticky Header JS (required):**
```javascript
(function() {
  const header = document.querySelector('.site-header');
  const isHomepage = document.body.classList.contains('template-index');
  if (!header) return;
  if (!isHomepage) { header.classList.add('is-sticky'); return; }

  const heroHeight = document.querySelector('.hero-section')?.offsetHeight || 400;
  function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > heroHeight * 0.5);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
})();
```

---

### SECTION C — Hero Banner (Full-Bleed)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│          [Full-bleed editorial photography]         │
│                                                     │
│              ┌────────────────────┐                 │
│              │  DISCOVER ALL →    │                 │
│              └────────────────────┘                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

```css
.hero-section {
  position: relative;
  width: 100%;
  height: 570px; /* mobile */
  background-size: cover !important;
  background-position: center;
  overflow: hidden;
}

@media (min-width: 768px) { .hero-section { height: 750px; } }
@media (min-width: 1200px) { .hero-section { height: var(--app-height, 98vh); } }

/* Top-fade overlay ONLY — never full darkening */
.hero-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.3) 20%, rgba(0,0,0,0) 30%);
}

/* CTA Button */
.hero-section .btn-white {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  border: 1px solid #fff;
  background: transparent;
  color: #fff;
  padding: 12px 32px;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 2px;
  font-weight: 400;
  border-radius: 0;
  white-space: nowrap;
}

/* iOS Safari height fix */
/* JS: document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`) */
```

---

### SECTION D — 3-Column Category Grid

```
┌─────────────┬─────────────┬─────────────┐
│  [SHOES img]│[CLOTHING img]│[ACCESS. img]│
│  aspect 3:4 │  aspect 3:4  │  aspect 3:4 │
├─────────────┼─────────────┼─────────────┤
│  SHOES →    │  CLOTHING →  │  ACCESSORIES→│
└─────────────┴─────────────┴─────────────┘
```

```css
.category-grid {
  display: grid;
  grid-template-columns: 1fr; /* mobile: stacked */
  gap: 0;                     /* flush edges */
}

@media (min-width: 992px) {
  .category-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.category-card__image-wrap {
  position: relative;
  aspect-ratio: 3 / 4; /* portrait — strict */
  overflow: hidden;
}

.category-card__image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
}

@media (min-width: 992px) {
  .category-card:hover .category-card__image-wrap img {
    transform: scale(1.02);
  }
}

/* Category label — EXACT specs */
.category-card__label {
  display: block;
  margin-top: 12px;
  font-family: var(--font-primary);
  font-size: 9px;          /* FIXED — do not change */
  font-weight: 400;        /* Never bold */
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--color-text);
  text-decoration: none;
}
/* Arrow is inline text → <span>SHOES →</span> — NOT a separate icon */
```

---

### SECTION E — Editorial Collection Carousel

```css
.editorial-carousel {
  position: relative;
  width: 100%;
  height: 570px; /* mobile */
}

@media (min-width: 992px) {
  .editorial-carousel { height: 80vh; }
}

/* Carousel transition — OPACITY ONLY, never transform/slide */
.editorial-carousel .swiper-slide {
  transition-property: opacity !important;
}

/* Label overlay */
.editorial-carousel .slide-label {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  border: 1px solid #fff;
  background: rgba(255,255,255,0.95);
  padding: 12px 32px;
  font-size: 12px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--color-text);
  white-space: nowrap;
}

/* Pagination dots */
.swiper-pagination-bullet {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(0,0,0,0.2);
}
.swiper-pagination-bullet-active {
  background: transparent;
  border: 2px solid var(--color-primary);
}
```

**Swiper.js config (required):**
```javascript
new Swiper('.editorial-carousel', {
  effect: 'fade',             /* NOT slide */
  fadeEffect: { crossFade: true },
  speed: 400,
  loop: true,
  autoplay: { delay: 5000, disableOnInteraction: false },
  pagination: { el: '.swiper-pagination', clickable: true }
});
```

---

### SECTION F — "Get Inspired" Grid (3×2)

```
                    Get inspired         ← Jomolhari italic, 36px, #185674
  ┌──────────┬──────────┬──────────┐
  │ Lace-ups │ Knitwear │ Loafers  │
  ├──────────┼──────────┼──────────┤
  │  Pants   │ Sneakers │ Jackets  │
  └──────────┴──────────┴──────────┘
```

```css
/* Section heading */
.get-inspired-heading {
  font-family: var(--font-display); /* Jomolhari */
  font-size: 36px;
  font-weight: 400;
  color: var(--color-primary); /* #185674 */
  text-align: center;
  font-style: italic;
  margin-bottom: 40px;
}

/* Grid */
.get-inspired-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* mobile */
  gap: 8px;
}

@media (min-width: 992px) {
  .get-inspired-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Section */
.get-inspired-section {
  background-color: var(--color-bg); /* #ffffff */
  padding: var(--section-spacing) 0; /* 60px top/bottom */
}
```

---

### SECTION G — Editorial Overlay Cards ("Made in Italy", "In Store", "For Her")

```
┌──────────────────────────────────────────────────────┐
│              [Full-width photographic BG]            │
│                                                      │
│          ┌──────────────────────────────┐            │
│          │  ARTISANAL CRAFTMANSHIP      │            │
│          │       Made in Italy          │ ← White card│
│          └──────────────────────────────┘            │
└──────────────────────────────────────────────────────┘
```

```css
.editorial-section {
  position: relative;
  width: 100%;
  height: 400px;
  background-size: cover !important;
  background-position: center;
}

@media (min-width: 768px) {
  .editorial-section { height: 500px; }
}

.editorial-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  padding: 32px 48px;
  text-align: center;
  border-radius: 0;    /* SHARP — no rounding, ever */
  min-width: 280px;
}

.editorial-card__eyebrow {
  display: block;
  font-family: var(--font-primary);
  font-size: 9px;
  font-weight: 400;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--color-text);
  margin-bottom: 8px;
}

.editorial-card__headline {
  display: block;
  font-family: var(--font-display); /* Jomolhari */
  font-size: 36px;
  font-weight: 400;
  color: var(--color-text);
  line-height: 1.2;
}
```

---

### SECTION H — Newsletter Block

```css
.newsletter-section {
  background-color: var(--color-bg-cream); /* #F7E7D4 */
  padding: var(--section-spacing) 0;       /* 60px */
}

.newsletter-heading {
  font-family: var(--font-display); /* Jomolhari */
  font-size: 36px;
  font-weight: 400;
  color: var(--color-primary); /* #185674 */
}

.newsletter-body {
  font-size: 20px;
  line-height: 34px;
  color: var(--color-text);
}

/* Input — bottom border only */
.newsletter-input-wrap {
  display: flex;
  align-items: center;
  background: transparent;
  border-bottom: 2px solid var(--color-border-dark); /* #b9bbbb */
  border-radius: 0;
}

.newsletter-input-wrap input {
  flex: 1;
  height: 45px;
  border: 0;
  background: transparent;
  font-family: var(--font-primary);
  font-size: 20px;
  font-weight: 400;
  color: var(--color-primary);
  padding: 0;
}

.newsletter-input-wrap input::placeholder {
  color: var(--color-text-muted); /* #777777 */
  font-style: italic;
  font-size: 20px;
}

/* Submit button — arrow icon only, no bg */
.newsletter-submit {
  width: 35px;
  height: 35px;
  background: transparent;
  border: 0;
  cursor: pointer;
}
```

---

### SECTION I — Footer

```css
/* Main footer */
footer {
  background-color: var(--color-bg-footer); /* #313332 */
  color: var(--color-text-inverted);
}

/* Sub-sections (payment, legal strip) */
.footer-sub {
  background-color: var(--color-bg-footer-sub); /* #454746 */
}

/* Column headings */
footer h4 {
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--color-text-inverted);
  margin-bottom: 10px;
}

/* Body links */
footer ul li a {
  color: #fff;
  font-size: 13px;
  line-height: 20px;
}

/* Footer nav links */
#footer-nav a {
  color: #fff;
  text-transform: uppercase;
  font-size: 16px;
  line-height: 20px;
}

/* Legal text */
#footer-info a,
#footer-info span {
  font-size: 14px;
  color: var(--color-border-dark); /* #b9bbbb */
}

/* Separator */
#footer-nav {
  border-top: 2px solid #fff;
  padding: 30px 0;
}
```

---

## PART 5 — COMPONENT SPECIFICATIONS

### 5.1 Button Components

```css
/* ── PRIMARY BUTTON ────────────────────────────────── */
.btn,
.btn-default {
  display: inline-block;
  margin: 15px 0;
  padding: 11px 32px 8px;
  font-family: var(--font-primary);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: 0;
  text-transform: uppercase;
  text-decoration: none !important;
  color: var(--color-text-inverted);
  background-color: var(--color-primary); /* #185674 */
  border: 0;
  border-radius: 0; /* SHARP — non-negotiable */
  transition: var(--transition-micro);
  cursor: pointer;
}

@media (min-width: 992px) {
  .btn-default:hover {
    background-color: var(--color-primary-light); /* #427892 */
    color: var(--color-text-inverted);
  }
}

/* ── GHOST / SECONDARY ─────────────────────────────── */
.btn-secondary {
  background-color: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  border-radius: 0;
  font-weight: 500;
  text-transform: uppercase;
  padding: 11px 32px 8px;
  font-size: 14px;
}

@media (min-width: 992px) {
  .btn-secondary:hover {
    background-color: var(--color-primary);
    color: var(--color-text-inverted);
  }
}

/* ── HERO / WHITE (over photography only) ──────────── */
.btn-white {
  background-color: rgba(255,255,255,0.3);
  color: var(--color-text-inverted);
  border: 1px solid var(--color-text-inverted);
  border-radius: 0;
  padding: 12px 32px;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
}

@media (min-width: 992px) {
  .btn-white:hover {
    background-color: var(--color-bg);
    color: var(--color-text);
  }
}

/* ── PILL (review/social submission ONLY) ──────────── */
.btn-pill {
  border-radius: 100px;  /* ONLY context with rounding */
  background-color: var(--color-primary);
  color: var(--color-text-inverted);
  border: 0;
  padding: 11px 32px 8px;
  font-size: 14px;
  font-weight: 400;
  text-transform: uppercase;
}
```

**Button comparison table:**

| Property | `.btn-default` | `.btn-secondary` | `.btn-white` | `.btn-pill` |
|---|---|---|---|---|
| Padding top | `11px` | `11px` | `12px` | `11px` |
| Padding bottom | `8px` | `8px` | `12px` | `8px` |
| Padding sides | `32px` | `32px` | `32px` | `32px` |
| Font weight | `500` | `500` | `400` | `400` |
| Letter-spacing | `0` | `0` | `2px` | `0` |
| Border-radius | `0` | `0` | `0` | `100px` |
| BG (rest) | `#185674` | `transparent` | `rgba(255,255,255,.3)` | `#185674` |
| BG (hover) | `#427892` | `#185674` | `#ffffff` | — |

> **Rule:** `border-radius > 0` is ONLY permitted on `.btn-pill`. Any other rounded button is a brand violation.

---

### 5.2 Form Input Components

```css
/* ── STANDARD TEXT INPUT ───────────────────────────── */
.lb-animate {
  position: relative;
  margin-bottom: 15px;
  border: 1px solid var(--color-border-dark);
  border-radius: 0;
}

.lb-animate input {
  width: 100%;
  border: 0;
  padding: 18px 15px;
  font-family: var(--font-primary);
  font-size: 14px;
  font-weight: 400;
  color: var(--color-text);
  background: transparent;
  transition: var(--transition-micro);
}

.lb-animate:focus-within {
  border: 1px solid var(--color-text);
}

/* Floating label */
.lb-animate label {
  opacity: 0;
  position: absolute;
  top: 0; left: 0;
  padding: 12px 15px 0;
  font-size: 12px;
  line-height: 12px;
  font-weight: 300;
  color: var(--color-primary);
  transition: var(--transition-micro);
}

.lb-animate.active label { opacity: 1; color: var(--color-text); }
.lb-animate.active input { padding: 25px 15px 11px; }
```

---

### 5.3 Links

```css
a { text-decoration: none; color: var(--color-text); }

@media (min-width: 992px) {
  a:focus, a:hover, a:visited { text-decoration: none; }
}

/* Accent link */
.a-default {
  cursor: pointer;
  color: var(--color-accent); /* #b0684f */
}

@media (min-width: 992px) {
  .a-default:hover { color: var(--color-accent); text-decoration: underline; }
}
```

---

## PART 6 — INTERACTION STATES MASTER TABLE

| Element | Rest | Hover | Transition | Notes |
|---|---|---|---|---|
| `.btn-default` | bg `#185674` | bg `#427892` | `0.2s linear` | 992px+ only |
| `.btn-secondary` | border `#185674`, bg `transparent` | bg `#185674`, text `#fff` | `0.2s linear` | 992px+ only |
| `.btn-white` | bg `rgba(255,255,255,.3)` | bg `#fff`, text `#313332` | `0.2s linear` | 992px+ only |
| `a` (generic) | no underline | no underline | — | Remove default underline |
| `.category-card img` | `scale(1.0)` | `scale(1.02)` | `0.3s ease` | 992px+ only |
| `nav a` | `#777777` | `#313332` | `0.2s linear` | — |
| Drawer/cart panel | off-screen | slides in | `0.5s cubic-bezier(0.32,0.72,0,1)` | Premium decel |
| Carousel slides | — | — | `opacity 0.4s ease-in-out` | **Never translateX** |
| Form field | border `#e3e3e3` | border `#313332` on focus | `0.2s linear` | `:focus-within` |
| Footer links | `#fff` | `opacity: 0.7` | `0.2s linear` | 992px+ only |

---

## PART 7 — SPACING SYSTEM

All spacing references the base `8px` grid. Key values:

```css
/* Exact values from production CSS */
.sp-1  { margin/padding: 1px; }
.sp-5  { margin/padding: 5px; }
.sp-9  { margin/padding: 9px; }
.sp-10 { margin/padding: 10px; }
.sp-12 { margin/padding: 12px; }
.sp-15 { margin/padding: 15px; }   /* default gutter */
.sp-16 { margin/padding: 16px; }
.sp-20 { margin/padding: 20px; }
.sp-30 { margin/padding: 30px; }   /* --component-spacing */
.sp-35 { margin/padding: 35px; }
.sp-60 { margin/padding: 60px; }   /* --section-spacing */
```

---

## PART 8 — BORDER RADIUS RULES

| Context | Radius | Used On |
|---|---|---|
| Default (all UI) | `0` | Buttons, inputs, cards, editorial cards |
| Subtle (modal/link) | `6px` | Modals, some links |
| Full round | `100px` | `.btn-pill` ONLY — review/social submission |
| Circle | `100%` | Avatar/icon containers |

> **Zero tolerance:** Any `border-radius > 6px` on a CTA button, input, or editorial card is a brand violation. When in doubt, use `0`.

---

## PART 9 — SHADOW & ELEVATION SYSTEM

```css
/* Only one standard shadow in the system */
.with-shadow {
  box-shadow: rgba(0, 0, 0, 0.5) 0px 5px 15px 0px;
}

/* Modal overlay shadows */
.modal-content {
  box-shadow: 0 5px 15px rgba(0,0,0,0.5);
}

/* Sticky header (scrolled state) */
.site-header.is-scrolled {
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
```

---

## PART 10 — ANIMATION & MOTION SYSTEM

```css
/* ── TRANSITION TOKENS ─────────────────────────────── */
--transition-micro:   all 0.2s linear;
--transition-overlay: all 0.4s ease-in-out;
--transition-drawer:  transform 0.5s cubic-bezier(0.32, 0.72, 0, 1);

/* ── MOTION SCALE ──────────────────────────────────── */
/* 0.05s | 0.1s | 0.2s | 0.3s | 0.4s | 0.5s */
/* Easing: ease (default), ease-out (nav), ease-in-out (links/buttons) */

/* ── BY CONTEXT ────────────────────────────────────── */
/* nav:     0.2s / 0.1s · ease-out [color, background] */
/* link:    0.2s · ease-in-out [color] */
/* media:   0.05s · ease [filter] */
/* button:  0.2s · ease-in-out */
/* carousel: 0.4s · ease-in-out [opacity ONLY] */
/* drawer:  0.5s · cubic-bezier(0.32, 0.72, 0, 1) [transform] */

/* ── HOVER PATTERN ─────────────────────────────────── */
/* "Velasca" brand color shift on nav links */
```

---

## PART 11 — CSS FILE ARCHITECTURE

```
assets/ (or styles/)
├── base.css               ← :root tokens ONLY
├── layout.css             ← Containers, section padding, grid utils
├── component-button.css   ← All button variants
├── component-form.css     ← All input/form styles
├── component-card.css     ← Category card, product card
├── component-nav.css      ← Header, nav, promo banner
├── component-footer.css   ← Footer layout and typography
├── component-hero.css     ← Hero banner, editorial banners
├── component-carousel.css ← Slider / carousel (opacity fade)
├── section-home.css       ← Homepage-specific overrides only
├── section-product.css    ← Product page overrides
└── section-collection.css ← Collection page overrides
```

**Loading order:**
```html
<link rel="stylesheet" href="base.css" />
<link rel="stylesheet" href="layout.css" />
<link rel="stylesheet" href="component-button.css" />
<link rel="stylesheet" href="component-form.css" />
<!-- ...etc in dependency order -->
```

---

## PART 12 — CURSOR AI SYSTEM PROMPT BLOCK

> Prepend this block to every Cursor AI refactoring session:

```
SYSTEM CONTEXT — VELASCA HOMEPAGE REFACTOR
You are editing HTML and CSS files to match the Velasca design system exactly.
The complete specification is in this document. Apply ALL rules without exception.

HARD RULES — NEVER VIOLATE:
1. Maximum font-weight anywhere in the codebase is 500. Never write font-weight: 600, 700, or bold.
2. All primary buttons have border-radius: 0. The ONLY exception is .btn-pill which uses border-radius: 100px.
3. ALL :hover rules must be wrapped inside @media (min-width: 992px) { }
4. Never hardcode a color hex value — always use var(--color-*) tokens.
5. Category labels are always: font-size: 9px; letter-spacing: 2px; text-transform: uppercase; font-weight: 400.
6. Carousel transitions use opacity only — never transform: translateX or any slide animation.
7. Every major section has padding: 60px top and bottom — no exceptions.
8. No pure black (#000000) anywhere. Use var(--color-text) #313332 for text, var(--color-bg-footer) #313332 for footer bg.
9. The accent color (#b0684f) must appear on fewer than 10% of interactive elements per page.
10. All images use background-size: cover — never background-size: contain.
11. The footer background is always #313332 — never #000, #111, or #1a1a1a.
12. The Jomolhari font is used on MAXIMUM 3 sections: "Get inspired" heading, newsletter heading, and editorial section headings only.
13. Arrow indicators in category labels are inline text characters (→) — never SVG, Font Awesome, or pseudo-elements.
14. No :hover state fires on mobile/touch — gate ALL hover CSS inside @media (min-width: 992px).
15. The hero section uses a top-only gradient overlay: linear-gradient(180deg, rgba(0,0,0,0.3) 20%, rgba(0,0,0,0) 30%) — not full darkening.
```

---

## PART 13 — DEVELOPER CHECKLIST

Use this as a QA gate before any PR is merged:

### Tokens & Colors
- [ ] `:root` block with all CSS variables is in `base.css`
- [ ] Global search for hardcoded hex values — every instance replaced with `var(--*)`
- [ ] `grep -r "color: black"`, `grep -r "#000"`, `grep -r "background: #000"` — all replaced
- [ ] `--color-accent` (#b0684f) usage does not exceed 10% of interactive elements per page
- [ ] `--color-primary` (#185674) only appears on `#ffffff` backgrounds (check contrast ratio ≥ 4.5:1)
- [ ] Footer `background-color` is `var(--color-bg-footer)` — not `#000` or `#1a1a1a`
- [ ] All `<input>` placeholder text uses `--color-text-muted` (#777777)

### Typography
- [ ] Google Fonts `<link>` for Jost (weights 300, 400, 500) and Jomolhari in `<head>`
- [ ] `grep -r "font-weight: 600"`, `grep -r "font-weight: 700"`, `grep -r "font-weight: bold"` — all removed
- [ ] Jomolhari is used on exactly 3 sections
- [ ] Body text is 20px / 34px line-height on desktop, 18px / 30px on mobile

### Layout
- [ ] Every `<section>` has `padding: 60px 0` (use a `.section-inner` utility class)
- [ ] Container max-width is 1200px with 15px side gutters
- [ ] Hero height: 570px mobile → 750px tablet → 98vh desktop
- [ ] Hero uses `background-size: cover`, `background-position: center`
- [ ] Hero overlay is top-fade gradient ONLY

### Sections
- [ ] Category grid: `grid-template-columns: repeat(3, 1fr)` desktop, `1fr` mobile
- [ ] Category labels: exactly `9px`, `letter-spacing: 2px`, `uppercase`, weight `400`
- [ ] Arrow characters (`→`) are inline text, not icon elements
- [ ] Editorial overlay cards: `border-radius: 0` — sharp corners, no rounding whatsoever
- [ ] Newsletter background: `var(--color-bg-cream)` #F7E7D4
- [ ] Footer background: `var(--color-bg-footer)` #313332, sub-sections #454746
- [ ] Promotional banner: `position: fixed`, `z-index: 9999`, height `41px`, bg `#185674`

### Components & Interactions
- [ ] `.btn-default` padding exactly `11px 32px 8px 32px` (asymmetric — intentional)
- [ ] `.btn-default` `border-radius: 0`
- [ ] `.btn-pill` `border-radius: 100px` — only this class
- [ ] ALL `:hover` rules inside `@media (min-width: 992px)` block
- [ ] Carousel implemented with opacity fade — `effect: 'fade'` in Swiper.js
- [ ] Sticky header JS: homepage transparent → `#f5f5f5` on scroll; other pages always sticky
- [ ] Nav link color: white over hero → #777 after scroll (`.is-scrolled` class)
- [ ] All `<input>` and `<button>` elements have `border-radius: 0` in base reset
- [ ] Floating label JS adds `.active` class when input has value
- [ ] Product/category card images: `aspect-ratio: 3 / 4` via wrapper + `object-fit: cover`
- [ ] iOS Safari hero height fix: `--app-height` JS variable set on resize

---

*System design extracted from direct CSS source analysis (4,464 lines of production CSS), brand extraction data, and visual audit of velasca.com — May 2026. Optimized for Cursor AI–guided HTML/CSS refactoring.*