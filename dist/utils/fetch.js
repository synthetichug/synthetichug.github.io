export function fetchJson(url) {
    return fetch(url, { cache: "no-store" }).then((r) => {
        if (!r.ok)
            throw new Error(`HTTP ${r.status} for ${url}`);
        return r.json();
    });
}
