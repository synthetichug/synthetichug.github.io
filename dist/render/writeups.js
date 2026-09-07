import { qs, clear } from "../utils/dom.js";
import { escapeHtml as esc } from "../utils/escape.js";
export function renderWriteups(data) {
    const root = qs("[data-writeups]");
    if (!root)
        return;
    const list = Array.isArray(data) ? data : data?.writeups ?? [];
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
    for (const w of list) {
        const title = (w.title || "—").trim();
        const link = w.link || "";
        const tags = Array.isArray(w.tags) ? w.tags.join(" · ") : "";
        const summary = (w.summary || "").trim();
        const li = document.createElement("li");
        li.innerHTML =
            '<h5 class="pos-title">' +
                (link
                    ? '<a href="' + esc(link) + '" target="_blank" rel="noopener">' + esc(title) + "</a>"
                    : esc(title)) +
                "</h5>" +
                '<div class="pos-meta"><span class="pos-company">' + esc(tags) + "</span></div>" +
                '<ul class="exp-bullets">' + (summary ? "<li>" + esc(summary) + "</li>" : "") + "</ul>";
        root.appendChild(li);
    }
}
