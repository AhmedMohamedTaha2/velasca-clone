    # Velasca Design System — Technical Implementation Blueprint

### For Shopify HTML / CSS / JS Refactoring

> **Purpose:** Pixel-perfect implementation guide. Feed this document directly to an AI agent as a system prompt or style guide to enforce exact design specifications across every file in your Shopify codebase.
> **Source files audited:** `the_style.txt` (4,464 lines of production CSS), `palette.pdf`, `screencapture-velasca.pdf`, `velasca-design-system-report.html`

---

## SECTION 1 — Design Token & Color System Audit

### 1.1 Complete CSS Variable Registry

Paste this block verbatim into your Shopify theme's `base.css` or `theme.css` inside a `:root {}` declaration. Every color decision in the codebase must reference these variables — **never hardcode a hex value**.

```css
:root {
  /* ─── LAYOUT TOKENS ──────────────────────────── */
  --container-max-width: 1280px;
  --grid-max-width: 1250px;
  --content-max-width: 1200px;
  --promotional-banner-height-desktop: 41px;
  --promotional-banner-height-mobile: 41px;

  /* ─── BRAND CORE ─────────────────────────────── */
  --color-primary: #185674; /* Deep teal  */
  --color-primary-light: #427892; /* Teal tint  */
  --color-primary-rgb: 24, 86, 116;

  /* ─── ACCENT ─────────────────────────────────── */
  --color-accent: #b0684f; /* Terracotta */

  /* ─── SURFACES ───────────────────────────────── */
  --color-bg: #ffffff; /* Page background */
  --color-bg-warm: #f9f8f7; /* Warm off-white  */
  --color-bg-light: #f5f5f5; /* Neutral surface */
  --color-bg-cream: #f7e7d4; /* Cream blush     */
  --color-bg-footer: #313332; /* Footer dark     */
  --color-bg-footer-sub: #454746; /* Footer sub-section */
  --color-bg-button-light: #f2f2f2; /* Light button    */

  /* ─── TEXT ───────────────────────────────────── */
  --color-text: #313332; /* Primary body text   */
  --color-text-inverted: #ffffff; /* On dark backgrounds */
  --color-text-muted: #777777; /* Captions, metadata  */
  --color-text-subdued: #8b959a; /* Secondary labels    */
  --color-text-placeholder: #a4abad; /* Form placeholders   */

  /* ─── BORDERS & DIVIDERS ─────────────────────── */
  --color-border: #e3e3e3; /* UI borders      */
  --color-border-dark: #b9bbbb; /* Dividers, rules */
  --color-neutral-300: #d9d9d9; /* Separator lines */

  /* ─── SUPPLEMENTARY PALETTE (art direction) ──── */
  --color-leather: #c59872; /* Warm tan  */
  --color-tobacco: #685646; /* Med brown */
  --color-slate: #354551; /* Dark slate */

  /* ─── SKELETON LOADING ───────────────────────── */
  --color-skeleton-base: #5f889c;
  --color-skeleton-shine: #a8bdc7;

  /* ─── TYPOGRAPHY ─────────────────────────────── */
  --font-primary: "Jost", serif;
  --font-display: Jomolhari, serif;

  /* ─── SPACING ────────────────────────────────── */
  --spacing-section: 60px;
  --spacing-component: 30px;
  --spacing-card: 24px;
  --spacing-gutter: 15px;

  /* ─── TRANSITIONS ────────────────────────────── */
  --transition-micro: all 0.2s linear;
  --transition-overlay: all 0.4s ease-in-out;
  --transition-drawer: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}
```

---

### 1.2 Color Application Logic Table

| Token                   | Hex       | Role               | Exact UI Targets                                                                                                 | Intent / Vibe                                                                                                                                          |
| ----------------------- | --------- | ------------------ | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--color-primary`       | `#185674` | Primary Brand      | Nav link text, CTA button fill, section headings, icon strokes, active tab border, review star fill, focus rings | **Trust & Authority.** This color owns every action the user takes. It signals navigation, safety, and the brand's Italian craftsmanship.              |
| `--color-primary-light` | `#427892` | Hover / Active     | Button `:hover` background, hovered navigation link, active carousel indicator                                   | **Feedback.** A 15% lighter teal that tells the user "you are here" without jarring contrast change.                                                   |
| `--color-accent`        | `#b0684f` | Emotional Accent   | Hyperlinks (`.a-default`), decorative section borders, error text, terracotta detail rules, `clr-ter` utility    | **Warmth & Restraint.** Appears on fewer than 10% of all interactive elements. Its rarity is the point — when it shows, it draws the eye deliberately. |
| `--color-bg`            | `#ffffff` | Page Base          | `<body>`, modal backgrounds, card surfaces, form fields                                                          | **Clean slate.** Never tinted. All surfaces start here.                                                                                                |
| `--color-bg-warm`       | `#F9F8F7` | Warm Surface       | Product card backgrounds, review widget background, `.stamped-main-widget`                                       | **Artisanal quality signal.** The slight warmth prevents the sterile white-box feel of generic e-commerce.                                             |
| `--color-bg-light`      | `#f5f5f5` | Neutral Section BG | Alternating page sections, input field backgrounds, skeleton loaders                                             | **Visual rhythm.** Separates content blocks without needing hard borders.                                                                              |
| `--color-bg-cream`      | `#F7E7D4` | Warm Editorial BG  | Newsletter popup, seasonal campaign blocks                                                                       | **Premium warmth.** Used only in editorial/lifestyle moments. Never on product pages.                                                                  |
| `--color-bg-footer`     | `#313332` | Footer Background  | `<footer>`, dark overlay sections                                                                                | **Closure.** The warm near-black (not pure black) provides gravity without harshness.                                                                  |
| `--color-text`          | `#313332` | Body Copy          | All `<p>`, `<span>`, `<a>` at rest, form labels, product descriptions                                            | **No pure black.** The green-grey cast prevents reading fatigue and matches the leather/natural tones of the product.                                  |
| `--color-text-inverted` | `#ffffff` | On-Dark Text       | Button labels, footer text, hero overlay text, nav on dark header                                                | **Inversion.** Always appears over `--color-primary`, `--color-bg-footer`, or dark photography.                                                        |
| `--color-text-muted`    | `#777777` | Subdued Copy       | Captions, review dates, metadata, placeholder labels                                                             | **Hierarchy signal.** Never used for interactive elements. Pure informational text only.                                                               |
| `--color-border`        | `#e3e3e3` | UI Borders         | Input borders, card borders, tab underlines, form field outlines                                                 | **Invisible structure.** Light enough not to compete visually, present enough to define space.                                                         |
| `--color-border-dark`   | `#b9bbbb` | Dividers           | Horizontal rules, navigation separators, inactive state borders                                                  | **Sectioning.** Heavier than `--color-border` but still subordinate to text.                                                                           |

