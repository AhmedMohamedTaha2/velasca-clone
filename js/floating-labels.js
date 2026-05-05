(function () {
  const formFields = document.querySelectorAll(".form-field");

  formFields.forEach((field) => {
    const input = field.querySelector("input, textarea");
    if (!input) return;

    function updateLabel() {
      if (input.value.trim().length > 0) {
        field.classList.add("is-active");
      } else {
        field.classList.remove("is-active");
      }
    }

    input.addEventListener("input", updateLabel);
    input.addEventListener("blur", updateLabel);
    input.addEventListener("focus", updateLabel);

    // Initial check
    updateLabel();
  });
})();
