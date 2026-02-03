(() => {
  const URL_PROFILE = "./data/profile.json";
  const URL_EXPERIENCE = "./data/experience.json";
  const URL_EDUCATION = "./data/education.json";
  const URL_SKILLS = "./data/skills.json";
  const URL_CERTS = "./data/certs.json";

  const DEBUG = true;

  function dbg(...args) {
    if (DEBUG) console.log("[render]", ...args);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  async function fetchJson(url) {
    dbg("fetchJson start:", url, "protocol:", location.protocol);
    const res = await fetch(url, { cache: "no-store" });
    dbg("fetchJson response:", url, "status:", res.status, "ok:", res.ok);

    if (!res.ok) {
      let body = "";
      try {
        body = await res.text();
      } catch (_) {}
      dbg("fetchJson non-ok body snippet:", url, body.slice(0, 200));
      throw new Error(`${url} fetch failed (${res.status})`);
    }

    const data = await res.json();
    dbg("fetchJson parsed:", url, data);
    return data;
  }

  // -------- Profile (name/title/bio) --------
  function renderProfile(data) {
    const nameEl = document.querySelector("[data-profile-name]");
    const titleEl = document.querySelector("[data-profile-title]");
    const bioEl = document.querySelector("[data-profile-bio]");

    dbg("renderProfile hooks:", {
      nameEl: !!nameEl,
      titleEl: !!titleEl,
      bioEl: !!bioEl,
    });

    if (!nameEl && !titleEl && !bioEl) {
      dbg("renderProfile: no hooks found; skipping");
      return;
    }

    const name = data && typeof data.name === "string" ? data.name : null;

    // accept either "title" or your current "tagline"
    const title =
      data && typeof data.title === "string"
        ? data.title
        : data && typeof data.tagline === "string"
          ? data.tagline
          : null;

    // accept either "bio" or your current "biography"
    const bio =
      data && typeof data.bio === "string"
        ? data.bio
        : data && typeof data.biography === "string"
          ? data.biography
          : null;

    dbg("renderProfile resolved fields:", {
      name,
      title,
      bioLen: bio ? bio.length : 0,
    });

    if (nameEl && name) nameEl.textContent = name;
    if (titleEl && title) titleEl.textContent = title;
    if (bioEl && bio) bioEl.textContent = bio;

    dbg("renderProfile applied:", {
      name: nameEl ? nameEl.textContent : null,
      title: titleEl ? titleEl.textContent : null,
      bioLen: bioEl ? bioEl.textContent.length : null,
    });
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

    dbg("renderExperience root found:", !!root);

    if (!root) {
      dbg("renderExperience: no root; skipping");
      return;
    }

    const items = data && Array.isArray(data.positions) ? data.positions : null;

    dbg("renderExperience schema:", {
      hasPositions: !!(data && data.positions),
      positionsIsArray: Array.isArray(data && data.positions),
      positionsLen: items ? items.length : null,
      dataKeys: data ? Object.keys(data) : null,
    });

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
      dbg("renderExperience: no entries rendered");
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

    dbg("renderExperience rendered count:", sorted.length);
  }
    
  function renderEducation(data) {
    const root =
      document.querySelector("[data-education]") ||
      document.querySelector(".view.view-job .positions.education");
  
    dbg("renderEducation root found:", !!root);
    if (!root) return;
  
    const items = data && Array.isArray(data.education) ? data.education : null;
  
    dbg("renderEducation schema:", {
      hasEducation: !!(data && data.education),
      educationIsArray: Array.isArray(data && data.education),
      educationLen: items ? items.length : null,
      dataKeys: data ? Object.keys(data) : null,
    });
  
    if (!items) throw new Error("education.json missing 'education' array");
  
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
  
    for (const ed of sorted) {
      const program = (ed.program || "—").trim();
      const school = (ed.school || "").trim();
      const dateText = fmtRange(ed.start, ed.end);
      const bullets = Array.isArray(ed.bullets) ? ed.bullets : [];
  
      const li = document.createElement("li");
      li.innerHTML = `
        <h5 class="pos-title">${escapeHtml(program)}</h5>
        <span class="date">${escapeHtml(dateText)}</span>
        <div class="pos-meta">
          <span class="pos-company">${escapeHtml(school)}</span>
        </div>
        <ul class="exp-bullets">
          ${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}
        </ul>
      `.trim();
  
      root.appendChild(li);
    }
  
    dbg("renderEducation rendered count:", sorted.length);
  }

  // -------- Skills (sidebar) --------
  function renderSkills(data) {
    const root = document.querySelector("[data-skills]");
    dbg("renderSkills root found:", !!root);

    if (!root) {
      dbg("renderSkills: no root; skipping");
      return;
    }

    // Accept either:
    // 1) { sections: [ { category, details: [] } ] }
    // 2) { skills:   [ { category, details: "" or [] } ] }
    const raw =
      (data && Array.isArray(data.sections) && data.sections) ||
      (data && Array.isArray(data.skills) && data.skills) ||
      null;

    dbg("renderSkills schema:", {
      hasSections: !!(data && data.sections),
      hasSkills: !!(data && data.skills),
      chosenLen: raw ? raw.length : null,
      dataKeys: data ? Object.keys(data) : null,
    });

    if (!raw || raw.length === 0) {
      dbg("renderSkills: missing/empty data; leaving placeholder intact");
      return;
    }

    root.innerHTML = "";

    for (const s of raw) {
      const category = s && s.category ? String(s.category) : "—";

      // Normalize details to an array of strings
      let details = [];
      if (Array.isArray(s && s.details)) {
        details = s.details.map((x) => String(x)).filter(Boolean);
      } else if (typeof (s && s.details) === "string") {
        details = [s.details];
      } else if (s && s.details != null) {
        details = [String(s.details)];
      }

      const h = document.createElement("h6");
      h.textContent = category;
      root.appendChild(h);

      const p = document.createElement("p");
      p.textContent = details.join(" • ");
      root.appendChild(p);
    }

    dbg("renderSkills rendered count:", raw.length);
  }

  function renderCerts(data) {
    const root = document.querySelector("[data-certs]");
    dbg("renderCerts root found:", !!root);
    if (!root) return;

    const certs = data && Array.isArray(data.certs) ? data.certs : null;

    dbg("renderCerts schema:", {
      hasCerts: !!(data && data.certs),
      certsIsArray: Array.isArray(data && data.certs),
      certsLen: certs ? certs.length : null,
      dataKeys: data ? Object.keys(data) : null,
    });

    if (!certs || certs.length === 0) return;

    root.innerHTML = "";

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
        // text fallback if icon missing
        a.textContent = c.short || c.title || "cert";
      }

      root.appendChild(a);
    }

    dbg("renderCerts rendered count:", certs.length);
  }

  // -------- Boot --------
  function run() {
    dbg("boot: started", {
      href: location.href,
      protocol: location.protocol,
      origin: location.origin,
    });

    dbg("hooks present:", {
      profileName: !!document.querySelector("[data-profile-name]"),
      profileTitle: !!document.querySelector("[data-profile-title]"),
      profileBio: !!document.querySelector("[data-profile-bio]"),
      positions: !!document.querySelector("[data-positions]"),
      skills: !!document.querySelector("[data-skills]"),
    });

    fetchJson(URL_PROFILE)
      .then((data) => {
        dbg("profile.json loaded ok");
        renderProfile(data);
      })
      .catch((err) => console.error("[render] profile render failed:", err));

    fetchJson(URL_EXPERIENCE)
      .then((data) => {
        dbg("experience.json loaded ok");
        renderExperience(data);
      })
      .catch((err) => {
        console.error("[render] experience render failed:", err);
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
    
    fetchJson(URL_EDUCATION)
      .then((data) => {
        dbg("education.json loaded ok");
        renderEducation(data);
      })
      .catch((err) => {
        console.error("[render] education render failed:", err);
        const root =
          document.querySelector("[data-education]") ||
          document.querySelector(".view.view-job .positions.education");
        if (root) {
          root.innerHTML = `
            <li>
              <span class="date">—</span>
              <h5 class="pos-title">education unavailable</h5>
              <div class="pos-meta"><span class="pos-company"></span></div>
              <ul class="exp-bullets"></ul>
            </li>
          `.trim();
        }
      });

    fetchJson(URL_SKILLS)
      .then((data) => {
        dbg("skills.json loaded ok");
        renderSkills(data);
      })
      .catch((err) => console.error("[render] skills render failed:", err));

    fetchJson(URL_CERTS)
      .then((data) => {
        dbg("certs.json loaded ok");
        renderCerts(data);
      })
      .catch((err) => console.error("[render] certs render failed:", err));
  }

  run();
})();