---

### 1.3 Functional Color Rules (Non-Negotiable)

1. **No `#000000` anywhere.** Replace all `color: black` or `background: #000` with `--color-text` or `--color-bg-footer`.
2. **`--color-accent` cap.** Count accent usages per page. If it exceeds 10% of interactive elements, remove instances. Its power comes from scarcity.
3. **`--color-primary` on white only.** Never place `#185674` text on `--color-bg-warm` or `--color-bg-light` without running an AA contrast check (minimum 4.5:1 ratio).
4. **Footer is always `#313332`.** Never use `#000`, `#222`, or `#1a1a1a` for the footer — the warm cast is part of the brand identity.
5. **Supplementary palette** (`--color-leather`, `--color-tobacco`, `--color-slate`) — used in photography and product art direction only. Never apply these as UI background or text colors.

---

### ✅ Section 1 Developer Checklist

- [ ] `:root` block with all tokens added to `base.css` / `theme.css`
- [ ] Global search for hardcoded hex values — replace every instance with a `var(--*)` reference
- [ ] Grep for `color: black`, `color: #000`, `background: #000` — replace with tokens
- [ ] Verify `--color-accent` usage does not exceed 10% of interactive elements per page
- [ ] Confirm `--color-primary` (#185674) only appears on `#ffffff` backgrounds (check contrast)
- [ ] Footer `background-color` set to `var(--color-bg-footer)` — not `#000` or `#1a1a1a`
- [ ] All `<input>` placeholder text uses `--color-text-muted` (`#777777`)
- [ ] Google Fonts `<link>` for Jost (weights 300, 400, 500) added to `<head>` of `theme.liquid`
- [ ] Jomolhari font imported for editorial headline use only

---

## SECTION 2 — Website Structure & Layout Blueprint

### 2.1 Container System

```css
/* ─── PRIMARY CONTAINERS ─────────────────────────────────────── */

/* Outer shell — full browser width sections (hero, editorial banners) */
.section-full-bleed {
  width: 100%;
  max-width: 100%;
}

/* Standard content container */
.container,
.page-width {
  width: 100%;
  max-width: var(--content-max-width); /* 1200px */
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--spacing-gutter); /* 15px */
  padding-right: var(--spacing-gutter); /* 15px */
}

/* Grid container — tighter than page-width */
.grid-container {
  width: 100%;
  max-width: var(--grid-max-width); /* 1250px */
  margin-left: auto;
  margin-right: auto;
}

/* ─── SECTION RHYTHM ─────────────────────────────────────────── */
/* Every major section — no exceptions */
section,
.shopify-section {
  padding-top: var(--spacing-section); /* 60px */
  padding-bottom: var(--spacing-section); /* 60px */
}

/* Full-bleed editorial sections remove container padding */
.section-editorial {
  padding-top: 0;
  padding-bottom: 0;
}
```

### 2.2 Responsive Breakpoint System

```css
/* ─── BREAKPOINTS ────────────────────────────────────────────── */
/* Mobile first. Hover states ONLY activate at 992px. */

/* XS — Single column, touch devices */
/* Default styles — no media query needed */

/* SM — Tablet portrait */
@media (min-width: 768px) {
}

/* MD — Hover-capable devices (CRITICAL BREAKPOINT) */
/* All :hover styles MUST be wrapped in this query */
@media (min-width: 992px) {
  a:hover {
    text-decoration: none;
  }
  .btn-primary:hover {
    background-color: var(--color-primary-light);
  }
}

/* LG — Full desktop */
@media (min-width: 1200px) {
}
```

**Shopify Note:** In Dawn and other Shopify themes, hover states often fire on touch devices because the theme targets `:hover` globally. Always scope your hover rules inside `@media (min-width: 992px)` to prevent sticky hover states on mobile.

---

### 2.3 Homepage Section Breakdown

#### SECTION A — Promotional Banner

```
┌──────────────────────────────────────────────────────────────────┐
│          "Duties are on us! No extra charges at delivery"        │
│                    height: 41px | bg: --color-primary            │
└──────────────────────────────────────────────────────────────────┘
```

| Property    | Value                                                       |
| ----------- | ----------------------------------------------------------- |
| Height      | `41px` (both desktop and mobile)                            |
| Background  | `var(--color-primary)` `#185674`                            |
| Text color  | `var(--color-text-inverted)` `#ffffff`                      |
| Font size   | `14px`                                                      |
| Font weight | `400`                                                       |
| Position    | `position: fixed; top: 0; left: 0; right: 0; z-index: 9999` |
| Text align  | `center`                                                    |

---

#### SECTION B — Header / Navigation

```
┌──────────────────────────────────────────────────────────────────┐
│  [Shipping: US]              Velasca              [Join/Orders]  │
│  [ℹ] [🔍]  NEW ARRIVALS  SHOES  CLOTHING  ACCESSORIES  [👤][🛒] │
└──────────────────────────────────────────────────────────────────┘
```

| Property                | Value                                                                    | Notes                               |
| ----------------------- | ------------------------------------------------------------------------ | ----------------------------------- |
| Top bar height          | `41px`                                                                   | Same as promotional banner          |
| Nav link font           | `14px`, weight `400`, `text-transform: uppercase`, `letter-spacing: 2px` |                                     |
| Nav link color (rest)   | `var(--color-text-muted)` `#777777`                                      | Light on homepage (transparent nav) |
| Nav link color (hover)  | `var(--color-text)` `#313332`                                            |                                     |
| Logo                    | Script typeface, centered                                                | No CSS — SVG/image asset            |
| Homepage behavior       | `position: fixed; background: transparent`                               | Overlays the hero image             |
| Product page behavior   | `position: sticky; background: var(--color-bg-light)` `#f5f5f5`          | Switches to sticky on scroll        |
| Cart icon, Account icon | SVG strokes: `var(--color-text)` `#313332`                               |                                     |
| Transition on scroll    | `background-color 0.3s ease-in-out`                                      | From transparent → `#f5f5f5`        |

---

#### SECTION C — Hero Banner (Full-Bleed)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│               [Full-bleed editorial photography]                 │
│                                                                  │
│                   ┌─────────────────────┐                        │
│                   │  DISCOVER ALL PRODUCTS  →  │                 │
│                   └─────────────────────┘                        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

| Property                 | Value                                                                                                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Height (mobile)          | `570px`                                                                                                                                                          |
| Height (tablet 768px+)   | `750px`                                                                                                                                                          |
| Height (desktop 1200px+) | `98vh`                                                                                                                                                           |
| `background-size`        | `cover` — always                                                                                                                                                 |
| `background-position`    | `center`                                                                                                                                                         |
| Overlay                  | `background: linear-gradient(180deg, rgba(0,0,0,0.3) 20%, rgba(0,0,0,0) 30%)` — top fade only                                                                    |
| CTA button position      | `position: absolute; bottom: ~80px; left: 50%; transform: translateX(-50%)`                                                                                      |
| CTA button style         | Border only: `border: 1px solid #fff; color: #fff; background: transparent; padding: 12px 32px; text-transform: uppercase; font-size: 14px; letter-spacing: 2px` |

---

#### SECTION D — 3-Column Category Grid

```
┌─────────────────┬─────────────────┬─────────────────┐
│   [SHOES img]   │ [CLOTHING img]  │ [ACCESSORIES img]│
│   aspect 3:4   │   aspect 3:4   │    aspect 3:4    │
├─────────────────┼─────────────────┼─────────────────┤
│   SHOES →       │   CLOTHING →    │   ACCESSORIES →  │
└─────────────────┴─────────────────┴─────────────────┘
```

| Property                      | Value                                          |
| ----------------------------- | ---------------------------------------------- |
| Grid columns (desktop 992px+) | `repeat(3, 1fr)`                               |
| Grid columns (mobile)         | `1fr` (stacked)                                |
| Grid gap                      | `0` (images are flush, no gutter)              |
| Image aspect ratio            | `3 / 4` (portrait)                             |
| `object-fit`                  | `cover`                                        |
| Label font size               | `9px`                                          |
| Label letter-spacing          | `2px`                                          |
| Label text-transform          | `uppercase`                                    |
| Label font-weight             | `400` — **never bold**                         |
| Label color                   | `var(--color-text)` `#313332`                  |
| Label margin-top              | `12px`                                         |
| Arrow                         | Inline text `→` — not a separate icon element  |
| Hover effect                  | `transform: scale(1.02)` on image, `0.3s ease` |

---

#### SECTION E — Editorial Collection Carousel

```
┌──────────────────────────────────────────────────────────────────┐
│  ←                  [Wide editorial photo]                    →  │
│                    ─ ─ ─ ● ─ ─ ─ ─ ─ ─                         │
│                     SPRING/SUMMER '26                            │
└──────────────────────────────────────────────────────────────────┘
```

| Property         | Value                                                                                                                                                                       |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Width            | `100%` full bleed                                                                                                                                                           |
| Transition type  | **Opacity crossfade only** — `opacity 0.4s ease-in-out` — **not a slide**                                                                                                   |
| Height (mobile)  | `570px`                                                                                                                                                                     |
| Height (desktop) | `80vh`                                                                                                                                                                      |
| Label overlay    | `position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%)`                                                                                                  |
| Label style      | `border: 1px solid #fff; background: rgba(255,255,255,0.95); padding: 12px 32px; font-size: 12px; letter-spacing: 4px; text-transform: uppercase; color: var(--color-text)` |
| Nav arrows       | SVG, `color: #fff`, left 10px / right 10px                                                                                                                                  |
| Pagination dots  | `8px` circles, active = `border: 2px solid var(--color-primary)`                                                                                                            |

---

#### SECTION F — "Get Inspired" Section (Section Header + 3×2 Grid)

```
                      Get inspired
        ┌──────────┬──────────┬──────────┐
        │ Lace-ups │ Knitwear │ Loafers  │
        │ LACE-UPS→│KNITWEAR→ │TASSEL...→│
        ├──────────┼──────────┼──────────┤
        │  Pants   │ Sneakers │ Jackets  │
        │  PANTS → │SNEAKERS→ │ JACKETS→ │
        └──────────┴──────────┴──────────┘
```

| Property                      | Value                                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Section heading               | Font: `var(--font-display)` Jomolhari; Size: `36px`; Color: `var(--color-primary)` `#185674`; Align: `center`; Style: `italic` |
| Section heading margin-bottom | `40px`                                                                                                                         |
| Grid columns                  | `repeat(3, 1fr)` desktop; `repeat(2, 1fr)` mobile                                                                              |
| Grid gap                      | `8px`                                                                                                                          |
| Section padding               | `60px` top and bottom                                                                                                          |
| Background                    | `var(--color-bg)` `#ffffff`                                                                                                    |

---

#### SECTION G — Editorial Overlay Cards ("Made in Italy", "In store", "For her")

```
┌──────────────────────────────────────────────────────────────────┐
│                  [Full-width photographic BG]                    │
│                                                                  │
│            ┌─────────────────────────────┐                      │
│            │  ARTISANAL CRAFTMANSHIP     │                      │
│            │     Made in Italy           │  ← White card overlay │
│            └─────────────────────────────┘                      │
└──────────────────────────────────────────────────────────────────┘
```

| Property                     | Value                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Section width                | `100%` — no container padding                                                                                |
| Photo height                 | `400–500px`                                                                                                  |
| `background-size`            | `cover`                                                                                                      |
| Overlay card `background`    | `#ffffff`                                                                                                    |
| Overlay card `border-radius` | `0` — **sharp corners, no rounding**                                                                         |
| Overlay card `padding`       | `32px 48px`                                                                                                  |
| Overlay card position        | `absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)`                                            |
| Eyebrow text                 | `font-size: 9px; letter-spacing: 4px; text-transform: uppercase; font-weight: 400; color: var(--color-text)` |
| Headline text                | Font: `var(--font-display)` Jomolhari; Size: `36px`; Color: `var(--color-text)`; Style: normal               |
| Eyebrow margin-bottom        | `8px`                                                                                                        |

---

#### SECTION H — Newsletter Block

```
┌──────────────────────────────────────────────────────────────────┐
│  [Photo: man in jacket left-aligned]                             │
│                    Let's keep in touch                           │
│         News and inspiration straight to your inbox              │
│              ┌──────────────────┐  ┌───┐                         │
│              │  Enter your email │  │ → │                        │
│              └──────────────────┘  └───┘                         │
└──────────────────────────────────────────────────────────────────┘
```

| Property           | Value                                                                 |
| ------------------ | --------------------------------------------------------------------- |
| Section background | `var(--color-bg-cream)` `#F7E7D4`                                     |
| Section padding    | `60px` top and bottom                                                 |
| Heading font       | `var(--font-display)` Jomolhari                                       |
| Heading size       | `36px`                                                                |
| Heading color      | `var(--color-primary)` `#185674`                                      |
| Body text          | `20px / 34px` line-height; `var(--color-text)`                        |
| Input border       | `none`; `border-bottom: 2px solid var(--color-border-dark)` only      |
| Input background   | `transparent`                                                         |
| Input text color   | `var(--color-primary)`                                                |
| Input placeholder  | `font-size: 20px; font-style: italic; color: var(--color-text-muted)` |
| Submit button      | Arrow icon only; `background: transparent; border: none`              |

---

#### SECTION I — Footer

```
┌──────────────────────────────────────────────────────────────────┐
│  WE'RE HERE FOR YOU │       HELP      │       ABOUT              │
│  [brand copy]       │  [link list]    │  [link list]             │
│─────────────────────────────────────────────────────────────────│
│              [Payment icons] [Social icons]                      │
│─────────────────────────────────────────────────────────────────│
│  Home  │  T&C  │  Privacy  │  Cookie         © Velasca          │
└──────────────────────────────────────────────────────────────────┘
```

| Property               | Value                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------- |
| Main footer background | `var(--color-bg-footer)` `#313332`                                                  |
| Sub-section background | `var(--color-bg-footer-sub)` `#454746`                                              |
| All footer text        | `var(--color-text-inverted)` `#ffffff`                                              |
| Column heading         | `font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 2px` |
| Body links             | `font-size: 13px; line-height: 20px; color: #fff`                                   |
| Footer nav links       | `color: #fff; font-size: 16px; text-transform: uppercase`                           |
| Bottom legal text      | `font-size: 14px; color: var(--color-border-dark)` `#b9bbbb`                        |
| Padding (fat footer)   | `30px` top and bottom per column                                                    |
| Border-top separator   | `2px solid #fff` above bottom nav                                                   |

---

### ✅ Section 2 Developer Checklist

- [ ] `:root` container tokens applied; all `max-width` values use variables
- [ ] Promotional banner is `position: fixed; z-index: 9999; height: 41px; background: var(--color-primary)`
- [ ] Homepage header starts transparent; transitions to `#f5f5f5` on scroll via JS class toggle
- [ ] Product/cart pages header is `position: sticky` with `background: var(--color-bg-light)`
- [ ] Hero height: `570px` mobile → `750px` tablet → `98vh` desktop
- [ ] Hero uses `background-size: cover` and `background-position: center` — no `contain`
- [ ] Hero overlay uses top-fade gradient only (not full darkening)
- [ ] Category grid: `grid-template-columns: repeat(3, 1fr)` desktop; stacks to `1fr` mobile
- [ ] Category labels: `9px`, `letter-spacing: 2px`, `uppercase`, weight `400` — no exceptions
- [ ] Every `<section>` has `padding: 60px 0` — use a `.section-pad` utility class
- [ ] Editorial overlay cards: `border-radius: 0` — sharp corners, not rounded
- [ ] Newsletter background: `var(--color-bg-cream)` `#F7E7D4`
- [ ] Footer background: `var(--color-bg-footer)` `#313332`, sub-sections `#454746`
- [ ] All `:hover` rules wrapped in `@media (min-width: 992px)`

---

## SECTION 3 — Component & Design System Audit

### 3.1 Component Inventory

| Component          | Shopify Template File               | Notes                        |
| ------------------ | ----------------------------------- | ---------------------------- |
| Primary CTA Button | `base.css` / `component-button.css` | Sharp corners, filled teal   |
| Ghost Button       | `base.css`                          | Border only, no fill         |
| White Hero Button  | `section-image-banner.css`          | Transparent + white border   |
| Text Input         | `component-form.css`                | Borderless bottom-only style |
| Email Input        | `section-newsletter.css`            | Bottom border only           |
| Category Card      | `section-collection-list.css`       | Image + 9px label            |
| Product Card       | `main-collection-product-grid.css`  | Image + title + price        |
| Editorial Banner   | `section-image-banner.css`          | Full-bleed + overlay card    |
| Navigation         | `header.css`                        | Transparent → sticky         |
| Carousel / Slider  | `component-slider.css`              | Opacity fade — not slide     |
| Footer             | `footer.css`                        | Dark charcoal, 3-column      |

---

### 3.2 Button Components — Pixel-Perfect Specifications

#### PRIMARY BUTTON (`.btn-primary` / `.btn-default`)

```css
.btn-primary {
  /* Layout */
  display: inline-block;
  padding: 11px 32px 8px 32px;
  margin: 15px 0;

  /* Typography */
  font-family: var(--font-primary); /* "Jost", serif */
  font-size: 14px;
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: 0;
  text-transform: uppercase;
  text-decoration: none !important;
  white-space: nowrap;

  /* Color */
  color: var(--color-text-inverted); /* #ffffff */
  background-color: var(--color-primary); /* #185674 */

  /* Shape — SHARP CORNERS, NO ROUNDING */
  border: 0;
  border-radius: 0;

  /* Interaction */
  transition: var(--transition-micro); /* all 0.2s linear */
  cursor: pointer;
}

@media (min-width: 992px) {
  .btn-primary:hover {
    background-color: var(--color-primary-light); /* #427892 */
    color: var(--color-text-inverted);
  }
}

.btn-primary:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

**Shopify Conflict Warning:** Dawn theme applies `border-radius: var(--buttons-radius)` globally via settings. Override this in your CSS with `border-radius: 0 !important` on `.btn-primary`.

---

#### GHOST / SECONDARY BUTTON (`.btn-secondary`)

```css
.btn-secondary {
  display: inline-block;
  padding: 11px 32px 8px 32px;
  font-family: var(--font-primary);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: 0;
  text-transform: uppercase;
  text-decoration: none !important;
  color: var(--color-primary); /* #185674 */
  background-color: transparent;
  border: 2px solid var(--color-primary);
  border-radius: 0;
  transition: var(--transition-micro);
  cursor: pointer;
}

@media (min-width: 992px) {
  .btn-secondary:hover {
    background-color: var(--color-primary);
    color: var(--color-text-inverted);
  }
}
```

---

#### HERO / WHITE BUTTON (`.btn-white`) — Used over photography only

```css
.btn-white {
  display: inline-block;
  padding: 12px 32px;
  font-family: var(--font-primary);
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--color-text-inverted); /* #ffffff */
  background-color: rgba(255, 255, 255, 0.3);
  border: 1px solid var(--color-text-inverted);
  border-radius: 0;
  transition: var(--transition-micro);
  cursor: pointer;
}

