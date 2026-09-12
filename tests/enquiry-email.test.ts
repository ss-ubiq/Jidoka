import { describe, it, expect } from "vitest";
import { renderHtml, renderText, type EnquiryLead } from "@/lib/email";
import type { QuoteItem } from "@/lib/quote";

const items: QuoteItem[] = [
  {
    id: "SAD02-D6-L300",
    code: "SAD02-D6-L300",
    qty: 2,
    family: "Standard - Straight Type",
    material: "GCr15 (SUJ2)",
    catalogue: "Guide Shaft catalogue",
    page: "11",
  },
  {
    id: "SAE02-D6-L500",
    code: "SAE02-D6-L500",
    qty: 25,
    family: "With Retaining Ring Grooves",
    material: "GCr15 (SUJ2)",
    catalogue: "Guide Shaft catalogue",
    page: "12",
  },
  { id: "ACF23-206", code: "ACF23-206", qty: 400, catalogue: "Aluminium Profiles", page: "787" },
];

const lead = (over: Partial<EnquiryLead> = {}): EnquiryLead => ({
  reference: "RFQ-TEST01",
  quoteId: "JQ-TEST-ABCD",
  mode: "quote",
  requirementType: "Product quotation",
  contact: { name: "Test Buyer", company: "Test Engineering", email: "buyer@example.com", phone: "" },
  items,
  details: { preferredContact: "Email", notes: "" },
  fileNames: [],
  ...over,
});

describe("the RFQ email keeps every part code on its own line", () => {
  it("renders one table row per line item", () => {
    const html = renderHtml(lead());
    const rows = html.split("<tr>").filter((r) => r.includes("SAD02") || r.includes("SAE02") || r.includes("ACF23"));
    expect(rows).toHaveLength(3);
    for (const item of items) expect(html).toContain(item.code);
  });

  it("keeps each quantity in its own row, not in a shared field", () => {
    const html = renderHtml(lead());
    for (const item of items) {
      const row = html.split("<tr>").find((r) => r.includes(item.code))!;
      expect(row, `${item.code} lost its quantity`).toContain(`>${item.qty}<`);
      // No other item's quantity may appear in this row.
      for (const other of items.filter((o) => o.code !== item.code)) {
        expect(row).not.toContain(other.code);
      }
    }
  });

  it("never joins the codes into one string", () => {
    const html = renderHtml(lead());
    expect(html).not.toContain("SAD02-D6-L300, SAE02-D6-L500");
    expect(html).not.toContain("SAD02-D6-L300: 2");
  });

  it("names the free-text field 'Other part number' when a list is attached", () => {
    const withBoth = renderHtml(lead({ details: { partNumber: "MYKP32-120", preferredContact: "Email" } }));
    expect(withBoth).toContain("Other part number");
    const withoutList = renderHtml(lead({ items: [], details: { partNumber: "MYKP32-120", preferredContact: "Email" } }));
    expect(withoutList).toContain("Part number");
    expect(withoutList).not.toContain("Other part number");
  });

  it("carries the anonymous quote session so the list can be traced back", () => {
    expect(renderHtml(lead())).toContain("JQ-TEST-ABCD");
    expect(renderText(lead())).toContain("JQ-TEST-ABCD");
  });

  it("gives the plain-text part one line per item too", () => {
    const text = renderText(lead());
    const lines = text.split("\n").filter((l) => /^\s+\d+\. /.test(l));
    expect(lines).toHaveLength(3);
    expect(lines[1]).toContain("SAE02-D6-L500");
    expect(lines[1]).toContain("qty 25");
  });

  it("still renders an enquiry that has no line items", () => {
    const html = renderHtml(lead({ items: undefined, details: { partNumber: "MYKP32-120", preferredContact: "Email" } }));
    expect(html).toContain("MYKP32-120");
    expect(html).not.toContain("Quotation list");
  });

  it("fails rather than silently dropping an attachment past the budget", async () => {
    // It used to `continue` past any file that did not fit, so the sales team received an
    // email listing a drawing that was not attached — and the customer was told it arrived.
    const { sendEnquiryEmail } = await import("@/lib/email");
    process.env.SMTP_HOST = "smtp.test";
    process.env.SMTP_PORT = "465";
    const huge = { name: "big.step", size: 30 * 1024 * 1024, arrayBuffer: async () => new ArrayBuffer(8) } as unknown as File;
    const r = await sendEnquiryEmail(lead(), [huge]);
    expect(r.sent).toBe(false);
    expect(r.error).toMatch(/budget/i);
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_PORT;
  });

  it("escapes anything a visitor typed", () => {
    const html = renderHtml(lead({ items: [{ id: "1", code: "<script>x</script>", qty: 1 }] }));
    expect(html).not.toContain("<script>x");
    expect(html).toContain("&lt;script&gt;");
  });
});
