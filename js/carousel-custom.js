  const DURATION = 4000;
 
  const slides = document.querySelectorAll('.editorial-slide');
  const dotsContainer = document.getElementById('dots');
  const prevBtn = document.querySelector('.editorial-carousel__nav--prev');
  const nextBtn = document.querySelector('.editorial-carousel__nav--next');
 
  let current = 0;
  let timer = null;
 
  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'editorial-dot' + (i === 0 ? ' active' : '');
    dot.style.setProperty('--slide-duration', DURATION + 'ms');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });
 
  const dots = document.querySelectorAll('.editorial-dot');
 
  function reset() {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => {
      d.classList.remove('active');
      // force reflow to restart animation
      void d.offsetWidth;
    });
  }
 
  function goTo(index) {
    clearTimeout(timer);
    reset();
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    timer = setTimeout(() => goTo(current + 1), DURATION);
  }
 
  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
 
  // Keyboard nav
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });
 
  // Start
  goTo(0);