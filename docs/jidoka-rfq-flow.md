# JIDOKA RFQ & Technical Enquiry Flow

The RFQ system is the site's core conversion engine (§42). It is deliberately **not** a checkout.

## One form component, six modes

`components/forms/EnquiryForm.tsx` renders the right fields per `mode`:

| Mode | Page | Emphasis |
|---|---|---|
| `quote` | `/request-a-quote` | part number + quantity |
| `requirement` | `/send-requirement` | "what are you building / what must it do" (no part code needed, §43) |
| `engineer` | `/engineering-desk` | full technical enquiry (§32) |
| `alternative` | `/engineering/find-an-alternative` | existing part/supplier + verified-equivalence rule (§33) |
| `bom` | `/engineering/submit-bom` | Excel/CSV/PDF BOM upload (§34) |
| `custom` | `/engineering/custom-component` | material/dimensions/tolerance/finish (§35) |

## Fields (superset, §42)

Name*, Company*, Email*, Phone · Industry · Requirement type (7 options) · Product/Part number · Quantity · What are you building / What must it do · Technical requirement/notes · **File upload** (drawing/CAD/PDF/photo/BOM) · Required date · Preferred contact.

## Requirement types (§32)

Product quotation · Alternative/replacement · Technical recommendation · Custom component · BOM review · Bulk requirement · General enquiry.

## File handling & security (§81)

- Client: type allow-list (`pdf, dwg, dxf, step/stp, igs/iges, png, jpg/jpeg, xlsx, xls, csv, zip`) + 25 MB/file cap, immediate feedback.
- Server (`/api/enquiry`, Node runtime): re-validates required fields, email format, **file extension allow-list and size** (defence in depth), builds a structured record. No data trusted from the client alone.

## The active quotation list

A visitor configures part numbers in `/tools/*`, collects them, and sends them as one
enquiry. That working list is **not** a cart: nothing is priced, reserved or ordered.

- **Where it lives:** `sessionStorage`, key `jidoka.quote.v1` — see `lib/quote.ts`, mirrored
  by an identical block inside each tool's HTML (the tools are standalone files with no
  build step; `tests/quote-session.test.ts` asserts the two do not drift apart).
- **Why sessionStorage:** it survives a refresh and moving between pages in the same tab,
  a new window starts empty, and closing the browser drops it — without anyone having to
  detect a close, which is never reliable. It was `localStorage` until 2026-09-12, which
  is why visitors' lists came back days later.
- **Session restore:** "continue where you left off" and Ctrl+Shift+T bring sessionStorage
  back, so the payload carries `startedAt` / `updatedAt` and is discarded once it is 8 h
  idle or 24 h old. Timestamps, not storage, are what expire a list.
- **Isolation:** the list never leaves the visitor's own browser until they submit. There
  is no server-side session, no cookie and no shared store, and `/request-a-quote` is
  served `Cache-Control: private, no-cache, no-store`.
- **Identity:** the list carries an anonymous `quoteId` (`JQ-...`). It identifies a working
  session, never a person — the customer is identified only by the contact details they
  type into the form. No login is required or offered.
- **Line items:** one entry per configured part number, each with its own quantity and
  specification, all the way through form → `POST /api/enquiry` → `lead.items` → email
  table. Codes are never joined into one text field. Re-adding the same configuration
  adds quantity to the existing row instead of creating a second one.
- **Lifecycle:** cleared on a confirmed submission only; a failed submission keeps it so
  the visitor can retry. "Start new quote" (two-step, in the tool and on the form) clears
  it on demand.
- **The configurator itself is never restored.** Only the list persists. Both tools used
  to preselect a family on load — the shaft tool went as far as building a complete
  `SCD02-D10-L300-M3` — so the tool looked already configured and invited a quote for a
  part nobody chose. A visit now opens on "choose a family" with **Add to list**
  disabled. A configuration is preselected only when the visitor asked for one:
  `?code=` (a part number from search) or `?cat=` (a product page's catalogue section,
  which lands on that section's family list).

## Integration point with Branch 1 (§65)

`/api/enquiry`:
1. Validates.
2. If `RFQ_FORWARD_URL` is set → forwards the enquiry (with optional `RFQ_FORWARD_TOKEN` bearer) to Branch 1 to become a qualified **lead**.
3. Else → logs server-side so nothing is lost. **The site is fully functional with no integration configured** (§78).

Future flow (§65): `Website → RFQ → Lead → Customer → Requirement → Branch 1 → Qualification → Sales action → Follow-up`.

## UX guarantees

- No account, no cart, no payment. Success state confirms an engineer will respond.
- Every product/family/application/industry/resource page routes into the appropriate mode (§67).
- The "I don't know the exact product" path (`/send-requirement`) is reachable from search, the no-result state, mega-menu, and the homepage panel (§18 Path 4, §24, §58).

## The verified-equivalence rule (§33)

The site **never** auto-claims a JIDOKA part is an equivalent replacement. Alternatives are always "submitted for technical review"; equivalence is asserted only after human verification.
