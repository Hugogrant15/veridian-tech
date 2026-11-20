# AGENTS.md: Veridian Tech Innovations Ltd website

> Orientation + working rules for anyone (human or AI agent) picking up this repo.
> Read this first, then `docs/` for depth.
>
> **This repository is PUBLIC.** This file is curated and secret-free: settings and secrets
> are named, never valued. No personal email addresses, account IDs, client data or revenue
> belong here. Real secrets live in the Cloudflare dashboard.
>
> Last updated: 2026-11-20

Company website for **Veridian Tech Innovations Ltd** (RC 9367650), the makers of EasyPass,
live at **https://veridiantechinnovationsltd.com**. The repo also holds the company's
business-document generators (letterhead, quotation) and marketing image renderers.

---

## Golden rules (break these and you cause real problems)

1. **Public repo.** Never commit secrets, `docs/`, `.dev.vars`, the MD's signature
   (`documents/quotation/private/`), generated documents (`documents/templates/`, `documents/quotes/`)
   or rendered marketing PNGs. They are all gitignored; keep it that way.
2. **Never invent facts.** No made-up clients, jobs, numbers, reviews or certifications. There are
   no IT-supply past jobs yet; do not imply any. All company facts come from `src/config/company.ts`.
3. **Mail is real.** Production sends live email (`MAIL_LIVE=true`). Never submit the live form,
   loop it, or send a live test without the owner explicitly saying so in that moment.
4. **Flow: `staging` → CI green → PR to `main` → merge.** Merging deploys. Never commit to `main`.
   Force-push is blocked; fix with follow-up commits. Commit messages end with the project's
   `Co-Authored-By:` line; never skip hooks.
5. **Gate before every commit:** `npm run lint && npm test && npm run build`.
6. **Separate companies, separate repos.** Veridian and Jantex are different companies: never mix
   them. Never add credits, links or files to client projects (Uwaoma, Stuzans, Prinx, RhemaVerse,
   EasyPass) from Veridian work; the owner does that. Never describe two clients as related.
7. **Ask before removing** any existing copy, section, asset or file.
8. **Never delete** `public/veridian-signature.png` or `public/obblink-logo.png`: sent emails link to them.
9. **Plan first.** The owner reviews a plan before code for any new feature.
10. **Docs discipline**: see the end of this file. Every change updates the docs and this file.

---

## Technical aspects to stay current on

### 1. Stack
React 19 · TypeScript strict (`noUncheckedIndexedAccess`) · Vite 7 · react-router 7 ·
Tailwind 4 **pinned at 4.1.18** (4.3.x breaks the build on the inline `<noscript><style>` in
`index.html`) · lucide-react · Node 22. Build tools are `devDependencies` so the production
`npm audit` gate stays clean.

### 2. How the site is built
`npm run build` = `tsc --noEmit` → `vite build` → `vite build --ssr src/entry-server.tsx` →
`scripts/prerender.mjs`, which writes one finished HTML file per route in `allRoutes()`
(`src/config/routes.ts`), a noindex `404.html`, `sitemap.xml` and `content-manifest.json`.
The prerender **fails the build** if a page lacks exactly one title / description / canonical /
og:title / h1, or references a missing file. `vite.config.js` injects Organization JSON-LD and writes
`robots.txt`. The single `tsconfig.json` includes `src/`, so `tsc --noEmit` really typechecks here.

### 3. Hosting: Cloudflare
- Cloudflare Worker `veridian-tech` with static assets from `dist/` (`not_found_handling: "404-page"`).
  The Worker code runs **only** for `/api/*` (`run_worker_first`).
- Custom domains: the bare domain and `www` (`wrangler.jsonc` routes). Canonical = **bare domain**;
  a dashboard Redirect Rule 301s www → root; http → https.
- Deploys: **Cloudflare Workers Builds**, connected to GitHub, deploys every push to `main`.
  Preview builds off. Rollback in the dashboard (Deployments) or revert via staging.
- Static headers (HSTS, nosniff, frame, referrer, permissions; cache rules) in `public/_headers`.
  No CSP yet; add one before any third-party script.
- Observability (logs) enabled; tiny usage since only `/api/contact` runs code.

### 4. The Worker: `POST /api/contact`
`worker/index.js` routes to `worker/contact.js`: content-type/size checks → JSON or multipart
(`payload` + up to 3 `files`) → honeypot `fax` → `validate()` against
`src/config/enquiry-options.json` (shared with the form) → `checkAttachments()` (magic bytes,
3 files / 8 MB each / 10 MB total) → `CONTACT_LIMITER` (5/min/IP) → Mailjet office copy
(`worker/office.js`, attachments only here) → acknowledgement (`worker/receipt.js`).
Status codes: 405, 415, 413, 400, 422, 429, 503 `not_configured`, 502 `send_failed`, 200.

### 5. Email
- **Sending:** Veridian's own Mailjet account (REST v3.1). `SandboxMode` unless secret
  `MAIL_LIVE === "true"`. Secrets: `MAILJET_API_KEY`, `MAILJET_SECRET_KEY`, `MAIL_LIVE`
  (Cloudflare dashboard). Public vars in `wrangler.jsonc`: `MAIL_FROM` (noreply@), `CONTACT_TO` (info@).