@media (min-width: 992px) {
  .btn-white:hover {
    background-color: var(--color-bg); /* #ffffff */
    color: var(--color-text); /* #313332 */
  }
}
```

---

#### PILL BUTTON (`.btn-pill`) — Review/Social submission ONLY

```css
/* Reserved exclusively for: review submission, social sign-up, newsletter confirm */
.btn-pill {
  display: inline-block;
  padding: 11px 32px 8px 32px;
  font-family: var(--font-primary);
  font-size: 14px;
  font-weight: 400;
  text-transform: uppercase;
  color: var(--color-text-inverted);
  background-color: var(--color-primary);
  border: 0;
  border-radius: 100px; /* PILL — only context with rounding */
  transition: var(--transition-micro);
  cursor: pointer;
}
```

**Rule:** Never use `border-radius > 0` on any button other than `.btn-pill`. If you feel tempted to round a CTA button, stop — it's a brand violation.

---

#### Button Property Comparison Table

| Property           | `.btn-primary` | `.btn-secondary`    | `.btn-white`            | `.btn-pill`   |
| ------------------ | -------------- | ------------------- | ----------------------- | ------------- |
| Padding (top)      | `11px`         | `11px`              | `12px`                  | `11px`        |
| Padding (bottom)   | `8px`          | `8px`               | `12px`                  | `8px`         |
| Padding (sides)    | `32px`         | `32px`              | `32px`                  | `32px`        |
| Font size          | `14px`         | `14px`              | `14px`                  | `14px`        |
| Font weight        | `500`          | `500`               | `400`                   | `400`         |
| Letter-spacing     | `0`            | `0`                 | `2px`                   | `0`           |
| Text-transform     | `uppercase`    | `uppercase`         | `uppercase`             | `uppercase`   |
| Border-radius      | `0`            | `0`                 | `0`                     | `100px`       |
| Background (rest)  | `#185674`      | `transparent`       | `rgba(255,255,255,0.3)` | `#185674`     |
| Background (hover) | `#427892`      | `#185674`           | `#ffffff`               | —             |
| Border             | `none`         | `2px solid #185674` | `1px solid #fff`        | `none`        |
| Transition         | `0.2s linear`  | `0.2s linear`       | `0.2s linear`           | `0.2s linear` |

