window.Vestiges = window.Vestiges || {};
(function () {
  const qs = Vestiges.dom.qs;
  const clear = Vestiges.dom.clear;

  Vestiges.renderSkills = function (data) {
    const root = qs("[data-skills]");
    if (!root) return;

    const list = Array.isArray(data) ? data : (data && Array.isArray(data.skills) ? data.skills : []);
    clear(root);

    if (!list.length) {
      root.innerHTML = '<h6>—</h6>';
      return;
    }

    // Matches the h6/p skeleton already in index.html (and the .skills h6
    // CSS rule) — one heading + one detail line per skill, not a <li> list.
    for (const s of list) {
      const category = (s && (s.category || s.name)) || "—";
      const details = (s && s.details) || "";

      const h6 = document.createElement("h6");
      h6.textContent = category;
      root.appendChild(h6);

      if (details) {
        const p = document.createElement("p");
        p.textContent = details;
        root.appendChild(p);
      }
    }
  };
})();
