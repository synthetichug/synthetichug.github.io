window.Vestiges = window.Vestiges || {};
(function () {
  const qs = Vestiges.dom.qs;
  const clear = Vestiges.dom.clear;
  const esc = Vestiges.escapeHtml;
  const fmtRange = Vestiges.format.fmtRange;
  const sortableYM = Vestiges.format.sortableYM;

  Vestiges.renderExperience = function (data) {
    const root = qs("[data-positions]");
    if (!root) return;

    const list = Array.isArray(data) ? data : (data && Array.isArray(data.positions) ? data.positions : []);
    const sorted = list.slice().sort(function (a, b) {
      return sortableYM(b.start || "") .localeCompare(sortableYM(a.start || ""));
    });

    clear(root);

    if (!sorted.length) {
      root.innerHTML = (
        '<li>' +
          '<span class="date">—</span>' +
          '<h5 class="pos-title">no entries</h5>' +
          '<div class="pos-meta"><span class="pos-company"></span></div>' +
          '<ul class="exp-bullets"></ul>' +
        '</li>'
      );
      return;
    }

    for (const pos of sorted) {
      const role = (pos.role || "—").trim();
      const company = (pos.company || "").trim();
      const dateText = fmtRange(pos.start, pos.end);
      const bullets = Array.isArray(pos.bullets) ? pos.bullets : [];

      const li = document.createElement("li");
      li.innerHTML = (
        '<h5 class="pos-title">' + esc(role) + '</h5>' +
        '<span class="date">' + esc(dateText) + '</span>' +
        '<div class="pos-meta"><span class="pos-company">' + esc(company) + '</span></div>' +
        '<ul class="exp-bullets">' +
          bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join("") +
        '</ul>'
      );

      root.appendChild(li);
    }
  };
})();
