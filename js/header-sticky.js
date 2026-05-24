(function () {
  const header = document.getElementById('site-header');
  const helpMenu = document.getElementById('help-menu');
  const navbar = document.getElementById('site-navbar');
  const shortLogo = document.getElementById('navbar-short-logo');
  const isHomepage = document.body.classList.contains('template-index');

  if (!header || !isHomepage) {
    if (header) header.classList.add('is-scrolled', 'is-nav-solid', 'is-nav-docked');
    return;
  }

  const PROMO_SOLID_THRESHOLD = 5;
  const NAV_SOLID_THRESHOLD = 80;
  const NAV_DOCK_OFFSET = 90;
  const SHORT_LOGO_THRESHOLD = 200;

  /** Match velasca.com stepped header scroll (Playwright audit). */
  function getHelpTop(y) {
    if (y <= 0) return 0;
    if (y < 11) return -Math.min(y, 5);
    if (y < NAV_SOLID_THRESHOLD) return -11;
    if (y < NAV_DOCK_OFFSET + 1) return -80;
    return -NAV_DOCK_OFFSET;
  }

  function getNavTop(y) {
    if (y <= 0) return NAV_DOCK_OFFSET;
    if (y < 11) return NAV_DOCK_OFFSET - Math.min(y, 5);
    if (y < NAV_SOLID_THRESHOLD) return 79;
    if (y < NAV_DOCK_OFFSET + 1) return 10;
    return 0;
  }

  function updateHeader() {
    const y = window.scrollY;

    header.classList.toggle('is-scrolled', y > PROMO_SOLID_THRESHOLD);
    header.classList.toggle('is-nav-solid', y >= NAV_SOLID_THRESHOLD);
    header.classList.toggle('is-nav-docked', y >= NAV_DOCK_OFFSET);

    if (helpMenu) {
      helpMenu.style.top = `${getHelpTop(y)}px`;
    }

    if (navbar) {
      navbar.style.top = `${getNavTop(y)}px`;
    }

    if (shortLogo) {
      shortLogo.classList.toggle('is-visible', y >= SHORT_LOGO_THRESHOLD);
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader, { passive: true });
  updateHeader();
})();
