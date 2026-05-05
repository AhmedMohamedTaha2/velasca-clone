/* ─────────────────────────────────
   STICKY HEADER (also in header-sticky.js but this
   handles the is-scrolled class for instant feedback)
───────────────────────────────── */
(function () {
  const header = document.getElementById('site-header');
  if (!header) return;
  const hero = document.querySelector('.hero');
  const threshold = hero ? hero.offsetHeight * 0.45 : 280;
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > threshold);
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ─────────────────────────────────
   MOBILE DRAWER
───────────────────────────────── */
(function () {
  const toggle  = document.getElementById('menu-toggle');
  const drawer  = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const close   = document.getElementById('drawer-close');
  if (!toggle || !drawer) return;

  const open  = () => { drawer.classList.add('is-open');  drawer.removeAttribute('aria-hidden'); toggle.setAttribute('aria-expanded', 'true');  document.body.style.overflow = 'hidden'; };
  const shut  = () => { drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true'); toggle.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };

  toggle.addEventListener('click', open);
  close?.addEventListener('click', shut);
  overlay?.addEventListener('click', shut);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });
})();

/* ─────────────────────────────────
   NEWSLETTER FORM
───────────────────────────────── */
(function () {
  const form = document.querySelector('.newsletter__form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('.newsletter__input');
    const btn   = form.querySelector('.newsletter__btn');
    if (!input.value.includes('@')) {
      input.style.outline = '2px solid #e07070';
      return;
    }
    input.style.outline = '';
    btn.innerHTML = '✓';
    btn.disabled  = true;
    input.disabled = true;
  });
})();

/* ─────────────────────────────────
   COOKIE BANNER
───────────────────────────────── */
(function () {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  if (localStorage.getItem('velasca_cookie')) return;
  setTimeout(() => banner.classList.add('is-visible'), 1400);
  const dismiss = () => { banner.classList.remove('is-visible'); localStorage.setItem('velasca_cookie', '1'); };
  document.getElementById('cookie-accept')?.addEventListener('click', dismiss);
  document.getElementById('cookie-customise')?.addEventListener('click', dismiss);
})();