- Sender name is always the full **"Veridian Tech Innovations Ltd"**.
- **Acknowledgement is not an open relay:** fixed wording that repeats nothing typed,
  `RECEIPT_LIMITER` 1/min per address, skipped if the domain has no MX, sent only after the office
  copy, never fails the request.
- **Inbound:** Cloudflare Email Routing forwards `info@` and `ugochukwu@` to the company inbox.
- **DNS:** one SPF record (Cloudflare + Mailjet includes), DKIM for Mailjet and Cloudflare,
  DMARC `p=none` with reports to info@. All verified live 2026-11-20.
- EasyPass uses different providers; never share keys or reputation between the companies.

### 6. Forms
Enquiry stepper (`EnquiryForm.tsx`) with paths build `1→2→3`, other `1→3`, IT supply `1→4→5→3`;
order builder (`OrderBuilder.tsx`) at `/it-supply/build-your-order`. Change option lists only in
`enquiry-options.json`. Thank-you copy follows the visitor's chosen reply method. **Do not push
WhatsApp** to visitors who chose email or call. In production, `sandbox: true` = not delivered.

### 7. Deployment and CI
`.github/workflows/ci-cd.yml`: on push/PR to `main`/`staging` → `npm ci`, lint, test,
`npm audit --omit=dev --audit-level=high`, build. On push to `main` an `indexnow` job saves the
live `content-manifest.json`, builds, waits for the new deploy and pings Bing with changed pages.
CI never deploys; Cloudflare does.

### 8. Tests
`tests/contact.test.js`, `node --test`, **41 passing** (2026-11-20): sandbox/live, receipts and
relay guards, validation, IT supply fields, uploads, escaping, rate limits, error codes. Add a test
with every Worker change. Live checks are done by the owner.

### 9. SEO
Canonicals and absolute URLs from `SITE_ORIGIN` (never hardcode a host). JSON-LD builders in
`src/utils/schema.ts`. Sitemap and pages follow the content files automatically. IndexNow key in
`src/config/site.json` + `public/<key>.txt` is public by design. Search Console domain verified.
Ranking work outstanding: Google Business Profile, LinkedIn page, client credit links, then
Organization `sameAs`.

### 10. Design rules
Tokens in `src/index.css`. **Two-green rule:** `#11A159` (brand green) only on rules/shapes and
large bold text; `#075C33` for all small green text. Gold never carries text on light backgrounds.
Never build Tailwind classes by string interpolation. **Hydration:** never read
`window`/query/storage during render (first render must match the prerendered HTML).
Every animation has a reduced-motion fallback. Images: originals in `public/work/`, then
`npm run images`, commit the WebP files + `image-manifest.json`.

### 11. Business documents
`documents/letterhead` and `documents/quotation` are separate npm projects (`docx` + `jszip`):
`npm install && npm run build` writes to `documents/templates/` (gitignored). Close the files in
Word first. They follow the two-green rule; the letterhead footer carries "Makers of EasyPass".
Facts at the top of each script mirror `src/config/company.ts`; keep them in step.

### 12. Marketing images
`marketing/status-banner` (`render.cjs`, `render-poster.cjs`) and `marketing/og` (`render-og.cjs`
→ `public/og.png`) render HTML to PNG with Playwright (path passed as an argument; not a
dependency here). The renderers fail on overflow and on leaving WhatsApp's safe zone.

---

## Commands

| | |
|---|---|
| `npm run dev` | Vite dev server (no `/api`; the form shows its failure state) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (ignores `marketing/`, `documents/`) |
| `npm test` | Worker tests |
| `npm run build` | typecheck + client + server bundle + prerender |
| `npm run preview` | serve the built site |
| `npx wrangler dev` | built site + Worker locally (keys in `.dev.vars`, gitignored) |
| `npm run images` | WebP copies + image manifest |

Windows: if a local server hangs, use `127.0.0.1` and kill the leftover process by port.

---

## Current state (update when it stops being true)

- ✅ Site live; contact form + IT quote sending real mail; email routing and SPF/DKIM/DMARC live.
- ✅ CI green on `main`; 41 tests passing.
- ✅ Letterhead, letter template, quotation on the two-green rule (PRs #17–#19, 2026-11-20).
- ⏳ Owner actions: Gmail "Send mail as", signatures installed, live IT-quote test with a PDF,
  Google Business Profile, LinkedIn page, client credit links. Full list: `docs/roadmap.md`.
- ❓ Unverified: whether an old Vercel integration is still connected (unused); Cloudflare plan tier.

---

## Docs discipline (every change, same session)

`docs/` is **gitignored** (local only, get it from the owner's machine or handover, not `git clone`).

1. **`docs/implementation_status.md`**: add an entry for every shipped change. Always.
2. Update each doc the change touches and bump its `Last updated` date
   (new page → `project-structure.md`/`content-guide.md`; Worker/email → `email_architecture.md`,
   `enquiry-forms.md`, `security.md`, `testing.md`; infra/DNS → `infrastructure.md`; ship flow →
   `deployment.md`; colours/components → `design-system.md`; SEO → `seo.md`; documents → `documents.md`).
3. Update **this file's "Current state"** and any technical section that changed. Commit it with the change.
4. Move finished roadmap items out of `docs/roadmap.md`.
5. Write **(unverified)** rather than guess.

Start with `docs/README.md` for the full index.
