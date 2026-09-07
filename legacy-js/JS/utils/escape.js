// Escaping for text injected into HTML templates.
window.Vestiges = window.Vestiges || {};
(function () {
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  Vestiges.escapeHtml = escapeHtml;
})();
