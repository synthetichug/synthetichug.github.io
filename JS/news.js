(() => {
  const root = document.querySelector("[data-newsstream]");
  if (!root) return;

  // Feeds that include title + pubDate + description (summary).
  // NPR feeds are generally consistent.
  const FEEDS = [
    "https://feeds.npr.org/1003/rss.xml", // national
    "https://feeds.npr.org/1014/rss.xml", // politics
  ];

  const MAX_ITEMS = 10;

  // RSS->JSON proxy. Browsers usually can't fetch RSS directly (CORS).
  const proxyUrl = (rssUrl) =>
    "https://api.rss2json.com/v1/api.json?rss_url=" +
    encodeURIComponent(rssUrl);

  function stripHtml(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html || "";
    return (tmp.textContent || "").replace(/\s+/g, " ").trim();
  }

  function formatDate(pubDate) {
    // "jan 03" style (quiet, matches your aesthetic)
    const d = new Date(pubDate);
    if (Number.isNaN(d.getTime())) return "—";

    const month = d.toLocaleString(undefined, { month: "short" }).toLowerCase();
    const day = String(d.getDate()).padStart(2, "0");
    return `${month} ${day}`;
  }

  function renderItem({ dateText, title, summary, link }) {
    const li = document.createElement("li");

    // Keep it restrained: if summary is empty, still render an empty <p>
    li.innerHTML = `
      <span class="date">${dateText || "—"}</span>
      <h5 class="news-title">
        <a href="${link || "#"}" target="_blank" rel="noopener">${
      title || "—"
    }</a>
      </h5>
      <p class="news-summary">${summary || ""}</p>
    `.trim();

    return li;
  }

  async function fetchFeed(rss) {
    const res = await fetch(proxyUrl(rss), { cache: "no-store" });
    if (!res.ok) throw new Error(`feed fetch failed (${res.status})`);
    return res.json();
  }

  function normalizeItems(feedJson) {
    const items = Array.isArray(feedJson?.items) ? feedJson.items : [];
    return items
      .map((it) => {
        const title = (it.title || "").trim();
        const link = (it.link || "").trim();
        const pubDate = it.pubDate || it.published || "";
        const summaryRaw = it.description || it.content || "";
        const summary = stripHtml(summaryRaw);

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

    // If parsing fails, push unknowns down
    if (Number.isNaN(da) && Number.isNaN(db)) return 0;
    if (Number.isNaN(da)) return 1;
    if (Number.isNaN(db)) return -1;
    return db - da;
  }

  async function run() {
    // Initial placeholder (keeps layout stable)
    root.innerHTML = "";
    root.appendChild(
      renderItem({
        dateText: "—",
        title: "loading…",
        summary: "",
        link: "#",
      })
    );

    const results = await Promise.allSettled(FEEDS.map(fetchFeed));

    let items = results
      .filter((r) => r.status === "fulfilled")
      .flatMap((r) => normalizeItems(r.value));

    // Sort newest first across all feeds, then take top N
    items.sort(newestFirst);
    items = items.slice(0, MAX_ITEMS);

    root.innerHTML = "";

    if (!items.length) {
      root.appendChild(
        renderItem({
          dateText: "—",
          title: "no updates",
          summary: "",
          link: "#",
        })
      );
      return;
    }

    for (const it of items) {
      // Keep summaries short and consistent (optional; adjust length)
      const clipped =
        it.summary.length > 260 ? it.summary.slice(0, 257) + "…" : it.summary;

      root.appendChild(
        renderItem({
          dateText: it.dateText,
          title: it.title,
          summary: clipped,
          link: it.link,
        })
      );
    }
  }

  run().catch(() => {
    root.innerHTML = "";
    root.appendChild(
      renderItem({
        dateText: "—",
        title: "news unavailable",
        summary: "",
        link: "#",
      })
    );
  });
})();
