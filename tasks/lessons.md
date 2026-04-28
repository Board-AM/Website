# BAM Website — Lessons

## L1: CRLF line endings on Windows break the Edit tool
**Rule:** Never use the Edit tool to patch `index.html` on Windows. Use a Node.js `.cjs` script instead.
**Why:** The file has CRLF line endings. The Edit tool matches LF patterns and fails silently or errors. Node.js `replace(/\r\n/g, '\n')` normalizes before patching, then writes back LF (which browsers and git handle fine).
**How to apply:** Any time you need to insert or replace content in `index.html`, write a `tasks/_patch_*.cjs` script and run it with `node`.

## L2: Built Vite/React apps contain no static domain data
**Rule:** When a portfolio or data app is bundled with Vite/React, assume all domain data (holdings, scores, CEO names, weights, sectors) is fetched at runtime from an API — not embedded in the bundle.
**Why:** The Mag7 & S&P 500 Live Dashboard bundle had zero static portfolio configuration. Grepping for `ticker`, `ceo`, `sector`, `weight` etc. returned only UI logic, not data.
**How to apply:** Inspect bundles by grepping, but immediately check for API fetch calls. If data is fetched dynamically and no backend is available, create curated static data structures instead.

## L3: Verify anchor strings before running patch scripts
**Rule:** Always include explicit `process.exit(1)` guards for every anchor string in patch scripts, and log success per edit.
**Why:** Silent failures leave the file partially patched and are hard to diagnose. An explicit exit on missing anchor makes the failure obvious and prevents partial writes.
**How to apply:** Pattern: `if (!src.includes(ANCHOR)) { console.error('anchor not found'); process.exit(1); }` before every replacement.
