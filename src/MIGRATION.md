# src/ — TypeScript site

This is the **live** vestig.es site source. `index.html` at the repo root
loads the compiled output from `../dist/`. The old hand-written plain-JS
version is frozen under `../legacy-js/` for reference.

## Layout

- `types.ts` — interfaces for the `data/*.json` shapes
- `utils/{dom,escape,fetch,format}.ts`
- `render/{profile,experience,education,skills,certs,projects,writeups}.ts`
  — real ES modules (`import`/`export`), not IIFEs on a `window.Vestiges`
  registry. `app.ts` imports them directly.
- `cves.ts`, `threatfeed.ts` — standalone self-executing widgets. Not
  exported, not imported by `app.ts`; they ship as their own
  `<script type="module">` tags, same split as the legacy site.
- `nav.ts`, `app.ts` — boot + centerwell view switching (sets
  `body[data-view]`, which `CSS/nav.css` keys off).

## Build

No CI. GitHub Pages serves static files only, so `dist/` **must be committed**.

```bash
npm install --no-save typescript@5   # if tsc isn't already available
npx tsc                              # emits ../dist/*.js (ES modules, mirrors src/ layout)
```

`tsconfig.json` (repo root): `rootDir: src`, `outDir: dist`, `strict`,
`noUncheckedIndexedAccess`, `noEmitOnError`. `node_modules/` is gitignored;
`dist/` is not.

## Deploy

1. `npx tsc`
2. Commit `dist/` alongside your `src/` changes.
3. Push — Pages serves the root `index.html` + `dist/` + `CSS/` + `data/`.

## Not done

No test setup, no lint config — matches the legacy site. `data/education.json`
still doesn't exist, so the education render logs one 404 (same as the legacy
site did); add that file when the section should populate.