---

### 3.3 Typography Components

```css
/* ─── HEADING SCALE ─────────────────────────────────────────── */

h1 {
  font-family: var(--font-primary); /* Jost */
  font-size: 50px;
  font-weight: 400;
  line-height: 1.1;
  color: var(--color-text);
  margin: 0;
}

h2 {
  font-family: var(--font-primary);
  font-size: 36px;
  font-weight: 400;
  line-height: 1.2;
  color: var(--color-text);
  margin: 0;
}

h3 {
  font-family: var(--font-primary);
  font-size: 30px;
  font-weight: 400;
  line-height: 1.2;
  color: var(--color-text);
  margin: 0;
}

h4 {
  font-family: var(--font-primary);
  font-size: 24px;
  font-weight: 400;
  line-height: 1.3;
  color: var(--color-text);
  margin: 0;
}

h5 {
  font-family: var(--font-primary);
  font-size: 20px;
  font-weight: 400;
  line-height: 1.4;
  color: var(--color-text);
  margin: 0;
}

/* ─── EDITORIAL DISPLAY HEADING (Jomolhari) ─────────────────── */
/* Use ONLY for: "Get inspired", newsletter headline, section hero titles */
.heading-display {
  font-family: var(--font-display); /* Jomolhari */
  font-size: 36px;
  font-weight: 400;
  color: var(--color-primary);
  font-style: italic;
}

/* ─── BODY TEXT ─────────────────────────────────────────────── */
body,
p,
span,
a {
  font-family: var(--font-primary);
  font-size: 20px;
  line-height: 34px;
  font-weight: 400;
  color: var(--color-text);
}

/* ─── UTILITY CLASSES ───────────────────────────────────────── */
.text-xl {
  font-size: 20px;
}
.text-lg {
  font-size: 18px;
}
.text-md {
  font-size: 16px;
}
.text-base {
  font-size: 14px;
}
.text-sm {
  font-size: 12px;
}
.text-xs {
  font-size: 9px;
} /* Category labels ONLY */
.text-xxs {
  font-size: 8px;
}

.font-light {
  font-weight: 300;
}
.font-regular {
  font-weight: 400;
}
.font-medium {
  font-weight: 500;
} /* MAXIMUM weight in the system */

/* ─── MOBILE OVERRIDES ──────────────────────────────────────── */
@media (max-width: 767px) {
  h1,
  h2,
  h3 {
    font-size: 28px;
  }
  body,
  p,
  span,
  a {
    font-size: 18px;
    line-height: 30px;
  }
}
```

