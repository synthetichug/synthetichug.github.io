// Minimal DOM helpers (explicit, no framework).
window.Vestiges = window.Vestiges || {};
(function () {
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
  function clear(node) { if (!node) return; while (node.firstChild) node.removeChild(node.firstChild); }
  Vestiges.dom = { qs: qs, qsa: qsa, clear: clear };
})();
