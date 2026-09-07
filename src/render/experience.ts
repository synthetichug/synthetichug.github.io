import { qs, clear } from "../utils/dom.js";
import { escapeHtml as esc } from "../utils/escape.js";
import { fmtRange, sortableYM } from "../utils/format.js";
import type { ExperienceData, Position } from "../types.js";

export function renderExperience(data: ExperienceData | Position[] | null | undefined): void {
  const root = qs("[data-positions]");
  if (!root) return;

  const list: Position[] = Array.isArray(data) ? data : data?.positions ?? [];
  const sorted = list
    .slice()
    .sort((a, b) => sortableYM(b.start || "").localeCompare(sortableYM(a.start || "")));

  clear(root);

  if (!sorted.length) {
    root.innerHTML =
      "<li>" +
      '<span class="date">—</span>' +
      '<h5 class="pos-title">no entries</h5>' +
      '<div class="pos-meta"><span class="pos-company"></span></div>' +
      '<ul class="exp-bullets"></ul>' +
      "</li>";
    return;
  }

  for (const pos of sorted) {
    const role = (pos.role || "—").trim();
    const company = (pos.company || "").trim();
    const dateText = fmtRange(pos.start, pos.end);
    const bullets = Array.isArray(pos.bullets) ? pos.bullets : [];

    const li = document.createElement("li");
    li.innerHTML =
      '<h5 class="pos-title">' + esc(role) + "</h5>" +
      '<span class="date">' + esc(dateText) + "</span>" +
      '<div class="pos-meta"><span class="pos-company">' + esc(company) + "</span></div>" +
      '<ul class="exp-bullets">' +
      bullets.map((b) => "<li>" + esc(b) + "</li>").join("") +
      "</ul>";

    root.appendChild(li);
  }
}
