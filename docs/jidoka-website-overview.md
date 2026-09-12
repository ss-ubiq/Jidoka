# JIDOKA Website — What has been built

**Status:** live at [jidoka.in](https://jidoka.in) · Last updated 12 September 2026

A B2B industrial component **discovery and technical-enquiry platform** for JIDOKA
Automation India LLP. Explicitly **not e-commerce** — there is no cart, no checkout, no
payment, and no price or stock anywhere on the site. The visitor journey ends in a
conversation with JIDOKA's engineering team, not a transaction.

```
discovery → technical confidence → requirement → RFQ / technical enquiry → sales conversation
```

---

## 1. At a glance

| | |
|---|---|
| **Pages built** | 149 |
| **Navigation families** (the 12 top-level product groups in the menu) | 12 |
| **Catalogue products** (each with its own page and catalogue PDF) | 52 |
| **Catalogue sections transcribed** into the configurator | 50 of 52 |
| **Configurator families** (a distinct dimension table inside a section) | 1,227 |
| **Buildable part-number variants** | 3,311 |
| **SEO keyword landing pages** | 28 |
| **Interactive tools** | 2 |
| **Solution / application / industry routes** | 7 / 11 / 8 |
| **Automated tests** | see §14 |
| **Legacy permanent redirects** (308) | 31 |
| **Automated tests** | 90 |

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · pnpm.
Hosted on Netlify; the application code is self-hostable. **No paid SaaS, CMS, search
service or AI dependency** in the application itself — which is not the same as zero
operating cost, since hosting and email remain provider services on their own plans.

The site browses, searches and configures with no configuration at all. **Production
enquiries additionally require a verified delivery destination** (SMTP, and optionally the
Branch 1 forward) and catalogue hosting via `NEXT_PUBLIC_CATALOGUE_BASE`. Without a
delivery destination the enquiry endpoint refuses submissions rather than accepting them
into nothing.

---

## 2. What a customer can do

### Find a component
- **12 product families** → subfamilies → **52 individual product pages**, each carrying
  its catalogue PDF, the codes it covers, and a route into an enquiry.
- **Search** across products, families and part-number prefixes. Typing a part number such
  as `SCE02D10L300M3` is recognised and offers to open it in the configurator, already
  configured.
- **Four discovery routes** for people who don't know the part name: by *Solution*
  (Mould & Die, Automation, Machine Building…), by *Application*, by *Industry*, or by
  describing the requirement in plain words.
- **28 keyword landing pages** (`/components/…`) targeting the terms engineers actually
  search — ejector pins, guide posts, die springs, linear bearings, button dies and so on.

### Build a part number
Two interactive configurators. Each is a single self-contained HTML file — its catalogue
data, dimension tables and validation logic are all inside the page, so once loaded it keeps
working through a dropped connection. **It is not an offline app:** the component
configurator’s 1,227 family drawings are separate files fetched on demand, and catalogue
PDF downloads always need connectivity.

| Tool | Covers |
|---|---|
| **Shaft Configurator** `/tools/shaft-configurator` | Guide shafts in depth — 23 families with full dimension tables |
| **Component Configurator** `/tools/component-configurator` | The whole catalogue — 50 sections, 1,227 families, 3,311 codes |

Each one validates the part number against the real catalogue tables as you build it, shows
the engineering drawing and specification, links back to the source catalogue page, and
refuses to produce a code the catalogue cannot supply.

### Request a quote
- **Quotation list** — collect configured part numbers across both tools and both
  catalogues into a single request. Every part code is its **own line item** with its own
  quantity, configuration and controls.
- **Six enquiry modes** from one form component: quotation, general requirement,
  alternative/replacement, BOM review, custom component, and Ask an Engineer.
- **No account, ever.** File attachments (drawing, CAD, BOM, photo): up to **5 files,
  3 MB each, 3.5 MB total**, sized to the hosting platform’s ~4.5 MB effective request
  limit. Anything larger is refused up front with instructions to email it, rather than
  failing at submit time. A submission returns a reference only once a destination has
  accepted it.

### Get technical help
`/engineering-desk` (Ask an Engineer), `/engineering/find-an-alternative`,
`/engineering/submit-bom`, `/engineering/custom-component`, `/engineering/compare`,
plus a resources library and CAD/catalogue downloads.

---

## 3. How the quotation workflow works

This is the part most recently rebuilt (12 September 2026). Full design notes in
[`jidoka-rfq-flow.md`](./jidoka-rfq-flow.md).

### The active quotation list
Stored in the visitor's own browser under `sessionStorage` key `jidoka.quote.v1`
(`lib/quote.ts`, mirrored by an identical block inside each tool's HTML).

| Event | Quotation list | Configurator |
|---|---|---|
| Refresh the page | kept | reset to blank |
| Move between pages, same tab | kept | reset to blank |
| Hand off to Request a Quote | kept | — |
| New tab or window (typed URL, bookmark, ordinary link) | **empty** | blank |
| Tab opened by the tool’s own “Open full-screen” link (`rel="opener"`) | **carried over, deliberately** | blank |
| Close and reopen the browser | **empty** | blank |
| Restored session, under 8 h idle | kept | blank |
| Restored session, over 8 h idle / 24 h old | **empty** | blank |
| Submission succeeds | **cleared** | blank |
| Submission fails | kept, so it can be retried | blank |
| "Start new quote" (two-step) | **cleared** | blank |

It is not a cart. Nothing is priced, reserved or ordered — it is simply the list of part
numbers the visitor wants quoted, and it never leaves their browser until they submit.

### Line items end to end
One row per configured part code — product, part number, configuration, catalogue page,
quantity, remove control — preserved identically through **form → submission payload →
email**. Codes are never joined into a single text field. Re-adding the same configuration
adds quantity to the existing row rather than creating a duplicate.

### Customer tracking without login
- Each working list carries an **anonymous quote id** (`JQ-…`). While the visitor is
  browsing it identifies *which parts belong together*, never a person, and it is discarded
  with the list. **On submission it is sent alongside the contact details they typed**, so
  from that point it is linked to an identified customer in the lead payload.
- The **customer** is identified only by the contact details they choose to give.
- Each submission gets a unique **`RFQ-…` reference** (time plus random suffix, so two
  enquiries in the same millisecond cannot collide) carrying the contact details, the
  individual part codes, their quantities and the submission timestamp.
- That reference is a **confirmation identifier only**. There is no status lookup, no
  customer portal and no way to query an enquiry by it — it exists so a person can quote it
  in an email or a phone call.

No registration is required or offered, because nothing in the workflow needs one.

### Privacy and isolation
There is **no database, no cookie and no server-side session** anywhere in the site. The
quotation list exists only in the visitor's own browser; `/request-a-quote` is served
`Cache-Control: private, no-cache, no-store`. Verified with two independent browser
sessions configuring and submitting simultaneously: separate quote ids, references,
contact details and line items, with no mixing. No visitor can see another's parts or
enquiry.

---

## 4. Where an enquiry goes

```
Visitor submits
      │
      ▼
POST /api/enquiry ── rate limit · size bounds · field validation ·
      │              strict line-item validation · upload contract
      │
      ├─► Email to RFQ_TO — line-item table + the actual attachments (SMTP)
      └─► Forward to Branch 1 as a qualified lead (optional, JSON: no file bytes)
      │
      ▼
  accepted only if a destination confirmed the COMPLETE enquiry
      │
      ├── yes → 200 + reference; the quotation list is cleared
      └── no  → 502/503 retryable; nothing is cleared, nothing is claimed
```

**What is and is not guaranteed.** A 200 and a reference mean a configured destination
accepted the enquiry, attachments included. There is no durable queue and no retry: if
delivery fails, the visitor is told at the time and asked to resend — the enquiry is not
held anywhere for later recovery. Server logs carry statuses only, never the enquiry
content, so they are **not** a recovery mechanism and are not treated as one.

Because the Branch 1 forward carries JSON — filenames, not file bytes — it cannot by
itself accept an enquiry that has attachments. Email can. The endpoint enforces that
distinction rather than counting any success as good enough.

Branch 1 is the JIDOKA AI Revenue Manager; the lead contract is documented in
[`jidoka-branch1-integration.md`](./jidoka-branch1-integration.md).

---

## 5. Every page on the site

30 route files produce 149 built pages. `○` static · `●` generated from data · `ƒ` rendered on demand.

| Route | | What it is |
|---|---|---|
| `/` | ○ | Homepage — hero with animated blueprint, search, family carousel, discovery hub |
| `/products` | ○ | All 12 families |
| `/products/[slug]` | ● | One family — subfamilies, products, tools, guides |
| `/products/[slug]/[product]` | ● | One catalogue product — codes, catalogue PDF, "Build a part number" |
| `/components` | ○ | Keyword hub |
| `/components/[slug]` | ● | 28 SEO landing pages — content, FAQs, FAQPage schema |
| `/solutions`, `/solutions/[slug]` | ○ ● | 7 solution routes (Mould & Die, Automation, Machine Building…) |
| `/applications`, `/applications/[slug]` | ○ ● | 11 application routes — discovery by what you're building |
| `/industries`, `/industries/[slug]` | ○ ● | 8 industry routes — discovery by sector |
| `/search` | ƒ | Catalogue search + part-number recognition |
| `/tools/shaft-configurator` | ƒ | Guide-shaft configurator |
| `/tools/component-configurator` | ƒ | Whole-catalogue configurator |
| `/request-a-quote` | ƒ | RFQ form + quotation list |
| `/send-requirement` | ○ | "I don't know the part" route |
| `/engineering-desk` | ƒ | Ask an Engineer |
| `/engineering` | ○ | Engineering services hub |
| `/engineering/find-an-alternative` | ƒ | Replacement / cross-reference enquiry |
| `/engineering/submit-bom` | ○ | BOM review |
| `/engineering/custom-component` | ○ | Custom manufacture enquiry |
| `/engineering/compare` | ○ | Side-by-side component comparison |
| `/resources`, `/resources/catalogues`, `/resources/cad` | ○ | Technical library, 50 catalogue PDFs, CAD |
| `/about`, `/contact` | ○ | Company, contact surface + map |
| `/privacy`, `/terms` | ○ | Full policies drafted from the implementation — **carrying a "pending JIDOKA approval" banner until the business signs them off** |
| `/not-found` | ○ | 404 with recovery routes |

**Endpoints:** `POST /api/enquiry` (RFQ intake) · `POST /api/track` (analytics) ·
`/sitemap.xml` · `/robots.txt`.

---

## 6. The UI layer

### Design tokens
Every colour is an HSL triple on `:root`, redefined for dark mode — so the whole system
stays consistent and Tailwind can apply alpha to any of them.

| Token group | |
|---|---|
| Surfaces | `--bg` `--surface` `--surface-2` `--surface-3` |
| Text | `--fg` `--fg-subtle` `--muted` `--ink` |
| Lines | `--border` `--border-strong` |
| Brand | `--accent` (engineering blue `211 90% 42%`) · `--accent-soft` · `--heat` |
| Status | `--positive` `--warning` `--danger` |
| Type | Inter (sans) · JetBrains Mono (part numbers, codes, references) |
| Shape | `--radius: 12px` |

**Theming:** three states — explicit light, explicit dark (`data-theme`), and system
default via `prefers-color-scheme`.

### Component inventory

| Area | Components |
|---|---|
| **Site chrome** | `Header` (scroll-progress hairline), `ProductsMegaMenu`, `Footer`, `MobileActionBar` (persistent Quote / Call / WhatsApp on phones), `Logo`, `PageHeader`, `CtaBand`, `DiscoveryHub` |
| **UI** | `Button`, `Carousel` (zero-dependency scroll-snap, swipeable), `Primitives` — `Section`, `Eyebrow`, `SectionHeading`, `Badge` |
| **Forms** | `EnquiryForm` (six modes + quotation list), `FormPage` (layout + "what happens next" panel) |
| **Home** | `HeroSearch`, `HeroTicker` (family-code marquee), `HeroVisual` (self-drawing blueprint of real parts) |
| **Products** | `CatalogueDownload` |
| **Search** | `SearchBox` |
| **Engineering** | `CompareTool` |
| **Motion** | `Reveal`, `TiltCard`, `MotionAuto` |
| **SEO / analytics** | `JsonLd`, `TrackOnMount` |

### Page-header artwork
Every inner page carries an animated blueprint drawing chosen from **17 motifs** — `pin`,
`spring`, `bearing`, `gear`, `profile`, `pneumatic`, `bolt`, `plate`, `gripper`, `cutter`,
`caster`, `draft`, `cube`, `sheet`, `assembly`, `factory`, `caliper`. Each of the 12
families maps to a unique one, and every page passes an explicit motif rather than falling
back to a default. Pure linework, with no invented dimension numbers.

### Motion system
Zero dependencies, all transform/opacity, entirely CSS keyframes + IntersectionObserver:
scroll reveals, 3D card tilt with cursor spotlight, shimmer headings, button sheen, route
transition fade, animated grid backdrops, self-drawing hero. `MotionAuto` applies it per
navigation so new pages animate without wiring. The whole layer collapses to its resting
frame under `prefers-reduced-motion`, and server-rendered markup stays visible without
JavaScript.

---

## 7. Search

`searchCatalogue()` returns three kinds of hit — **family**, **subfamily** and **product** —
ranked, with no external search service. Alongside it, `matchTool()` recognises a typed
**part number** (`SCE02D10L300M3`) or a tool term and offers to open the configurator with
that code already applied. A no-result state routes to "Send requirement" rather than a
dead end, and both outcomes emit an analytics event.

---

## 8. SEO

| | |
|---|---|
| **Structured data** | `Organization`, `WebSite` + `SearchAction`, `Product`, `Brand`, `BreadcrumbList`/`ListItem`, `ItemList`, `FAQPage` + `Question`/`Answer`, `DigitalDocument`, `PostalAddress`, `EntryPoint` |
| **Sitemap** | Generated from real data (`app/sitemap.ts`), keyword pages at priority 0.9 |
| **Robots** | `app/robots.ts`; the raw tool HTML is `noindex` so the framed route stays canonical |
| **Metadata** | Per-route title/description on every page |
| **Migration** | 31 permanent redirects from the legacy WooCommerce shop's indexed URLs, host-agnostic. Next emits **308** for these, not 301 — verified against the running server; search engines consolidate both identically |
| **Internal linking** | Footer popular components, family guide chips, mega-menu, product↔catalogue both directions |

---

## 9. Analytics and privacy

Self-hostable, **no cookies at all**, and Do-Not-Track is honoured. Nine allow-listed
events — anything else is dropped at the endpoint:

`search_performed` · `search_no_result` · `product_view` · `family_view` · `rfq_start` ·
`rfq_submit` · `resource_download` · `contact_click` · `cta_click`

**Each event declares exactly which properties it may carry**, and they are all bounded
enums, counts or flags — enforced in the browser and again at the endpoint, which is public
and therefore trusts nothing. Raw free text is never sent: **what a visitor types into the
search box does not leave their browser.** Only a classification (`part-code` or `term`) and
a length go. Query strings are stripped from the reported path for the same reason.

Precise scope, rather than a blanket claim: **analytics collects no personal data**; enquiry
processing does handle personal data, by definition, and the hosting provider keeps its own
short-term technical logs including IP addresses. Our own request logs carry statuses only
— no contact details, requirement text or filenames.

Events go via `navigator.sendBeacon`, never block the UI, and fail silently.
`ANALYTICS_FORWARD_URL` can point them at a self-hosted Plausible/Umami; unset, they are
logged.

---

## 10. Security limits

| Control | Value |
|---|---|
| Required fields | name, company, valid email |
| Uploads | **5 files, 3 MB each, 3.5 MB total**, enforced in the browser and again on the server |
| Whole-request budget | 4 MB, refused with a readable message before the body is buffered |
| Allowed file types | `pdf dwg dxf step stp igs iges png jpg jpeg xlsx xls csv zip` — anything else rejected |
| Filenames | Sanitised before they reach a mail client or a file system |
| Email attachments | Every accepted file is attached **or the send fails** — never silently dropped |
| Field bounds | Per-field length limits on every text input; oversized fields rejected |
| Quotation list | Strictly validated on submission — malformed JSON, bad quantities, duplicates or an over-length list are **refused with a reason**, never silently repaired |
| Flood control | Best-effort per-instance rate limit (8 enquiries/min, 120 events/min) plus a honeypot field. Not a durable control — see §16 |
| Output escaping | All visitor text escaped in the email |
| Upstream timeouts | 10 s Branch 1 forward, 2 s analytics forward — neither can hold a response open |

---

## 11. Environment variables

All optional — the site builds and runs with none of them set.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_JIDOKA_EMAIL` / `_PHONE` / `_WHATSAPP` | Contact surface |
| `NEXT_PUBLIC_MAPS_QUERY` | Office map lookup |
| `NEXT_PUBLIC_CATALOGUE_BASE` | Rewrites catalogue PDF links to the release-asset host |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASS` | RFQ email delivery |
| `EMAIL_FROM` · `RFQ_TO` | Sender and recipient |
| `RFQ_FORWARD_URL` · `RFQ_FORWARD_TOKEN` | Branch 1 lead forwarding |
| `ANALYTICS_FORWARD_URL` | Self-hosted analytics sink |

---

## 12. Performance

| | |
|---|---|
| Shared First Load JS | **102 kB** across every page |
| Rendering | Static/SSG wherever possible; only search, tools and the forms render on demand |
| Images | None by design — the site is typographic (code chips, blueprint linework) |
| Configurator weight | 9.5 MB page + 35 MB of content-hashed drawings, lazy-loaded and cached forever; a rebuild rewrites only what changed |
| Dependencies | **7** runtime packages — next, react, react-dom, lucide-react, clsx, tailwind-merge, nodemailer (Tailwind itself is build-time only) |

---

## 13. Design and build principles

- **Never invent** specifications, certifications, stock or customer stories. Where data is
  missing, the page says so honestly and offers to get it.
- **Never publish** internal customer, sales or pricing data.
- **No mandatory paid service** — free and self-hostable throughout.
- **Every page ends in an action** — quote, requirement, or engineer.
- **Verified equivalence only** — the site never auto-claims a JIDOKA part replaces another
  brand's. Alternatives are "submitted for technical review"; equivalence is asserted only
  after a human confirms it.
- **Interlinking rule** — no product appears anywhere without a link to its catalogue, in
  both directions. Enforced at build time: `publish_web.py` fails if a catalogue section is
  unmapped.
- **Motion** — a zero-dependency "precision in motion" layer (scroll reveals, blueprint
  drawings of real parts, 3D card tilt, shimmer headings, card carousel), all
  transform/opacity only and fully disabled under `prefers-reduced-motion`.
- **Accessibility and mobile** — the site is typographic by design, works without
  JavaScript for content, and every tool has been fixed for phone widths.

---

## 14. Quality gates

`pnpm verify` runs all four:

Measured on revision `50a1b97` plus the working tree, 12 September 2026:

| Gate | Command | Result |
|---|---|---|
| Types | `pnpm typecheck` | clean |
| Lint | `pnpm lint` | clean |
| Tests | `pnpm test` | 7 suites passing |
| Build | `pnpm build` | 149 pages |

The suites cover data integrity, internal links, route coverage, tool/catalogue
consistency, the quotation-session contract (including that `lib/quote.ts` and the two tool
HTML files never drift apart), the RFQ email's line-item rendering and attachment
integrity, and enquiry intake — delivery refusal, upload limits, strict line-item
validation, reference collisions and analytics property filtering.

**What the gates do not establish:** they are Node-level and build-level checks. Real
browser accessibility, contrast, mobile performance on a slow connection, production inbox
receipt and deployed behaviour are separate evidence — see the readiness report.

---

## 15. Deployment

```
merge to main → git push origin main → Netlify builds → live at jidoka.in in 2–4 minutes
```

Catalogue PDFs are served as GitHub release assets rather than committed (1.95 GB), via
`NEXT_PUBLIC_CATALOGUE_BASE`. Email delivery uses Gmail SMTP to `info@jidoka.in`.

The full runbook — environment variables (which are production-required vs optional,
build-time vs runtime), platform limits, pre-release checks, the post-deploy smoke test,
CI gating and rollback — is [`jidoka-deployment.md`](./jidoka-deployment.md), rewritten on
12 September 2026 to replace the abandoned VPS plan it used to describe.

**Deploys are not currently gated on CI.** GitHub Actions runs the same four checks on
every push, but Netlify builds in parallel rather than waiting for them. Closing that needs
branch protection plus a Netlify deploy setting — both owner actions, documented in the
runbook.

---

## 16. Open items

- Google Search Console verification and sitemap submission (owner action).
- A product photo library — the site is deliberately typographic until JIDOKA supplies its
  own images.
- Two catalogue products have no transcribed section yet (conveyor gripping units,
  universal joints); the Cutters catalogue is not transcribed.
- Adding `ec.jidoka.in` as a Netlify domain alias would let the existing redirect map catch the
  legacy shop's indexed URLs directly.

---

## Reference

| Area | File |
|---|---|
| RFQ & quotation workflow | `docs/jidoka-rfq-flow.md` |
| Configurator tools | `CONFIGURATOR-README.md` |
| Branch 1 integration | `docs/jidoka-branch1-integration.md` |
| Information architecture | `docs/jidoka-information-architecture.md` |
| Product taxonomy & data model | `docs/jidoka-product-taxonomy.md`, `docs/jidoka-product-data-model.md` |
| Design system | `docs/jidoka-design-system.md` |
| SEO strategy | `docs/jidoka-seo-strategy.md` |
