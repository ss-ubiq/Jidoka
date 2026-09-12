import { describe, it, expect } from "vitest";

import { families } from "@/data/families";
import { catalogueProducts } from "@/data/products";
import {
  catalogueSections,
  sectionByKey,
  sectionByProduct,
  sectionByProductName,
  productHref,
  subfamilyConfigureHref,
  configuratorHref,
} from "@/data/catalogueSections";
import { tools, toolHref, toolHrefForProduct, matchTool } from "@/data/tools";

const shaftTool = tools.find((t) => t.slug === "shaft-configurator")!;
const componentTool = tools.find((t) => t.slug === "component-configurator")!;

/** Pull the ?cat= section key back out of a configurator href. */
function catOf(href: string): string | null {
  const value = new URL(href, "https://example.test").searchParams.get("cat");
  return value;
}

describe("subfamilyConfigureHref", () => {
  it("returns null rather than a broken link for an unknown product name", () => {
    expect(subfamilyConfigureHref("Not A Real Product")).toBeNull();
    expect(subfamilyConfigureHref(undefined)).toBeNull();
    expect(subfamilyConfigureHref("")).toBeNull();
    // A rename would arrive as a near-miss like this one, not as an obvious typo.
    expect(subfamilyConfigureHref("guide shaft")).toBeNull();
  });

  it("returns a configurator URL whose cat key exists for every subfamily that has a section", () => {
    const linked = families
      .flatMap((f) => f.subfamilies)
      .filter((s) => s.product && sectionByProductName[s.product]);

    expect(linked.length).toBeGreaterThan(0);
    for (const sub of linked) {
      const href = subfamilyConfigureHref(sub.product)!;
      expect(href, sub.name).not.toBeNull();
      expect(href.startsWith("/tools/component-configurator?cat="), href).toBe(true);
      const cat = catOf(href)!;
      expect(sectionByKey[cat], `"${sub.name}" → cat=${cat}`).toBeDefined();
    }
  });

  it("returns null for a subfamily whose product has no transcribed section", () => {
    const unsectioned = catalogueProducts.filter((p) => !sectionByProduct[p.code]);

    // Currently just Cutters — but the point is the helper degrades to null, not a dead chip.
    expect(unsectioned.length).toBeGreaterThan(0);
    for (const p of unsectioned) {
      expect(subfamilyConfigureHref(p.name), p.name).toBeNull();
    }
  });
});

describe("sectionByProduct", () => {
  it("prefers the main catalogue book over the supplement when two sections share a product", () => {
    // AA7-2 (Ball Screw Supports) and AA7-3 (the supplement) both map to
    // JID-BALL-SCREW-SUPPORT. The main book must win, or every Ball Screw Support
    // link lands in the supplement.
    const sharing = catalogueSections.filter((s) => s.product === "JID-BALL-SCREW-SUPPORT");
    expect(sharing.map((s) => s.key)).toEqual(["AA7-2", "AA7-3"]);

    expect(sectionByProduct["JID-BALL-SCREW-SUPPORT"].key).toBe("AA7-2");
    expect(configuratorHref("JID-BALL-SCREW-SUPPORT")).toBe("/tools/component-configurator?cat=AA7-2");
  });

  it("resolves the first section in file order for any product with multiple sections", () => {
    const firstSeen = new Map<string, string>();
    for (const s of catalogueSections) {
      for (const code of [s.product, ...(s.alsoProducts ?? [])]) {
        if (!firstSeen.has(code)) firstSeen.set(code, s.key);
      }
    }
    for (const [code, key] of firstSeen) {
      expect(sectionByProduct[code].key, code).toBe(key);
    }
  });

  it("covers alsoProducts, so products printed inside another book still deep-link", () => {
    const also = catalogueSections.flatMap((s) => s.alsoProducts ?? []);
    expect(also.length).toBeGreaterThan(0);
    for (const code of also) {
      expect(sectionByProduct[code], code).toBeDefined();
    }
  });

  it("gives a plain configurator link when the product code is unknown or missing", () => {
    expect(configuratorHref("JID-NOT-A-PRODUCT")).toBe("/tools/component-configurator");
    expect(configuratorHref(undefined)).toBe("/tools/component-configurator");
  });
});

