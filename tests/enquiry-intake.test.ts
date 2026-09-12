import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { parseItemsStrict, QUOTE_MAX_ITEMS, QUOTE_MAX_QTY } from "@/lib/quote";
import {
  checkUploads,
  isAllowedFile,
  formatBytes,
  UPLOAD_MAX_FILES,
  UPLOAD_MAX_FILE_BYTES,
  UPLOAD_MAX_TOTAL_BYTES,
  REQUEST_MAX_BYTES,
} from "@/lib/uploads";
import { EVENT_SCHEMA, classifyQuery, sanitizeProps } from "@/lib/analytics";

/* ------------------------------------------------------------------ uploads */

describe("the upload contract fits where it actually runs", () => {
  it("stays inside Netlify's effective binary request limit", () => {
    // Netlify buffers 6 MB and Base64-encodes binary payloads (~30% overhead), leaving
    // roughly 4.5 MB. The site used to advertise 25 MB per file with no total and no
    // count, which the platform rejects before our code ever runs.
    const NETLIFY_EFFECTIVE_BINARY_LIMIT = 4_500_000;
    expect(REQUEST_MAX_BYTES).toBeLessThan(NETLIFY_EFFECTIVE_BINARY_LIMIT);
    expect(UPLOAD_MAX_TOTAL_BYTES).toBeLessThan(REQUEST_MAX_BYTES);
    expect(UPLOAD_MAX_FILE_BYTES).toBeLessThanOrEqual(UPLOAD_MAX_TOTAL_BYTES);
  });

  it("accepts a realistic drawing set", () => {
    expect(checkUploads([{ name: "bracket.pdf", size: 900_000 }, { name: "part.dxf", size: 400_000 }])).toEqual({ ok: true });
  });

  it("rejects a file over the per-file limit, and says what to do instead", () => {
    const r = checkUploads([{ name: "assembly.step", size: 12_000_000 }]);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error).toContain("assembly.step");
      expect(r.error).toMatch(/email/i); // never a dead end
    }
  });

  it("rejects a set that is individually fine but too large together", () => {
    const files = Array.from({ length: 3 }, (_, i) => ({ name: `d${i}.pdf`, size: 2_000_000 }));
    const r = checkUploads(files);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/total/i);
  });

  it("rejects too many files", () => {
    const files = Array.from({ length: UPLOAD_MAX_FILES + 1 }, (_, i) => ({ name: `d${i}.pdf`, size: 1000 }));
    expect(checkUploads(files).ok).toBe(false);
  });

  it("rejects disallowed types, including a double extension", () => {
    expect(isAllowedFile("drawing.pdf")).toBe(true);
    expect(isAllowedFile("payload.exe")).toBe(false);
    expect(isAllowedFile("drawing.pdf.exe")).toBe(false);
    expect(isAllowedFile("noextension")).toBe(false);
  });

  it("states sizes the way a person reads them", () => {
    expect(formatBytes(3_000_000)).toBe("3 MB");
    expect(formatBytes(3_500_000)).toBe("3.5 MB");
    expect(formatBytes(400_000)).toBe("400 KB");
  });
});

/* -------------------------------------------------------------- line items */