**Critical rule:** The heaviest font weight in the entire system is `500`. Never use `font-weight: 600`, `700`, or `bold`. Boldness in this brand is expressed through _spacing and color_, not stroke weight.

---

### 3.4 Form Input Components

#### Standard Text Input

```css
/* ─── STANDARD INPUT ────────────────────────────────────────── */
.form-field {
  position: relative;
  margin-bottom: 15px;
  border: 1px solid var(--color-border); /* #e3e3e3 */
  border-radius: 0; /* SHARP — no rounding */
}

.form-field input {
  width: 100%;
  border: 0;
  padding: 18px 15px;
  font-family: var(--font-primary);
  font-size: 14px;
  line-height: 1;
  font-weight: 400;
  color: var(--color-text);
  background-color: transparent;
  transition: var(--transition-micro);
}

.form-field:focus-within {
  border: 1px solid var(--color-text); /* #313332 — darkens on focus */
}

.form-field label {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  padding: 12px 15px 0;
  font-family: var(--font-primary);
  font-size: 12px;
  line-height: 12px;
  font-weight: 300;
  color: var(--color-primary);
  transition: var(--transition-micro);
}

/* Floating label — activates when field has value */
.form-field.is-active label {
  opacity: 1;
  color: var(--color-text);
}

.form-field.is-active input {
  padding: 25px 15px 11px; /* Shifts down to make room for label */
}

::placeholder {
  color: var(--color-text);
  font-family: var(--font-primary);
  font-size: 14px;
  font-weight: 400;
}
```

