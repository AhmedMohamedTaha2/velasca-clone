document.addEventListener('DOMContentLoaded', () => {
  const editorialEl = document.querySelector('.editorial-swiper');
  if (!editorialEl || typeof Swiper === 'undefined') return;

  new Swiper('.editorial-swiper', {
    loop: true,
    speed: 300,
    slidesPerView: 1,
    spaceBetween: 0,
    allowTouchMove: true,
    observer: true,
    observeParents: true,
    resizeObserver: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: '.editorial-carousel__nav--next',
      prevEl: '.editorial-carousel__nav--prev',
    },
    pagination: {
      el: '.editorial-carousel .swiper-pagination',
      clickable: true,
    },
  });
});
