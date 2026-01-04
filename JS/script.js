// Optional: mimic the old behavior where hovering a nav tile dims the page
(() => {
  const tiles = document.querySelectorAll(".tile");
  const body = document.body;

  const on = () => body.classList.add("is-dimmed");
  const off = () => body.classList.remove("is-dimmed");

  tiles.forEach(t => {
    t.addEventListener("mouseenter", on);
    t.addEventListener("mouseleave", off);
    t.addEventListener("focus", on);
    t.addEventListener("blur", off);
  });
})();