#### Newsletter / Single-Line Input

```css
/* ─── NEWSLETTER INPUT (Bottom border only) ─────────────────── */
.input-newsletter-wrap {
  display: flex;
  align-items: center;
  background-color: transparent;
  border-bottom: 2px solid var(--color-border-dark); /* #b9bbbb */
  border-radius: 0;
}

.input-newsletter-wrap input {
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

.input-newsletter-wrap input::placeholder {
  color: var(--color-text-muted); /* #777777 */
  font-style: italic;
  font-size: 20px;
}

.input-newsletter-wrap button {
  width: 35px;
  height: 35px;
  background: transparent;
  border: 0;
  cursor: pointer;
  /* Arrow is created with CSS pseudo-elements — no image dependency */
  position: relative;
}
```

---

### 3.5 Product / Category Card Component

```css
/* ─── CATEGORY CARD ─────────────────────────────────────────── */
.category-card {
  display: block;
  text-decoration: none;
}

.category-card__image-wrap {
  position: relative;
  aspect-ratio: 3 / 4; /* Portrait — strict */
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

.category-card__label {
  display: block;
  margin-top: 12px;
  font-family: var(--font-primary);
  font-size: 9px; /* FIXED — do not change */
  font-weight: 400; /* Never bold */
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--color-text);
  text-decoration: none;
}

/* Arrow is inline text — not a separate element */
/* Example HTML: <span class="category-card__label">SHOES →</span> */
```

---

### 3.6 Editorial Overlay Card Component

```css
/* ─── EDITORIAL OVERLAY CARD ────────────────────────────────── */
.editorial-section {
  position: relative;
  width: 100%;
  height: 400px;
  background-size: cover !important;
  background-position: center;
}

@media (min-width: 768px) {
  .editorial-section {
    height: 500px;
  }
}

.editorial-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  padding: 32px 48px;
  text-align: center;
  border-radius: 0; /* SHARP — architectural choice */
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

### 3.7 Interaction States — Master Reference Table

| Element              | Rest State                         | Hover State               | Transition                         | Notes                            |
| -------------------- | ---------------------------------- | ------------------------- | ---------------------------------- | -------------------------------- |
| `.btn-primary`       | bg `#185674`                       | bg `#427892`              | `0.2s linear`                      | Desktop 992px+ only              |
| `.btn-secondary`     | bg `transparent`, border `#185674` | bg `#185674`, text `#fff` | `0.2s linear`                      | Desktop 992px+ only              |
| `.btn-white`         | bg `rgba(255,255,255,0.3)`         | bg `#fff`, text `#313332` | `0.2s linear`                      | Desktop 992px+ only              |
| `a` (generic)        | No underline                       | No underline              | —                                  | Remove Shopify default underline |
| `.category-card img` | `scale(1.0)`                       | `scale(1.02)`             | `0.3s ease`                        | Desktop 992px+ only              |
| `nav a`              | color `#777777`                    | color `#313332`           | `0.2s linear`                      | —                                |
| Drawer / panel       | off-screen                         | slides in                 | `0.5s cubic-bezier(0.32,0.72,0,1)` | Premium deceleration             |
| Carousel             | active opacity `1`                 | —                         | `opacity 0.4s ease-in-out`         | **Not** `transform`/slide        |
| Form field           | border `#e3e3e3`                   | border `#313332` on focus | `0.2s linear`                      | Uses `:focus-within`             |
| Footer links         | color `#fff`                       | opacity `0.7`             | `0.2s linear`                      | Desktop 992px+ only              |

---

### ✅ Section 3 Developer Checklist

