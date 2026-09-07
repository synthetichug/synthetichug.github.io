// Date formatting helpers (YYYY-MM -> "Mon YYYY")
window.Vestiges = window.Vestiges || {};
(function () {
  function monthName(m) {
    const map = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const i = Number(m) - 1;
    return map[i] || "";
  }

  function fmtYM(ym) {
    if (!ym) return "";
    const parts = String(ym).split("-");
    if (parts.length < 2) return String(ym);
    const y = parts[0];
    const m = parts[1];
    const mon = monthName(m);
    return mon ? (mon + " " + y) : String(ym);
  }

  function fmtRange(startYM, endYM) {
    const a = fmtYM(startYM);
    const b = endYM ? fmtYM(endYM) : "Present";
    if (!a && !b) return "";
    if (!a) return b;
    return a + " – " + b;
  }

  function sortableYM(ym) {
    if (!ym) return "";
    const s = String(ym);
    const parts = s.split("-");
    if (parts.length < 2) return s;
    const y = parts[0];
    const m = parts[1].padStart(2, "0");
    return y + "-" + m;
  }

  Vestiges.format = { fmtYM: fmtYM, fmtRange: fmtRange, sortableYM: sortableYM };
})();
