(function () {
  const header = document.getElementById('site-header');
  if (!header) return;

  const hero = document.querySelector('.hero');
  const heroH = hero ? hero.offsetHeight * 0.5 : 300;

  function update() {
    if (window.scrollY > heroH) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();
