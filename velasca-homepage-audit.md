# Velasca Homepage — Live Browser Audit

> **Source:** [https://www.velasca.com/](https://www.velasca.com/)  
> **Captured:** 2026-05-24 via Playwright (desktop 1440×900, mobile 390×844)  
> **Page title:** Velasca | Italian style, made to last  
> **Total scroll height:** ~6,819px (desktop) / ~6,853px (mobile)

---

## 1. Page structure (top → bottom)

| # | Section | DOM / class hint | Desktop Y | Height | Notes |
|---|---------|------------------|-------------|--------|-------|
| 0 | **Promo banner** | `styles__PromotionalBannerBackground` | 0 | 41px | Fixed wrapper; sale copy + inline links |
| 1 | **Header shell** | `styles__Header-velasca` | 0 | 41px fixed + nav below | Logo center, menu left, cart right |
| 2 | **Hero** | `PageIntrostyles__Container` | 0 | 882px | Full-bleed image + CTA overlay |
| 3 | **Category trio** | `CategoriesGridstyle__Container` (1st) | 882 | 780px | SHOES / CLOTHING / ACCESSORIES |
| 4 | **Editorial carousel** | `CollectionFocusBlockstyles__Layout` + Swiper | 1,662 | 611px | Seasonal lookbook slides |
| 5 | **Get inspired** | `CategoriesGridstyle__Container` (2nd) | 2,273 | 1,533px | 6 collection cards in grid |
| 6 | **About — Made in Italy** | `AboutUsBlockstyles__Background` | 3,806 | 700px | Full-width image + dual headings |
| 7 | **Stores** | `BottegasBlockstyles__Background` | 4,526 | 700px | “Come visit us / In store” |
| 8 | **Women redirect** | `RedirectBlockstyles__Background` | 5,226 | 700px | Links to velascawomen.com |
| 9 | **Newsletter** | `#newsletter-section` / `NewsletterSectionstyles__BackgroundContainer` | 5,926 | 427px | Email capture + legal copy |
| 10 | **Footer** | `[role="contentinfo"]` | 6,353+ | 468px | 3-column grid, payments, legal |

**Main wrapper:** `#homepage` inside `.content.side-collapse-container`

---

## 2. Layout system

### 2.1 Global constraints

| Token (live `:root`) | Value |
|----------------------|-------|
| `--container-max-width` | `1280px` |
| `--grid-max-width` | `1250px` |
| `--desktop-promotional-banner-height` | `41px` |
| `--mobile-promotional-banner-height` | `41px` |
| `--drawer-width` | `39rem` |

**Observed content width at 1440px viewport:** ~1,425px (full bleed; side gutters applied per section).

### 2.2 Section padding & margins (computed)

| Section | Padding | Margin |
|---------|---------|--------|
| Category grids (both) | `60px 30px` (desktop) / `45px 12px` (mobile) | `0` |
| Category card links | `0` | `0 0 35px` bottom per card |
| Promo blocks (About / Stores / Women) | `0` | About block: `0 0 20px` |
| Footer inner grid | `17px` | — |
| Footer column gap | `42px` | — |

### 2.3 Grids

**Category / “Get inspired” grid** (`.CategoriesGridstyle__Grid`):

| Breakpoint | Columns | Gap | Card size | Image height |
|------------|---------|-----|-----------|--------------|
| Desktop 1440 | `3 × ~448px` | `10px` | ~448×605px | ~560px |
| Mobile 390 | Single column (stacked) | — | full width (~351px inner) | — |

**Footer** (`contentinfo`):

- `display: grid`
- `grid-template-columns: 425.66px 425.67px 425.66px` (3 equal cols at desktop)
- `gap: 42px`
- Each menu column ~240px wide inside cell

### 2.4 Hero

| Property | Desktop | Mobile |
|----------|---------|--------|
| Container height | 882px | 570px |
| CTA position | Bottom-center overlay | Same pattern |
| CTA size | 300×38px | Scales with viewport |

---

## 3. Typography

### 3.1 Font families

| Role | Family | Source |
|------|--------|--------|
| **Primary UI** | `Jost`, serif | Google Fonts + Shopify CDN woff2 |
| **Display / editorial** | `Jomolhari`, serif | Google Fonts |
| **Third-party** | Open Sans 400/600 | Cookie/widget overlays |
| **Icons** | swiper-icons (woff data URI) | Swiper carousel |

```css
--theme-font-family: "Jost", serif;
--theme-secondary-font-family: Jomolhari, serif;
```

### 3.2 Type scale (computed samples)

| Element | Font | Size | Weight | Line-height | Letter-spacing | Transform | Color |
|---------|------|------|--------|-------------|----------------|-----------|-------|
| Logo area `h1` | Jost | 50px | 400 | 55px | normal | none | `#313332` |
| Section title “Get inspired” | Jomolhari | 50px | 400 | 62.5px | **-3px** | none | `#185674` |
| Promo block `h2` (“Made in Italy”) | Jomolhari | 50px | 400 | 62.5px | **-3px** | none | `#313332` |
| Newsletter `h2` | Jomolhari | 36px | 400 | 45px | **-2px** | none | `#313332` |
| Category `h3` (SHOES, etc.) | Jost | 20px | 500 | 25px | **2px** | **uppercase** | `#313332` |
| Footer column `h3` | Jost | 16px | 600 | 20px | normal | **uppercase** | `#ffffff` |
| Body / footer paragraph | Jost | 16px | 300–400 | 20px | normal | none | `#313332` / `#fff` |
| Promo banner links | Jost | 15px | 400 | 34px | normal | none | `#ffffff` |
| Hero / card CTA | Jost | 14px | 500 | 20px | normal | none | `#ffffff` |
| Legal / fine print | Jost | 14px | 400 | 17.5px | normal | none | `#313332` |
| Newsletter input | Jost | 14px | 500 | 12.5px | normal | none | `#313332` |

---

## 4. Color palette (live CSS variables + computed)

### 4.1 Brand tokens

| Variable | Hex | Usage |
|----------|-----|-------|
| `--theme-primary-color` | `#185674` | Headings, buttons, focus, back-to-top border |
| `--theme-primary-light` | `#427892` | Lighter primary variant |
| `--theme-accent-color` | `#b0684f` | Terracotta accent |
| `--theme-primary-text-color` / `--theme-text-color` | `#313332` | Body text |
| `--theme-secondary-text-color` | `#ffffff` | On dark backgrounds |
| `--theme-background-color` | `#ffffff` | Page base |
| `--theme-box-background-color` | `#F9F8F7` | Warm surface |
| `--theme-light-color` | `#f5f5f5` | Light fills |
| `--theme-border-color` | `#e3e3e3` | Borders |
| `--theme-secondary-color` | `#b9bbbb` | Secondary UI |
| `--theme-tertiary-color` | `#777777` | Muted text |
| `--theme-neutral500-color` | `#8B959A` | Subdued labels |
| `--theme-neutral300-color` | `#D9D9D9` | Neutral borders |

### 4.2 Surfaces observed

- **Footer background:** `rgb(49, 51, 50)` → `#313332`
- **Promo banner:** semi-transparent white overlay `rgba(255,255,255,0.3)` on imagery
- **Newsletter submit button:** `#185674` fill, white text
- **Cookie banner (Iubenda):** `#eee` bg, `#979aa7` border, offset shadow

---

## 5. Components

### 5.1 Promotional banner

- **Height:** 41px (fixed variable)
- **Position:** Inside `styles__Header` fixed wrapper (`z-index: 150`)
- **Typography:** White Jost ~15px, centered
- **Content example:** “Velasca Days: 20% off all [shoes] and [clothing].”
- **Links:** Underlined inline, same color

### 5.2 Navigation

| Property | At page top | After scroll ≥200px |
|----------|-------------|---------------------|
| Position | `absolute` | `absolute` |
| `top` | `90px` (below hero overlap) | `0px` (docks under promo) |
| Height | 58px | 58px |
| Background | transparent | transparent (`transition: background 0.1s linear`) |
| Layout | Flex: hamburger + search (left), logo (center), bag (right) | Same |

**Note:** Promo/header use a **fixed** outer shell (`styles__Header`, 41px). Main `nav` is **not** `position: sticky`; it repositions via `top` change on scroll.

### 5.3 Hero CTA (“Discover all products”)

```
display: inline-flex
padding: 11px
border: 1px solid #ffffff
color: #ffffff
font: Jost 14px / 500
gap: 8px
transition: 0.2s ease-in-out
border-radius: 0  (square corners site-wide)
size: ~300×38px
```

### 5.4 Category card

- Grid cell with image (~560px tall) + label row (~24px)
- `h3` uppercase label + arrow icon (24×24px)
- Card link margin-bottom: **35px**
- Hover: standard link transition (`transition: all`)

### 5.5 Editorial carousel (Collection Focus)

- **Library:** Swiper (`swiper-horizontal`)
- **Slide width:** 100% viewport (~1425px at desktop, 375px mobile)
- **Slide height:** ~611px desktop / ~469px mobile
- **Overflow:** `hidden` on `.swiper`
- **Scroll width:** ~12,825px total (10 slides + duplicates)
- **Navigation:** Text “prev / next” (screen-reader); `.swiper-button-prev/next` present but `display: none` at desktop
- **Snap:** None (`scroll-snap-type: none`) — transform-based slide transitions
- **CTA on slide:** Same ghost button as hero (300×38px, white border)

**Slides (order observed):**

1. P/E '25 Style Edit  
2. Spring/Summer '26  
3. S/S '26 in Sicily  
4. Winter in the Dolomites  
5. F/W '25 in Cortina  
6. Fall/Winter '25  
7. By the Amalfi Coast  
8. A trip to Apulia  
(+ duplicates for loop)

### 5.6 Editorial promo blocks (×3)

Shared pattern:

- Full-bleed background image (700px tall desktop, 560px mobile)
- Centered text block with:
  - `h3` — Jost 20px uppercase, 2px letter-spacing
  - `h2` — Jomolhari 50px, -3px letter-spacing
- Entire block is a single `<a>` link

| Block | h3 | h2 | href |
|-------|----|----|------|
| About | Artisanal craftmanship | Made in Italy | `/pages/about-us` |
| Stores | Come visit us | In store | `/pages/all-our-stores` |
| Women | Velasca | For her | `https://www.velascawomen.com/` |

### 5.7 Newsletter

- **Section height:** ~427px
- **Layout:** Background image + form column (~360px) + decorative image
- **Heading:** “Let’s keep in touch” — Jomolhari 36px
- **Input:** 301×44px, white bg, padding `17px 15px`
- **Submit:** 44×44px square, primary fill `#185674`, icon arrow inside
- **Legal:** 14px Jost, links to iubenda terms

### 5.8 Footer

- **Background:** `#313332`, white text
- **3 columns:** WE'RE HERE FOR YOU | HELP | ABOUT
- **Links:** ~23px line-height rows, 30px list item spacing
- **Payment icons row:** ~350×50px centered
- **Copyright + legal links** separated by 1px `#e3e3e3` rules
- **Breadcrumb:** “Home” above footer (`padding` ~15px)

### 5.9 Floating UI

| Component | Position | z-index | Size | Behavior |
|-----------|----------|---------|------|----------|
| Back to top `#back-to-top` | `fixed`, bottom-right | 1000 | 35×35px circle | White bg, 1px primary border, `transition: 0.2s linear` |
| Zendesk chat `.velasca-zendesk-icon` | `fixed` bottom-left | 25 | 60×75px | Fade in/out |
| Accessibility (AccessEase) | `fixed` | 2147483645+ | 50×50px | Hidden on desktop view tested |
| Cookie banner (Iubenda) | `fixed` bottom-right | 99999998 | 610×250px | Slide-in panel |
| Newsletter popup `.newsletter-foot-block` | `fixed` full viewport | 999999 | Hidden by default | Overlay when triggered |

---

## 6. Scrolling behavior

### 6.1 Page scroll

| Property | Value |
|----------|-------|
| Scroll container | `document` / viewport (html/body `overflow: visible`) |
| `scroll-behavior` | `auto` (no smooth scroll globally) |
| Scroll snap | **None** on page level |
| Parallax | Not detected on main sections |

### 6.2 Header on scroll (tested steps)

| scrollY | Nav `top` | Nav viewport Y |
|---------|-----------|----------------|
| 0 | 90px | ~131px |
| 200+ | 0px | ~41px (flush under promo) |

Promo banner wrapper stays **fixed** at top (`z-index: 150`). Content scrolls beneath.

### 6.3 Carousel scroll

- **Horizontal** swipe/drag via Swiper JS (not native overflow scroll)
- `overflow-x: hidden` on `.swiper`
- `swiper-wrapper` width >> viewport; slides translate on X axis
- No CSS scroll-snap on carousel

### 6.4 Back-to-top

- Fixed position: `top: 825px` at 900px viewport height → ~75px from bottom
- Right offset: ~75px from edge at 1440px width
- Appears as floating circular button over content

### 6.5 Mobile-specific scroll

- Same vertical document flow; sections stack single-column
- Category grid padding reduces: `45px 12px`
- Hero shortens (570px vs 882px)
- Nav becomes `display: flex`, static in flow at 390px (hamburger layout)

---

## 7. Spacing reference (quick)

| Context | Value |
|---------|-------|
| Section horizontal gutter (desktop) | 30px |
| Section horizontal gutter (mobile) | 12px |
| Section vertical padding (grids) | 60px desktop / 45px mobile |
| Grid gap (cards) | 10px |
| Card bottom margin | 35px |
| Promo block bottom margin | 20px (About only) |
| Footer grid gap | 42px |
| Footer inner padding | 17px |
| CTA padding | 11px |
| Button/icon gap | 8px |
| Newsletter input padding | 17px 15px |

---

## 8. Transitions & motion

| Element | Transition |
|---------|------------|
| Nav background | `background 0.1s linear` |
| Hero/category CTAs | `0.2s ease-in-out` |
| Back to top | `0.2s linear` (`tran-all` class) |
| Swiper slides | `transform` (Swiper default) |
| Newsletter overlay | `opacity 0.3236s, background 0.3236s` |
| Drawer (theme token) | `transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)` |
| Modals | `opacity 0.15s linear` |

**No** sitewide `prefers-reduced-motion` overrides observed in computed styles.

---

## 9. Accessibility & skip links

- Skip to content → `#skip-skip-to-content`
- Skip to footer → `#footer-react`
- Accessibility widget button (AccessEase) — visually hidden until focused
- Carousel: “prev next” text for screen readers
- Images: descriptive `alt` text on product/lifestyle photos

---

## 10. Tech stack signals

- **Shopify** storefront (CDN assets, section IDs `shopify-section-*`)
- **React** styled-components (class pattern `*styles__*-velasca__sc-*`)
- **Swiper** for editorial carousel
- **Iubenda** cookie consent
- **Zendesk** support widget
- **Google Sign-In** stylesheet loaded (accounts)

---

## 11. Homepage content map (links)

### Primary categories
- `/collections/all-products` — Hero CTA
- `/collections/all-shoes` — SHOES
- `/collections/all-clothing` — CLOTHING
- `/collections/all-accessories` — ACCESSORIES

### Get inspired collections
- `/collections/lace-ups`
- `/collections/knitwear`
- `/collections/tassel-and-belgian-loafers`
- `/collections/pants`
- `/collections/sneakers`
- `/collections/jackets`

### Editorial pages
- `/pages/s-s-2025-style-edit`
- `/pages/spring-summer-2026`
- `/pages/spring-summer-2026-in-sicily`
- `/pages/winter-in-the-dolomites`
- `/pages/fall-winter-2025-in-the-dolomites`
- `/pages/fall-winter-2025`
- `/pages/by-the-amalfi-coast`
- `/pages/s-s-in-apulia`

---

## 12. Responsive summary

| Breakpoint | Viewport | Page height | Key layout change |
|------------|----------|-------------|-------------------|
| Desktop | 1440×900 | ~6,819px | 3-col grids, 700px promo blocks, nav absolute |
| Mobile | 390×844 | ~6,853px | 1-col stacks, 45px/12px padding, shorter hero |

---

*This audit reflects the live production homepage at capture time. Promotional copy, carousel slides, and sale banners change seasonally; design tokens and layout mechanics are stable.*
