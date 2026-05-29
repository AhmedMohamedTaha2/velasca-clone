# Velasca.com — Mobile Design Audit Report
**Reference:** https://www.velasca.com/  
**Viewport tested:** 390 × 844 (iPhone 14 / CSS px)  
**Effective content width:** 375px (all React components cap here)  
**Audit date:** 2026-05-26  

---

## 1. Viewport & Global Layout

| Property | Value |
|---|---|
| Viewport meta width | device-width |
| Effective content width | **375px** |
| Body background | `#ffffff` |
| Base font | `Jost, serif` |
| Base color | `rgb(49, 51, 50)` = `#313332` |
| Page total height (390w) | ~6 660px |
| Main section height | ~5 745px |
| Footer height | **916px** |

> **Critical note:** Although the viewport is 390px, all React-rendered blocks render at **375px**. Your clone should set `max-width: 375px; margin: 0 auto` on the root content wrapper, or ensure the design is built to 375px mobile width. Everything below is measured at 375px content width.

---

## 2. CSS Breakpoints

The site defines the following meaningful breakpoints (from parsed stylesheets):

| Breakpoint | Role |
|---|---|
| `max-width: 389px` | Tiny phones (< iPhone SE) |
| `max-width: 420px` | Small phones |
| `min-width: 375px` and `max-width: 767px` | Core mobile (most rules live here) |
| `min-width: 480px` / `max-width: 480px` | Landscape small phones |
| `max-width: 530px` | Compact mobile |
| `max-width: 600px` | Large phone / small tablet |
| `max-width: 640px` | Pre-tablet |
| `max-width: 660px` / `min-width: 660px` | Lower tablet boundary |
| `max-width: 750px` / `max-width: 767px` | Tablet transition |
| **`min-width: 768px`** | **Tablet — primary desktop switch** |
| `min-width: 992px` | Medium desktop |
| `min-width: 1024px` | Large tablet / small desktop |
| `min-width: 1200px` | Desktop |
| `min-width: 1400px` | Wide desktop |
| `min-width: 1600px` | Extra-wide |

**Mobile-first rule:** Design for `< 768px`. The major layout shifts happen at `768px`.

---

## 3. Color Palette

| Name | RGB | Hex | Usage |
|---|---|---|---|
| Dark Charcoal | `rgb(49, 51, 50)` | `#313332` | Body text, footer bg, nav text |
| Brand Blue | `rgb(24, 86, 116)` | `#185674` | SerifTitle headings, accessibility icon bg |
| Link Blue | `rgb(51, 122, 183)` | `#337ab7` | Category card titles, overlay links |
| Muted Grey | `rgb(139, 149, 154)` | `#8B959A` | Footer legal/copyright text |
| White | `rgb(255, 255, 255)` | `#ffffff` | Nav text on dark, button text, promo banner text |
| Semi-white banner | `rgba(255,255,255,0.3)` | — | Promo banner background |

---

## 4. Typography System

### Fonts
- **Serif:** `Jomolhari, serif` — used for display headings (H1-level titles)
- **Sans:** `Jost, serif` — used for everything else (body, buttons, nav, labels)

### Type Scale

| Component | Font | Size | Weight | Line-height | Letter-spacing | Transform | Color |
|---|---|---|---|---|---|---|---|
| SerifTitle (H2 display) | Jomolhari | **30px** | 400 | 37.5px | **-2px** | none | `#185674` |
| SerifTitle (Newsletter H2) | Jomolhari | **36px** | 400 | 45px | **-2px** | none | `#313332` |
| SansTitle (H3 label) | Jost | **14px** | 500 | 17.5px | **+2px** | `uppercase` | `#313332` |
| Footer H3 label | Jost | **16px** | 600 | 20px | normal | none | `#ffffff` |
| Footer body text | Jost | **16px** | 300 | 20px | normal | none | `#ffffff` |
| Footer links | Jost | **14px** | 400 | 17.5px | normal | none | `#8B959A` |
| Category card title | Jost | **18px** | 400 | 30px | normal | none | `#337ab7` |
| AboutUs overlay text | Jost | **18px** | 400 | 30px | normal | none | `#337ab7` |
| Description body text | Jost | **16px** | 400 | 20px | normal | none | `#313332` |
| Privacy/legal small | Jost | **14px** | 400 | 17.5px | normal | none | `#313332` |
| Promo banner text | Jost | **15px** | 400 | 30px | normal | none | `#ffffff` |

