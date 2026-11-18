# boardam.com — Update Proposal (branch: proposal/site-refresh)

Status legend: [ ] open · [~] decision needed · [x] done on branch

## 1. Public repository  [~ decided: private repo + Cloudflare, see tasks/cloudflare-setup.md]
- Repo is public; `inspiration/` holds the fund PDF, logo source (.ai) and draft pages; `tasks/` holds dev notes.
- Deleting files does NOT remove them from git history. Treat anything committed so far as already exposed.
- Options:
  a. Make repo private. GitHub Pages from a private repo needs a paid org plan.
  b. Stay public: move `inspiration/` + `tasks/` to a private repo, purge history (git filter-repo), force-push main. Touches live branch → do at go-live only.
  c. Make repo private + host on Cloudflare Pages (free plan supports private repos; 500 builds/mo).
     Branch previews on *.pages.dev (protect with Cloudflare Access). Go-live = repoint boardam.com DNS.
     Needs Board-AM org admin to install the Cloudflare GitHub app. Does not undo past exposure.

## 2. Contact form actually sending  [x code done; account setup in tasks/cloudflare-setup.md]
- Worker endpoint POST /api/contact → Cloudflare Email Service → info@boardam.com (Reply-To = visitor). Honeypot + optional Turnstile.
- Current: `mailto:` link → opens visitor's email client; fails silently if none configured. No record of submissions.
- Site is static (GitHub Pages), so needs a form service or small serverless endpoint:
  a. Hosted form service (Formspree / Web3Forms) — no backend, minutes to set up.
  b. Cloudflare Worker / Google Apps Script — free, more control, more to maintain.
- Needs: someone with access to info@boardam.com to register/verify the endpoint.

## 3. Contact email  [x]
- Keep info@boardam.com (live inline handler in index.html). No change.

## 4. Dead code: main.js  [x removed, with unused styles.css]
- Not loaded by index.html. Contains an old handler pointing to johan@anomalycapital.co.za. Delete.

## 5. Unused files  [ ]
- index.html is self-contained (inline CSS/JS, Google Fonts). NOT used: styles.css, main.js, static/background.mp4 (48 MB), background.jpeg, background-mobile.jpeg, logo.png, fonts/URWClassico-*.ttf.
- Remove from repo (or move to a private assets store).

## 6. Performance figures — compliance  [~]
- Decision: keep, but labelled illustrative/backtest at point of display. Pending FSCA marketing-rule review.
- "14.7% vs 10.6% CAGR 2005–2025", "Alpha-generating", portfolio holdings/weights/scores.

## 7. Methodology inconsistency  [~]
- Copy: "eight dimensions", "composite 0–10". Card: five dimensions, composite 78.2. BAM to confirm correct facts.

## 8. Live Returns link mismatch  [~]
- Desktop nav → external-dashboard-…us-central1.run.app; mobile nav → external-dashboard-…europe-west1.run.app. Confirm which is correct.

## 9. Investment Products copy  [ ]
- BAMCOR and AI² descriptions + facts (Strategy / Universe / Holdings / Access) are `[placeholder content goes here]`. Francois to write.
- AI² portfolio view: empty state until data supplied.

## 10. Treemap sector weights sum to 101%  [~]
- 39+12+9+10+9+8+5+3+2+2+2 = 101. Rounding? Confirm.

## 11. Methodology card rescaled to 0–10  [x]
- Card now 8.8 / 8.2 / 7.9 / 7.4 / 6.8, composite 7.8 (was 88…68, 78.2) to match the "0–10" copy and portfolio scores. Five vs eight dimensions still open (item 7).

## 12. Process scorecard scale  [x]
- Rescaled to 0–10: 9.5 / 8.5 / 1.0 / 7.1. All scores site-wide now 0–10.

## 13. CFA wording on Team cards  [~ parked by Francois]
- Francois and Louis show "CFA Level I". CFA Institute guidance prefers "Passed Level I of the CFA Program". Kept as-is by choice; review with compliance before go-live.
