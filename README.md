# veridian-tech

Company website for **Veridian Tech Innovations Ltd** (RC 9367650), the company behind EasyPass.

React 19 · TypeScript (strict) · Vite 7 · Tailwind 4 · Cloudflare Workers (static assets + one API route).

## Commands

| | |
|---|---|
| `npm run dev` | Vite dev server (the contact form has no API here, so it shows its failure state) |
| `npm run typecheck` | `tsc --noEmit` (single tsconfig, so this really checks `src/`) |
| `npm run lint` | ESLint with typescript-eslint strict |
| `npm test` | Contact endpoint tests (`node --test`) |
| `npm run build` | Typecheck, then production build into `dist/` |
| `npx wrangler dev` | Built site + Worker locally, the closest thing to production |

Gate before every commit: `npm run lint && npm test && npm run build`.

## Structure

| Path | What lives there |
|---|---|
| `src/config/` | **All content facts**: `company.ts`, `services.ts`, `portfolio.ts` (client work), `products.ts` (EasyPass, RhemaVerse) |
| `src/components/` | Navbar, Footer, floating WhatsApp/call buttons, `ui.tsx` (split button, links, headings), `CircuitArt` |
| `src/sections/` | Home-page sections, reused by inner pages |
| `src/pages/` | One file per route |
| `src/index.css` | Emerald & Champagne tokens and every effect; all motion has a `prefers-reduced-motion` fallback |
| `public/work/` | Portfolio screenshots (top screen of each live site only) |
| `public/fonts/` | Self-hosted Inter Tight and Instrument Serif (no Google Fonts request) |

Light theme only: the logo's charcoal half disappears on dark backgrounds.

## Company facts and portfolio

Every name, number and address lives in `src/config/company.ts`. Pages read from there; never hardcode them.
**Never invent a fact.** `veridiantech.com` belongs to someone else; never use it.

To add client work, add one entry to `src/config/portfolio.ts` and a screenshot to `public/work/`.
Keep `url: null` until the site is publicly live (the card shows "Launching soon").
Clients are listed independently; never describe any two as related.
RhemaVerse is described without naming any church or customer.

## Contact form

`POST /api/contact` is handled by `worker/contact.js`:

- **Mailjet, sandbox by default.** Mailjet checks every message and delivers nothing (SandboxMode) unless `MAIL_LIVE` is exactly `true`.
  Go live only after the sending domain passes SPF and DKIM in Mailjet, then send one real test to our own inbox.
  Never loop or load-test the live form.
