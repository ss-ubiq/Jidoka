# JIDOKA Website Design System — "Premium Industrial Precision"

Shares DNA with Branch 1 (graphite neutrals, one steel-blue accent, amber heat signal) so both branches read as one company — tuned here for a public, editorial, high-trust experience. Implemented in `tailwind.config.ts` + `app/globals.css`.

## Principles (§20, §46, §85)

Premium · technical · precise · confident · minimal · high-trust. Wow comes from **design, navigation, search, typography and engineering depth** — not neon, fake AI, or over-animation. Credible to a senior automotive/tooling procurement manager.

## Color (§47) — all CSS variables, light + dark

| Token | Role | Light |
|---|---|---|
| `bg` / `surface` / `surface-2/3` | ground & cards | near-white graphite scale |
| `fg` / `fg-subtle` / `muted` | text hierarchy | deep graphite → muted |
| `border` / `border-strong` | hairlines & edges | cool grey |
| **`accent`** | primary CTA, links, active | **steel blue `211 90% 42%`** (JIDOKA) |
| `heat` | action/heat signal | amber `26 90% 50%` |
| `positive` / `warning` / `danger` | status | green / amber / red |
| `ink` | dark section ground | near-black graphite |

One accent only — no rainbow UI. Dark mode fully redefined (system preference + explicit `data-theme` toggle wins both directions). `:focus-visible` ring everywhere.

## Typography (§46)

- **Sans:** Inter (self-hosted via `next/font`, no external CDN).
- **Mono:** JetBrains Mono — used for eyebrows, codes, part numbers, technical metadata (the "engineering" texture).
- Fluid display scale: `display-lg`, `display`, `heading-lg` via `clamp()`. Balanced/pretty text-wrap.

## Layout & motion

- `container-page` (max 80rem), generous section rhythm (`Section` = ~7rem vertical).
- Engineering-grid backdrop (`bg-grid`) + precision hairlines evoke technical drawings.
- Motion is subtle: `fade-in`, `scale-in`, hover lifts, cubic-bezier `precise`. **`prefers-reduced-motion` fully respected** (§50, §76).

## Components (`components/ui`, `components/site`)

`Button`/`LinkButton` (4 variants × 3 sizes) · `Section` · `Eyebrow` · `SectionHeading` · `Badge` (status tones) · `Logo` (wordmark + aperture mark; swap for official SVG when supplied) · `Header` (sticky, 3 mega-menus, mobile drawer) · `Footer` (final CTA + columns) · `PageHeader` (breadcrumb) · `CtaBand` · `PlaceholderNotice` · `DiscoveryHub`/`Detail` · `EnquiryForm` + `FormPage`.

## Product-explorer UI (§22) — NOT e-commerce

Engineering cards: family code chip, name, technical tagline/blurb, status badge, subfamily/product counts, "Explore". **No** Add to Cart / Buy / price / discount / stock badges anywhere. Primary action is always **Request Quote / Send Requirement / Ask an Engineer**.

## Accessibility (§76)

Semantic landmarks, skip-link, keyboard-navigable menus (Escape closes, focus rings), labelled inputs, alt text policy, AA contrast targets, reduced-motion.

## Performance (§77)

Static/SSG pages, First Load JS ~105–120 kB, self-hosted fonts, minimal client JS (only header, forms, search box are client components), no effect-only libraries.