---

## 5. Fixed Header / Mobile Navigation

**Total header height: 109px** (stacked: 41px banner + 68px navbar)  
Position: `fixed`, top: 0, left: 0, z-index: `100`, background: **transparent** (`rgba(0,0,0,0)`)

---

### 5.1 Promotional Banner (top strip)

```
┌─────────────────────────── 375px ──────────────────────────┐
│  "Velasca Days: 20% off all shoes and clothing…"    41px   │
└─────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Height | **41px** |
| Width | 375px |
| Background | `rgba(255, 255, 255, 0.3)` (semi-transparent white) |
| Text color | `#ffffff` |
| Font | Jost 15px / 400 / line-height: 30px |
| Content | Swiper carousel — auto-plays promotional messages |
| Padding | 0 all sides |

---

### 5.2 Navbar Bar

```
┌─────────────────────────── 375px ──────────────────────────┐
│  [≡] [🔍]          Velasca (logo)          [♡] [person] [🛒] │  68px  │
│   ←113px→            ←113px→               ←113px→         │
└─────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Height | **68px** |
| Width | 375px |
| Padding top/bottom | **5px** |
| Padding left/right | 0 |
| Display | `flex`, `flex-direction: row`, `justify-content: space-between`, `align-items: center` |
| Background | transparent |
| Font color | `#313332` |

**Three equal chunks (each 113px wide):**

| Chunk | Content | Alignment | Details |
|---|---|---|---|
| StartChunk (left) | Hamburger + Search icon | `flex-start` | Two 48×48px icon buttons, positioned left at x=5 |
| CenterChunk (center) | Logo SVG / H1 | `center` + `align-items: center` | Logo: 100×42px |
| EndChunk (right) | Wishlist + Account + Cart | `flex-end` | 113×48px, icons at right |

**Icon sizes:** 48×48px each (touch-target sized)  
**Logo container:** H1 tag, 100×42px, centered

---

## 6. Hero / Page Intro Section

```
┌─────────────────────── 375px ─────────────────────────┐
│                                                        │
│              [Full-bleed photo]                        │
│                                                    570px
│                                                        │
│  ┌──────────── 300px ────────────┐                    │
│  │    DISCOVER ALL PRODUCTS      │  38px (button)     │
│  └───────────────────────────────┘                    │
└────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Width | 375px |
| Height | **570px** |
| Position | `relative` |
| Padding | 0 |
| Background image | `IMG` covering full 375×570, `position: static`, `display: inline` |

**Overlay TextContainer:**
- Position: `absolute`
- Width: 375px, Height: 495px
- Display: `flex`, `justify-content: center`, `align-items: end`

**TextContent inner wrapper:**
- Display: `flex-column`, `justify-content: center`, `align-items: center`
- `padding-top: 60px`

**CTA Button ("Discover all products"):**
- Width: **300px**, Height: **38px**
- Display: `inline-flex`, `justify-content: center`, `align-items: center`
- Padding: **11px** all sides
- Gap: 8px
- Border: `1px solid #ffffff`
- Font: Jost, weight 500, color white
- Background: transparent (`rgba(0,0,0,0)`)
- Margin from left edge: `(375 - 300) / 2 = 37.5px` (auto centered)

---

## 7. Categories Grid — Section 1 (Shoes / Clothing / Accessories)

**Layout: single-column full cards, stacked vertically**

