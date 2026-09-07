// Boot: load JSON and render into existing DOM hooks.
window.Vestiges = window.Vestiges || {};
(function () {
  const fetchJson = Vestiges.fetch.json;

  function run() {
    // nav (hash-based views) can initialize immediately
    if (Vestiges.nav && Vestiges.nav.init) Vestiges.nav.init();

    fetchJson("./data/profile.json")
      .then(function (d) { if (Vestiges.renderProfile) Vestiges.renderProfile(d); })
      .catch(function (e) { console.error("[app] profile render failed:", e); });

    fetchJson("./data/experience.json")
      .then(function (d) { if (Vestiges.renderExperience) Vestiges.renderExperience(d); })
      .catch(function (e) { console.error("[app] experience render failed:", e); });

    fetchJson("./data/education.json")
      .then(function (d) { if (Vestiges.renderEducation) Vestiges.renderEducation(d); })
      .catch(function (e) { console.error("[app] education render failed:", e); });

    fetchJson("./data/skills.json")
      .then(function (d) { if (Vestiges.renderSkills) Vestiges.renderSkills(d); })
      .catch(function (e) { console.error("[app] skills render failed:", e); });

    fetchJson("./data/certs.json")
      .then(function (d) { if (Vestiges.renderCerts) Vestiges.renderCerts(d); })
      .catch(function (e) { console.error("[app] certs render failed:", e); });

    fetchJson("./data/projects.json")
      .then(function (d) { if (Vestiges.renderProjects) Vestiges.renderProjects(d); })
      .catch(function (e) { console.error("[app] projects render failed:", e); });

    fetchJson("./data/writeups.json")
      .then(function (d) { if (Vestiges.renderWriteups) Vestiges.renderWriteups(d); })
      .catch(function (e) { console.error("[app] writeups render failed:", e); });
  }

  // Defer scripts execute after parsing; still guard for safety.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
