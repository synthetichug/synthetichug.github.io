import { qs } from "../utils/dom.js";
export function renderProfile(data) {
    const nameEl = qs("[data-profile-name]");
    const titleEl = qs("[data-profile-title]");
    const bioEl = qs("[data-profile-bio]");
    if (nameEl)
        nameEl.textContent = data && data.name ? data.name : "—";
    if (titleEl)
        titleEl.textContent = data && data.title ? data.title : "—";
    if (bioEl)
        bioEl.textContent = data && data.bio ? data.bio : "—";
}
