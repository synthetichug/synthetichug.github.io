// JSON fetch wrapper with predictable errors.
window.Vestiges = window.Vestiges || {};
(function () {
  function fetchJson(url) {
    return fetch(url, { cache: "no-store" }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status + " for " + url);
      return r.json();
    });
  }
  Vestiges.fetch = { json: fetchJson };
})();
