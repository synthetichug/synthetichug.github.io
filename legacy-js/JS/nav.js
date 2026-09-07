// Centerwell behavior: JS-driven view switching (no URL/hash change — see
// CSS/nav.css, which keys off body[data-view] instead of :target) + dim
// fallback for browsers without :has().
window.Vestiges = window.Vestiges || {};
(function () {
  const tiles = Array.from(document.querySelectorAll(".cw-btn"));
  const body = document.body;
  const DEFAULT_VIEW = "home";

  function keyFromHref(href) {
    return (href || "").replace("#", "") || DEFAULT_VIEW;
  }

  function setView(key) {
    body.setAttribute("data-view", key);
    tiles.forEach(function (t) {
      t.classList.toggle("is-active", keyFromHref(t.getAttribute("href")) === key);
    });
  }

  function bindClicks() {
    tiles.forEach(function (t) {
      t.addEventListener("click", function (e) {
        e.preventDefault(); // stay on the same URL — no hash navigation
        setView(keyFromHref(t.getAttribute("href")));
      });
    });
  }

  // JS dim fallback (CSS :has() is the primary implementation)
  function bindDimFallback() {
    const on = function () { body.classList.add("is-dimmed"); };
    const off = function () { body.classList.remove("is-dimmed"); };
    tiles.forEach(function (t) {
      t.addEventListener("mouseenter", on);
      t.addEventListener("mouseleave", off);
      t.addEventListener("focus", on);
      t.addEventListener("blur", off);
    });
  }

  Vestiges.nav = {
    init: function () {
      if (!tiles.length) return;
      setView(DEFAULT_VIEW);
      bindClicks();
      bindDimFallback();
    }
  };
})();
