# JIDOKA Information Architecture

## Primary navigation (§52, §70)

`HOME · PRODUCTS · SOLUTIONS · APPLICATIONS · INDUSTRIES · ENGINEERING · RESOURCES · ABOUT` + global **Search** + **Request a Quote**.

Header is sticky, becomes translucent/blurred on scroll, and exposes three mega-menus (Products, Solutions, Engineering). Implemented in `components/site/Header.tsx`.

## Four discovery paths (§18) — the backbone

1. **Product** — "I know the component." → `/products` → `/products/[family]` → subfamily → RFQ.
2. **Application** — "I know what I'm building." → `/applications` → `/applications/[slug]` → families → enquiry.
3. **Industry** — "I know my industry." → `/industries` → `/industries/[slug]` → families → enquiry.
4. **Requirement** — "I don't know the exact product." → `/send-requirement` (drawing/photo/CAD/BOM) → engineering review. **Always reachable** from header search, no-result state, every family page, and the homepage "Not sure what you need?" panel.

## Route map (all implemented, all build as static/SSG except forms/api)

```
/                             Homepage (hero, 4 paths, families, solutions, engineering desk, why, resources)
/products                     Engineering product explorer (12 families, demand-ordered)
/products/[slug]              Family page — subfamilies, catalogue products, engineering context,
                              commonly-used-with, resources, RFQ sidebar   (SSG ×12)
/solutions   /solutions/[slug]        Solution disciplines → relevant families   (SSG ×7)
/applications /applications/[slug]    Application discovery → families            (SSG ×11)
/industries  /industries/[slug]       Industry discovery → families               (SSG ×8)
/engineering                  Engineering hub (tools index)
/engineering/find-an-alternative      Alternative/replacement enquiry (verified-equivalence rule)
/engineering/submit-bom               BOM upload & review
/engineering/custom-component         Custom / made-to-drawing enquiry
/engineering/compare                  Component comparison (Phase 3 tool; honest placeholder + CTA)
/engineering-desk             Ask an Engineer — structured technical enquiry (§32)
/request-a-quote              RFQ (§42)
/send-requirement             Smart requirement form (§43)
/search                       Global search + no-result → send-requirement (§24, §58)
/resources   /resources/cad           Technical library (Phase 3 document serving)
/about  /contact  /privacy  /terms
/api/enquiry                  Enquiry intake → Branch 1 integration point (§65)
/sitemap.xml  /robots.txt     SEO
```

## Page contract (§75)

Every page answers: **What is this? Who is it for? Where is it used? What technical info matters? What's related? What if I don't know what I need? What next?** The last is enforced by a `CtaBand` (or form) on every page — no dead ends.

## Mega-menu contents

- **Products** (§53): all 12 families (code chip + tagline) + View all / Part number search / Technical resources + "Not sure what you need?" panel.
- **Solutions** (§54): Mould & Die, Automation, Machine Building, Linear Motion, Power Transmission, Pneumatics, Component Sourcing, BOM Support, Custom Components.
- **Engineering** (§55): Product Finder, Part Number Search, Compare, Technical Library, CAD & Drawings, Ask an Engineer, Find an Alternative, Submit BOM, Custom Component.

## Mobile (§51, §86)

Header collapses to a drawer; primary CTAs (Request a Quote, Send Requirement) stay one tap away; search is a persistent icon. Call/WhatsApp surface when configured.