describe("a submitted quotation list is validated strictly, not repaired", () => {
  const item = (over = {}) => ({ id: "A", code: "SAD02-D6-L300", qty: 2, ...over });

  it("accepts a well-formed list", () => {
    const r = parseItemsStrict(JSON.stringify([item(), item({ id: "B", code: "SCD02-D10-L300", qty: 25 })]));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.items.map((i) => i.qty)).toEqual([2, 25]);
  });

  it("treats an absent list as no line items, not an error", () => {
    expect(parseItemsStrict(null)).toEqual({ ok: true, items: [] });
    expect(parseItemsStrict("")).toEqual({ ok: true, items: [] });
  });

  it("refuses malformed JSON rather than silently sending nothing", () => {
    // This was the bug: unparseable items became an empty list, and the customer got a
    // confirmation for an enquiry that had lost every part they configured.
    const r = parseItemsStrict("{not json");
    expect(r.ok).toBe(false);
  });

  it.each([
    ["a fractional quantity", { qty: 2.5 }],
    ["a zero quantity", { qty: 0 }],
    ["a negative quantity", { qty: -5 }],
    ["a non-numeric quantity", { qty: "many" }],
    ["a quantity over the cap", { qty: QUOTE_MAX_QTY + 1 }],
  ])("refuses %s instead of rounding it", (_label, over) => {
    const r = parseItemsStrict(JSON.stringify([item(over)]));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/quantity/i);
  });

  it("refuses a row with no part number", () => {
    expect(parseItemsStrict(JSON.stringify([item({ code: "" })])).ok).toBe(false);
  });

  it("refuses a list longer than the cap rather than truncating it", () => {
    const many = Array.from({ length: QUOTE_MAX_ITEMS + 1 }, (_, i) => item({ id: `i${i}`, code: `C${i}` }));
    const r = parseItemsStrict(JSON.stringify(many));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/split/i);
  });

  it("refuses duplicate rows and control characters", () => {
    expect(parseItemsStrict(JSON.stringify([item(), item()])).ok).toBe(false);
    expect(parseItemsStrict(JSON.stringify([item({ code: "SAD02\u0000" })])).ok).toBe(false);
  });

  it("names the offending line so the visitor can fix it", () => {
    const r = parseItemsStrict(JSON.stringify([item(), item({ id: "B", code: "SCD02", qty: 0 })]));
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error).toContain("Line 2");
      expect(r.error).toContain("SCD02");
    }
  });
});

/* --------------------------------------------------------------- analytics */

describe("analytics carries categories, never what the visitor typed", () => {
  it("drops raw search text", () => {
    // A search box is free text: a person can type a customer name or an unreleased part
    // into it. It used to be sent verbatim as `q`.
    const props = sanitizeProps("search_performed", { q: "ACME Corp ejector pin", kind: "term", length: 21 });
    expect(props).not.toHaveProperty("q");
    expect(props).toEqual({ kind: "term", length: 21 });
  });

  it("drops any property the event does not declare", () => {
    expect(sanitizeProps("family_view", { family: "springs", email: "a@b.com" })).toEqual({ family: "springs" });
  });

  it("rejects a value outside an enum", () => {
    expect(sanitizeProps("contact_click", { channel: "carrier-pigeon" })).toEqual({});
    expect(sanitizeProps("contact_click", { channel: "whatsapp" })).toEqual({ channel: "whatsapp" });
  });

  it("keeps identifiers bounded so free text cannot ride along in one", () => {
    expect(sanitizeProps("product_view", { product: "JID-GUIDE-SHAFT" })).toEqual({ product: "JID-GUIDE-SHAFT" });
    expect(sanitizeProps("product_view", { product: "a sentence with spaces" })).toEqual({});
    expect(sanitizeProps("product_view", { product: "x".repeat(200) })).toEqual({});
  });

  it("coerces counts to bounded whole numbers", () => {
    expect(sanitizeProps("rfq_submit", { mode: "quote", items: 3.9, files: -1 })).toEqual({ mode: "quote", items: 3 });
  });

  it("classifies a query without retaining it", () => {
    expect(classifyQuery("SCE02D10L300M3")).toBe("part-code");
    expect(classifyQuery("something for a mould")).toBe("term");
  });

  it("declares a schema for every event the endpoint accepts", () => {
    for (const [event, schema] of Object.entries(EVENT_SCHEMA)) {
      expect(Object.keys(schema).length, `${event} has no declared properties`).toBeGreaterThan(0);
    }
  });
});

/* ------------------------------------------------------------- the endpoint */

const loadRoute = async () => (await import("@/app/api/enquiry/route")).POST;

function enquiry(fields: Record<string, string> = {}, files: File[] = []) {
  const fd = new FormData();
  const base = { name: "Test Buyer", company: "Test Engineering", email: "buyer@example.com", mode: "quote" };
  for (const [k, v] of Object.entries({ ...base, ...fields })) fd.set(k, v);
  for (const f of files) fd.append("files", f);
  return new Request("http://localhost/api/enquiry", { method: "POST", body: fd });
}

