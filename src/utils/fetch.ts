export function fetchJson<T>(url: string): Promise<T> {
  return fetch(url, { cache: "no-store" }).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
    return r.json() as Promise<T>;
  });
}
