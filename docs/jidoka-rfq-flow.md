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
