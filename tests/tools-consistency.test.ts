import { describe, it, expect } from "vitest";
import { tools, toolHrefForProduct, toolsByProduct } from "@/data/tools";
import { sectionByProduct } from "@/data/catalogueSections";

const configurator = tools.find((t) => t.slug === "component-configurator")!;

describe("component configurator product coverage", () => {
  it("lists every product at most once", () => {
    // Two sections share JID-BALL-SCREW-SUPPORT (AA7-2 main book, AA7-3 supplement).
    // Before dedup this produced two identical tool cards on that product page.
    const seen = new Set(configurator.productCodes);
    expect(configurator.productCodes.length).toBe(seen.size);
  });

  it("never attaches the same tool twice to one product", () => {
    for (const [code, list] of Object.entries(toolsByProduct)) {
      const slugs = list.map((t) => t.slug);
      expect(new Set(slugs).size, `${code} has a duplicate tool card`).toBe(slugs.length);
    }
  });
});

describe("one rule decides which catalogue section a product opens", () => {
  it("agrees with sectionByProduct for every product", () => {
    for (const [code, section] of Object.entries(sectionByProduct)) {
      expect(configurator.sections?.[code], `section map disagrees for ${code}`).toBe(section.key);
    }
  });

  it("sends Ball Screw Support to the main book, not the supplement", () => {
    expect(toolHrefForProduct(configurator, "JID-BALL-SCREW-SUPPORT")).toBe(
      "/tools/component-configurator?cat=AA7-2",
    );
  });
});
