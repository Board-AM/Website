# BAM Website — Portfolios Section

## Source Inspection Finding
The `Mag7 & S&P 500 Live Dashboard` bundle is a live market dashboard (React/Vite, Nasdaq API).
No static portfolio data, scores, CEO names, or sector weights are embedded in the bundle.
Section was built from curated public data (tickers, CEO names, approximate market-cap weights, BAM leadership scores).

## Implementation Checklist
- [x] Inspect portfolio app source/assets
- [x] Determine data strategy (curated static data — live API data not portable)
- [x] CSS added (scoped `.portfolio-` prefix, BAM design system vars, responsive)
- [x] HTML section inserted between Team and Contact (`id="portfolios"`)
- [x] Portfolio tabs: Mag7 | S&P 500
- [x] Summary cards: Holdings, Avg Score, Top Sector, Top Holding
- [x] Holdings table: Company, Ticker, CEO, Sector, Weight, Score
- [x] Sector allocation panel with bar visual
- [x] Disclaimer footer
- [x] Desktop nav: About · Process · Team · **Portfolios** · Contact
- [x] Mobile nav: same order
- [x] JS IIFE scoped — no global variable collisions
- [x] Tab switching (aria-selected, active class)
- [x] JS renders on DOMContentLoaded (safe init guard)
- [x] Responsive: 2-col summary cards at ≤900px, stacked layout at ≤900px, smaller cards at ≤600px
- [x] 19/19 automated verification checks passed
- [x] Patch script: `tasks/_patch_portfolios.cjs` (can be deleted)

## Review
Applied 2026-04-27. Portfolio section inserted at line 1762 of index.html (2309 lines total).
Portfolios: Mag7 (7 holdings) and S&P 500 (top 10 holdings + full sector allocation).
Nav order: About · Process · Team · Portfolios · Contact (desktop and mobile).
Open index.html in browser and scroll to Portfolios to verify tabs, table, allocation panel.
Check DevTools console for errors.
