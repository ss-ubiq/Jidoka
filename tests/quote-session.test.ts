import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import {
  LEGACY_KEYS,
  QUOTE_IDLE_MS,
  QUOTE_MAX_AGE_MS,
  QUOTE_MAX_ITEMS,
  QUOTE_MAX_QTY,
  QUOTE_STORAGE_KEY,
  itemSpec,
  newQuoteId,
  normalizeQty,
  sanitizeItems,
} from "@/lib/quote";

const tools = ["shaft-configurator", "component-configurator"] as const;
const toolSource = Object.fromEntries(
  tools.map((slug) => [slug, readFileSync(`public/tools/${slug}.embed.html`, "utf8")]),
) as Record<(typeof tools)[number], string>;

describe("quantities", () => {
  it("keeps whole positive units and rejects anything else", () => {
    expect(normalizeQty(5)).toBe(5);
    expect(normalizeQty("12")).toBe(12);
    expect(normalizeQty("abc")).toBe(1); // a typo must never become a quantity
    expect(normalizeQty("")).toBe(1);
    expect(normalizeQty(0)).toBe(1);
    expect(normalizeQty(-4)).toBe(1);
    expect(normalizeQty(2.9)).toBe(2);
    expect(normalizeQty(QUOTE_MAX_QTY * 10)).toBe(QUOTE_MAX_QTY);
  });

  it("parses the number instead of stripping non-digits", () => {
    // Stripping non-digits turned "-5" into 5 and "2.9" into 29 — a typo became an
    // order for 29 shafts. Found by the end-to-end run, fixed in both the site and
    // the configurators.
    expect(normalizeQty("-5")).toBe(1);
    expect(normalizeQty("2.9")).toBe(2);
    expect(normalizeQty("1,500")).toBe(1500);
    expect(normalizeQty("100 pcs")).toBe(100);
  });
});

describe("line items", () => {
  it("keeps one entry per part number, never a joined string", () => {
    const items = sanitizeItems([
      { id: "A", code: "SAD02-D6-L300", qty: 2, family: "Straight" },
      { id: "B", code: "SCE02D10L300", qty: "5" },
    ]);
    expect(items).toHaveLength(2);
    expect(items.map((i) => i.code)).toEqual(["SAD02-D6-L300", "SCE02D10L300"]);
    expect(items.map((i) => i.qty)).toEqual([2, 5]);
  });

  it("drops rows with no part number, and de-duplicates row ids", () => {
    expect(sanitizeItems([{ code: "", qty: 3 }, { qty: 1 }])).toEqual([]);
    const dup = sanitizeItems([
      { id: "X", code: "AAA", qty: 1 },
      { id: "X", code: "BBB", qty: 1 },
    ]);
    expect(dup).toHaveLength(1);
  });

  it("survives anything a hand-edited payload could contain", () => {
    expect(sanitizeItems(null)).toEqual([]);
    expect(sanitizeItems("SAD02")).toEqual([]);
    expect(sanitizeItems([null, 7, "x"])).toEqual([]);
    expect(sanitizeItems(Array.from({ length: 500 }, (_, i) => ({ code: `C${i}`, qty: 1 })))).toHaveLength(
      QUOTE_MAX_ITEMS,
    );
    const [long] = sanitizeItems([{ code: "A".repeat(9000), qty: 1 }]);
    expect(long.code.length).toBeLessThanOrEqual(200);
  });

  it("strips control characters that would break an email header or CSV", () => {
    const nasty = ["SAD02", String.fromCharCode(13), String.fromCharCode(10), String.fromCharCode(0), "-D6"].join("");
    const [it] = sanitizeItems([{ code: nasty, qty: 1 }]);
    expect(it.code).not.toMatch(/[\u0000-\u001f\u007f]/);
    expect(it.code).toContain("SAD02");
  });

  it("describes a configuration without repeating itself", () => {
    expect(itemSpec({ id: "1", code: "X", qty: 1, family: "Steel", material: "Steel" })).toBe("Steel");
    expect(itemSpec({ id: "1", code: "X", qty: 1 })).toBe("");
  });
});

describe("quote ids", () => {
  it("are unique and readable", () => {
    const ids = new Set(Array.from({ length: 500 }, newQuoteId));
    expect(ids.size).toBe(500);
    expect(newQuoteId()).toMatch(/^JQ-[0-9A-Z]+-[A-Z2-9]{4}$/);
    // No characters that get misread when a customer reads the reference aloud.
    expect(newQuoteId().slice(-4)).not.toMatch(/[ILO01]/);
  });
});