```
┌────────────────────── 375px ──────────────────────┐
│  padding: 45px 12px                                │
│  ┌─────────────────── 351px ──────────────────┐   │
│  │  [card: SHOES]           351 × 483px       │   │
│  ├────────────────────── gap: 5px ────────────┤   │
│  │  [card: CLOTHING]        351 × 483px       │   │
│  ├──────────────────────────────────────────── ┤   │
│  │  [card: ACCESSORIES]     351 × 483px       │   │
│  └────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────┘
  Total height: 1583px
```

**Container:**

| Property | Value |
|---|---|
| Width | 375px |
| Height | 1583px |
| Padding top/bottom | **45px** |
| Padding left/right | **12px** |
| Display | `block` |

**Inner Grid (`.Grid`):**

| Property | Value |
|---|---|
| Width | 351px (375 - 24px padding) |
| Display | `grid` |
| grid-template-columns | `351px` (single column) |
| grid-template-rows | `492.75px 492.75px 492.75px` |
| gap | **5px** |
| margin-top | **5px** |

**Each Category Card:**

| Property | Value |
|---|---|
| Width | 351px |
| Rendered height | **483px** |
| Tag | `<a>` (full block link) |
| margin-bottom | 10px |

**Card internals:**
- `ImageContainer`: 351×439px, `display: block`, no padding
- `TitleWrapper`: 351×24px, `display: flex`, `margin-top: 20px`
  - Title text: Jost **18px**, weight 400, color `#337ab7`
  - Text: "SHOES" / "CLOTHING" / "ACCESSORIES" (uppercase by CSS text-transform)

---

## 8. Collection Focus Block (Swiper Carousel)

**Full-width editorial slider — no side padding**

| Property | Value |
|---|---|
| Width | 375px |
| Height | **469px** |
| Display | `flex`, `flex-direction: row`, `justify-content: space-between`, `align-items: center` |
| Padding | 0 |
| Background | transparent |

**Swiper inside:**
- Width: 375px, Height: 469px
- `position: relative`
- Navigation buttons hidden on mobile (`display: none`)
- Pagination dots: `margin-top: 20px`, height 13px, full width

**Each slide:** Full 375px wide editorial image with overlaid text (title + CTA)

---

## 9. Categories Grid — Section 2 ("Get Inspired" — product sub-categories)

**Layout: 2-column grid with mixed-height rows**

```
┌──────────────────── 375px ────────────────────────┐
│  padding: 45px 12px                                │
│                                                    │
│  Title: "Get inspired"  (H2 Jomolhari 30px)        │
│         padding-bottom: 20px                       │
│                                                    │
│  ┌─────── 173px ──────┬──── 173px ─────┐  260px   │
│  │   Lace-ups          │   Knitwear      │          │
│  ├─────────────────────┴────────────────┤  gap:5px │
│  │   Tassel loafers (spans full)         │  289px  │
│  ├─────── 173px ──────┬──── 173px ─────┤  gap:5px │
│  │   Pants             │   Sneakers      │  260px  │
│  └─────────────────────┴────────────────┘          │
│  Total grid height: 849px                          │
└────────────────────────────────────────────────────┘
  Total section height: 1002px
```

**Container:**

| Property | Value |
|---|---|
| Width | 375px |
| Height | 1002px |
| Padding top/bottom | **45px** |
| Padding left/right | **12px** |

**Title ("Get inspired"):**
- Element: `TitleCompositionstyles__Title`
- Height: 58px, padding-bottom: **20px**
- H2: Jomolhari, 30px, weight 400, line-height 37.5px, letter-spacing **-2px**, color `#185674`

**Inner Grid:**

| Property | Value |
|---|---|
| Width | 351px |
| Display | `grid` |
| grid-template-columns | `173px 173px` **(2 columns)** |
| grid-template-rows | `270.25px 298.75px 270.25px` |
| gap | **5px** |
| margin-top | **5px** |

