import { describe, it, expect } from "vitest";

import { families, familyById } from "@/data/families";
import { catalogueProducts } from "@/data/products";
import { allProductPaths, resolveProduct, searchCatalogue, productsOf } from "@/lib/catalog";

describe("allProductPaths", () => {
  it("returns exactly one path per catalogue product", () => {
    const paths = allProductPaths();
    expect(paths).toHaveLength(catalogueProducts.length);

    const unique = new Set(paths.map((p) => `${p.slug}/${p.product}`));
    expect(unique.size).toBe(paths.length);
  });

  it("produces a path that resolveProduct() can resolve back to the same product", () => {
    for (const { slug, product } of allProductPaths()) {
      const resolved = resolveProduct(slug, product);
      expect(resolved, `/products/${slug}/${product}`).not.toBeNull();
      expect(resolved!.product.slug).toBe(product);
      expect(resolved!.family.slug).toBe(slug);
      // generateStaticParams builds these pages; the pair must be internally consistent.
      expect(resolved!.product.family).toBe(resolved!.family.id);
    }
  });
});

describe("resolveProduct", () => {
  it("rejects a product requested under the wrong family", () => {
    const product = catalogueProducts.find((p) => p.family === "linear-motion")!;
    const otherFamily = families.find((f) => f.id !== product.family)!;

    expect(resolveProduct(otherFamily.slug, product.slug)).toBeNull();
  });

  it("returns null for unknown slugs instead of throwing", () => {
    const known = catalogueProducts[0];
    const knownFamily = familyById.get(known.family)!;

    expect(resolveProduct("no-such-family", known.slug)).toBeNull();
    expect(resolveProduct(knownFamily.slug, "no-such-product")).toBeNull();
    expect(resolveProduct("", "")).toBeNull();
  });
});

describe("productsOf", () => {
  it("partitions the whole catalogue across the families, with no strays", () => {
    const grouped = families.flatMap((f) => productsOf(f.id));
    expect(grouped).toHaveLength(catalogueProducts.length);

    for (const f of families) {
      for (const p of productsOf(f.id)) expect(p.family, p.code).toBe(f.id);
    }
  });

  it("returns an empty array (never undefined) for a family with no catalogue products", () => {
    expect(productsOf("no-such-family")).toEqual([]);
  });
});

describe("searchCatalogue", () => {
  it("finds a known product by its exact code", () => {
    const hits = searchCatalogue("JID-GUIDE-SHAFT");

    expect(hits.some((h) => h.kind === "product" && h.product.code === "JID-GUIDE-SHAFT")).toBe(true);
  });

  it("finds every product by its own code, case-insensitively", () => {
    for (const p of catalogueProducts) {
      const hits = searchCatalogue(p.code.toLowerCase());
      expect(
        hits.some((h) => h.kind === "product" && h.product.code === p.code),
        p.code,
      ).toBe(true);
    }
  });

  it("finds a product by a partial name", () => {
    const hits = searchCatalogue("bushing");

    expect(hits.some((h) => h.kind === "product" && h.product.name === "Oil-Free Bushing")).toBe(true);
  });

  it("attaches the resolved family to every product hit", () => {
    for (const hit of searchCatalogue("shaft")) {
      if (hit.kind === "product") expect(hit.family, hit.product.code).toBeDefined();
    }
  });

  it("finds a family by name and a subfamily by name", () => {
    const familyHits = searchCatalogue("Pneumatic Components");
    expect(familyHits.some((h) => h.kind === "family" && h.family.id === "pneumatics")).toBe(true);

    const subHits = searchCatalogue("Die Springs");
    expect(subHits.some((h) => h.kind === "subfamily" && h.name === "Die Springs")).toBe(true);
  });

  it("returns [] for gibberish and for an empty query", () => {
    expect(searchCatalogue("qwrtzpfxvbn")).toEqual([]);
    expect(searchCatalogue("")).toEqual([]);
    expect(searchCatalogue("   ")).toEqual([]);
  });
});
