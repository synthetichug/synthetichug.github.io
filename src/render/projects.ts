import { qs, clear } from "../utils/dom.js";
import { escapeHtml as esc } from "../utils/escape.js";
import type { ProjectsData, Project } from "../types.js";

export function renderProjects(data: ProjectsData | Project[] | null | undefined): void {
  const root = qs("[data-projects]");
  if (!root) return;

  const list: Project[] = Array.isArray(data) ? data : data?.projects ?? [];
  clear(root);

  if (!list.length) {
    root.innerHTML =
      "<li>" +
      '<h5 class="pos-title">no entries</h5>' +
      '<div class="pos-meta"><span class="pos-company"></span></div>' +
      '<ul class="exp-bullets"></ul>' +
      "</li>";
    return;
  }

  for (const p of list) {
    const name = (p.name || "—").trim();
    const repo = p.repo || "";
    const stack = Array.isArray(p.stack) ? p.stack.join(" · ") : "";
    const blurb = (p.blurb || "").trim();

    const li = document.createElement("li");
    li.innerHTML =
      '<h5 class="pos-title">' +
      (repo ? '<a href="' + esc(repo) + '" target="_blank" rel="noopener">' + esc(name) + "</a>" : esc(name)) +
      "</h5>" +
      '<div class="pos-meta"><span class="pos-company">' + esc(stack) + "</span></div>" +
      '<ul class="exp-bullets">' + (blurb ? "<li>" + esc(blurb) + "</li>" : "") + "</ul>";

    root.appendChild(li);
  }
}
