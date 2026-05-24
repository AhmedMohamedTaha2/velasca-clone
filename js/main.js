/* ─────────────────────────────────
   HEADER SCROLL (velasca.com parity)
───────────────────────────────── */
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

/* ─────────────────────────────────
   BACK TO TOP (audit §5.9)
───────────────────────────────── */
(function () {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  function toggle() {
    btn.classList.toggle('is-visible', window.scrollY > 600);
  }

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  });

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
})();

/* ─────────────────────────────────
   MOBILE DRAWER
───────────────────────────────── */
(function () {
  const toggle = document.getElementById('menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const close = document.getElementById('drawer-close');
  if (!toggle || !drawer) return;

  const open = () => {
    drawer.classList.add('is-open');
    drawer.removeAttribute('aria-hidden');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const shut = () => {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', open);
  close?.addEventListener('click', shut);
  overlay?.addEventListener('click', shut);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') shut();
  });
})();

/* ─────────────────────────────────
   NEWSLETTER FORM
───────────────────────────────── */
(function () {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    const btn = form.querySelector('.newsletter-submit');
    if (!input || !btn) return;

    if (!input.value.includes('@')) {
      input.classList.add('is-invalid');
      return;
    }

    input.classList.remove('is-invalid');
    btn.setAttribute('aria-label', 'Subscribed');
    btn.disabled = true;
    input.disabled = true;
  });
})();