**Small Card sizes:**
- Row 1 & 3: 173×260px each
- Row 2 (middle/featured): 173×289px each

---

## 10. About Us Block

**Full-bleed image with centered overlay text box**

```
┌──────────────── 375px ───────────────┐
│                                      │
│  [Full-bleed background photo]  560px│
│                                      │
│       ┌──── 275px ─────┐             │
│       │  Artisanal      │  183px     │
│       │  craftmanship   │            │
│       │  Made in Italy  │            │
│       └─────────────────┘            │
└──────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Width | 375px |
| Height | **560px** |
| margin-bottom | **20px** |
| Background | `#ffffff` |
| Section frame | `display: flex`, `justify-content: center`, `align-items: center`, `position: relative` |
| ImageWrapper | 375×560px, full-bleed photo |

**Overlay Description link:**
- Width: 275px, Height: 183px
- Padding: **34px** top/bottom, **60px** left/right
- Margin: **100px** top/bottom
- Font: Jost 18px / 400 / line-height 30px
- Color: `#337ab7`

---

## 11. Bottegas Block (Store Visits)

Same structure as About Us Block:

| Property | Value |
|---|---|
| Width | 375px |
| Height | **560px** |
| Background | `#ffffff` |
| Frame | `flex`, `justify-content: center`, `align-items: center`, `position: relative` |
| Overlay description | 255×146px, padding 34px/60px, margin 100px top/bottom |
| Font | Jost 18px / color `#337ab7` |

---

## 12. Redirect Block ("For her" / "For him")

| Property | Value |
|---|---|
| Width | 375px |
| Height | **560px** |
| Background | `#ffffff` |
| Frame | `flex`, `justify-content: center`, `align-items: center`, `position: relative` |

---

## 13. Newsletter Section

```
┌──────────────────── 375px ─────────────────────────┐
│  [Background photo — absolute, full bleed]     336px│
│                                                     │
│  padding-top: 68px, padding: 12px sides             │
│  ┌──────────────── 351px ──────────────────┐        │
│  │  "Let's keep in touch"  H2 36px/Jomolhari│        │
│  │                                          │        │
│  │  Description text   16px  mt: 24px       │        │
│  │                                          │        │
│  │  [email input]  351 × 44px               │        │
│  │                                          │        │
│  │  Policy text   14px  mt:15px mb:15px     │        │
│  └──────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────┘
```

**Background container:**

| Property | Value |
|---|---|
| Width | 375px |
| Height | **336px** |
| Background image | `position: absolute`, 375×336px, full-cover |
| Position | `relative` |

**Layout section:**

| Property | Value |
|---|---|
| Display | `flex-column`, `align-items: center` |
| Padding top | **68px** |
| Padding left/right | **12px** |

**FormWrapper:** 351×242px (375 - 24px horizontal padding)

**Form internals:**

| Element | Size | Font | Details |
|---|---|---|---|
| H2 "Let's keep in touch" | 351×45px | Jomolhari **36px** / 400 / lh 45px / ls -2px | color `#313332` |
| Description `<div>` | 351×40px | Jost **16px** / 400 / lh 20px | `margin-top: 24px` |
| Email `<form>` input row | 351×44px | — | `display: flex` |
| Policy text | 351×35px | Jost **14px** / 400 / lh 17.5px | `margin: 15px 0` |

---

## 14. Footer

