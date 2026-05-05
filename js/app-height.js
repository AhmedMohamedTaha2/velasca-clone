(function () {
  function setAppHeight() {
    const vh = window.innerHeight;
    document.documentElement.style.setProperty("--app-height", `${vh}px`);
  }

  window.addEventListener("resize", setAppHeight);
  window.addEventListener("load", setAppHeight);
  setAppHeight();
})();