describe("the configurators and the site agree on one quotation list", () => {
  it.each(tools)("%s stores the list in sessionStorage under the shared key", (slug) => {
    const src = toolSource[slug];
    expect(src).toContain(`const QUOTE_KEY = '${QUOTE_STORAGE_KEY}'`);
    expect(src).toContain("window.sessionStorage");
  });

  it.each(tools)("%s no longer writes the list to localStorage", (slug) => {
    // This was the bug: localStorage survives the browser closing, so a visitor's
    // quotation list came back days later.
    expect(toolSource[slug]).not.toContain("localStorage.setItem");
  });

  it.each(tools)("%s clears the keys the old build left behind", (slug) => {
    for (const key of LEGACY_KEYS) {
      expect(toolSource[slug]).toContain(`localStorage.removeItem('${key}')`);
    }
  });

  it.each(tools)("%s expires a list on the same schedule as lib/quote.ts", (slug) => {
    const src = toolSource[slug];
    expect(src).toContain(`const QUOTE_IDLE_MS = ${QUOTE_IDLE_MS / 3_600_000} * 60 * 60 * 1000`);
    expect(src).toContain(`const QUOTE_MAX_AGE_MS = ${QUOTE_MAX_AGE_MS / 3_600_000} * 60 * 60 * 1000`);
    expect(src).toContain(`const QUOTE_MAX_ITEMS = ${QUOTE_MAX_ITEMS}, QUOTE_MAX_QTY = ${QUOTE_MAX_QTY}`);
  });

  it.each(tools)("%s hands the list over by session id, not by flattening it into the URL", (slug) => {
    const src = toolSource[slug];
    expect(src).toContain("quote: q.quoteId");
    // The old hand-off built one comma-joined `ref` of every code plus a `qty` string.
    expect(src).not.toMatch(/const qty = items\.length === 1/);
  });

  it.each(tools)("%s adds quantity to an existing row instead of duplicating it", (slug) => {
    expect(toolSource[slug]).toContain("state.list.find(x => x.code === it.code)");
  });

  it.each(tools)("%s asks before emptying the list", (slug) => {
    expect(toolSource[slug]).toContain("state.confirmClear");
  });
});

describe("a visit lands on a fresh configurator", () => {
  it.each(tools)("%s keeps only the list, never the configuration on screen", (slug) => {
    // The configurator's own field state used to be stored too, so returning to the tool
    // in the same tab restored a half-built part number.
    expect(toolSource[slug]).not.toContain("jidoka.cfg.");
    expect(toolSource[slug]).not.toContain("CFG_KEY");
    expect(toolSource[slug]).toContain("function save(){ saveQuote(); }");
  });

  it("the shaft tool no longer builds a part number nobody asked for", () => {
    // It used to open on a complete SCD02-D10-L300-M3, which read as "already configured"
    // and invited a quote for a shaft the visitor never chose.
    expect(toolSource["shaft-configurator"]).not.toContain("applyCode('SCD')");
    expect(toolSource["shaft-configurator"]).toContain("if (qsCode) applyCode(qsCode);");
  });

  it("the component tool opens a catalogue section without picking a family", () => {
    const src = toolSource["component-configurator"];
    // It needs a catalogue to render, but never a family.
    expect(src).toContain("state.cat = f.cat; state.fam = null;");
    expect(src).not.toContain("state.cat = f.cat; state.fam = f.uid;");
  });

  it.each(tools)("%s still honours an explicit deep link", (slug) => {
    // ?code= (a part number from search) and ?cat= (a product page's catalogue section)
    // are the visitor asking for something — those must keep working.
    const src = toolSource[slug];
    expect(src).toMatch(slug === "shaft-configurator" ? /get\('code'\)/ : /get\('cat'\)/);
  });
});

describe("the full-screen link must not strand the quotation list", () => {
  // Chrome puts every target="_blank" tab in its own browsing context group unless the
  // link opts back in, and a tab in a new group does not inherit sessionStorage. Without
  // rel="opener" the visitor arrives full-screen with an empty list.
  it.each([
    ["shaft-configurator", "app/tools/shaft-configurator/page.tsx"],
    ["component-configurator", "app/tools/component-configurator/page.tsx"],
  ])("%s keeps rel=\"opener\" on its Open full-screen link", (_slug, file) => {
    const src = readFileSync(file, "utf8");
    const label = src.indexOf("Open full-screen");
    expect(label, "the Open full-screen link is gone").toBeGreaterThan(-1);
    // Just the opening <a> tag — the comment above it explains noopener, so a looser
    // window would match the word in the prose rather than in the attributes.
    const tag = src.slice(src.lastIndexOf("<a", label), label);
    expect(tag).toContain('target="_blank"');
    expect(tag).toContain('rel="opener"');
    expect(tag).not.toContain("noopener");
  });
});