- **The office copy** goes to `CONTACT_TO` from "Veridian Tech Innovations Ltd", as a branded HTML email (`worker/office.js`) with one-tap Reply / WhatsApp / Call buttons, plus a plain-text copy. The visitor's address is the Reply-To. Everything the visitor typed is HTML-escaped. Both emails share `worker/emailLayout.js`.
- **The visitor gets a fixed acknowledgement** (`worker/receipt.js`, "we'll get back to you within 24 hours"). Its only variable parts are labels from the fixed lists (the service, and the reply method they chose). It must never become an open relay, so it repeats nothing the visitor typed (not even their name), goes at most once a minute to any one address (`RECEIPT_LIMITER`), is skipped for domains with no MX record, and is sent only after the office copy; a failed receipt never fails the enquiry.
- Honeypot field (`fax`), input validation, 16 KB body cap, and a rate limit of 5 per minute per IP (`CONTACT_LIMITER`).
- **IT equipment requests** (`it-supply`) have their own steps: items with optional quantities, delivery, then details with an optional upload. Files arrive as multipart (`payload` JSON plus up to 3 `files`), are checked by their contents in `worker/attachments.js` (PDF, Excel, Word, CSV, JPG, PNG; 8 MB each, 10 MB total, under Mailjet's 15 MB email cap), and are attached to the office copy only, never the visitor's acknowledgement. Item ids, purchase types and upload limits live in `enquiry-options.json`.
- The form (`src/components/EnquiryForm.tsx`) takes **one** choice on step 1 (the Worker rejects a list); a tap or click moves straight on, while keyboard arrows only change the choice and Continue confirms. It branches on that choice. Anything in the **build** group: what → timing and budget → details (3 steps). Only **other** options (Consultation, Partnership, Careers, General question): what → details (2 steps), and the message is required. Careers also asks for a role (required) and a LinkedIn or portfolio link (optional). There is deliberately no CV upload.
  Its option lists live in `src/config/enquiry-options.json`, which the Worker imports too, so an id the form sends is always one the Worker knows.
  Unknown ids are dropped, never trusted. Extra needs go in the last step's message box (its placeholder prompts for them). Email **or** phone is required, not both.
- In production a sandboxed send (`sandbox: true`) is treated as **not delivered**: the visitor gets the WhatsApp fallback with their request pre-typed, so no lead is silently lost.
- `/contact?service=<id>` opens the form with that service ticked (used by "Start this project" on the Services page).

Settings. The two keys and `MAIL_LIVE` are **secrets**, set in the Cloudflare dashboard (Worker → Settings → Variables and Secrets, type "Secret"), never in the repo. The two addresses are public and live in `wrangler.jsonc` under `vars`:

| Name | Value |
|---|---|
| `MAILJET_API_KEY` / `MAILJET_SECRET_KEY` | Veridian's own Mailjet account keys |
| `MAIL_FROM` | `noreply@veridiantechinnovationsltd.com` |
| `CONTACT_TO` | `info@veridiantechinnovationsltd.com` (Cloudflare Email Routing forwards it to the company Gmail) |
| `MAIL_LIVE` | `true` only when going live |

Until the first four are set the endpoint returns `503 not_configured`, and the form tells visitors to call instead.

## Deploy

Cloudflare Workers Builds, connected to this GitHub repo: push to `main` deploys.
`wrangler.jsonc` serves `dist/` with SPA fallback and runs the Worker only for `/api/*`.
GitHub Actions (`.github/workflows/ci-cd.yml`) is the quality gate: lint, test, audit, build.

Flow: push to `staging`, wait for CI to pass, then open a PR `staging → main`. Merging it deploys.
Preview builds are off, so `staging` never deploys.

Domain: `veridiantechinnovationsltd.com` (registered at HostingNigeria, DNS on Cloudflare).
- The bare domain is canonical, set in `src/config/site.json`.
- `www` is attached to the Worker too. A Cloudflare Redirect Rule ("Redirect from WWW to root") sends it to the bare domain with a 301.
- The DNS records for both are created by the `routes` in `wrangler.jsonc`. Do not add A or CNAME records for them by hand.

## SEO build

`npm run build` type-checks, builds the browser bundle, builds a server bundle
(`src/entry-server.tsx` into `dist-server/`), then runs `scripts/prerender.mjs`.

- **Every route ships as finished HTML** (`dist/about.html` is served at `/about`), with its own title, description, canonical and preview tags. They come from the page's `<Seo>` component, so there is one place to edit. The browser takes each page over with `hydrateRoot`.
- **Adding a page:** fixed pages go in `src/App.tsx` AND `src/config/site.json`. Pages generated from content files (services, IT supply, case studies, industries, blog posts) are listed by `src/config/routes.ts`, so adding an entry to the content file is enough. The prerender writes `sitemap.xml` from the same list. The build fails if a listed route is missing from `App.tsx`.
- **Structured data:** every page carries the Organization block (from `vite.config.js`). Pages add their own with `<JsonLd>` and the builders in `src/utils/schema.ts`: Service, FAQPage, Article and BreadcrumbList.
- **`dist/404.html`** is served with a real 404 status (`not_found_handling: "404-page"` in `wrangler.jsonc`).
- **Images:** after adding or replacing anything in `public/work/`, run `npm run images` and commit the `.webp` files and `src/config/image-manifest.json`. Render them with `<Shot>` (`src/components/ui.tsx`). The build fails if a page loads a file that is not there.
- **Caching and security headers:** `public/_headers`.
- **IndexNow:** on every push to `main`, the `indexnow` job in CI tells Bing which pages changed (`scripts/indexnow.mjs`, using `dist/content-manifest.json`). The key in `site.json` is public by design.
- **Hydration rule:** the first browser render must match the prerendered HTML. Never read `window`, the URL query or storage during render; see `EnquiryForm` for the pattern.

## IT supply and setup

The company's second side, beside software. Everything renders from `src/config/supply.ts`:
the hub (`/it-supply`), one page per service (`/it-supply/<id>`) and the order builder
(`/it-supply/build-your-order`), which turns "who the laptops are for and how many" into a
specification sheet and sends it through `/api/contact` as the `it-supply` option, or on WhatsApp.

- Adding a supply service: add it to `SUPPLY_SERVICES` and add `/it-supply/<id>` to `src/config/site.json`.
- **Nothing unconfirmed is claimed:** no past supply projects, no authorised-partner status, no warranty terms, no government registrations. Add a claim only once it is true.

## Quotation (Word)

`documents/quotation/` builds the quotation template and `documents/letterhead/` the letterhead and letter template. See their READMEs. The signature,
the generated files and every real quote are gitignored: this repository is public.

## Content for search (Phase 1)

| Pages | Content file |
|---|---|
| `/services/<id>`: one page per software service, with FAQs | `src/config/services.ts` + `src/config/serviceDetails.ts` |
| `/work/<id>`: one case study per client site | `src/config/caseStudies.ts` (+ `portfolio.ts`) |
| `/industries/<id>` | `src/config/industries.ts` |
| `/blog`, `/blog/<slug>` | `src/content/blog.ts` |

All of it is marked DRAFT for the owner's review. Case studies use only facts that are public on the client's live site. Prices appear only in the pricing guide.
