import { escapeHtml as esc } from "../utils/escape.js";
import type { SatisfactoryData, SatRecipe } from "../types.js";

// Satisfactory build codex. Renders a filterable table of every building /
// craftable part with named ingredients, plus a pin panel that sums pinned
// recipes into direct-component and recursive raw-resource totals.
// Data: data/satisfactory.json (trimmed from github.com/greeny/SatisfactoryTools).

interface Pin {
  id: string;
  qty: number;
}

const LS_KEY = "vestiges-sat-pins";

export function renderSatisfactory(data: SatisfactoryData | null | undefined): void {
  const mount = document.querySelector<HTMLElement>("[data-satisfactory]");
  if (!mount || !data) return;

  const { names, recipes, makeMap } = data;
  const nm = (c: string): string => names[c] || c;
  const byId: Record<string, SatRecipe> = Object.fromEntries(recipes.map((r) => [r.id, r]));

  // ---- recursive raw-resource expansion -------------------------------------
  function rawInto(acc: Record<string, number>, item: string, qty: number, seen: Set<string>, depth: number): void {
    const m = makeMap[item];
    if (!m || depth > 40 || seen.has(item)) {
      acc[item] = (acc[item] || 0) + qty;
      return;
    }
    const s2 = new Set(seen);
    s2.add(item);
    for (const [c, a] of m) rawInto(acc, c, a * qty, s2, depth + 1);
  }
  function rawForRecipe(r: SatRecipe, n: number): Record<string, number> {
    const acc: Record<string, number> = {};
    for (const [c, a] of r.ing) rawInto(acc, c, a * n, new Set(), 0);
    return acc;
  }

  // ---- state --------------------------------------------------------------
  let pins: Pin[] = load();
  function load(): Pin[] {
    try {
      const v = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  }
  function save(): void {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(pins));
    } catch {
      /* private mode / disabled storage — pins just won't persist */
    }
  }
  const pinOf = (id: string): Pin | undefined => pins.find((p) => p.id === id);

  function fmt(n: number): string {
    const r = Math.round(n * 1000) / 1000;
    return Number.isInteger(r) ? String(r) : r.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  }

  // ---- scaffold ---------------------------------------------------------------
  mount.innerHTML = `
    <div class="sat">
      <div class="sat-controls">
        <input class="sat-q" type="search"
          placeholder="filter by name or ingredient…  e.g.  assembler  /  modular frame" />
        <label class="sat-toggle"><input type="checkbox" data-t="build" />Buildings only</label>
        <label class="sat-toggle sat-on"><input type="checkbox" data-t="alt" checked />Hide alternate recipes</label>
        <label class="sat-toggle"><input type="checkbox" data-t="pin" />Pinned only</label>
        <span class="sat-count"></span>
      </div>

      <div class="sat-pinwrap" hidden>
        <div class="sat-pinhead">
          <h4>Pinned build list</h4><span class="sat-pc"></span><span class="sat-caret">▾</span>
        </div>
        <div class="sat-pinbody">
          <div class="sat-pinlist"></div>
          <div class="sat-totblock">
            <h5>Direct components (sum)</h5>
            <ul class="sat-totlist" data-tot="direct"></ul>
            <button class="sat-copy" data-copy="direct">Copy list</button>
          </div>
          <div class="sat-totblock sat-raw">
            <h5>Raw resources (recursive)</h5>
            <ul class="sat-totlist" data-tot="raw"></ul>
            <button class="sat-copy" data-copy="raw">Copy list</button>
          </div>
        </div>
      </div>

      <div class="sat-tablewrap">
        <table class="sat-table">
          <thead><tr>
            <th>Item</th><th>Build / craft requirements</th><th class="sat-cq">Qty</th><th class="sat-ca"></th>
          </tr></thead>
          <tbody></tbody>
        </table>
        <div class="sat-empty" hidden>No recipes match that filter.</div>
      </div>
    </div>
  `;

  const q = mount.querySelector<HTMLInputElement>(".sat-q")!;
  const tbody = mount.querySelector<HTMLTableSectionElement>(".sat-table tbody")!;
  const countEl = mount.querySelector<HTMLElement>(".sat-count")!;
  const emptyEl = mount.querySelector<HTMLElement>(".sat-empty")!;
  const pinwrap = mount.querySelector<HTMLElement>(".sat-pinwrap")!;
  const pinlist = mount.querySelector<HTMLElement>(".sat-pinlist")!;
  const pcEl = mount.querySelector<HTMLElement>(".sat-pc")!;
  const totDirect = mount.querySelector<HTMLElement>('[data-tot="direct"]')!;
  const totRaw = mount.querySelector<HTMLElement>('[data-tot="raw"]')!;
  const tBuild = mount.querySelector<HTMLInputElement>('.sat-toggle input[data-t="build"]')!;
  const tAlt = mount.querySelector<HTMLInputElement>('.sat-toggle input[data-t="alt"]')!;
  const tPin = mount.querySelector<HTMLInputElement>('.sat-toggle input[data-t="pin"]')!;

  let copyText: Record<string, string> = { direct: "", raw: "" };

  // ---- filtering / row render ----------------------------------------------
  function matches(r: SatRecipe, terms: string[]): boolean {
    if (tBuild.checked && !r.building) return false;
    if (tAlt.checked && r.alt) return false;
    if (tPin.checked && !pinOf(r.id)) return false;
    if (!terms.length) return true;
    const hay = (r.name + " " + r.ing.map(([c]) => nm(c)).join(" ")).toLowerCase();
    return terms.every((t) => hay.includes(t));
  }

  function qtyHtml(v: number): string {
    return (
      '<span class="sat-qty"><button data-act="dec">−</button>' +
      `<input type="number" min="0" step="1" value="${v}" data-act="qin" />` +
      '<button data-act="inc">+</button></span>'
    );
  }

  function reqHtml(r: SatRecipe): string {
    if (!r.ing.length) return '<div class="sat-reqs"><span class="sat-req">—</span></div>';
    return (
      '<div class="sat-reqs">' +
      r.ing
        .map(([c, a]) => `<span class="sat-req"><b>${fmt(a)}×</b> ${esc(nm(c))}</span>`)
        .join("") +
      "</div>"
    );
  }

  function render(): void {
    const terms = q.value.toLowerCase().split(/\s+/).filter(Boolean);
    const list = recipes.filter((r) => matches(r, terms)).sort((a, b) => a.name.localeCompare(b.name));
    countEl.textContent = list.length + " / " + recipes.length;
    emptyEl.hidden = list.length > 0;

    tbody.innerHTML = list
      .map((r) => {
        const p = pinOf(r.id);
        const qty = p ? p.qty : 1;
        const chip = r.alt
          ? '<span class="sat-chip sat-a">alt</span>'
          : r.building
          ? '<span class="sat-chip sat-b">building</span>'
          : '<span class="sat-chip sat-p">part</span>';
        return (
          `<tr data-id="${esc(r.id)}"${p ? ' class="sat-pinned"' : ""}>` +
          `<td><span class="sat-name">${esc(r.name)}</span>${chip}` +
          ` <button class="sat-exp" data-act="exp">raw ▸</button></td>` +
          `<td>${reqHtml(r)}</td>` +
          `<td class="sat-cq">${qtyHtml(qty)}</td>` +
          `<td class="sat-ca"><button class="sat-pinbtn" data-act="pin">${p ? "Pinned" : "Pin"}</button></td>` +
          "</tr>"
        );
      })
      .join("");
  }

  // ---- pin panel ---------------------------------------------------------
  function aggregate(): { direct: Record<string, number>; raw: Record<string, number> } {
    const direct: Record<string, number> = {};
    const raw: Record<string, number> = {};
    for (const p of pins) {
      const r = byId[p.id];
      if (!r) continue;
      for (const [c, a] of r.ing) direct[c] = (direct[c] || 0) + a * p.qty;
      const rr = rawForRecipe(r, p.qty);
      for (const [c, v] of Object.entries(rr)) raw[c] = (raw[c] || 0) + v;
    }
    return { direct, raw };
  }

  function totListHtml(obj: Record<string, number>): string {
    const rows = Object.entries(obj).sort((a, b) => nm(a[0]).localeCompare(nm(b[0])));
    if (!rows.length) return '<li class="sat-none">nothing pinned</li>';
    return rows
      .map(([c, a]) => `<li><span>${esc(nm(c))}</span><span class="sat-n">${fmt(a)}</span></li>`)
      .join("");
  }

  function renderPins(): void {
    pinwrap.hidden = pins.length === 0;
    pcEl.textContent = pins.length ? pins.length + " recipe" + (pins.length > 1 ? "s" : "") : "";
    pinlist.innerHTML = pins.length
      ? pins
          .map((p) => {
            const r = byId[p.id];
            if (!r) return "";
            return (
              `<div class="sat-pinrow" data-id="${esc(r.id)}">` +
              `<span class="sat-pnm">${esc(r.name)}</span>${qtyHtml(p.qty)}` +
              `<button class="sat-x" data-act="unpin" title="remove">×</button></div>`
            );
          })
          .join("")
      : '<div class="sat-none">Pin recipes from the table to build a shopping list.</div>';

    const { direct, raw } = aggregate();
    totDirect.innerHTML = totListHtml(direct);
    totRaw.innerHTML = totListHtml(raw);
    const asText = (o: Record<string, number>): string =>
      Object.entries(o)
        .sort((a, b) => nm(a[0]).localeCompare(nm(b[0])))
        .map(([c, a]) => fmt(a) + " x " + nm(c))
        .join("\n");
    copyText = { direct: asText(direct), raw: asText(raw) };
  }

  function setQty(id: string, v: number | string): void {
    const n = Math.max(0, Math.floor(Number(v) || 0));
    const p = pinOf(id);
    if (p) {
      p.qty = n || 1;
      save();
      renderPins();
      render();
    }
  }

  // ---- events -----------------------------------------------------------
  let debounce: number | undefined;
  q.addEventListener("input", () => {
    window.clearTimeout(debounce);
    debounce = window.setTimeout(render, 120);
  });
  for (const el of [tBuild, tAlt, tPin]) {
    el.addEventListener("change", () => {
      el.closest(".sat-toggle")!.classList.toggle("sat-on", el.checked);
      render();
    });
  }

  tbody.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest("button");
    if (!btn) return;
    const tr = (e.target as HTMLElement).closest("tr") as HTMLElement;
    const id = tr.dataset.id as string;
    const act = btn.dataset.act;
    const qin = tr.querySelector<HTMLInputElement>('[data-act="qin"]')!;

    if (act === "pin") {
      if (pinOf(id)) pins = pins.filter((x) => x.id !== id);
      else pins.push({ id, qty: Math.max(1, Math.floor(Number(qin.value) || 1)) });
      save();
      renderPins();
      render();
    } else if (act === "inc" || act === "dec") {
      qin.value = String(Math.max(0, (Number(qin.value) || 0) + (act === "inc" ? 1 : -1)));
      setQty(id, qin.value);
      if (!pinOf(id)) render();
    } else if (act === "exp") {
      toggleDetail(tr, id, btn as HTMLButtonElement);
    }
  });
  tbody.addEventListener("change", (e) => {
    const t = e.target as HTMLElement;
    if (t.dataset.act === "qin") {
      const tr = t.closest("tr") as HTMLElement;
      setQty(tr.dataset.id as string, (t as HTMLInputElement).value);
    }
  });

  function toggleDetail(tr: HTMLElement, id: string, btn: HTMLButtonElement): void {
    const next = tr.nextElementSibling;
    if (next && next.classList.contains("sat-detail")) {
      next.remove();
      btn.textContent = "raw ▸";
      return;
    }
    const r = byId[id];
    if (!r) return;
    const n = Math.max(1, Math.floor(Number(tr.querySelector<HTMLInputElement>('[data-act="qin"]')!.value) || 1));
    const rr = rawForRecipe(r, n);
    const items = Object.entries(rr).sort((a, b) => nm(a[0]).localeCompare(nm(b[0])));
    const d = document.createElement("tr");
    d.className = "sat-detail";
    d.innerHTML =
      `<td colspan="4"><h6>Raw resources to build ${fmt(n)}× ${esc(r.name)}</h6>` +
      '<div class="sat-rawlist">' +
      (items.map(([c, a]) => `<span><b>${fmt(a)}×</b> ${esc(nm(c))}</span>`).join("") || "— already raw") +
      "</div></td>";
    tr.after(d);
    btn.textContent = "raw ▾";
  }

  pinlist.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest("button");
    if (!btn) return;
    const row = (e.target as HTMLElement).closest(".sat-pinrow") as HTMLElement;
    const id = row.dataset.id as string;
    if (btn.dataset.act === "unpin") {
      pins = pins.filter((x) => x.id !== id);
      save();
      renderPins();
      render();
    } else if (btn.dataset.act === "inc" || btn.dataset.act === "dec") {
      const inp = row.querySelector<HTMLInputElement>('[data-act="qin"]')!;
      inp.value = String(Math.max(0, (Number(inp.value) || 0) + (btn.dataset.act === "inc" ? 1 : -1)));
      setQty(id, inp.value);
    }
  });
  pinlist.addEventListener("change", (e) => {
    const t = e.target as HTMLElement;
    if (t.dataset.act === "qin") {
      setQty((t.closest(".sat-pinrow") as HTMLElement).dataset.id as string, (t as HTMLInputElement).value);
    }
  });

  mount.querySelector(".sat-pinhead")!.addEventListener("click", () => pinwrap.classList.toggle("sat-collapsed"));
  mount.querySelectorAll<HTMLButtonElement>(".sat-copy").forEach((b) => {
    b.addEventListener("click", () => {
      const key = b.dataset.copy as string;
      navigator.clipboard?.writeText(copyText[key] || "");
      const o = b.textContent;
      b.textContent = "Copied";
      window.setTimeout(() => (b.textContent = o), 1000);
    });
  });

  renderPins();
  render();
}
