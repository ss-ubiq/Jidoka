import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { describe, it, expect } from "vitest";

import { families, familyBySlug, familyById } from "@/data/families";
import { catalogueProducts } from "@/data/products";
import { catalogueSections, sectionByKey } from "@/data/catalogueSections";
import { redirects } from "@/data/redirects";
import { resolveProduct } from "@/lib/catalog";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));

const productNames = new Set(catalogueProducts.map((p) => p.name));
const productCodes = new Set(catalogueProducts.map((p) => p.code));

/** Duplicate values in a list, so failures name the offender instead of just a count. */
function duplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const v of values) {
    if (seen.has(v)) dupes.add(v);
    seen.add(v);
  }
  return [...dupes];
}

describe("catalogue size contract", () => {
  // Hardcoded on purpose: an accidental deletion in a data file should fail loudly.
  it("has 12 families, 72 subfamilies, 52 products and 50 configurator sections", () => {
    expect(families).toHaveLength(12);
    expect(families.flatMap((f) => f.subfamilies)).toHaveLength(72);
    expect(catalogueProducts).toHaveLength(52);
    expect(catalogueSections).toHaveLength(50);
    expect(redirects).toHaveLength(30);
  });
});

describe("families", () => {
  it("has unique ids, slugs, codes and demand ranks", () => {
    expect(duplicates(families.map((f) => f.id))).toEqual([]);
    expect(duplicates(families.map((f) => f.slug))).toEqual([]);
    expect(duplicates(families.map((f) => f.code))).toEqual([]);
    expect(duplicates(families.map((f) => String(f.demandRank)))).toEqual([]);
  });

  it("only references real family ids in commonlyUsedWith", () => {
    for (const f of families) {
      for (const id of f.commonlyUsedWith) {
        expect(familyById.has(id), `${f.id} → commonlyUsedWith "${id}"`).toBe(true);
      }
      // A family listed as related to itself would render a link back to the page you are on.
      expect(f.commonlyUsedWith).not.toContain(f.id);
    }
  });
});

describe("products", () => {
  it("has unique codes and unique slugs", () => {
    expect(duplicates(catalogueProducts.map((p) => p.code))).toEqual([]);
    expect(duplicates(catalogueProducts.map((p) => p.slug))).toEqual([]);
  });

  it("has unique names — the subfamily join is by name, so a collision is ambiguous", () => {
    expect(duplicates(catalogueProducts.map((p) => p.name))).toEqual([]);
  });

  it("belongs to a real family", () => {
    for (const p of catalogueProducts) {
      expect(familyById.has(p.family), `${p.code} → family "${p.family}"`).toBe(true);
    }
  });

  it("always has a catalogue PDF under /catalogues/", () => {
    for (const p of catalogueProducts) {
      expect(p.catalogueFile, `${p.code} has no catalogueFile`).toBeTruthy();
      expect(p.catalogueFile!.startsWith("/catalogues/"), `${p.code}: ${p.catalogueFile}`).toBe(true);
      expect(p.catalogueFile!.endsWith(".pdf"), `${p.code}: ${p.catalogueFile}`).toBe(true);
      expect(p.catalogueSizeMB).toBeGreaterThan(0);
    }
  });

  it("points every catalogue PDF (and supplement) at a file that exists in /public", () => {
    for (const p of catalogueProducts) {
      const docs = [p.catalogueFile!, ...(p.extraDocs ?? []).map((d) => d.file)];
      for (const file of docs) {
        const onDisk = path.join(repoRoot, "public", file.replace(/^\//, ""));
        expect(existsSync(onDisk), `${p.code}: missing public${file}`).toBe(true);
      }
    }
  });
});

describe("THE FRAGILE JOIN: Subfamily.product → CatalogueProduct.name", () => {
  // data/families.ts links a subfamily row to a catalogue product by NAME STRING, not by
  // code. Renaming a product in data/products.ts silently kills the "Configure" chip on
  // /products/[slug] instead of failing the build. This is the test that catches it.
  it("resolves every Subfamily.product to a real catalogue product name", () => {
    const linked = families.flatMap((f) =>
      f.subfamilies.filter((s) => s.product).map((s) => ({ family: f.id, sub: s.name, product: s.product! })),
    );

    expect(linked.length).toBeGreaterThan(0);
    for (const row of linked) {
      expect(
        productNames.has(row.product),
        `${row.family} / "${row.sub}" points at product name "${row.product}", which no longer exists in data/products.ts`,
      ).toBe(true);
    }
  });
});

describe("catalogue sections", () => {
  it("has unique keys", () => {
    expect(duplicates(catalogueSections.map((s) => s.key))).toEqual([]);
    expect(Object.keys(sectionByKey)).toHaveLength(catalogueSections.length);
  });

  it("references only real product codes in product and alsoProducts", () => {
    for (const s of catalogueSections) {
      expect(productCodes.has(s.product), `section "${s.key}" → product "${s.product}"`).toBe(true);
      for (const code of s.alsoProducts ?? []) {
        expect(productCodes.has(code), `section "${s.key}" → alsoProducts "${code}"`).toBe(true);
      }
      expect(s.title.trim()).not.toBe("");
      expect(s.families).toBeGreaterThan(0);
      expect(s.codes).toBeGreaterThan(0);
    }
  });

  it("never lists a section's own product in its alsoProducts", () => {
    for (const s of catalogueSections) {
      expect(s.alsoProducts ?? []).not.toContain(s.product);
    }
  });
});

describe("redirects", () => {
  it("has unique sources", () => {
    expect(duplicates(redirects.map((r) => r.source))).toEqual([]);
  });

  it("is a permanent 301 map with absolute paths on both sides", () => {
    for (const r of redirects) {
      expect(r.permanent, `${r.source} is not permanent`).toBe(true);
      expect(r.source.startsWith("/"), r.source).toBe(true);
      expect(r.destination.startsWith("/"), r.destination).toBe(true);
      // A destination that still carries a pattern token would emit a literal ":" URL.
      expect(r.destination).not.toContain(":");
    }
  });

  it("sends every destination to a route this site actually serves", () => {
    for (const r of redirects) {
      const segments = r.destination.split("/").filter(Boolean);

      // /products/<family>/<product> and /products/<family> are data-driven routes.
      if (segments[0] === "products" && segments.length === 3) {
        expect(resolveProduct(segments[1], segments[2]), r.destination).not.toBeNull();
        continue;
      }
      if (segments[0] === "products" && segments.length === 2) {
        expect(familyBySlug.has(segments[1]), r.destination).toBe(true);
        continue;
      }

      // Everything else is a static App Router page.
      const page = path.join(repoRoot, "app", ...segments, "page.tsx");
      expect(existsSync(page), `${r.source} → ${r.destination} has no app/${segments.join("/")}/page.tsx`).toBe(true);
    }
  });

  it("puts specific rules before their catch-all (first match wins in next.config)", () => {
    redirects.forEach((wildcard, wildcardIndex) => {
      const patternStart = wildcard.source.indexOf("/:");
      if (patternStart === -1) return;
      const prefix = wildcard.source.slice(0, patternStart) + "/";

      redirects.forEach((specific, specificIndex) => {
        if (specific.source.includes(":") || !specific.source.startsWith(prefix)) return;
        expect(
          specificIndex,
          `"${specific.source}" is shadowed by the earlier catch-all "${wildcard.source}"`,
        ).toBeLessThan(wildcardIndex);
      });
    });
  });
});
