(() => {
  // Keep URLs explicit
  const URL_PROFILE = "./data/profile.json";
  const URL_EXPERIENCE = "./data/experience.json";
  const URL_SKILLS = "./data/skills.json";

  function escapeHtml(s) {
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
    const nameEl = document.querySelector("[data-profile-name]");
    const titleEl = document.querySelector("[data-profile-title]");
    const bioEl = document.querySelector("[data-profile-bio]");

    // Fail closed: if hooks don't exist, do nothing
    if (!nameEl && !titleEl && !bioEl) return;

    if (nameEl && data.name) nameEl.textContent = data.name;
    if (titleEl && data.title) titleEl.textContent = data.title;
    if (bioEl && data.bio) bioEl.textContent = data.bio;
  }

  // -------- Experience --------
  function monthName(m) {
    const names = [
      "jan", "feb", "mar", "apr", "may", "jun",
      "jul", "aug", "sep", "oct", "nov", "dec",
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
    // Your HTML uses: <div class="skills" data-skills>
    const root = document.querySelector("[data-skills]");
    if (!root) return;

    const sections = data && Array.isArray(data.sections) ? data.sections : null;
    if (!sections || sections.length === 0) return; // keep placeholder/fallback

    // Clear only when valid data is present
    root.innerHTML = "";

    for (const s of sections) {
      const h = document.createElement("h6");
      h.textContent = s.category || "—";
      root.appendChild(h);

      const p = document.createElement("p");
      const details = Array.isArray(s.details) ? s.details : [];
      // Match your restrained aesthetic: bullet-like separators, not a loud list
      p.textContent = details.join(" • ");
      root.appendChild(p);
    }
  }

  // -------- Boot --------
  function run() {
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
