/* ═══════════════════════════════════════════════════════════════════ */
/* MOBILE MENU TOGGLE                                                  */
/* ═══════════════════════════════════════════════════════════════════ */

(function () {
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const menuClose = document.querySelector("[data-menu-close]");
  const menuLinks = mobileMenu?.querySelectorAll("a") || [];

  if (!menuToggle || !mobileMenu) return;

  // Toggle menu
  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.add("is-open");
    document.body.style.overflow = "hidden";
  });

  // Close menu
  menuClose?.addEventListener("click", () => {
    mobileMenu.classList.remove("is-open");
    document.body.style.overflow = "";
  });

  // Close on link click
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("is-open");
      document.body.style.overflow = "";
    });
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (
      !mobileMenu.contains(e.target) &&
      !menuToggle.contains(e.target) &&
      mobileMenu.classList.contains("is-open")
    ) {
      mobileMenu.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  });
})();
