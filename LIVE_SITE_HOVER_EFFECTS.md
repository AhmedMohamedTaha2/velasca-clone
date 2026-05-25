# Live Site Hover Effects — velasca.com

**Scraped:** 2026-05-25  
**Method:** Playwright MCP — CSS stylesheet extraction + visual inspection  
**Source:** https://www.velasca.com/

---

## How to read this document

Each section lists the **live site's actual CSS** for that component, including selector, properties, and transitions. A `[CLONE STATUS]` tag at the end of each entry shows how the clone compares:

- `✅ MATCH` — Clone implements this correctly  
- `⚠️ PARTIAL` — Clone has the effect but with wrong values  
- `❌ MISSING` — Clone has no equivalent implementation  
- `🔄 DIFFERENT` — Clone uses a different approach entirely

---

## 1. Navigation — Main Nav Links

### 1.1 NavLink base (`.itCOVi`)

```css
.itCOVi {
  display: block;
  font-size: 1.2rem;
  color: rgb(49, 51, 50);
  transition: all;
}
.itCOVi:hover {
  color: rgb(24, 86, 116); /* #185674 */
}
.itCOVi .styles__FirstLevelMenuTitle-velasca__sc-qjgftd-1:hover {
  color: rgb(24, 86, 116);
  font-weight: 600;
}
```

