"use strict";
// Standalone widget (compiled to dist/threatfeed.js, loaded as its own
// module script) — same standalone split as legacy-js/JS/threatfeed.js.
// Pulls CISA's cybersecurity advisories feed through an RSS->JSON proxy
// (the feed has no CORS header).
(() => {
    const root = document.querySelector("[data-newsstream]");
    if (!root)
        return;
    const FEEDS = ["https://www.cisa.gov/cybersecurity-advisories/all.xml"];
    const MAX_ITEMS = 10;
    const proxyUrl = (rssUrl) => "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(rssUrl);
    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
    function stripHtml(html) {
        const tmp = document.createElement("div");
        tmp.innerHTML = html || "";
        return (tmp.textContent || "").replace(/\s+/g, " ").trim();
    }
    function formatDate(pubDate) {
        const d = new Date(pubDate);
        if (Number.isNaN(d.getTime()))
            return "—";
        const month = d.toLocaleString(undefined, { month: "short" }).toLowerCase();
        const day = String(d.getDate()).padStart(2, "0");
        return `${month} ${day}`;
    }
    function renderItem({ dateText, title, summary, link }) {
        const li = document.createElement("li");
        li.innerHTML = `
      <span class="date">${escapeHtml(dateText || "—")}</span>
      <h5 class="news-title">
        <a href="${escapeHtml(link || "#")}" target="_blank" rel="noopener">${escapeHtml(title || "—")}</a>
      </h5>
      <p class="news-summary">${escapeHtml(summary || "")}</p>
    `.trim();
        return li;
    }
    async function fetchFeed(rss) {
        const res = await fetch(proxyUrl(rss), { cache: "no-store" });
        if (!res.ok)
            throw new Error(`feed fetch failed (${res.status})`);
        return res.json();
    }
    function normalizeItems(feedJson) {
        const items = Array.isArray(feedJson?.items) ? feedJson.items : [];
        return items
            .map((it) => {
            const title = (it.title || "").trim();
            const link = (it.link || "").trim();
            const pubDate = it.pubDate || it.published || "";
            const summary = stripHtml(it.description || it.content || "");
            return {
                title,
                link,
                pubDate,
                dateText: pubDate ? formatDate(pubDate) : "—",
                summary,
            };
        })
            .filter((it) => it.title && it.link);
    }
    function newestFirst(a, b) {
        const da = new Date(a.pubDate).getTime();
        const db = new Date(b.pubDate).getTime();
        if (Number.isNaN(da) && Number.isNaN(db))
            return 0;
        if (Number.isNaN(da))
            return 1;
        if (Number.isNaN(db))
            return -1;
        return db - da;
    }
    async function run() {
        root.innerHTML = "";
        root.appendChild(renderItem({ dateText: "—", title: "loading…", summary: "", link: "#" }));
        const results = await Promise.allSettled(FEEDS.map(fetchFeed));
        let items = results
            .filter((r) => r.status === "fulfilled")
            .flatMap((r) => normalizeItems(r.value));
        items.sort(newestFirst);
        items = items.slice(0, MAX_ITEMS);
        root.innerHTML = "";
        if (!items.length) {
            root.appendChild(renderItem({ dateText: "—", title: "no updates", summary: "", link: "#" }));
            return;
        }
        for (const it of items) {
            const clipped = it.summary.length > 260 ? it.summary.slice(0, 257) + "…" : it.summary;
            root.appendChild(renderItem({ dateText: it.dateText, title: it.title, summary: clipped, link: it.link }));
        }
    }
    run().catch((e) => {
        console.error("[threatfeed] feed failed:", e);
        root.innerHTML = "";
        root.appendChild(renderItem({ dateText: "—", title: "advisory feed unavailable", summary: "", link: "#" }));
    });
})();
