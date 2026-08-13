# JIDOKA — Website (Branch 2)

Public **B2B industrial component discovery, engineering solutions & technical enquiry** platform for JIDOKA. **Not e-commerce** — no cart, no checkout, no payment. The visitor journey is: discovery → technical confidence → requirement → RFQ / technical enquiry → JIDOKA sales conversation.

## Stack
Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS. Self-hostable, no mandatory paid SaaS/AI/search/CMS.

## Getting started
```bash
pnpm install
cp .env.example .env   # all values optional — site runs with none set
pnpm dev               # http://localhost:3000
pnpm build && pnpm start
```

## Structure
- `app/` — routes (homepage, products, solutions, applications, industries, engineering, forms, search, api).
- `components/` — `site/` (header, footer, mega-menus), `ui/`, `home/`, `forms/`, `search/`.
- `data/` — `families.ts` (12 public families), `products.ts` (50 verified catalogue products), `discovery.ts`.
- `lib/` — `site.ts` (brand/nav), `catalog.ts`, `utils.ts`.
- `docs/` — audit, IA, taxonomy, data-model, demand-analysis, design-system, RFQ-flow, SEO, implementation-plan.

## Principles
Never invent specs/certifications/stock. Internal customer & sales data is never published. Every page ends in an action (quote / requirement / engineer). See `docs/`.

## Branch 1 integration
Set `RFQ_FORWARD_URL` (+ optional `RFQ_FORWARD_TOKEN`) to forward enquiries to the JIDOKA AI Revenue Manager as qualified leads. Unset = enquiries are validated and logged locally.
