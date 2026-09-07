window.Vestiges = window.Vestiges || {};
(function () {
  const qs = Vestiges.dom.qs;
  const clear = Vestiges.dom.clear;

  Vestiges.renderCerts = function (data) {
    const root = qs("[data-certs]");
    if (!root) return;

    const certs = Array.isArray(data) ? data : (data && Array.isArray(data.certs) ? data.certs : []);
    clear(root);

    if (!certs.length) return;

    for (const c of certs) {
      const a = document.createElement("a");
      a.className = "cert";
      a.href = c.url || "#";
      a.target = "_blank";
      a.rel = "noopener";
      a.setAttribute("aria-label", c.title || c.short || "Certification");

      if (c.icon) {
        const img = document.createElement("img");
        img.className = "cert-icon";
        img.src = c.icon;
        img.alt = c.short || c.title || "cert";
        a.appendChild(img);
      } else {
        a.textContent = c.short || c.title || "cert";
      }
      root.appendChild(a);
    }
  };
})();
