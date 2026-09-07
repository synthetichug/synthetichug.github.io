// Boot: load JSON and render into existing DOM hooks.
// Unlike legacy-js/JS/app.js (which looks up render fns via window.Vestiges),
// this imports them directly — no global registry needed once modules exist.
// cves.ts / threatfeed.ts are NOT imported here — they ship as their own
// standalone module scripts, same split as the legacy site.
import { fetchJson } from "./utils/fetch.js";
import { initNav } from "./nav.js";
import { renderProfile } from "./render/profile.js";
import { renderExperience } from "./render/experience.js";
import { renderEducation } from "./render/education.js";
import { renderSkills } from "./render/skills.js";
import { renderCerts } from "./render/certs.js";
import { renderProjects } from "./render/projects.js";
import { renderWriteups } from "./render/writeups.js";
import { renderSatisfactory } from "./render/satisfactory.js";
function run() {
    initNav();
    fetchJson("./data/profile.json")
        .then(renderProfile)
        .catch((e) => console.error("[app] profile render failed:", e));
    fetchJson("./data/experience.json")
        .then(renderExperience)
        .catch((e) => console.error("[app] experience render failed:", e));
    fetchJson("./data/education.json")
        .then(renderEducation)
        .catch((e) => console.error("[app] education render failed:", e));
    fetchJson("./data/skills.json")
        .then(renderSkills)
        .catch((e) => console.error("[app] skills render failed:", e));
    fetchJson("./data/certs.json")
        .then(renderCerts)
        .catch((e) => console.error("[app] certs render failed:", e));
    fetchJson("./data/projects.json")
        .then(renderProjects)
        .catch((e) => console.error("[app] projects render failed:", e));
    fetchJson("./data/writeups.json")
        .then(renderWriteups)
        .catch((e) => console.error("[app] writeups render failed:", e));
    fetchJson("./data/satisfactory.json")
        .then(renderSatisfactory)
        .catch((e) => console.error("[app] satisfactory render failed:", e));
}
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
}
else {
    run();
}