- [ ] `.btn-primary` padding exactly `11px 32px 8px 32px` — verify with browser dev tools
- [ ] `.btn-primary` `border-radius: 0` — override Shopify Dawn theme's `--buttons-radius` variable
- [ ] Maximum `font-weight` in entire codebase is `500` — grep for `700`, `bold`, `600` and remove
- [ ] `.category-card__label` is exactly `9px`, `letter-spacing: 2px`, weight `400`
- [ ] Arrow character (`→`) is inline text inside label span — not a Font Awesome or SVG icon
- [ ] All carousel transitions use `opacity` fade — no `transform: translateX` slide
- [ ] Editorial overlay cards have `border-radius: 0` — not `4px`, `8px`, or any rounding
- [ ] All `:hover` rules are inside `@media (min-width: 992px)` block
- [ ] Form inputs have `border-radius: 0` — Shopify Dawn adds radius by default
- [ ] Floating label JS implemented: adds `.is-active` class to `.form-field` when input has value
- [ ] `transition: all 0.2s linear` on all interactive elements — not `ease-in-out`
- [ ] Jomolhari font is only loaded for: section headings, newsletter headline, "Get inspired" title
- [ ] Drawer/cart panel uses `cubic-bezier(0.32, 0.72, 0, 1)` — not linear or ease

---

## SECTION 4 — Technical Implementation Guide (Shopify Refactoring)

### 4.1 Recommended CSS File Architecture

```
assets/
├── base.css               ← :root tokens ONLY — no component styles
├── layout-theme.css       ← Container widths, section padding, grid utilities
├── component-button.css   ← All button variants
├── component-form.css     ← All input / form styles
├── component-card.css     ← Category card, product card
├── component-nav.css      ← Header, nav, promotional banner
├── component-footer.css   ← Footer layout and typography
├── component-hero.css     ← Hero banner, editorial banners
├── component-carousel.css ← Slider / carousel
├── section-home.css       ← Homepage-specific overrides only
├── section-product.css    ← Product page overrides
└── section-collection.css ← Collection page overrides
```

**Loading order in `theme.liquid`:**

```html
{{ 'base.css' | asset_url | stylesheet_tag }} {{ 'layout-theme.css' | asset_url
| stylesheet_tag }} {{ 'component-button.css' | asset_url | stylesheet_tag }} {{
'component-form.css' | asset_url | stylesheet_tag }}
<!-- ...etc -->
```

---

### 4.2 Shopify-Specific Gap Analysis & Pitfalls

#### 🔴 CRITICAL: Theme Settings Override Your CSS

**Problem:** Shopify Dawn and most themes expose `settings_schema.json` variables like `--buttons-radius`, `--color-button`, and `--typography-heading-font-family`. If a merchant changes these in the theme customizer, they silently override your hardcoded CSS.

**Fix:**

```css
/* In your base.css, re-assert all tokens at highest specificity */
:root {
  --color-button: var(--color-primary) !important;
  --buttons-radius: 0px !important; /* SHARP CORNERS */
  --buttons-radius-outset: 0px !important;
  --color-button-text: var(--color-text-inverted) !important;
  /* Override font settings */
  --font-heading-family: "Jost", serif !important;
  --font-body-family: "Jost", serif !important;
}
```

---

#### 🔴 CRITICAL: Shopify's Default `<link>` Order

**Problem:** Shopify loads `base.css` before your custom CSS. If your specificity is equal to Shopify's, Shopify wins because it loads first.

**Fix:** Always write your styles with one level higher specificity, or use `body .your-class {}` to ensure your rules win without `!important` overuse.

---

#### 🟡 WARNING: Mobile Nav & Touch Hover States

**Problem:** On iOS and Android, `:hover` states persist after tap. Velasca's design explicitly gates all hover states at `992px`. If you don't do this, mobile users get stuck hover states on buttons and cards.

**Fix:**

```css
/* WRONG — fires on mobile */
.btn-primary:hover {
  background-color: var(--color-primary-light);
}

/* CORRECT — desktop only */
@media (min-width: 992px) {
  .btn-primary:hover {
    background-color: var(--color-primary-light);
  }
}
```

---

#### 🟡 WARNING: Hero Height on Mobile Safari

**Problem:** `height: 98vh` on mobile Safari includes the address bar, causing content to be hidden under it on initial load.

**Fix:**

```javascript
// In your theme.js
function setAppHeight() {
  document.documentElement.style.setProperty(
    "--app-height",
    `${window.innerHeight}px`,
  );
}
window.addEventListener("resize", setAppHeight);
setAppHeight();
```

```css
.hero-section {
  height: 570px; /* mobile fallback */
}

@media (min-width: 1200px) {
  .hero-section {
    height: var(--app-height, 98vh); /* uses JS-set accurate height */
  }
}
```

---

#### 🟡 WARNING: Font Loading Flash (FOUT)

**Problem:** Jost and Jomolhari are not system fonts. On slow connections, text renders in a fallback serif before the font loads, causing a jarring reflow.

**Fix in `theme.liquid` `<head>`:**

```html
<!-- Preconnect to Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Load Jost — weights 300, 400, 500 only -->
<link
  href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500&display=swap"
  rel="stylesheet"
/>

<!-- Jomolhari — display font, load non-blocking -->
<link
  href="https://fonts.googleapis.com/css2?family=Jomolhari&display=swap"
  rel="stylesheet"
/>
```

**Add `font-display: swap`** — Google Fonts does this automatically with the `display=swap` URL parameter.

---

#### 🟡 WARNING: Shopify Section Padding Conflicts

**Problem:** Shopify's `shopify-section` wrapper applies its own padding or margin that stacks with your `--spacing-section` variable.

**Fix:**

```css
/* Reset Shopify section wrapper */
.shopify-section {
  padding: 0;
  margin: 0;
}

/* Apply section rhythm to your inner wrapper instead */
.section-inner {
  padding-top: var(--spacing-section); /* 60px */
  padding-bottom: var(--spacing-section); /* 60px */
}
```

---

#### 🟡 WARNING: Image Aspect Ratio on Different Shopify Image Sizes

**Problem:** Shopify CDN serves different image sizes. If you set `aspect-ratio: 3/4` in CSS but your product images are landscape, they'll be cropped.

**Fix:**

