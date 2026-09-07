// Typed port of legacy-js/JS/nav.js. Centerwell behavior: JS-driven view
// switching (no URL/hash change — see CSS/nav.css, which keys off
// body[data-view] instead of :target) + dim fallback for browsers without :has().

const DEFAULT_VIEW = "home";

function keyFromHref(href: string | null): string {
  return (href || "").replace("#", "") || DEFAULT_VIEW;
}

export function initNav(): void {
  const tiles = Array.from(document.querySelectorAll<HTMLAnchorElement>(".cw-btn"));
  if (!tiles.length) return;
  const body = document.body;

  function setView(key: string): void {
    body.setAttribute("data-view", key);
    tiles.forEach((t) => {
      t.classList.toggle("is-active", keyFromHref(t.getAttribute("href")) === key);
    });
  }

  tiles.forEach((t) => {
    t.addEventListener("click", (e) => {
      e.preventDefault(); // stay on the same URL — no hash navigation
      setView(keyFromHref(t.getAttribute("href")));
    });
  });

  // JS dim fallback (CSS :has() is the primary implementation)
  const on = () => body.classList.add("is-dimmed");
  const off = () => body.classList.remove("is-dimmed");
  tiles.forEach((t) => {
    t.addEventListener("mouseenter", on);
    t.addEventListener("mouseleave", off);
    t.addEventListener("focus", on);
    t.addEventListener("blur", off);
  });

  setView(DEFAULT_VIEW);
}
