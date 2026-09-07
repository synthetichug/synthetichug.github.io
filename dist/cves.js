"use strict";
// Standalone widget (compiled to dist/cves.js, loaded as its own module
// script) — outside the render/*.ts data pattern by design, same split as
// legacy-js/JS/cves.js. Keeps its own tiny escaper since it renders
// third-party text into innerHTML.
(() => {
    const root = document.querySelector("[data-cves]");
    if (!root)
        return;
    // NVD REST API 2.0 — no API key needed for light/public use (rate-limited
    // per IP without one). One request per page load.
    const MAX_ITEMS = 5;
    const WINDOW_DAYS = 8;
    function isoNoMillisZ(date) {
        return date.toISOString().replace(/\.\d+Z$/, ".000");
    }
    function nvdUrl() {
        const end = new Date();
        const start = new Date(end.getTime() - WINDOW_DAYS * 24 * 60 * 60 * 1000);
        return ("https://services.nvd.nist.gov/rest/json/cves/2.0/" +
            `?pubStartDate=${encodeURIComponent(isoNoMillisZ(start))}` +
            `&pubEndDate=${encodeURIComponent(isoNoMillisZ(end))}` +
            `&resultsPerPage=${MAX_ITEMS * 4}`);
    }
    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
    function englishDescription(descriptions) {
        const list = Array.isArray(descriptions) ? descriptions : [];
        const en = list.find((d) => d && d.lang === "en");
        return ((en || list[0] || {}).value || "").trim();
    }
    function bestMetric(metrics) {
        const m = metrics || {};
        if (m.cvssMetricV31 && m.cvssMetricV31[0]) {
            const d = m.cvssMetricV31[0].cvssData || {};
            return { severity: d.baseSeverity || "—", score: d.baseScore };
        }
        if (m.cvssMetricV30 && m.cvssMetricV30[0]) {
            const d = m.cvssMetricV30[0].cvssData || {};
            return { severity: d.baseSeverity || "—", score: d.baseScore };
        }
        if (m.cvssMetricV2 && m.cvssMetricV2[0]) {
            const entry = m.cvssMetricV2[0];
            return { severity: entry.baseSeverity || "—", score: (entry.cvssData || {}).baseScore };
        }
        return { severity: "—", score: undefined };
    }
    function renderItem({ severity, score, id, link, summary }) {
        const div = document.createElement("div");
        div.className = "sidebar-item";
        const scoreText = typeof score === "number" ? " " + score.toFixed(1) : "";
        div.innerHTML =
            '<div class="sidebar-row">' +
                '<span class="sidebar-lead">' + escapeHtml(severity) + escapeHtml(scoreText) + "</span>" +
                '<a class="sidebar-sub" href="' + escapeHtml(link) + '" target="_blank" rel="noopener">' + escapeHtml(id) + "</a>" +
                "</div>" +
                '<p class="sidebar-meta">' + escapeHtml(summary) + "</p>";
        return div;
    }
    async function run() {
        root.innerHTML = "";
        root.appendChild(renderItem({ severity: "loading", score: undefined, id: "…", link: "#", summary: "" }));
        const res = await fetch(nvdUrl(), { cache: "no-store" });
        if (!res.ok)
            throw new Error("NVD fetch failed (" + res.status + ")");
        const data = await res.json();
        const vulns = Array.isArray(data && data.vulnerabilities) ? data.vulnerabilities : [];
        const items = vulns
            .map((v) => v.cve || {})
            .sort((a, b) => +new Date(b.published || 0) - +new Date(a.published || 0))
            .slice(0, MAX_ITEMS)
            .map((cve) => {
            const { severity, score } = bestMetric(cve.metrics);
            const summaryFull = englishDescription(cve.descriptions);
            const summary = summaryFull.length > 140 ? summaryFull.slice(0, 137) + "…" : summaryFull;
            return {
                severity,
                score,
                id: cve.id || "CVE-?",
                link: "https://nvd.nist.gov/vuln/detail/" + encodeURIComponent(cve.id || ""),
                summary,
            };
        });
        root.innerHTML = "";
        if (!items.length) {
            root.appendChild(renderItem({ severity: "—", score: undefined, id: "no recent CVEs", link: "#", summary: "" }));
            return;
        }
        items.forEach((it) => root.appendChild(renderItem(it)));
    }
    run().catch((e) => {
        console.error("[cves] feed failed:", e);
        root.innerHTML = "";
        root.appendChild(renderItem({ severity: "—", score: undefined, id: "cve feed unavailable", link: "#", summary: "" }));
    });
})();
