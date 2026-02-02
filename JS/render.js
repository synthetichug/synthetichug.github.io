(() => {
  // Keep URLs explicit
  const URL_PROFILE = "./data/profile.json";
  const URL_EXPERIENCE = "./data/experience.json";
  const URL_SKILLS = "./data/skills.json";

  function escapeHtml(s) {
    // avoids replaceAll() compatibility issues
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  async function fetchJson(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`${url} fetch failed (${res.status})`);
    return res.json();
  }

  // -------- Profile (name/title/bio) --------
  function renderProfile(data) {
    // Targets inside your existing .view-job
    const jobView = document.querySelector(".view.view-job");
    if (!jobView) return;

    const nameEl = jobView.querySelector("h2.morph"); // "dustin"
    const titleEl = jobView.querySelector("span.title.current"); // "artificer"

    // Bio paragraph: first <p> after "biography" heading
    const bioH3 = Array.from(jobView.querySelectorAll("h3.morph")).find(
      (h) => h.textContent.trim().toLowerCase() === "biography",
    );
    const bioEl = bioH3 ? bioH3.nextElementSibling : null;

    if (nameEl && data.name) nameEl.textContent = data.name;
    if (titleEl && data.title) titleEl.textContent = data.title;
    if (bioEl && bioEl.tagName === "P" && data.bio)
      bioEl.textContent = data.bio;
  }

  // -------- Experience --------
  function monthName(m) {
    const names = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    return names[m - 1] || "—";
  }

  function fmtYM(ym) {
    if (!ym) return "—";
    const [y, m] = String(ym).split("-").map(Number);
    if (!y || !m) return "—";
    return `${monthName(m)} ${y}`;
  }

  function fmtRange(start, end) {
    return `${fmtYM(start)} – ${end ? fmtYM(end) : "current"}`;
  }

  function sortableYM(ym) {
    if (!ym) return 999999;
    const [y, m] = String(ym).split("-").map(Number);
    if (!y || !m) return 0;
    return y * 100 + m;
  }

  function renderExperience(data) {
    const root =
      document.querySelector("[data-positions]") ||
      document.querySelector(".view.view-job .positions");

    if (!root) return;

    const items = data && Array.isArray(data.positions) ? data.positions : null;
    if (!items) throw new Error("experience.json missing 'positions' array");

    const sorted = items
      .slice()
      .sort((a, b) => sortableYM(b.start) - sortableYM(a.start));

    // Only clear AFTER we know we have valid data
    root.innerHTML = "";

    if (sorted.length === 0) {
      root.innerHTML = `
        <li>
          <span class="date">—</span>
          <h5 class="pos-title">no entries</h5>
          <div class="pos-meta"><span class="pos-company"></span></div>
          <ul class="exp-bullets"></ul>
        </li>
      `.trim();
      return;
    }

    for (const pos of sorted) {
      const role = (pos.role || "—").trim();
      const company = (pos.company || "").trim();
      const dateText = fmtRange(pos.start, pos.end);
      const bullets = Array.isArray(pos.bullets) ? pos.bullets : [];

      const li = document.createElement("li");
      li.innerHTML = `
        <h5 class="pos-title">${escapeHtml(role)}</h5>
        <span class="date">${escapeHtml(dateText)}</span>
        <div class="pos-meta">
          <span class="pos-company">${escapeHtml(company)}</span>
        </div>
        <ul class="exp-bullets">
          ${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}
        </ul>
      `.trim();

      root.appendChild(li);
    }
  }

  // -------- Skills (sidebar) --------
  function renderSkills(data) {
    const root = document.querySelector(".sideview.side-job ul.skills");
    if (!root) return;

    const sections =
      data && Array.isArray(data.sections) ? data.sections : null;
    if (!sections || sections.length === 0) return; // keep existing static markup

    // Only clear AFTER valid data exists
    root.innerHTML = "";

    for (const s of sections) {
      const li = document.createElement("li");
      const details = Array.isArray(s.details) ? s.details : [];
      li.innerHTML = `
        <h6>${escapeHtml(s.category || "—")}</h6>
        <p>${escapeHtml(details.join("; "))}</p>
      `.trim();
      root.appendChild(li);
    }
  }

  // -------- Boot --------
  async function run() {
    // Load each independently; one failure doesn't nuke others.
    fetchJson(URL_PROFILE)
      .then(renderProfile)
      .catch((err) => console.error("profile render failed:", err));

    fetchJson(URL_EXPERIENCE)
      .then(renderExperience)
      .catch((err) => {
        console.error("experience render failed:", err);
        const root =
          document.querySelector("[data-positions]") ||
          document.querySelector(".view.view-job .positions");
        if (root) {
          root.innerHTML = `
            <li>
              <span class="date">—</span>
              <h5 class="pos-title">experience unavailable</h5>
              <div class="pos-meta"><span class="pos-company"></span></div>
              <ul class="exp-bullets"></ul>
            </li>
          `.trim();
        }
      });

    fetchJson(URL_SKILLS)
      .then(renderSkills)
      .catch((err) => console.error("skills render failed:", err));
  }

  run();
})();
