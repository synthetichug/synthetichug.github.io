window.Vestiges = window.Vestiges || {};
(function () {
  const qs = Vestiges.dom.qs;
  const clear = Vestiges.dom.clear;
  const esc = Vestiges.escapeHtml;
  const fmtRange = Vestiges.format.fmtRange;
  const sortableYM = Vestiges.format.sortableYM;

  Vestiges.renderEducation = function (data) {
    const root = qs("[data-education]");
    if (!root) return;

    const list = Array.isArray(data) ? data : (data && Array.isArray(data.education) ? data.education : []);
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

    for (const ed of sorted) {
      const program = (ed.program || "—").trim();
      const school = (ed.school || "").trim();
      const dateText = fmtRange(ed.start, ed.end);
      const bullets = Array.isArray(ed.bullets) ? ed.bullets : [];

      const li = document.createElement("li");
      li.innerHTML = (
        '<h5 class="pos-title">' + esc(program) + '</h5>' +
        '<span class="date">' + esc(dateText) + '</span>' +
        '<div class="pos-meta"><span class="pos-company">' + esc(school) + '</span></div>' +
        '<ul class="exp-bullets">' +
          bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join("") +
        '</ul>'
      );

      root.appendChild(li);
    }
  };
})();
