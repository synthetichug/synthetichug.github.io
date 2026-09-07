import { qs, clear } from "../utils/dom.js";
import { escapeHtml as esc } from "../utils/escape.js";
import { fmtRange, sortableYM } from "../utils/format.js";
import type { EducationData, EducationEntry } from "../types.js";

export function renderEducation(data: EducationData | EducationEntry[] | null | undefined): void {
  const root = qs("[data-education]");
  if (!root) return;

  const list: EducationEntry[] = Array.isArray(data) ? data : data?.education ?? [];
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

  for (const ed of sorted) {
    const program = (ed.program || "—").trim();
    const school = (ed.school || "").trim();
    const dateText = fmtRange(ed.start, ed.end);
    const bullets = Array.isArray(ed.bullets) ? ed.bullets : [];

    const li = document.createElement("li");
    li.innerHTML =
      '<h5 class="pos-title">' + esc(program) + "</h5>" +
      '<span class="date">' + esc(dateText) + "</span>" +
      '<div class="pos-meta"><span class="pos-company">' + esc(school) + "</span></div>" +
      '<ul class="exp-bullets">' +
      bullets.map((b) => "<li>" + esc(b) + "</li>").join("") +
      "</ul>";

    root.appendChild(li);
  }
}
