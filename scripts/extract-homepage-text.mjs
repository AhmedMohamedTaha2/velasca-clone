/**
 * Scroll velasca.com homepage and extract copy by section.
 * Output: Ai Guideline/velasca-homepage-text.md + .json
 */
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const OUT_MD = path.join('Ai Guideline', 'velasca-homepage-text.md');
const OUT_JSON = path.join('Ai Guideline', 'velasca-homepage-text.json');
const URL = 'https://www.velasca.com/';

async function scrollToBottom(page) {
  let prev = -1;
  for (let i = 0; i < 35; i++) {
    await page.evaluate(() => window.scrollBy(0, Math.floor(window.innerHeight * 0.9)));
    await page.waitForTimeout(350);
    const y = await page.evaluate(() => window.scrollY);
    if (y === prev) break;
    prev = y;
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
}

async function extract(page) {
  return page.evaluate(() => {
    const t = (s) => (s || '').replace(/\s+/g, ' ').trim();

    const promo = document.querySelector('[class*="PromotionalBanner"]');
    const navLinks = [...document.querySelectorAll('[class*="Navbar"] a')].map((a) => ({
      text: t(a.textContent),
      href: a.getAttribute('href'),
    }));

    const utilTexts = ['United States', 'Join the community', 'WhatsApp'];
    const utilAnchors = [...document.querySelectorAll('header a')].filter((a) => {
      const text = t(a.textContent);
      return (
        text.includes('United States') ||
        text.includes('Join the community') ||
        text.includes('929') ||
        text === 'WhatsApp'
      );
    });

    const heroCta = document.querySelector('[class*="PageIntro"] a, [class*="Hero"] a');
    const grids = [...document.querySelectorAll('[class*="CategoriesGridstyle__Container"]')];
    const categoryTrio = grids[0]
      ? [...grids[0].querySelectorAll('h3')].map((h) => t(h.textContent))
      : [];
    const getInspiredGrid = grids.find((g) => g.querySelector('h2'));
    const getInspired = {
      heading: getInspiredGrid ? t(getInspiredGrid.querySelector('h2')?.textContent) : 'Get inspired',
      cards: getInspiredGrid
        ? [...getInspiredGrid.querySelectorAll('h3')].map((h) => t(h.textContent))
        : [],
    };

    const slides = [...document.querySelectorAll('.swiper-slide a')].map((a) => t(a.textContent));
    const carousel = [...new Set(slides.filter((s) => s.length > 3 && s.length < 60))];

    const block = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const h3 = el.querySelector('h3');
      const h2 = el.querySelector('h2');
      return {
        eyebrow: h3 ? t(h3.textContent) : null,
        headline: h2 ? t(h2.textContent) : null,
      };
    };

    const newsletterEl = document.querySelector('#newsletter-section, [class*="NewsletterSection"]');
    const newsletter = newsletterEl
      ? {
          heading: t(newsletterEl.querySelector('h2')?.textContent),
          body: t(newsletterEl.querySelector('p')?.textContent),
          placeholder: newsletterEl.querySelector('input')?.placeholder || '',
          consent: [...newsletterEl.querySelectorAll('p')]
            .map((p) => t(p.textContent))
            .filter((x) => x.includes('agree') || x.includes('terms'))
            .join(' '),
        }
      : null;

    const footerEl = document.querySelector('#footer-react, [role="contentinfo"]');
    const footerCols = footerEl
      ? [...footerEl.querySelectorAll('h3')].map((h) => {
          const heading = t(h.textContent);
          const parent = h.closest('div') || h.parentElement;
          const body = parent?.querySelector('p');
          const links = parent
            ? [...parent.querySelectorAll('a')].map((a) => t(a.textContent))
            : [];
          return { heading, body: body ? t(body.textContent) : null, links };
        })
      : [];

    const footerText = t(footerEl?.innerText || '');
    const copyrightMatch = footerText.match(/©[^|]+?(?=Terms|$)/);

    return {
      title: document.title,
      metaDescription: document.querySelector('meta[name="description"]')?.content || '',
      promotionalBanner: t(promo?.innerText),
      utility: utilAnchors.map((a) => ({ text: t(a.textContent), href: a.getAttribute('href') })),
      navigation: navLinks.filter((l) => l.text && l.text.length < 30),
      hero: { cta: t(heroCta?.textContent), href: heroCta?.getAttribute('href') },
      categoryTrio,
      carousel,
      getInspired,
      editorialBlocks: {
        about: block('[class*="AboutUs"]'),
        stores: block('[class*="Bottegas"]'),
        women: block('[class*="RedirectBlock"]'),
      },
      newsletter,
      footer: {
        breadcrumb: 'Home',
        columns: footerCols,
        copyright: copyrightMatch ? t(copyrightMatch[0]) : null,
        legal: ['Terms & Conditions', 'Privacy Policy', 'Cookie Policy', 'Whistleblowing'],
      },
    };
  });
}

