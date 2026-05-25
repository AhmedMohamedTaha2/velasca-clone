# Hover Effects Documentation

## Velasca Clone Project

**Last Updated:** 2026-05-25  
**Scope:** All hover effects across the entire project  
**Status:** Complete audit of CSS hover states

---



## Overview

This document catalogs all hover effects implemented in the Velasca clone project. All hover effects are **disabled on mobile devices** and only activate on desktop (`@media (min-width: 992px)` or higher).

---

## 1. Button Components

### 1.1 Primary Button (`.btn`, `.btn-default`)

**File:** `css/component-button.css`

- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Background color changes from primary to lighter primary
- **Properties Changed:**
  - `background-color: var(--color-primary)` → `var(--color-primary-light)` (#427892)
  - Text color remains inverted white
- **Duration:** 0.2s ease-in-out

### 1.2 Secondary Button (`.btn-secondary`)

**File:** `css/component-button.css`

- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Background and text color invert
- **Properties Changed:**
  - `background-color: transparent` → `var(--color-primary)` (#185674)
  - `color: var(--color-primary)` → `var(--color-text-inverted)` (white)
- **Duration:** 0.2s ease-in-out

### 1.3 Ghost White Button (`.btn-white`)

**File:** `css/component-button.css`

- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Background becomes solid white, text turns dark
- **Properties Changed:**
  - `background-color: transparent` → `#ffffff`
  - `color: var(--color-text-inverted)` → `#313332` (dark)
  - Border color also changes to white
- **Additional:** Affects child `<span>` text color
- **Duration:** 0.2s ease-in-out

### 1.4 Pill Button (`.btn-pill`)

**File:** `css/component-button.css`

- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Background lightens to lighter primary
- **Properties Changed:**
  - `background-color: var(--color-primary)` → `var(--color-primary-light)` (#427892)
- **Duration:** 0.2s linear (variable: `--transition-micro`)

### 1.5 Ghost White Button (`.btn--ghost-white`)

**File:** `css/main.css`

- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Background becomes white, text becomes dark
- **Properties Changed:**
  - `background: transparent` → `var(--color-bg)` (white)
  - `color: var(--color-text-inv)` → `var(--color-text)` (dark)
  - `border-color` → matches background
- **Duration:** 0.2s

### 1.6 Primary Button (`.btn--primary`)

**File:** `css/main.css`

- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Background lightens
- **Properties Changed:**
  - `background: var(--color-primary)` → `var(--color-primary-light)` (#427892)
- **Duration:** 0.2s

### 1.7 Ghost Button (`.btn--ghost`)

**File:** `css/main.css`

- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Border color darkens
- **Properties Changed:**
  - `border-color: var(--color-border-mid)` → `var(--color-text)` (dark)
- **Duration:** 0.2s

---

## 2. Card Components

### 2.1 Category Card Labels

**File:** `css/component-card.css`

- **Selectors:**
  - `h3.category-card__label:hover`
  - `.category-card:hover h3.category-card__label`
  - `.category-card:focus-within h3.category-card__label`
- **Effect:** Text color changes to theme primary, underline appears
- **Properties Changed:**
  - `color` → `var(--theme-primary-color)` (#185674)
  - `text-decoration: underline`
  - `text-decoration-color: var(--theme-primary-color)`
  - `text-decoration-thickness: 1px`
  - `text-underline-offset: 4px`
- **Duration:** Inherits parent 0.2s ease-in-out

### 2.2 Inspired Card Labels

**File:** `css/component-card.css`

- **Selectors:**
  - `h3.inspired-card-label:hover`
  - `.inspired-card:hover h3.inspired-card-label`
  - `.inspired-card:focus-within h3.inspired-card-label`
- **Effect:** Same as category card labels (text color + underline)
- **Properties Changed:** Identical to 2.1

### 2.3 Editorial Card Headline (Promo Blocks)

**File:** `css/component-card.css`

- **Selector:** `.editorial-section--promo .editorial-card:hover .editorial-card__headline`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Headline color changes to primary
- **Properties Changed:**
  - `color: var(--color-text)` → `var(--color-primary)` (#185674)
- **Duration:** 0.2s linear (variable: `--transition-micro`)

### 2.4 Editorial Card Headline (Redirect Block)

**File:** `css/component-card.css`

- **Selector:** `.editorial-section--redirect .editorial-card:hover .editorial-card__headline`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Headline color changes to primary
- **Properties Changed:** Same as 2.3

---

## 3. Navigation Components

### 3.1 Promotional Banner Links

**File:** `css/component-nav.css`

- **Selector:** `.promotional-banner a:hover`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Opacity reduces
- **Properties Changed:**
  - `opacity: 1` → `0.85`
- **Duration:** 0.2s ease-in-out

### 3.2 Help Menu Links

**File:** `css/component-nav.css`

- **Selector:** `.help-menu__link:hover`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Opacity reduces
- **Properties Changed:**
  - `opacity: 1` → `0.75`
- **Duration:** 0.2s cubic-bezier (transition defined in base)

### 3.3 Navbar Icon Buttons

**File:** `css/component-nav.css`

- **Selector:** `.navbar__icon-btn:hover`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Opacity reduces
- **Properties Changed:**
  - `opacity: 1` → `0.7`
- **Duration:** 0.2s linear

### 3.4 Navigation Links (Main Nav)

**File:** `css/component-nav.css`

- **Selectors:**
  - `.nav-link--void:hover .nav-link__entry`
  - `.conditional-link-void:hover .nav-link__entry`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Link text color changes to teal
- **Properties Changed:**
  - `color` → `var(--header-brand-teal)` (#185674)
- **Duration:** 0.2s cubic-bezier

### 3.5 Nav Link Text

**File:** `css/component-nav.css`

- **Selector:** `.nav-link:hover .nav-link__entry`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Text opacity reduces
- **Properties Changed:**
  - `opacity: 1` → `0.85`
- **Duration:** 0.2s cubic-bezier

### 3.6 Mega Menu Group Title Links

**File:** `css/component-nav.css`

- **Selector:** `.mega-menu__group-title a:hover`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Underline appears on text
- **Properties Changed:**
  - `text-decoration: none` → `underline`
- **Duration:** None (instant)

### 3.7 Mega Menu Links

**File:** `css/component-nav.css`

- **Selector:** `.mega-menu__link:hover`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Underline appears on text
- **Properties Changed:**
  - `text-decoration: none` → `underline`
- **Duration:** None (instant)

### 3.8 Mega Menu Image Links

**File:** `css/component-nav.css`

- **Selector:** `.mega-menu__image-link:hover .mega-menu__image-wrap img`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Image zooms slightly
- **Properties Changed:**
  - `transform: scale(1)` → `scale(1.03)`
- **Duration:** 0.4s ease

### 3.9 Mobile Drawer Navigation Links

**File:** `css/component-nav.css`

- **Selector:** `.mobile-drawer__nav a:hover`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Text color changes to primary
- **Properties Changed:**
  - `color: var(--color-text)` → `var(--color-primary)` (#185674)
- **Duration:** None (inherits parent)

### 3.10 Site Header Utility Links

**File:** `css/main.css`

- **Selector:** `.site-header__util-link:hover`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Opacity reduces
- **Properties Changed:**
  - `opacity: 1` → `0.75`
- **Duration:** 0.2s

### 3.11 Site Header Icon Buttons

**File:** `css/main.css`

- **Selector:** `.site-header__icon-btn:hover`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Opacity reduces
- **Properties Changed:**
  - `opacity: 1` → `0.7`
- **Duration:** 0.2s

### 3.12 Site Header Navigation Links

**File:** `css/main.css`

- **Selector:** `.site-header__nav-link:hover`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Text color opacity changes
- **Properties Changed:**
  - `color: var(--color-text-inv)` → `rgba(255, 255, 255, 0.7)`
- **Duration:** 0.2s

### 3.13 Site Header Scrolled Navigation Links

**File:** `css/main.css`

- **Selector:** `.site-header.is-scrolled .site-header__nav-link:hover`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Text color changes to primary
- **Properties Changed:**
  - `color: var(--color-text)` → `var(--color-primary)` (#185674)
- **Duration:** 0.2s

---

## 4. Footer Components

### 4.1 Footer Breadcrumb Links

**File:** `css/component-footer.css`

- **Selector:** `.footer-breadcrumb a:hover`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Opacity reduces
- **Properties Changed:**
  - `opacity: 1` → `0.7`
- **Duration:** 0.2s linear

### 4.2 Footer Column List Links

**File:** `css/component-footer.css`

- **Selector:** `.footer-col__list a:hover`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Opacity reduces
- **Properties Changed:**
  - `opacity: 1` → `0.7`
- **Duration:** 0.2s linear

### 4.3 Footer Bottom Links

**File:** `css/component-footer.css`

- **Selector:** `.footer-bottom__links a:hover`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Text color changes to white
- **Properties Changed:**
  - `color: var(--color-text-subdued)` → `var(--color-text-inverted)` (white)
- **Duration:** 0.2s linear

### 4.4 Footer Breadcrumb Links (main.css)

**File:** `css/main.css`

- **Selector:** `.footer-breadcrumb a:hover`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Opacity reduces
- **Properties Changed:**
  - `opacity: 1` → `0.5`
- **Duration:** 0.2s

### 4.5 Footer Column Links (main.css)

**File:** `css/main.css`

- **Selector:** `.footer-col__list a:hover`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Opacity reduces
- **Properties Changed:**
  - `opacity: 1` → `0.6`
- **Duration:** 0.2s

### 4.6 Footer Bottom Links (main.css)

**File:** `css/main.css`

- **Selector:** `.footer-bottom__links a:hover`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Text color changes to white
- **Properties Changed:**
  - `color: var(--color-text-sub)` → `var(--color-text-inv)` (white)
- **Duration:** 0.2s

---

## 5. Newsletter Components

### 5.1 Newsletter Submit Button

**File:** `css/section-newsletter.css`

- **Selector:** `.newsletter-submit:hover`
- **Trigger:** `:hover` (no media query restriction)
- **Effect:** Background color lightens
- **Properties Changed:**
  - `background: #185674` → `var(--color-primary-light, #427892)`
- **Duration:** 0.2s linear

### 5.2 Newsletter Consent Links

**File:** `css/section-newsletter.css`

- **Selector:** `.newsletter-consent a:hover`
- **Trigger:** `:hover` (no media query restriction)
- **Effect:** Text color lightens
- **Properties Changed:**
  - `color: var(--color-primary)` → `var(--color-primary-light, #427892)`
- **Duration:** None (instant)

### 5.3 Newsletter Button (main.css)

**File:** `css/main.css`

- **Selector:** `.newsletter__btn:hover`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Background lightens
- **Properties Changed:**
  - `background: var(--color-primary)` → `var(--color-primary-light)`
- **Duration:** 0.2s

---

## 6. Carousel & Slider Components

### 6.1 Editorial Carousel Navigation Buttons

**File:** `css/component-carousel.css`

- **Selector:** `.editorial-carousel__nav:hover`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Color changes from gray to white
- **Properties Changed:**
  - `color: var(--color-neutral-300)` → `var(--color-text-inverted)` (white)
- **Duration:** 0.2s ease-in-out

### 6.2 Editorial Carousel Pagination Bullets

**File:** `css/component-carousel.css`

- **Selector:** `.editorial-carousel .swiper-pagination-bullet`
- **Effect:** Background color transitions on active state
- **Properties Changed:**
  - `background: var(--color-neutral-300)` → `var(--color-text-subdued)` (on active)
  - `opacity: 1` (always)
- **Duration:** 0.25s ease

---

## 7. Product & Category Grid Components

### 7.1 Category Card Image Zoom

**File:** `css/main.css`

- **Selector:** `.category-card:hover .category-card__img-wrap img`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Image zooms slightly
- **Properties Changed:**
  - `transform: scale(1)` → `scale(1.03)`
- **Duration:** 0.5s ease

### 7.2 Product Block Image Zoom

**File:** `css/main.css`

- **Selector:** `.product-block:hover .product-block__img-wrap img`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Image zooms
- **Properties Changed:**
  - `transform: scale(1)` → `scale(1.03)`
- **Duration:** 0.5s ease

### 7.3 Product Block Label Color Change

**File:** `css/main.css`

- **Selector:** `.product-block:hover .product-block__label`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Label text color changes to primary
- **Properties Changed:**
  - `color: var(--color-text)` → `var(--color-primary)` (#185674)
- **Duration:** 0.2s (inherited)

---

## 8. CTA Block Components

### 8.1 CTA Block Media Zoom

**File:** `css/main.css`

- **Selector:** `.cta-block__media:hover img`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Background image zooms
- **Properties Changed:**
  - `transform: scale(1)` → `scale(1.05)`
- **Duration:** 0.6s ease

### 8.2 CTA Block Parent Media Zoom

**File:** `css/main.css`

- **Selector:** `.cta-block:hover .cta-block__media img`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Background image zooms (slightly less than 8.1)
- **Properties Changed:**
  - `transform: scale(1)` → `scale(1.03)`
- **Duration:** 0.6s ease

### 8.3 CTA Block Headline Color Change

**File:** `css/main.css`

- **Selector:** `.cta-block__box:hover .cta-block__headline`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Headline text color changes to primary
- **Properties Changed:**
  - `color: var(--color-text)` → `var(--color-primary)` (#185674)
- **Duration:** 0.2s

---

## 9. Hero & Editorial Section Components

### 9.1 Hero Media Image Zoom

**File:** `css/main.css`

- **Selector:** `.hero__media picture, .hero__media img`
- **Effect:** Image applies zoom effect
- **Properties Changed:**
  - `transition: transform 0.8s ease`
- **Duration:** 0.8s ease (animation applied globally)

### 9.2 Editorial Slide Label Hover

**File:** `css/main.css`

- **Selector:** `.editorial-slide__label:hover`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Background becomes more transparent white
- **Properties Changed:**
  - `background: rgba(0, 0, 0, 0.18)` → `rgba(255, 255, 255, 0.15)`
  - `color: var(--color-text-inverted)` (stays white)
- **Duration:** 0.25s

### 9.3 Editorial Carousel Navigation Arrows

**File:** `css/main.css`

- **Selector:** `.editorial-carousel__nav:hover`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Arrow color changes from gray to white
- **Properties Changed:**
  - `color: var(--color-neutral-300)` → `var(--color-text-inv)` (white)
- **Duration:** 0.2s

---

## 10. Base Element Hover Effects

### 10.1 Global Link Hover

**File:** `css/base.css`

- **Selector:** `a:hover, a:focus`
- **Trigger:** `:hover` on `@media (min-width: 992px)` (exception in media query)
- **Effect:** Text color changes to primary, underline appears
- **Properties Changed:**
  - `color` → `var(--theme-primary-color)` (#185674)
  - `text-decoration: underline`
  - `text-decoration-color: var(--theme-primary-color)`
  - `text-decoration-thickness: 2px`
  - `text-underline-offset: 2px`
- **Duration:** 0.2s linear (inherited from `a` rule)

### 10.2 Default Link Hover

**File:** `css/base.css`

- **Selector:** `.a-default:hover`
- **Trigger:** `:hover` on `@media (min-width: 992px)`
- **Effect:** Text color changes, underline appears
- **Properties Changed:**
  - `color: var(--color-accent)` (stays same)
  - `text-decoration: underline`
- **Duration:** 0.2s linear

---

## Summary Table

| Component      | Effect Type             | Duration  | Desktop Only? |
| -------------- | ----------------------- | --------- | ------------- |
| Buttons        | Color/Background        | 0.2s      | Yes           |
| Cards          | Color/Underline         | 0.2s      | Yes           |
| Navigation     | Opacity/Color/Underline | 0.2s      | Yes           |
| Footer         | Opacity/Color           | 0.2s      | Yes           |
| Newsletter     | Color/Background        | 0.2s      | Mixed\*       |
| Carousel       | Color                   | 0.2-0.25s | Yes           |
| Product Grids  | Zoom/Color              | 0.5s      | Yes           |
| CTA Blocks     | Zoom/Color              | 0.6s      | Yes           |
| Hero/Editorial | Zoom/Opacity            | 0.6-0.8s  | Yes           |
| Links          | Color/Underline         | 0.2s      | Yes           |

\*Newsletter submit button hover doesn't have media query restriction

---

## Design Tokens Used

### Color Transitions

- **Primary → Light Primary:** #185674 → #427892
- **Dark Text:** #313332
- **White Text:** #ffffff
- **Opacity Changes:** 1 → 0.5, 0.6, 0.7, or 0.85

### Transform Effects

- **Image Zoom:** scale(1) → scale(1.03) or scale(1.05)
- **Timing Functions:**
  - `ease-in-out` - Most buttons
  - `ease` - Carousels, image zooms
  - `linear` - Navigation elements
  - `cubic-bezier(0, 0, 0, 1)` - Menu links

---

## Mobile Behavior

All hover effects are **completely disabled on mobile devices** (devices under 992px width). The `@media (min-width: 992px)` breakpoint is critical throughout this project:

- Touch devices don't support hover states
- All hover styles are wrapped in desktop breakpoint queries
- Fallback styling works without hover effects

---

## Implementation Notes

1. **Consistency:** All button hovers use 0.2s transitions
2. **Specificity:** Some hover effects are overridden based on page state (is-scrolled, is-menu-open, etc.)
3. **Performance:** Uses `transition` shorthand; `transform` properties use GPU acceleration
4. **Accessibility:** All hover effects have visible focus states in base styles
