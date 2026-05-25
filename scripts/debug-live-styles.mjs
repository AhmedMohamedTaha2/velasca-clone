import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://www.velasca.com/', { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(2000);
const accept = page.locator('#onetrust-accept-btn-handler');
if (await accept.count()) await accept.click({ timeout: 5000 }).catch(() => {});
await page.waitForTimeout(1000);

for (const label of ['Shoes', 'Collections']) {
  await page.mouse.move(5, 5);
  await page.waitForTimeout(200);
  await page
    .locator('[data-testid="desktop-navigation"]')
    .getByText(label, { exact: true })
    .first()
    .hover();
  await page.waitForTimeout(800);

  const data = await page.evaluate((menuLabel) => {
    const panel = document.querySelector('[data-testid="menu-links"]');
    const pick = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        text: (el.textContent || '').trim().slice(0, 50),
        color: cs.color,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        fontFamily: cs.fontFamily.split(',')[0],
        textTransform: cs.textTransform,
        textDecoration: cs.textDecoration,
        letterSpacing: cs.letterSpacing,
        lineHeight: cs.lineHeight,
        w: Math.round(r.width),
        h: Math.round(r.height),
        transform: cs.transform,
        transition: cs.transition,
        objectFit: cs.objectFit,
        marginLeft: cs.marginLeft,
        borderLeft: cs.borderLeft,
        paddingLeft: cs.paddingLeft,
      };
    };

    const columns = [...panel.querySelectorAll('[class*="MenuColumn"]')];
    const imageLinks = [...panel.querySelectorAll('[class*="ImageLink"]')];
    const skeletons = [...panel.querySelectorAll('[class*="ImageWithSkeleton"]')];

    return {
      menuLabel,
      columnRects: columns.map((c, i) => ({
        i,
        hasImg: !!c.querySelector('img'),
        ...pick(c),
      })),
      skeletons: skeletons.map(pick),
      imageLinks: imageLinks.map((a) => {
        const labelEl =
          a.querySelector('[class*="ImageLabel"]') ||
          a.querySelector('span:last-child') ||
          [...a.childNodes].find((n) => n.nodeType === 3);
        const img = a.querySelector('img');
        return {
          link: pick(a),
          labelEl: labelEl && labelEl.nodeType === 1 ? pick(labelEl) : { text: (a.textContent || '').trim() },
          img: img ? pick(img) : null,
          skeleton: pick(a.querySelector('[class*="ImageWithSkeleton"]')),
        };
      }),
    };
  }, label);

  console.log('\n===', label, '===\n', JSON.stringify(data, null, 2));
}

// image hover on shoes
await page.mouse.move(5, 5);
await page.waitForTimeout(200);
await page
  .locator('[data-testid="desktop-navigation"]')
  .getByText('Shoes', { exact: true })
  .first()
  .hover();
await page.waitForTimeout(600);
const card = page.locator('[data-testid="menu-links"] [class*="ImageLink"]').first();
await card.hover();
await page.waitForTimeout(400);
const hoverImg = await page.evaluate(() => {
  const img = document.querySelector('[data-testid="menu-links"] [class*="ImageLink"] img');
  const cs = getComputedStyle(img);
  return { transform: cs.transform, transition: cs.transition, opacity: cs.opacity };
});
console.log('\n=== Shoes image hover ===\n', hoverImg);

// link hover
const link = page.locator('[data-testid="menu-links"] [class*="SecondLevelMenuChildren"] a').first();
await link.hover();
await page.waitForTimeout(200);
const linkHover = await page.evaluate(() => {
  const el = document.querySelector('[data-testid="menu-links"] [class*="SecondLevelMenuChildren"] a');
  const cs = getComputedStyle(el);
  return { color: cs.color, textDecoration: cs.textDecoration };
});
console.log('\n=== Child link hover ===\n', linkHover);

await browser.close();