function toMarkdown(data) {
  const lines = [
    '# Velasca Homepage — Live Text Extract',
    '',
    `> **Source:** [${URL}](${URL})`,
    `> **Extracted:** ${new Date().toISOString().slice(0, 10)} via Playwright (desktop 1440×900, full-page scroll)`,
    '',
    'Use this file as the canonical copy reference for `index.html`.',
    '',
    '---',
    '',
    '## Page meta',
    '',
    '| Field | Live text |',
    '|-------|-----------|',
    `| **Title** | ${data.title} |`,
    `| **Meta description** | ${data.metaDescription} |`,
    '',
    '---',
    '',
    '## Promotional banner',
    '',
    data.promotionalBanner,
    '',
    '---',
    '',
    '## Header — utility row',
    '',
    '| Element | Text |',
    '|---------|------|',
  ];
  for (const u of data.utility) {
    lines.push(`| ${u.text.split(':')[0].trim()} | ${u.text} |`);
  }
  lines.push('', '---', '', '## Header — main navigation', '', '| Link | href |', '|------|------|');
  for (const n of data.navigation) {
    if (['Velasca', 'shoes', 'clothing'].includes(n.text)) continue;
    lines.push(`| ${n.text} | \`${n.href}\` |`);
  }
  lines.push('', '> **Note:** Live site does **not** include a “Collections” nav item.', '');
  lines.push('---', '', '## Hero', '', `**CTA:** ${data.hero.cta} → \`${data.hero.href}\``, '');
  lines.push('---', '', '## Category trio', '', '| Card | Label |', '|------|-------|');
  data.categoryTrio.forEach((label, i) => lines.push(`| ${i + 1} | ${label} |`));
  lines.push('', '---', '', '## Editorial carousel (slide CTAs)', '');
  data.carousel.forEach((s, i) => lines.push(`${i + 1}. ${s}  `));
  lines.push('', '---', '', `## Get inspired`, '', `**Heading:** ${data.getInspired.heading}`, '');
  lines.push('| Card | Label |', '|------|-------|');
  data.getInspired.cards.forEach((label, i) => lines.push(`| ${i + 1} | ${label} |`));
  lines.push('', '---', '', '## Editorial promo blocks', '', '| Block | Eyebrow | Headline |', '|-------|---------|----------|');
  const blocks = [
    ['About', data.editorialBlocks.about],
    ['Stores', data.editorialBlocks.stores],
    ['Women', data.editorialBlocks.women],
  ];
  for (const [name, b] of blocks) {
    if (b) lines.push(`| ${name} | ${b.eyebrow} | ${b.headline} |`);
  }
  if (data.newsletter) {
    lines.push('', '---', '', '## Newsletter', '', '| Element | Text |', '|---------|------|');
    lines.push(`| **Heading** | ${data.newsletter.heading} |`);
    lines.push(`| **Body** | ${data.newsletter.body} |`);
    lines.push(`| **Placeholder** | ${data.newsletter.placeholder} |`);
    lines.push(`| **Consent** | ${data.newsletter.consent} |`);
  }
  lines.push('', '---', '', '## Footer', '', '**Breadcrumb:** Home', '');
  for (const col of data.footer.columns) {
    lines.push(`### ${col.heading}`, '');
    if (col.body) lines.push(col.body, '');
    if (col.links?.length) {
      for (const l of col.links) lines.push(`- ${l}  `);
      lines.push('');
    }
  }
  if (data.footer.copyright) {
    lines.push('### Copyright', '', data.footer.copyright, '');
  }
  lines.push('### Legal links', '');
  for (const l of data.footer.legal) lines.push(`- ${l}  `);
  lines.push('');
  return lines.join('\n');
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  await scrollToBottom(page);
  const data = await extract(page);
  await browser.close();

  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  fs.writeFileSync(OUT_MD, toMarkdown(data), 'utf8');
  fs.writeFileSync(OUT_JSON, JSON.stringify(data, null, 2), 'utf8');
  fs.writeFileSync('velasca-homepage-text.md', fs.readFileSync(OUT_MD), 'utf8');
  console.log('Wrote', OUT_MD, OUT_JSON, 'velasca-homepage-text.md');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
