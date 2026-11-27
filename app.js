(() => {
  "use strict";

  const toggle = document.getElementById("menu-toggle");
  const backdrop = document.getElementById("sidebar-backdrop");
  const sidebar = document.getElementById("sidebar");
  const mobileQuery = window.matchMedia("(max-width: 991.98px)");

  function closeMenu(returnFocus = false) {
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    if (isOpen) sidebar.querySelector(".side-link:not(:disabled)")?.focus();
  });

  backdrop.addEventListener("click", () => closeMenu(true));

  sidebar.addEventListener("click", event => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
      closeMenu(true);
    }
  });

  mobileQuery.addEventListener("change", event => {
    if (!event.matches) closeMenu();
  });
})();