describe("productHref", () => {
  it("has a site page for every product referenced by a section", () => {
    for (const s of catalogueSections) {
      for (const code of [s.product, ...(s.alsoProducts ?? [])]) {
        expect(productHref[code], `section "${s.key}" → ${code}`).toBeDefined();
      }
    }
  });

  it("builds /products/<family slug>/<product slug> for every catalogue product", () => {
    expect(Object.keys(productHref)).toHaveLength(catalogueProducts.length);
    for (const p of catalogueProducts) {
      const family = families.find((f) => f.id === p.family)!;
      expect(productHref[p.code]).toBe(`/products/${family.slug}/${p.slug}`);
    }
  });
});

describe("toolHrefForProduct", () => {
  it("always produces a cat key that exists in sectionByKey", () => {
    const sections = componentTool.sections!;
    expect(Object.keys(sections).length).toBeGreaterThan(0);

    for (const code of Object.keys(sections)) {
      const href = toolHrefForProduct(componentTool, code);
      const cat = catOf(href)!;
      expect(cat, code).not.toBeNull();
      expect(sectionByKey[cat], `${code} → cat=${cat}`).toBeDefined();
    }
  });

  it("falls back to the bare tool URL when the tool knows no section for the product", () => {
    expect(toolHrefForProduct(componentTool, "JID-NOT-A-PRODUCT")).toBe("/tools/component-configurator");
    // The shaft configurator declares no sections map at all.
    expect(toolHrefForProduct(shaftTool, "JID-GUIDE-SHAFT")).toBe("/tools/shaft-configurator");
  });

  it("only maps product codes that really exist", () => {
    const codes = new Set(catalogueProducts.map((p) => p.code));
    for (const code of Object.keys(componentTool.sections!)) {
      expect(codes.has(code), code).toBe(true);
    }
  });
});

describe("matchTool", () => {
  it("resolves a bare shaft family prefix to the shaft configurator", () => {
    const prefix = shaftTool.codePrefixes[0];
    const hit = matchTool(prefix)!;

    expect(hit, prefix).not.toBeNull();
    expect(hit.tool.slug).toBe("shaft-configurator");
    expect(hit.code).toBe(prefix);
    expect(hit.href).toBe(toolHref(shaftTool, prefix));
    expect(hit.full).toBe(false);
  });

  it("resolves every declared shaft prefix, in lower case too", () => {
    for (const prefix of shaftTool.codePrefixes) {
      expect(matchTool(prefix)?.tool.slug, prefix).toBe("shaft-configurator");
      expect(matchTool(prefix.toLowerCase())?.tool.slug, prefix).toBe("shaft-configurator");
    }
  });

  it("recognises a full shaft part number across separator styles", () => {
    const prefix = shaftTool.codePrefixes[0];
    for (const query of [`${prefix}06-D10-L300`, `${prefix}06 D10 L300`, `${prefix}06_D10_L300`]) {
      const hit = matchTool(query)!;
      expect(hit, query).not.toBeNull();
      expect(hit.tool.slug).toBe("shaft-configurator");
      expect(hit.full, query).toBe(true);
    }
  });

  it("matches free text to a tool without a ?code deep link", () => {
    const hit = matchTool("linear shaft")!;
    expect(hit.tool.slug).toBe("shaft-configurator");
    expect(hit.href).toBe("/tools/shaft-configurator");
    expect(hit.code).toBeUndefined();
  });

  // Regression: the component configurator spans every catalogue and declares NO
  // codePrefixes. Joining an empty prefix list into `^(...)` once produced `^()` — a
  // regex that matches the empty string, so every query returned this tool with an
  // empty code. The guard is `if (t.codePrefixes.length)`.
  it("does not match a bare number to the component configurator", () => {
    expect(componentTool.codePrefixes).toHaveLength(0);
    for (const query of ["12345", "06", "2024", "150", "-", "..."]) {
      expect(matchTool(query), query).toBeNull();
    }
  });

  it("never returns a hit with an empty code", () => {
    for (const query of ["12345", "SCD06", "linear shaft", "part number", "xyzzy"]) {
      const hit = matchTool(query);
      if (hit && "code" in hit && hit.code !== undefined) expect(hit.code, query).not.toBe("");
    }
  });

  it("returns null for an empty query and for gibberish", () => {
    expect(matchTool("")).toBeNull();
    expect(matchTool("   ")).toBeNull();
    expect(matchTool("qwertyuiop asdfgh")).toBeNull();
  });

  it("keeps every tool's prefix list free of empty entries", () => {
    for (const t of tools) {
      for (const prefix of t.codePrefixes) {
        expect(prefix.trim(), t.slug).not.toBe("");
      }
    }
  });
});