**Effect:** Text turns blue (#185674); mega-menu title also gains bold weight  
**Desktop only:** No (applies to all breakpoints)  
`[CLONE STATUS: ✅ MATCH — .nav-link:hover with color #185674]`

---

### 1.2 All generic links (`.bFzpYj`)

```css
.bFzpYj:hover,
.bFzpYj:link,
.bFzpYj:visited,
.bFzpYj:active {
  text-decoration: none;
}
.bFzpYj:hover {
  color: rgb(24, 86, 116);
}
```

**Effect:** Removes underline on hover; turns blue  
`[CLONE STATUS: ✅ MATCH — base link hover]`

---

### 1.3 Mega Menu Category Items (`.geQIqz`)

```css
.geQIqz {
  color: rgb(49, 51, 50);
  font-size: 1.4rem;
  text-transform: uppercase;
  font-weight: 400;
}
.geQIqz:hover {
  color: rgb(24, 86, 116) !important;
  cursor: pointer;
}
.geQIqz.italic-blue:hover {
  color: rgb(66, 120, 146) !important;  /* lighter teal */
}
.geQIqz.boxed:hover {
  color: rgb(75, 108, 94) !important;   /* green-teal */
}
```

**Effect:** Color shift to brand teal; variants shift to lighter teal or green  
**Desktop only:** No  
`[CLONE STATUS: ✅ MATCH — .mega-menu__link:hover with color change]`

---

### 1.4 Account / Cart icon links (`.jOLCHE`)

```css
.jOLCHE:hover,
.jOLCHE:link,
.jOLCHE:visited,
.jOLCHE:active {
  text-decoration: none;
}
```

**Effect:** Prevents browser default underline on icon links  
`[CLONE STATUS: ✅ MATCH — .navbar__icon-btn:hover]`

---

### 1.5 Help Bar links (`.cKDRCB`)

```css
.cKDRCB {
  transition: color 0.2s cubic-bezier(0, 0, 0, 1);
}
.cKDRCB:hover {
  color: rgb(49, 51, 50);
  text-decoration: underline;
  cursor: pointer;
}
```

**Effect:** Underline appears + turns dark; smooth cubic-bezier transition  
`[CLONE STATUS: ⚠️ PARTIAL — clone has opacity:0.75 instead of underline+dark color]`

---

### 1.6 Help Bar label (`.hbGrQA`)

```css
.hbGrQA {
  transition: color 0.2s cubic-bezier(0, 0, 0, 1);
}
.hbGrQA:hover {
  color: rgb(49, 51, 50);
}
```

**Effect:** Color darkens  
`[CLONE STATUS: ❌ MISSING — not in clone docs]`

---

### 1.7 Header hover — global state changes

When hovering anywhere on `header`:

```css
/* @media (min-width: 992px) */
header:hover .ly-languages-switcher { color: rgb(49, 51, 50); }
header:hover .navbar-top-sep        { color: rgb(49, 51, 50); }
header:hover .phone-svg             { fill: rgb(49, 51, 50); stroke: rgb(49, 51, 50); stroke-miterlimit: 10; }

header:hover #navbar-menu .navbar-nav li a.iWishView { color: rgb(139, 142, 145); }
header #navbar-menu .navbar-right li:hover a.iWishView { font-weight: 400; }
```

**Effect:** When hovering the entire header, language switcher, separator, and phone icon all shift to dark; wishlist link desaturates  
`[CLONE STATUS: ❌ MISSING — no header:hover global state in clone]`

---

## 2. Buttons

### 2.1 Primary / Solid Button (`.ezsVQF`)

```css
.ezsVQF {
  border: 1px solid rgb(24, 86, 116);
  color: rgb(255, 255, 255);
  background: rgb(24, 86, 116);
  transition: 0.2s ease-in-out;
  border-radius: 0px;
}
/* @media (hover: hover) */
.ezsVQF:hover {
  color: rgb(255, 255, 255);
  background: rgb(66, 120, 146);     /* lightens */
  border-color: rgb(66, 120, 146);
}
/* @media (max-width: 991px) */
.ezsVQF:hover { color: rgb(255, 255, 255); }  /* mobile: color only */
```

**Effect:** Solid blue button lightens on hover; SVG icons inside get `fill/color` transition  
**True hover device only** (`@media (hover: hover)`)  
`[CLONE STATUS: ✅ MATCH — .btn-default:hover background #427892]`

---

### 2.2 Ghost White Button (`.gmBPfN`)

```css
.gmBPfN {
  background: transparent;
  color: rgb(255, 255, 255);
  border: 1px solid rgb(255, 255, 255);
  transition: 0.2s ease-in-out;
}
/* @media (hover: hover) */
.gmBPfN:hover {
  background: rgb(255, 255, 255);
  color: rgb(49, 51, 50);
}
.gmBPfN:hover g,
.gmBPfN:hover path {
  fill: rgb(49, 51, 50);
  color: rgb(49, 51, 50);
}
```

**Effect:** Transparent → solid white fill; text/SVG inverts to dark  
`[CLONE STATUS: ✅ MATCH — .btn-white:hover background white + dark text + SVG stroke]`

---

### 2.3 Form submit button (single-input)

```css
/* @media (min-width: 992px) */
.single-input > div:not(.privacy-policy-text) button:hover,
.single-input > div:not(.privacy-policy-text) input[type="submit"]:hover {
  color: rgb(255, 255, 255);
  background-color: rgb(66, 120, 146);
}
```

**Effect:** Submit lightens to #427892 on hover  
`[CLONE STATUS: ✅ MATCH — newsletter submit hover]`

---

## 3. Category Grid Cards

### 3.1 Category Card Wrapper (`.GWqXK`)

```css
.GWqXK:hover .SansTitlestyles__Title-velasca__sc-4f82ke-0 {
  color: rgb(24, 86, 116);
  text-decoration: underline 0.1rem;
  text-underline-offset: 0.3rem;
}
.GWqXK:hover .pathArrow {
  stroke: rgb(24, 86, 116);
}
```

**Effect:** Card title turns blue + thin underline appears; the arrow icon SVG also turns blue  
**Desktop only:** No media query restriction  
`[CLONE STATUS: ⚠️ PARTIAL — clone changes title color ✓ but missing .pathArrow stroke change ❌]`

---

## 4. Product Image Hover (Legacy)

### 4.1 Image Swap on Product Hover (`[name="data-hover"]`)

```css
[name="data-hover"] .box .image .hover {
  opacity: 0;
  position: absolute;
  top: 0; left: 0;
  transition: 0.2s linear;
}
/* @media (min-width: 992px) */
[name="data-hover"] .box:hover .hover {
  opacity: 1;
}
[name="data-hover"] .box:hover .label-big {
  color: rgb(24, 86, 116);
}
/* @media (max-width: 767px) */
[name="data-hover"] .box .image .hover {
  opacity: 1 !important;  /* always visible on mobile */
}
```

**Effect:** On desktop, a second overlaid image fades in; label text turns blue  
**Duration:** 0.2s linear  
`[CLONE STATUS: ❌ MISSING — no product image swap hover in clone]`

---

## 5. About Us / Editorial Link

### 5.1 About Us Section Link (`.lfLkzu`)

```css
.lfLkzu { position: relative; }
.lfLkzu:hover { text-decoration: none; }
.lfLkzu:hover .SerifTitlestyles__Title-velasca__sc-1vrlen0-0 {
  text-decoration: underline 0.2rem;
  text-underline-offset: 1.4rem;
}
```

**Effect:** Serif headline gets thick underline with generous offset (read-more style)  
`[CLONE STATUS: ❌ MISSING — no editorial serif title underline hover]`

---

## 6. Slider / Carousel Navigation

### 6.1 Slider Arrow Buttons (`.clHfZC`)

```css
/* @media screen and (min-width: 992px) */
.clHfZC {
  color: rgb(217, 217, 217);   /* light gray default */
  background: none;
  padding: 2rem;
}
.clHfZC:hover {
  cursor: pointer;
  color: rgb(139, 149, 154);   /* slightly darker gray */
}
```

**Effect:** Arrow lightens slightly (from near-white gray to medium gray) on hover  
`[CLONE STATUS: ⚠️ PARTIAL — clone has color white → gray, but live site is gray → slightly-darker gray]`

---

## 7. Footer

### 7.1 Footer Nav Links

```css
.rrDEW a:hover  { color: rgb(255, 255, 255); text-decoration: underline; }
.jSEacY a:hover { color: rgb(255, 255, 255); text-decoration: underline; }
.dDOcgj a:hover { color: rgb(255, 255, 255); text-decoration: underline; }
```

**Effect:** White text + underline (links are already white, underline is the visible change)  
`[CLONE STATUS: 🔄 DIFFERENT — clone uses opacity:0.7 reduction instead of underline]`

---

### 7.2 Footer Social Media Icons

```css
footer #footer-container #fat-footer .social-container img {
  width: 30px;
  transition: 80.9ms linear;
}
/* @media (min-width: 992px) */
footer #footer-container #fat-footer .social-container img:hover {
  transform: scale(1.3);
}
```

**Effect:** Icon grows 30% on hover; very fast 81ms transition  
`[CLONE STATUS: ❌ MISSING — clone docs describe scale(1.03) for product images, no social icon scale]`

---

## 8. Newsletter / Modal

### 8.1 Newsletter Popup Submit

```css
/* @media (min-width: 992px) */
.newsletter-foot-block .submit-button .submit-foot-block:hover {
  background-color: var(--theme-primary-light);
}
```

**Effect:** Submit button lightens  
`[CLONE STATUS: ✅ MATCH]`

### 8.2 Newsletter Popup Close Button

```css
/* @media (min-width: 992px) */
.newsletter-foot-block .close:hover { opacity: 0.8; }
```

**Effect:** Close button fades slightly  
`[CLONE STATUS: ✅ MATCH]`

---

## 9. Tab Components

### 9.1 Tab Navigation Items (`.tab-justify li`)

```css
/* @media (min-width: 992px) */
.tab-justify li:hover        { opacity: 1; }
.tab-justify li:hover path   { stroke: rgb(66, 120, 146) !important; }
.tab-justify li:hover a      { font-weight: 500 !important; }
```

**Effect:** Inactive tab becomes fully opaque; icon stroke turns teal; label bolds  
`[CLONE STATUS: ❌ MISSING]`

---

## 10. Sticker / Info Hotspot Components

### 10.1 Blue Sticker

```css
/* @media (min-width: 992px) */
.sticker-info.blue:hover .circle {
  color: rgb(255, 255, 255) !important;
  background-color: rgb(24, 86, 116);
}
.sticker-info.blue:hover .circle::after,
.sticker-info.blue:hover .circle::before {
  background-color: rgb(255, 255, 255);
}
.sticker-info:hover span,
.sticker-info:hover span a { text-decoration: underline; }
```

**Effect:** Hotspot circle fills with brand blue; crosshair lines turn white; label underlines  
`[CLONE STATUS: ❌ MISSING]`

### 10.2 Orange Sticker

```css
.sticker-info.orange:hover .circle {
  color: rgb(255, 255, 255) !important;
  background-color: rgb(176, 104, 79);
}
```

**Effect:** Circle fills with brand orange (#b0684f)  
`[CLONE STATUS: ❌ MISSING]`

---

## 11. Table / Size Guide

### 11.1 Hover Table Rows

```css
/* @media (min-width: 992px) */
.table-row-hover .cell-row:hover div {
  background-color: rgb(238, 238, 238);
}
.table-row-hover .cell-row:hover div:hover {
  background-color: rgb(24, 86, 116) !important;
  color: rgb(255, 255, 255) !important;
}
```

**Effect:** Hovering a row highlights the entire row in light gray; hovering a specific cell highlights it in primary blue with white text  
`[CLONE STATUS: ❌ MISSING]`

---

## 12. Base / Global

### 12.1 Global anchor hover

```css
/* @media (min-width: 992px) */
a:focus, a:hover, a:visited { text-decoration: none; }
a.bold-blue:hover            { text-decoration: underline; }
```

**Effect:** Global override removes underline on desktop; bold-blue variant adds it back  
`[CLONE STATUS: ✅ MATCH]`

### 12.2 `.a-default:hover`

```css
/* @media (min-width: 992px) */
.a-default:hover {
  color: rgb(176, 104, 79);   /* brand orange-brown */
  text-decoration: underline;
}
```

**Effect:** Turns warm orange-brown + underline  
`[CLONE STATUS: ✅ MATCH — .a-default:hover]`

---

## 13. Logo Animation (Scroll State)

These are not strictly hover effects but are CSS transitions tied to scroll/UI state:

```css
.cqpsiA {   /* full Velasca wordmark */
  width: 14rem;
  transition: opacity 0.1s cubic-bezier(0, 0, 0, 1);
}
.foPuPB {   /* compact icon version */
  opacity: 0;
  width: 4.75rem;
  transition: opacity 0.1s cubic-bezier(0, 0, 0, 1);
}
.kwIsWn {   /* separator bar */
  transition: color 0.2s cubic-bezier(0, 0, 0, 1);
  transform: rotate(10deg);
}
```

**Effect:** Wordmark and icon logo cross-fade on scroll  
`[CLONE STATUS: ❌ MISSING — clone has no logo swap on scroll]`

---

## Summary — Comparison Table

| # | Component | Live Site Effect | Clone Status |
|---|-----------|-----------------|--------------|
| 1 | Nav links (`.itCOVi`) | color → #185674 | ✅ MATCH |
| 2 | Nav link font-weight on title hover | font-weight 600 | ⚠️ PARTIAL |
| 3 | Help links (`.cKDRCB`) | underline + dark + cubic-bezier | ⚠️ PARTIAL |
| 4 | Header hover global state | lang/phone/sep → dark | ❌ MISSING |
| 5 | Primary button (`.ezsVQF`) | bg #185674 → #427892, 0.2s | ✅ MATCH |
| 6 | Ghost white button (`.gmBPfN`) | transparent → white, text inverts | ✅ MATCH |
| 7 | Category card title (`.GWqXK`) | color + 0.1rem underline | ⚠️ PARTIAL |
| 8 | Category card arrow (`.pathArrow`) | stroke → #185674 | ❌ MISSING |
| 9 | Product image hover fade | opacity 0→1 on `.hover` layer | ❌ MISSING |
| 10 | About us serif title (`.lfLkzu`) | 0.2rem underline, 1.4rem offset | ❌ MISSING |
| 11 | Slider arrows (`.clHfZC`) | gray → slightly darker gray | ⚠️ PARTIAL |
| 12 | Footer nav links | white + underline | 🔄 DIFFERENT |
| 13 | Footer social icons | scale(1.3) @ 81ms | ❌ MISSING |
| 14 | Tab items (`.tab-justify`) | opacity + stroke + bold | ❌ MISSING |
| 15 | Sticker info hotspots | circle fill + label underline | ❌ MISSING |
| 16 | Table row hover | row highlight + cell highlight | ❌ MISSING |
| 17 | Logo scroll swap | opacity crossfade 0.1s cubic-bezier | ❌ MISSING |
| 18 | Newsletter submit | bg lightens | ✅ MATCH |
| 19 | Mega menu items | color + cursor | ✅ MATCH |
| 20 | Account/cart icons | no underline | ✅ MATCH |

### Counts
- ✅ MATCH: 8
- ⚠️ PARTIAL: 4  
- ❌ MISSING: 9
- 🔄 DIFFERENT: 1

---

## Key Fixes Needed in Clone

### Priority 1 — Visually Obvious
1. **Footer social icons** — add `transform: scale(1.3)` with `transition: 80.9ms linear`
2. **Category card arrow** — add `.pathArrow:hover` or `.GWqXK:hover .pathArrow { stroke: #185674 }`
3. **Footer links** — change from opacity reduction to `text-decoration: underline` on hover

### Priority 2 — Fidelity
4. **Help links** — change to `color: rgb(49,51,50) + text-decoration: underline + cubic-bezier(0,0,0,1)` transition
5. **Product image hover** — add `.hover` layer with `opacity: 0 → 1` at `0.2s linear`
6. **About us serif link** — add `text-decoration: underline 0.2rem + text-underline-offset: 1.4rem` on hover

### Priority 3 — Complete Coverage
7. **Header:hover global state** — add CSS that changes language/phone/separator colors when header is hovered
8. **Tab items** — opacity + SVG stroke + font-weight on hover
9. **Sticker hotspots** — circle fill color + label underline
