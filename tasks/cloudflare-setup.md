# boardam.com on Cloudflare — setup and cutover

Branch: `site-v1` (one commit on top of `main`). The domain `boardam.com` is already on Cloudflare DNS.

| File | What it does |
|---|---|
| `wrangler.jsonc` | Worker `boardam-site`: serves `./dist`, runs code only for `/api/*`, email binding locked to info@boardam.com |
| `worker/index.js` | `POST /api/contact` → validates, spam-checks (honeypot, optional Turnstile), emails info@boardam.com with Reply-To = visitor |
| `public/_headers` | Security headers on every page; long cache on hashed `/assets/*` |
| `index.html` | The site. Form posts to `/api/contact` |

Checked before handover: `npm run build` (304 KB, all images resolve), `wrangler deploy --dry-run` (passes), local `wrangler dev` (page 200, headers present, form → `{"ok":true}`, email simulated).

Phases A–C do **not** touch the live site. Phase D is the go-live.

---

## Phase A — Preview on Cloudflare (no effect on live site)

1. **Push** `site-v1` to `Board-AM/Website`. GitHub Pages only publishes `main`, so nothing changes live.
2. Cloudflare dashboard → **Workers & Pages → Create → Import a repository** → connect GitHub → `Board-AM/Website`.
   - A **Board-AM org admin** must approve the Cloudflare GitHub app.
   - Project name: `boardam-site` (must match `name` in `wrangler.jsonc`)
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Non-production branch deploy command: `npx wrangler versions upload`
   - Production branch: `main`
   - Turn on **builds for non-production branches**.
3. The `site-v1` build gets a **preview URL** (`site-v1-boardam-site.<account>.workers.dev`). Review the site there.
   The contact form returns an error until Phase B — expected.

## Phase B — Contact form email (no effect on live site)

The form sends **from** `website@forms.boardam.com` **to** `info@boardam.com`. Using the `forms.` subdomain means the root MX records are never touched, so the info@ mailbox keeps working exactly as now.

1. Before anything: Cloudflare → `boardam.com` → **DNS** → export/screenshot all records (MX, TXT/SPF/DKIM/DMARC, `@`, `www`). This is the rollback copy.
2. **Email → Email Routing** → enable on the **subdomain** `forms.boardam.com`. Cloudflare adds MX/SPF/DKIM records on `forms.boardam.com` only.
   - If it offers to change MX records on `boardam.com` itself: **stop and decline.**
3. **Destination addresses** → add `info@boardam.com` → click the link in the verification email.
4. Re-run the `site-v1` build. Submit the form on the preview URL → the message arrives at info@boardam.com; Reply answers the visitor.

### Optional: Turnstile (recommended once live)

1. **Turnstile** → add widget → hostnames `boardam.com`, `www.boardam.com`, the preview host → *Managed*.
2. Site key → `index.html`: `<meta name="turnstile-sitekey" content="SITE_KEY">`
3. Secret → Worker → **Settings → Variables and secrets** → `TURNSTILE_SECRET` (type: Secret).

## Phase C — Final review

- Desktop + phone on the preview URL: all sections, both product tabs, hover cards, contact form.
- Open items before publishing: team photos (Johan, Rohan, third member), BAMCOR blocks vs portfolio, AI² 30% allocation gap, compliance sign-off on performance figures and logos.

## Phase D — Go live (the cutover)

1. Merge `site-v1` → `main`. Cloudflare builds and deploys production.
2. Worker `boardam-site` → **Settings → Domains & Routes → Add → Custom domain** → `boardam.com`.
   Cloudflare asks to replace the existing GitHub Pages records for `@` → confirm.
3. **www → boardam.com redirect:** Rules → **Redirect Rules** → template *Redirect from WWW to root* (301, keep query string).
   `www` needs a proxied DNS record (orange cloud) for the rule to fire; if it is a CNAME to GitHub, change it to `AAAA www 100::` proxied.
4. Test: `https://boardam.com` loads the new site, `https://www.boardam.com/anything` redirects, the form sends, and a normal email to info@boardam.com still arrives.
5. After a few days stable: GitHub → Settings → Pages → disable; delete `CNAME`; consider making the repo **private** (Workers Builds works with private repos on the free plan).

## Rollback

- **Site:** remove the custom domain from the Worker, recreate the GitHub Pages `@`/`www` records from the Phase B copy (DNS only), re-enable Pages.
- **Form:** the site keeps working; visitors are told to email info@boardam.com directly.

## Local testing

```bash
npm install
npm run cf:dev        # builds, then serves at http://localhost:8787
```

Email is simulated locally: wrangler prints the message and writes it to `.wrangler/tmp/email/…`.
