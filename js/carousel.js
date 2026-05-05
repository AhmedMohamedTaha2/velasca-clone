/* ═══════════════════════════════════════════════════════════════════ */
/* CAROUSEL / SLIDER FUNCTIONALITY                                    */
/* ═══════════════════════════════════════════════════════════════════ */

(function () {
  class Carousel {
    constructor(containerSelector) {
      this.container = document.querySelector(containerSelector);
      if (!this.container) return;

      this.slides = this.container.querySelectorAll(".carousel-slide");
      this.dots = this.container.querySelectorAll(".carousel-dot");
      this.prevBtn = this.container.querySelector(".carousel-nav.prev");
      this.nextBtn = this.container.querySelector(".carousel-nav.next");

      if (this.slides.length === 0) return;

      this.currentIndex = 0;
      this.autoplayInterval = null;
      this.autoplayDelay = 5000;

      this.init();
    }

    init() {
      // Show first slide
      this.showSlide(0);

      // Event listeners
      if (this.prevBtn)
        this.prevBtn.addEventListener("click", () => this.prevSlide());
      if (this.nextBtn)
        this.nextBtn.addEventListener("click", () => this.nextSlide());

      this.dots.forEach((dot, index) => {
        dot.addEventListener("click", () => this.showSlide(index));
      });

      // Autoplay
      this.startAutoplay();
      this.container.addEventListener("mouseenter", () => this.stopAutoplay());
      this.container.addEventListener("mouseleave", () => this.startAutoplay());
    }

    showSlide(index) {
      // Remove active class from all slides and dots
      this.slides.forEach((slide) => slide.classList.remove("active"));
      this.dots.forEach((dot) => dot.classList.remove("active"));

      // Add active class to current slide and dot
      this.slides[index].classList.add("active");
      this.dots[index]?.classList.add("active");

      this.currentIndex = index;
    }

    nextSlide() {
      const nextIndex = (this.currentIndex + 1) % this.slides.length;
      this.showSlide(nextIndex);
      this.resetAutoplay();
    }

    prevSlide() {
      const prevIndex =
        this.currentIndex === 0
          ? this.slides.length - 1
          : this.currentIndex - 1;
      this.showSlide(prevIndex);
      this.resetAutoplay();
    }

    startAutoplay() {
      this.autoplayInterval = setInterval(() => {
        this.nextSlide();
      }, this.autoplayDelay);
    }

    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
    }

    resetAutoplay() {
      this.stopAutoplay();
      this.startAutoplay();
    }

    destroy() {
      this.stopAutoplay();
      if (this.prevBtn)
        this.prevBtn.removeEventListener("click", () => this.prevSlide());
      if (this.nextBtn)
        this.nextBtn.removeEventListener("click", () => this.nextSlide());
    }
  }

  // Initialize all carousels on page
  document.addEventListener("DOMContentLoaded", function () {
    const carousels = document.querySelectorAll(".carousel-container");
    carousels.forEach((carousel) => {
      new Carousel(carousel.parentElement.querySelector(".carousel-container"));
    });
  });

  // Export for global use
  window.Carousel = Carousel;
})();
