const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('https://www.velasca.com', { waitUntil: 'networkidle', timeout: 60000 });

  // Scroll to trigger lazy rendering
  await page.evaluate(() => window.scrollTo(0, 2000));
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);

  const data = await page.evaluate(() => {
    const headerDiv = document.querySelector('[data-testid="desktop-navigation"]');
    const headerDivH = headerDiv ? headerDiv.getBoundingClientRect().height : 'not found';

    const promoBanner = document.querySelector('.styles__PromotionalBannerBackground-velasca__sc-5ynxgb-0');
    const promoBannerH = promoBanner ? promoBanner.getBoundingClientRect().height : 'not found';

    const helpMenu = document.querySelector('.styles__HelpMenu-velasca__sc-qjgftd-20');
    const helpMenuH = helpMenu ? helpMenu.getBoundingClientRect().height : 'not found';

    const nav = document.querySelector('nav');
    const navH = nav ? nav.getBoundingClientRect().height : 'not found';

    const bg = document.querySelector('.styles__Background-velasca__sc-qjgftd-5');
    const bgH = bg ? bg.getBoundingClientRect().height : 'not found';

    const heroSection = document.getElementById('shopify-section-homepage-hero');
    let heroSectionH = heroSection ? heroSection.getBoundingClientRect().height : 'not found';
    let heroChildren = [];
    if (heroSection) {
      heroChildren = Array.from(heroSection.querySelectorAll('*'))
        .map(el => ({ tag: el.tagName, class: el.className.toString().substring(0,100), h: el.getBoundingClientRect().height }))
        .filter(x => x.h > 100)
        .slice(0, 15);
    }

    const helpLabel = document.querySelector('.styles__HelpLabel-velasca__sc-qjgftd-17');
    const shippingText = helpLabel ? helpLabel.innerText : 'not found';

    const headerChildren = headerDiv ? Array.from(headerDiv.children).map(c => ({
      tag: c.tagName, class: c.className.toString().substring(0, 150), height: c.getBoundingClientRect().height
    })) : [];

    // Big image/video elements for hero
    const bigEls = Array.from(document.querySelectorAll('video, img'))
      .map(el => ({ tag: el.tagName, src: (el.src||el.currentSrc||'').substring(0,80), h: el.getBoundingClientRect().height, top: el.getBoundingClientRect().top }))
      .filter(x => x.h > 200)
      .slice(0, 10);

    // Newsletter section
    const nlSection = document.getElementById('shopify-section-newsletter-section');
    let nlInfo = null;
    if (nlSection) {
      nlInfo = {
        height: nlSection.getBoundingClientRect().height,
        html: nlSection.innerHTML.substring(0, 3000),
      };
    }

    // Footer summary
    const footer = document.querySelector('footer');
    const footerChildren = footer ? Array.from(footer.querySelectorAll('div > div')).slice(0, 5).map(c => ({
      class: c.className.toString().substring(0,100), children: c.children.length
    })) : [];

    // All divs with height > 30 at top of page for header breakdown
    const topDivs = Array.from(document.querySelectorAll('body > *')).map(el => ({
      tag: el.tagName, id: el.id, class: el.className.toString().substring(0,100), h: el.getBoundingClientRect().height
    }));

    return {
      headerDivH,
      promoBannerH,
      helpMenuH,
      navH,
      bgH,
      heroSectionH,
      heroChildren,
      shippingText,
      headerChildren,
      bigEls,
      nlInfo,
      footerChildren,
      topDivs,
    };
  });

  const fs = require('fs');
  fs.writeFileSync('D:\\Claude\\velasca-clone\\measurements2.json', JSON.stringify(data, null, 2));
  console.log('Done');
  await browser.close();
})();