```css
/* Enforce aspect ratio via container — never rely on img intrinsic dimensions */
.card__image-wrapper {
  aspect-ratio: 3 / 4;
  overflow: hidden;
}

.card__image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Cover — always */
  object-position: center top; /* Center-top for portrait product shots */
}
```

---

#### 🟠 SHOPIFY-SPECIFIC: Sticky Header Script

```javascript
// assets/header-sticky.js
// Toggles header between transparent (homepage) and sticky (scroll/other pages)

(function () {
  const header = document.querySelector(".site-header");
  const isHomepage = document.body.classList.contains("template-index");

  if (!header) return;

  if (!isHomepage) {
    header.classList.add("is-sticky");
    return;
  }

  // Homepage: transparent until scrolled past hero
  const heroHeight =
    document.querySelector(".hero-section")?.offsetHeight || 400;

  function updateHeader() {
    if (window.scrollY > heroHeight * 0.5) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
})();
```

```css
/* Header state CSS */
.site-header {
  position: fixed;
  top: 41px; /* Below promotional banner */
  left: 0;
  right: 0;
  z-index: 999;
  background-color: transparent;
  transition: background-color 0.3s ease-in-out;
}

.site-header.is-scrolled,
.site-header.is-sticky {
  background-color: var(--color-bg-light); /* #f5f5f5 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Nav link color adapts to header state */
.site-header .nav-link {
  color: var(--color-text-inverted); /* White over hero */
  transition: color 0.3s ease-in-out;
}

.site-header.is-scrolled .nav-link,
.site-header.is-sticky .nav-link {
  color: var(--color-text-muted); /* #777 over light bg */
}

@media (min-width: 992px) {
  .site-header .nav-link:hover {
    color: var(--color-text); /* #313332 on hover */
  }
}
```

---

#### 🟠 SHOPIFY-SPECIFIC: Carousel Opacity Fade (Not Slide)

**Problem:** Most Shopify themes implement carousels with `transform: translateX` slide animation. Velasca uses opacity crossfade. Swiper.js (used by Velasca's actual CSS) has an `effect: 'fade'` option — use that.

```javascript
// If using Swiper.js
const heroSwiper = new Swiper(".hero-carousel", {
  effect: "fade",
  fadeEffect: { crossFade: true },
  speed: 400,
  loop: true,
  autoplay: { delay: 5000, disableOnInteraction: false },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});
```

---

### 4.3 Master CSS Specificity Layering

Apply these layers in order to prevent cascade conflicts:

```css
/* Layer 1 — Tokens (lowest specificity) */
:root {
  /* all variables */
}

/* Layer 2 — Resets (overrides browser defaults) */
*,
*::before,
*::after {
  box-sizing: border-box;
}
button {
  border-radius: 0;
} /* Critical — overrides browser default */
input,
textarea,
select {
  border-radius: 0;
  font-family: var(--font-primary);
}

/* Layer 3 — Shopify reset (overrides theme defaults) */
.shopify-section {
  padding: 0;
  margin: 0;
}
.btn,
button[type="submit"] {
  border-radius: 0;
} /* Override theme buttons */

/* Layer 4 — Layout utilities */
.container {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 15px;
}
.section-pad {
  padding: var(--spacing-section) 0;
}

/* Layer 5 — Components */
.btn-primary {
  /* ... */
}

/* Layer 6 — Page-specific overrides (highest specificity) */
.template-index .site-header {
  /* homepage header behavior */
}
```

---

### 4.4 How to Use This Document as an AI Agent System Prompt

When feeding this blueprint to Claude, ChatGPT, GitHub Copilot, or any AI agent for code generation, prepend the following instruction block:

```
SYSTEM CONTEXT:
You are editing Shopify HTML, CSS, and JS files to match the Velasca design system exactly.
The complete specification is below. Apply ALL rules without exception.

HARD RULES (never violate):
1. Font weight maximum is 500. Never write font-weight: 700 or bold.
2. Primary buttons have border-radius: 0. Never round them.
3. All :hover rules must be inside @media (min-width: 992px).
4. Never hardcode a color hex value — always use var(--color-*) tokens.
5. Category labels are always: font-size: 9px; letter-spacing: 2px; text-transform: uppercase; font-weight: 400.
6. Carousel transitions use opacity only — never transform: translateX.
7. Section padding is always 60px top and bottom — no exceptions.
8. No pure black (#000000) anywhere. Use var(--color-text) #313332 instead.
9. The accent color (#b0684f) must appear on fewer than 10% of interactive elements per page.
10. All images use background-size: cover — never background-size: contain.

[Paste this full blueprint document below this line]
```

---

### ✅ Section 4 Developer Checklist

- [ ] `base.css` contains `:root` tokens block only — no component styles mixed in
- [ ] CSS file architecture matches recommended structure above
- [ ] Shopify theme settings overridden in `:root` with `!important` for critical tokens
- [ ] All `:hover` rules gated inside `@media (min-width: 992px)`
- [ ] Hero height uses JS `--app-height` variable to fix iOS Safari viewport bug
- [ ] Google Fonts preconnect tags added to `<head>` in `theme.liquid`
- [ ] Jost loaded with weights `300`, `400`, `500` only — no 600 or 700
- [ ] Jomolhari loaded separately and used on 3 sections maximum
- [ ] `shopify-section` padding reset to `0` — rhythm applied via `.section-inner`
- [ ] Carousel implemented with Swiper.js `effect: 'fade'` — not slide
- [ ] Sticky header JS script implemented and handles homepage vs. product page
- [ ] Nav link color switches from white → `#777` based on `.is-scrolled` class
- [ ] All `<input>` and `<button>` elements have `border-radius: 0` in base reset
- [ ] Floating label JS adds `.is-active` class to `.form-field` on input value change
- [ ] Product card images enforce `aspect-ratio: 3 / 4` via wrapper, `object-fit: cover`
- [ ] AI agent system prompt prepared with hard rules and this document attached

---

_Technical Implementation Blueprint generated from direct CSS source analysis (4,464 lines), palette extraction, and visual audit of velasca.com — May 2026. Intended for Shopify HTML/CSS/JS implementation without framework conversion._