```
┌──────────────────── 375px ─────────────────────────────┐
│  bg: #313332 (dark charcoal)   padding: 20px top/bottom │
│                                                         │
│  [Breadcrumbs nav]  35px  pl:17px pr:17px pb:17px      │
│  ───────────────────────────────────────────────────    │
│                                                         │
│  [Menus grid]  614px  padding: 17px  gap: 42px          │
│   ┌── 240px ──────────────────────────────────┐         │
│   │  WE'RE HERE FOR YOU  (H3 16px/600)        │         │
│   │  Body text           (p 16px/300)  132px  │         │
│   ├────────────────────────────────────────────┤        │
│   │  HELP               (H3 16px/600)          │        │
│   │  - Impact report                    212px  │        │
│   │  - Accessibility Statement                 │        │
│   │  - Shipping and returns                    │        │
│   │  - Make a return                           │        │
│   │  - Mob: +1 929 384 6040                    │        │
│   │  - Email: hello@velasca.com                │        │
│   ├────────────────────────────────────────────┤        │
│   │  ABOUT              (H3 16px/600)   152px  │        │
│   │  - All our stores                          │        │
│   │  - About us                                │        │
│   │  - Work with us                            │        │
│   │  - Archive                                 │        │
│   └────────────────────────────────────────────┘        │
│                                                         │
│  [Payment methods image]  350×50px  margin: 30px 0      │
│  ─────────────────────────────────────────────────      │
│  [Legal notes]  flex space-between  pl/pr: 17px         │
│   © copyright text  14px  mt:20px  color:#8B959A        │
│   Terms | Privacy | Cookie | Whistleblowing  wrap       │
└─────────────────────────────────────────────────────────┘
  Total height: 916px
```

**Footer container:**

| Property | Value |
|---|---|
| Width | 375px |
| Height | **916px** |
| Background | `rgb(49, 51, 50)` = `#313332` |
| Padding top/bottom | **20px** |
| Text color | `#ffffff` |

**Breadcrumbs nav:**
- Height: 35px
- OL: `display: flex`, `align-items: center`
- Padding: `0 17px 17px 17px`, gap: **10px**
- Font: Jost 14px / color `#ffffff`

**Menus grid:**
- Height: 614px
- Display: `grid` (single column, stacked)
- Padding: **17px** all sides
- Gap between menus: **42px**
- Menu item width: **240px** (left-aligned within 375px container)

**Menu H3 headings:**
- Font: Jost **16px** / weight **600** / line-height 20px
- margin-bottom: **12px**
- Color: `#ffffff`

**Menu link items (`<li>`):**
- Height: 30px each
- Padding top/bottom: **5px**
- Font: Jost 14px (inferred from anchor tags) / color `#8B959A` (muted)

**Payment image:**
- Width: 350px, Height: 50px
- `margin-top: 30px`, `margin-bottom: 30px`

**Legal notes row:**
- Display: `flex`, `justify-content: space-between`
- Padding: `0 17px`, gap: `80px`
- Copyright text: `#8B959A`, 14px/17.5px, `margin-top: 20px`
- Legal links list: `flex`, `flex-wrap`, `gap: 5px 10px`
  - Items: "Terms & Conditions" (115px), "Privacy Policy" (80px), "Cookie Policy" (81px), "Whistleblowing" (91px)
  - Font: Jost 14px / color `#8B959A`

---

## 15. Spacing Summary

| Section | Top Padding | Bottom Padding | Left Padding | Right Padding | Notes |
|---|---|---|---|---|---|
| Promo Banner | 0 | 0 | 0 | 0 | Height from line-height |
| Navbar | 5px | 5px | 0 | 0 | Left icons at x=5 |
| Hero | 0 | 0 | 0 | 0 | Full bleed |
| Categories Grid 1 | **45px** | **45px** | **12px** | **12px** | Both grids same |
| Categories Grid 2 | **45px** | **45px** | **12px** | **12px** | — |
| Collection Slider | 0 | 0 | 0 | 0 | Full bleed |
| AboutUs Block | 0 | 0 | 0 | 0 | + margin-bottom: 20px |
| Bottegas Block | 0 | 0 | 0 | 0 | — |
| Redirect Block | 0 | 0 | 0 | 0 | — |
| Newsletter | **68px** top | 0 | **12px** | **12px** | — |
| Footer | **20px** | **20px** | 0 | 0 | Inner menus: 17px |

---

## 16. Page Section Layout Map (Vertical)

