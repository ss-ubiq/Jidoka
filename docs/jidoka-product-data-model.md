# JIDOKA Product Data Model (website)

Separates **data** from **presentation / search / content / RFQ** (§79). The website owns its own typed data files so it is self-contained and fast; it does **not** read Branch 1's `dev.db` at runtime (§65).

## Current shape (Phase 1 — typed TS data)

### `Family` — `data/families.ts`
```ts
type Family = {
  id: string; slug: string; code: string;        // "MD", "LM" …
  name: string; tagline: string; blurb: string;  // engineering context, no invented specs
  status: "catalogue" | "demand-verified";       // honesty flag (§63)
  internalCategories: string[];                   // maps to dev.db categories
  demandValueINR: number; demandCustomers: number;// internal priority signal only
  subfamilies: { name: string; product?: string }[];
  commonlyUsedWith: string[];                     // related-component intelligence (§28)
  applications: string[];
};
```

### `CatalogueProduct` — `data/products.ts` (50 rows, generated from `dev.db`)
```ts
type CatalogueProduct = { code: string; name: string; family: string; internalCategory: string };
```
Structured specs are **intentionally absent** — they live in catalogue PDFs and are never invented (§3, §26).

### `DiscoveryItem` — `data/discovery.ts`
Applications / Industries / Solutions, each linking to `familyIds`.

## Target shape (Phase 3 — the full Product Library, §62)

When structured technical data is verified and imported, expand to:

```
Product { id, code, name, familyId, subfamily, description,
          specifications[], variants[], applications[], industries[],
          relatedProductIds[], compatibleProductIds[],
          documents[] (catalogue/datasheet/drawing/CAD),
          images[], supplier?, availabilityStatus,
          verificationStatus: "VERIFIED" | "DRAFT_INTERNAL",   // only VERIFIED is public (§63)
          seo{ title, description }, publishedStatus }
```

Storage options (all self-hostable, §78): keep typed TS/JSON for content-scale data, or promote to the **same Prisma schema as Branch 1** (SQLite → Postgres) if the website gains an admin UI. The type above mirrors Branch 1's `Product`/`ProductDocument`/`ProductRelationship` so a shared schema is a drop-in later.

## Verification & publishing rules (§63)

- Nothing renders publicly unless it is catalogue-verified or clearly demand-verified.
- `demand-verified` families never claim stock; they present engineering context + enquiry.
- Specs, CAD, datasheets appear only where a real document exists; otherwise the page shows a "request documentation" action, never a fabricated table.

## Future-AI readiness (§64)

The family/subfamily/relationship graph + demand aggregates give a future **Product Intelligence** layer what it needs ("what is this / what's related / which family fits this application"), while the site stays fully functional without any AI.