describe("POST /api/enquiry only confirms what was actually delivered", () => {
  const env = { ...process.env };

  beforeEach(async () => {
    vi.resetModules();
    (await import("@/lib/ratelimit")).resetRateLimits();
    for (const k of ["SMTP_HOST", "SMTP_PORT", "RFQ_FORWARD_URL", "ENQUIRY_DEV_SINK"]) delete process.env[k];
  });
  afterEach(() => {
    process.env = { ...env };
    vi.restoreAllMocks();
  });

  it("refuses with a retryable error when no destination is configured", async () => {
    // Previously this returned {ok:true} and a reference, and the browser cleared the
    // visitor's quotation list on the strength of it.
    const res = await (await loadRoute())(enquiry());
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.retryable).toBe(true);
    expect(body.error).toMatch(/still here|try again/i);
    expect(body).not.toHaveProperty("reference");
  });

  it("refuses when the only configured destination fails", async () => {
    process.env.RFQ_FORWARD_URL = "https://branch1.invalid/lead";
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 500 })));
    const res = await (await loadRoute())(enquiry());
    expect(res.status).toBe(502);
    expect((await res.json()).ok).toBe(false);
  });

  it("accepts when a destination confirms it", async () => {
    process.env.RFQ_FORWARD_URL = "https://branch1.test/lead";
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 200 })));
    const res = await (await loadRoute())(enquiry());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.reference).toMatch(/^RFQ-[0-9A-Z]+-[A-Z2-9]{5}$/);
  });

  it("will not accept an enquiry with attachments on a channel that cannot carry them", async () => {
    // The Branch 1 forward sends JSON — filenames, not file bytes. Confirming receipt of a
    // drawing that was never transmitted is exactly the failure this guards.
    process.env.RFQ_FORWARD_URL = "https://branch1.test/lead";
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 200 })));
    const file = new File([new Uint8Array(1000)], "drawing.pdf", { type: "application/pdf" });
    const res = await (await loadRoute())(enquiry({}, [file]));
    expect(res.status).toBe(502);
    expect((await res.json()).error).toMatch(/attachment/i);
  });

  it("gives every enquiry a distinct reference, even in the same millisecond", async () => {
    process.env.RFQ_FORWARD_URL = "https://branch1.test/lead";
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 200 })));
    const post = await loadRoute();
    const { resetRateLimits } = await import("@/lib/ratelimit");
    vi.spyOn(Date, "now").mockReturnValue(1_700_000_000_000);
    const refs = new Set<string>();
    for (let i = 0; i < 50; i++) {
      // The flood control is doing its job here — clear it so this test measures the
      // reference generator rather than the rate limiter.
      resetRateLimits();
      refs.add((await (await post(enquiry())).json()).reference);
    }
    expect(refs.size).toBe(50);
  });

  it("refuses a flood from one connection", async () => {
    process.env.RFQ_FORWARD_URL = "https://branch1.test/lead";
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 200 })));
    const post = await loadRoute();
    const { resetRateLimits } = await import("@/lib/ratelimit");
    resetRateLimits();
    const statuses: number[] = [];
    for (let i = 0; i < 12; i++) statuses.push((await post(enquiry())).status);
    expect(statuses.filter((s) => s === 200).length).toBeLessThanOrEqual(8);
    expect(statuses).toContain(429);
  });

  it("accepts a honeypot submission without telling the sender it was caught", async () => {
    const post = await loadRoute();
    const { resetRateLimits } = await import("@/lib/ratelimit");
    resetRateLimits();
    // No destination is configured, so a real enquiry here would be refused with a 503.
    // A bot sees an ordinary success instead, and nothing is delivered.
    const res = await post(enquiry({ website: "http://spam.example" }));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
  });

  it("validates before it tries to deliver anything", async () => {
    const post = await loadRoute();
    expect((await post(enquiry({ email: "not-an-email" }))).status).toBe(400);
    expect((await post(enquiry({ name: "" }))).status).toBe(400);
    expect((await post(enquiry({ items: "{broken" }))).status).toBe(422);
    expect((await post(enquiry({ name: "x".repeat(5000) }))).status).toBe(400);
  });

  it("rejects a disallowed or oversized attachment", async () => {
    const post = await loadRoute();
    const exe = new File([new Uint8Array(10)], "payload.exe");
    expect((await post(enquiry({}, [exe]))).status).toBe(413);
    const huge = new File([new Uint8Array(UPLOAD_MAX_FILE_BYTES + 1)], "big.pdf");
    expect((await post(enquiry({}, [huge]))).status).toBe(413);
  });
});
