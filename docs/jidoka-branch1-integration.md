# Branch 1 Integration — Website → AI Revenue Manager

Clean, one-directional integration (§65): the website captures a technical enquiry and hands it to Branch 1 as a **qualified lead**. Codebases stay separate; the only coupling is this HTTP contract.

## Configuration

| Env | Meaning |
|---|---|
| `RFQ_FORWARD_URL` | Branch 1 endpoint that accepts a lead (JSON POST). Unset → enquiries are validated and logged locally; the site stays fully functional. |
| `RFQ_FORWARD_TOKEN` | Optional bearer token sent as `Authorization: Bearer <token>`. |

The website POSTs with a 10 s timeout; if Branch 1 is slow or down, the enquiry is logged server-side and the visitor still gets a success + reference (no lost leads, §42).

## Lead payload (POST `RFQ_FORWARD_URL`)

```jsonc
{
  "reference": "RFQ-XXXXXX",           // stable id, also shown to the visitor
  "source": "website",
  "mode": "quote|requirement|engineer|alternative|bom|custom",
  "requirementType": "Product quotation | Alternative / replacement | ...",
  "contact": { "name": "", "company": "", "email": "", "phone": "" },
  "details": {
    "industry": "", "partNumber": "", "quantity": "", "reference": "",
    "building": "", "function": "", "notes": "",
    "requiredDate": "", "preferredContact": "Email|Phone|WhatsApp"
  },
  "fileNames": ["drawing.pdf"],          // names only; binary transfer TBD (see below)
  "fileCount": 1,
  "receivedAt": "ISO-8601"
}
```

Branch 1 should map this onto its `Requirement` / lead + `Company`/`Contact` entities (which already exist in its Prisma schema) and run qualification → next-best-action.

## Files

Phase-3 sends file **names + count**. Options to add binary transfer when Branch 1 exposes intake:
1. Multipart passthrough to a Branch 1 upload endpoint, or
2. Website stores to object storage and sends signed URLs.
Both are self-hostable; neither is built yet (no Branch 1 endpoint exists to receive them).

## Suggested Branch 1 endpoint

`POST /api/leads/intake` returning `{ ok: true, leadId }`. Validate the bearer token, upsert Company by name/email, create the Requirement, enqueue qualification. Idempotency: dedupe on `reference`.

## Downstream flow (§65)

`Website → RFQ → Lead → Company/Contact → Requirement → Branch 1 qualification → sales action → follow-up → opportunity.`

## What is NOT shared

No customer/sales/price data flows **from** Branch 1 to the public site. The website never reads Branch 1's DB; integration is outbound-only.