All offsets measured from page top (`y=0`):

| Offset (px) | Section | Height (px) |
|---|---|---|
| 0 | **Promo Banner** (fixed) | 41 |
| 41 | **Navbar** (fixed) | 68 |
| 0 | **Hero / Page Intro** | 570 |
| 570 | **Categories Grid 1** (Shoes/Clothing/Accessories) | 1583 |
| 2153 | **Collection Focus Slider** | 469 |
| 2622 | **Categories Grid 2** (Get Inspired) | 1002 |
| 3624 | **About Us Block** | 560 (+20px margin) |
| 4204 | **Bottegas Block** | 560 |
| 4764 | **Redirect Block** | 560 |
| 5324 | **Newsletter Section** | 336 |
| 5660 | **Footer** | 916 |
| **Total** | | **~6 576px** |

---

## 17. Key Design Patterns to Replicate

### 17.1 Full-bleed image sections
- AboutUs, Bottegas, Redirect, Hero, Newsletter: all use `position: relative` container + `position: absolute` image child at 100% width & height
- Overlay content is absolutely or flexibly centered inside

### 17.2 Grid gutter system
- Outer page padding: **12px** left/right (inside category sections)
- Grid item gap: **5px** uniform
- Results in inner grid width: `375 - 24 = 351px`
- 2-col grid: `(351 - 5) / 2 = 173px` per column

### 17.3 Card title anatomy
- Image fills full card area except bottom ~44px reserved for label
- Label: `margin-top: 20px`, font Jost 18px, color `#337ab7`
- Card bottom: no padding, label is outside the image box

### 17.4 Button style
- Outlined button: `1px solid white` border, transparent bg, white text
- Padding: `11px` all sides, `gap: 8px`
- Width: **300px** (fixed, not 100%)
- Centered within parent via flex `align-items: center`

### 17.5 Header transparency
- The full header (promo + nav) is **transparent** by default
- It overlays the hero image — the hero is NOT offset by header height
- The hero image starts at `y=0`, not `y=109px`

### 17.6 Section separation
- No dividers between main content sections
- Only whitespace (padding) separates sections
- AboutUs block has a unique `margin-bottom: 20px` gap before Bottegas

---

## 18. Checklist for Clone Implementation

- [ ] Fix content width to **375px** (max-width on wrapper or media query)
- [ ] Header: `position: fixed; top: 0; z-index: 100; width: 375px; height: 109px`
- [ ] Promo banner: `height: 41px; background: rgba(255,255,255,0.3)`
- [ ] Navbar: `height: 68px; padding: 5px 0; display: flex; justify-content: space-between`
- [ ] Navbar 3-chunk layout: each chunk exactly `113px` wide
- [ ] Icons: `48×48px` touch targets
- [ ] Logo: `100×42px` centered H1
- [ ] Hero: `height: 570px; position: relative` — image NOT pushed down by header
- [ ] Hero CTA button: `width: 300px; height: 38px; border: 1px solid #fff; padding: 11px`
- [ ] Grid section padding: `45px top/bottom, 12px left/right`
- [ ] Grid 1 (main): single column, gap `5px`, full 351px wide cards
- [ ] Grid 2 (inspired): 2 columns `173px` each, gap `5px`, row heights `260/289/260`
- [ ] Collection slider: full 375px bleed, dots only on mobile
- [ ] AboutUs/Bottegas/Redirect: `560px` tall, full-bleed image, centered overlay
- [ ] Newsletter bg: `336px` tall, `padding-top: 68px`, `padding: 0 12px`
- [ ] Newsletter H2: Jomolhari `36px`, ls `-2px`
- [ ] Footer bg: `#313332`, padding `20px`
- [ ] Footer menus: padding `17px`, gap `42px` between menu groups
- [ ] Footer legal: `14px`, color `#8B959A`
- [ ] Load fonts: **Jomolhari** (serif display) + **Jost** (sans body)
