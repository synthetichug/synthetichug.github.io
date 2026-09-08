import { escapeHtml as esc } from "../utils/escape.js";
const LS_KEY = "vestiges-sat-pins";
export function renderSatisfactory(data) {
    const mount = document.querySelector("[data-satisfactory]");
    const side = document.querySelector("[data-satisfactory-controls]");
    if (!mount || !side || !data)
        return;
    const { names, recipes, makeMap } = data;
    const nm = (c) => names[c] || c;
    const byId = Object.fromEntries(recipes.map((r) => [r.id, r]));
    // ---- recursive raw-resource expansion -----------------------------------
    function rawInto(acc, item, qty, seen, depth) {
        const m = makeMap[item];
        if (!m || depth > 40 || seen.has(item)) {
            acc[item] = (acc[item] || 0) + qty;
            return;
        }
        const s2 = new Set(seen);
        s2.add(item);
        for (const [c, a] of m)
            rawInto(acc, c, a * qty, s2, depth + 1);
    }
    function rawForRecipe(r, n) {
        const acc = {};
        for (const [c, a] of r.ing)
            rawInto(acc, c, a * n, new Set(), 0);
        return acc;
    }
    // ---- state ------------------------------------------------------------
    let pins = load();
    function load() {
        try {
            const v = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
            return Array.isArray(v) ? v : [];
        }
        catch {
            return [];
        }
    }
    function save() {
        try {
            localStorage.setItem(LS_KEY, JSON.stringify(pins));
        }
        catch {
            /* private mode / disabled storage — pins just won't persist */
        }
    }
    const pinOf = (id) => pins.find((p) => p.id === id);
    function fmt(n) {
        const r = Math.round(n * 1000) / 1000;
        return Number.isInteger(r) ? String(r) : r.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
    }
    // ---- scaffold: sidebar controls + primary table ------------------------
    side.innerHTML = `
    <div class="sat-side">
      <input class="sat-q" type="search" placeholder="filter by name or ingredient…" />
      <div class="sat-toggles">
        <label class="sat-toggle"><input type="checkbox" data-t="build" />Buildings only</label>
        <label class="sat-toggle sat-on"><input type="checkbox" data-t="alt" checked />Hide alternate recipes</label>
        <label class="sat-toggle"><input type="checkbox" data-t="pin" />Pinned only</label>
      </div>
      <span class="sat-count"></span>

      <div class="sat-pinwrap" hidden>
        <div class="sat-pinhead">
          <h6>Pinned build list</h6><span class="sat-pc"></span><span class="sat-caret">▾</span>
        </div>
        <div class="sat-pinbody">
          <div class="sat-pinlist"></div>
          <div class="sat-totblock">
            <h6>Direct components (sum)</h6>
            <ul class="sat-totlist" data-tot="direct"></ul>
            <button class="sat-copy" data-copy="direct">Copy list</button>
          </div>
          <div class="sat-totblock sat-raw">
            <h6>Raw resources (recursive)</h6>
            <ul class="sat-totlist" data-tot="raw"></ul>
            <button class="sat-copy" data-copy="raw">Copy list</button>
          </div>
        </div>
      </div>
    </div>
  `;
    mount.innerHTML = `
    <div class="sat">
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
    const q = side.querySelector(".sat-q");
    const tBuild = side.querySelector('input[data-t="build"]');
    const tAlt = side.querySelector('input[data-t="alt"]');
    const tPin = side.querySelector('input[data-t="pin"]');
    const countEl = side.querySelector(".sat-count");
    const pinwrap = side.querySelector(".sat-pinwrap");
    const pinlist = side.querySelector(".sat-pinlist");
    const pcEl = side.querySelector(".sat-pc");
    const totDirect = side.querySelector('[data-tot="direct"]');
    const totRaw = side.querySelector('[data-tot="raw"]');
    const tbody = mount.querySelector(".sat-table tbody");
    const emptyEl = mount.querySelector(".sat-empty");
    let copyText = { direct: "", raw: "" };
    // ---- filtering / row render -----------------------------------------------
    function matches(r, terms) {
        if (pinOf(r.id))
            return true; // pinned recipes stay visible through any filter
        if (tPin.checked)
            return false; // "pinned only", and this one isn't pinned
        if (tBuild.checked && !r.building)
            return false;
        if (tAlt.checked && r.alt)
            return false;
        if (!terms.length)
            return true;
        const hay = (r.name + " " + r.ing.map(([c]) => nm(c)).join(" ")).toLowerCase();
        return terms.every((t) => hay.includes(t));
    }
    function qtyHtml(v) {
        return ('<span class="sat-qty"><button data-act="dec">−</button>' +
            `<input type="number" min="0" step="1" value="${v}" data-act="qin" />` +
            '<button data-act="inc">+</button></span>');
    }
    function reqHtml(r) {
        if (!r.ing.length)
            return '<div class="sat-reqs"><span class="sat-req">—</span></div>';
        return ('<div class="sat-reqs">' +
            r.ing.map(([c, a]) => `<span class="sat-req"><b>${fmt(a)}×</b> ${esc(nm(c))}</span>`).join("") +
            "</div>");
    }
    function render() {
        const terms = q.value.toLowerCase().split(/\s+/).filter(Boolean);
        const list = recipes
            .filter((r) => matches(r, terms))
            .sort((a, b) => {
            const pa = pinOf(a.id) ? 0 : 1;
            const pb = pinOf(b.id) ? 0 : 1;
            return pa - pb || a.name.localeCompare(b.name);
        });
        countEl.textContent =
            list.length + " / " + recipes.length + (pins.length ? ` · ${pins.length} pinned` : "");
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
            return (`<tr data-id="${esc(r.id)}"${p ? ' class="sat-pinned"' : ""}>` +
                `<td><span class="sat-name">${esc(r.name)}</span>${chip}` +
                ` <button class="sat-exp" data-act="exp">raw ▸</button></td>` +
                `<td>${reqHtml(r)}</td>` +
                `<td class="sat-cq">${qtyHtml(qty)}</td>` +
                `<td class="sat-ca"><button class="sat-pinbtn" data-act="pin">${p ? "Pinned" : "Pin"}</button></td>` +
                "</tr>");
        })
            .join("");
    }
    // ---- pin panel -------------------------------------------------------
    function aggregate() {
        const direct = {};
        const raw = {};
        for (const p of pins) {
            const r = byId[p.id];
            if (!r)
                continue;
            for (const [c, a] of r.ing)
                direct[c] = (direct[c] || 0) + a * p.qty;
            const rr = rawForRecipe(r, p.qty);
            for (const [c, v] of Object.entries(rr))
                raw[c] = (raw[c] || 0) + v;
        }
        return { direct, raw };
    }
    function totListHtml(obj) {
        const rows = Object.entries(obj).sort((a, b) => nm(a[0]).localeCompare(nm(b[0])));
        if (!rows.length)
            return '<li class="sat-none">nothing pinned</li>';
        return rows
            .map(([c, a]) => `<li><span>${esc(nm(c))}</span><span class="sat-n">${fmt(a)}</span></li>`)
            .join("");
    }
    function renderPins() {
        pinwrap.hidden = pins.length === 0;
        pcEl.textContent = pins.length ? pins.length + " recipe" + (pins.length > 1 ? "s" : "") : "";
        pinlist.innerHTML = pins.length
            ? pins
                .map((p) => {
                const r = byId[p.id];
                if (!r)
                    return "";
                return (`<div class="sat-pinrow" data-id="${esc(r.id)}">` +
                    `<span class="sat-pnm">${esc(r.name)}</span>${qtyHtml(p.qty)}` +
                    `<button class="sat-x" data-act="unpin" title="remove">×</button></div>`);
            })
                .join("")
            : '<div class="sat-none">Pin recipes from the table to build a shopping list.</div>';
        const { direct, raw } = aggregate();
        totDirect.innerHTML = totListHtml(direct);
        totRaw.innerHTML = totListHtml(raw);
        const asText = (o) => Object.entries(o)
            .sort((a, b) => nm(a[0]).localeCompare(nm(b[0])))
            .map(([c, a]) => fmt(a) + " x " + nm(c))
            .join("\n");
        copyText = { direct: asText(direct), raw: asText(raw) };
    }
    function setQty(id, v) {
        const n = Math.max(0, Math.floor(Number(v) || 0));
        const p = pinOf(id);
        if (p) {
            p.qty = n || 1;
            save();
            renderPins();
            render();
        }
    }
    // ---- events --------------------------------------------------------
    let debounce;
    q.addEventListener("input", () => {
        window.clearTimeout(debounce);
        debounce = window.setTimeout(render, 120);
    });
    for (const el of [tBuild, tAlt, tPin]) {
        el.addEventListener("change", () => {
            el.closest(".sat-toggle").classList.toggle("sat-on", el.checked);
            render();
        });
    }
    tbody.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn)
            return;
        const tr = e.target.closest("tr");
        const id = tr.dataset.id;
        const act = btn.dataset.act;
        const qin = tr.querySelector('[data-act="qin"]');
        if (act === "pin") {
            if (pinOf(id))
                pins = pins.filter((x) => x.id !== id);
            else
                pins.push({ id, qty: Math.max(1, Math.floor(Number(qin.value) || 1)) });
            save();
            renderPins();
            render();
        }
        else if (act === "inc" || act === "dec") {
            qin.value = String(Math.max(0, (Number(qin.value) || 0) + (act === "inc" ? 1 : -1)));
            setQty(id, qin.value);
            if (!pinOf(id))
                render();
        }
        else if (act === "exp") {
            toggleDetail(tr, id, btn);
        }
    });
    tbody.addEventListener("change", (e) => {
        const t = e.target;
        if (t.dataset.act === "qin") {
            const tr = t.closest("tr");
            setQty(tr.dataset.id, t.value);
        }
    });
    function toggleDetail(tr, id, btn) {
        const next = tr.nextElementSibling;
        if (next && next.classList.contains("sat-detail")) {
            next.remove();
            btn.textContent = "raw ▸";
            return;
        }
        const r = byId[id];
        if (!r)
            return;
        const n = Math.max(1, Math.floor(Number(tr.querySelector('[data-act="qin"]').value) || 1));
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
        const btn = e.target.closest("button");
        if (!btn)
            return;
        const row = e.target.closest(".sat-pinrow");
        const id = row.dataset.id;
        if (btn.dataset.act === "unpin") {
            pins = pins.filter((x) => x.id !== id);
            save();
            renderPins();
            render();
        }
        else if (btn.dataset.act === "inc" || btn.dataset.act === "dec") {
            const inp = row.querySelector('[data-act="qin"]');
            inp.value = String(Math.max(0, (Number(inp.value) || 0) + (btn.dataset.act === "inc" ? 1 : -1)));
            setQty(id, inp.value);
        }
    });
    pinlist.addEventListener("change", (e) => {
        const t = e.target;
        if (t.dataset.act === "qin") {
            setQty(t.closest(".sat-pinrow").dataset.id, t.value);
        }
    });
    side.querySelector(".sat-pinhead").addEventListener("click", () => pinwrap.classList.toggle("sat-collapsed"));
    side.querySelectorAll(".sat-copy").forEach((b) => {
        b.addEventListener("click", () => {
            const key = b.dataset.copy;
            navigator.clipboard?.writeText(copyText[key] || "");
            const o = b.textContent;
            b.textContent = "Copied";
            window.setTimeout(() => (b.textContent = o), 1000);
        });
    });
    renderPins();
    render();
}
