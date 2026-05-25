/**
 * Velasca-style desktop mega-menu (hover + height spring-like animation).
 */
(function () {
  const MENU_IDS = ['shoes', 'clothing', 'accessories', 'collections'];
  const DURATION_MS = 300;
  /* Framer Motion spring (bounce: 0, duration: 0.3) approximation */
  const EASE_SPRING = (t) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : 1 - Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4);
  };

  const header = document.getElementById('site-header');
  const menuBg = document.getElementById('navbar-menu-bg');
  const panelBg = document.getElementById('mega-menu-bg');
  const panelInner = document.getElementById('mega-menu-inner');
  const navItems = document.querySelectorAll('.navbar__item[data-menu]');

  if (!header || !menuBg || !panelBg || !panelInner || !navItems.length) return;
  if (!window.VELASCA_MEGA_MENU) return;

  const menus = window.VELASCA_MEGA_MENU;
  let activeId = null;
  let animFrame = null;
  let isOpen = false;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderGroup(group) {
    const title = escapeHtml(group.title);
    const titleHref = group.href ? ` href="${escapeHtml(group.href)}"` : '';
    const links = (group.links || [])
      .map((link) => {
        const cls = link.viewAll ? ' mega-menu__link--view-all' : '';
        return `<li><a class="mega-menu__link${cls}" href="${escapeHtml(link.href)}">${escapeHtml(link.title)}</a></li>`;
      })
      .join('');

    const children =
      links.length > 0
        ? `<ul class="mega-menu__children">${links}</ul>`
        : '';

    return `
      <div class="mega-menu__group">
        <h3 class="mega-menu__group-title">
          <a${titleHref}>${title}</a>
        </h3>
        ${children}
      </div>`;
  }

  function renderImageCard(img) {
    return `
      <a class="mega-menu__image-link" href="${escapeHtml(img.href)}">
        <span class="mega-menu__image-wrap">
          <img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt)}" loading="eager" width="468" height="585" />
        </span>
        <span class="mega-menu__image-label">${escapeHtml(img.label)}</span>
      </a>`;
  }

  function renderMenu(id) {
    const data = menus[id];
    if (!data) return '';

    const columns = (data.columns || [])
      .map(
        (col) => `
        <div class="mega-menu__column MenuColumn">
          ${col.groups.map(renderGroup).join('')}
        </div>`
      )
      .join('');

    const images = [];
    if (data.image) images.push(data.image);
    if (data.images) images.push(...data.images);

    const imageCol =
      images.length > 0
        ? `<div class="mega-menu__column mega-menu__column--images">
            ${images.map(renderImageCard).join('')}
           </div>`
        : '';

    return `
      <div class="mega-menu__columns">
        ${columns}
        ${imageCol}
      </div>`;
  }

  function cancelAnimation() {
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
  }

  function animateHeight(from, to, onDone) {
    cancelAnimation();
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / DURATION_MS);
      const h = from + (to - from) * EASE_SPRING(t);
      panelBg.style.height = `${h}px`;

      if (t < 1) {
        animFrame = requestAnimationFrame(tick);
      } else {
        animFrame = null;
        panelBg.style.height = to === 0 ? '0px' : `${to}px`;
        onDone?.();
      }
    }

    animFrame = requestAnimationFrame(tick);
  }

  function measurePanelHeight() {
    panelBg.style.height = 'auto';
    const h = panelBg.scrollHeight;
    panelBg.style.height = isOpen ? `${h}px` : '0px';
    return h;
  }

  function setActiveNavItem(id) {
    navItems.forEach((li) => {
      const entry = li.querySelector('.nav-link__entry');
      const isActive = li.dataset.menu === id;
      li.classList.toggle('is-active', isActive);
      entry?.classList.toggle('is-active', isActive);
    });
  }

  function openMenu(id) {
    if (!menus[id]) return;

    const wasOpen = isOpen;
    const switching = wasOpen && activeId !== id;

    activeId = id;
    isOpen = true;

    panelInner.innerHTML = renderMenu(id);
    setActiveNavItem(id);

    header.classList.add('is-menu-open');
    panelBg.setAttribute('aria-hidden', 'false');
    panelBg.classList.add('is-open');

    const targetH = measurePanelHeight();
    const currentH = panelBg.offsetHeight;

    if (!wasOpen) {
      panelBg.style.height = '0px';
      animateHeight(0, targetH);
    } else if (switching) {
      animateHeight(currentH, targetH);
    } else {
      panelBg.style.height = `${targetH}px`;
    }
  }

  function closeMenu() {
    if (!isOpen) return;

    const currentH = panelBg.offsetHeight;
    activeId = null;
    isOpen = false;

    setActiveNavItem(null);
    header.classList.remove('is-menu-open');

    animateHeight(currentH, 0, () => {
      panelBg.classList.remove('is-open');
      panelBg.setAttribute('aria-hidden', 'true');
      panelInner.innerHTML = '';
      panelBg.style.height = '0px';
    });
  }

  navItems.forEach((li) => {
    const id = li.dataset.menu;
    const trigger = li.querySelector('.nav-link, .nav-link--void, .conditional-link-void');

    trigger?.addEventListener('mouseenter', () => openMenu(id));
    li.addEventListener('focusin', () => openMenu(id));
  });

  const headerOverlay = document.querySelector('.site-header__overlay');

  headerOverlay?.addEventListener('mouseenter', () => {
    header.classList.add('is-menu-hover');
  });

  headerOverlay?.addEventListener('mouseleave', (e) => {
    if (!headerOverlay.contains(e.relatedTarget)) {
      header.classList.remove('is-menu-hover');
    }
  });

  menuBg.addEventListener('mouseleave', (e) => {
    if (!menuBg.contains(e.relatedTarget)) {
      closeMenu();
    }
  });

  document.querySelectorAll('.navbar__center li:not([data-menu])').forEach((li) => {
    li.addEventListener('mouseenter', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (isOpen && activeId) {
      panelBg.style.height = 'auto';
      panelBg.style.height = `${panelBg.scrollHeight}px`;
    }
  });
})();
