import { NextResponse } from "next/server";
import { deliverEnquiry, describeOutcome } from "@/lib/delivery";
import { rateLimit } from "@/lib/ratelimit";
import { itemSpec, parseItemsStrict, QUOTE_MAX_FIELD } from "@/lib/quote";
import {
  REQUEST_MAX_BYTES,
  UPLOAD_MAX_FILES,
  checkUploads,
  formatBytes,
} from "@/lib/uploads";

/**
 * Enquiry / RFQ intake — the clean integration point with Branch 1 (JIDOKA AI Revenue
 * Manager) (§65). It never behaves like an e-commerce endpoint: it captures a technical
 * requirement and routes it to become a qualified lead.
 *
 * The contract with the visitor is the important part: **a 200 here means a configured
 * destination accepted this enquiry, in full, including any attachments.** It used to mean
 * only "the request parsed", which let the site confirm a reference and clear someone's
 * quotation list while the requirement went nowhere. If nothing accepts it, this returns a
 * retryable error and the browser keeps the list and the typed fields.
 */

export const runtime = "nodejs";

/** Text fields are bounded so a single request cannot carry an essay per field. */
const MAX_TEXT_FIELD = 5_000;
const MAX_NOTES = 20_000;
const REQUIRED = ["name", "company", "email"] as const;

/** Contact fields are short; a long one is a copy-paste accident or an injection attempt. */
const FIELD_LIMITS: Record<string, number> = {
  name: 200, company: 200, email: 320, phone: 60, industry: 200,
  requirementType: 120, partNumber: QUOTE_MAX_FIELD, quantity: 120,
  reference: 400, building: MAX_TEXT_FIELD, function: MAX_TEXT_FIELD,
  notes: MAX_NOTES, requiredDate: 40, preferredContact: 40, quoteId: 64,
  mode: 40, submissionId: 64, website: 200, itemsSummary: 20_000,
};

const bad = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

function reference(): string {
  // Date.now() alone collided for two enquiries in the same millisecond — two customers
  // could be given the same RFQ number. The random suffix removes that.
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  let suffix = "";
  for (const b of bytes) suffix += alphabet[b % alphabet.length];
  return `RFQ-${Date.now().toString(36).toUpperCase()}-${suffix}`;
}

export async function POST(req: Request) {
  // Best-effort flood control. See lib/ratelimit.ts for what this does and does not do —
  // a genuine buyer never approaches 8 enquiries a minute.
  const limited = rateLimit(req, "enquiry", 8);
  if (!limited.allowed) {
    return NextResponse.json(
      { ok: false, retryable: true, error: "Too many enquiries from this connection. Please wait a moment and try again." },
      { status: 429, headers: { "retry-after": String(limited.retryAfterSeconds) } },
    );
  }

  // Refuse an oversized body before buffering it. The platform enforces its own limit
  // ahead of us with a non-JSON error page, so this is about giving a usable message
  // whenever the request does reach the function.
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > REQUEST_MAX_BYTES) {
    return bad(
      `That enquiry is ${formatBytes(declared)}, which is more than this form can carry. Please reduce the attachments and send larger files by email.`,
      413,
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return bad("We could not read that submission. Please try again.");
  }

  // ---- text fields -------------------------------------------------------
  const record: Record<string, string> = {};
  for (const [k, v] of form.entries()) {
    if (typeof v !== "string") continue;
    const limit = FIELD_LIMITS[k] ?? MAX_TEXT_FIELD;
    if (v.length > limit) return bad(`The "${k}" field is too long.`);
    record[k] = v;
  }

  // A field no person can see and no browser autofills. Bots complete every input they
  // find, so a value here is the cheapest possible signal — answered with a normal-looking
  // success so the sender learns nothing from being caught.
  if (record.website?.trim()) {
    console.info("[enquiry] discarded: honeypot");
    return NextResponse.json({ ok: true, reference: reference() });
  }

  for (const key of REQUIRED) {
    if (!record[key]?.trim()) return bad(`Missing required field: ${key}.`);
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(record.email)) {
    return bad("Please enter a valid email address.");
  }

  // ---- files -------------------------------------------------------------
  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  const upload = checkUploads(files.map((f) => ({ name: f.name, size: f.size })));
  if (!upload.ok) return bad(upload.error, 413);
  if (files.length > UPLOAD_MAX_FILES) return bad(`Please attach at most ${UPLOAD_MAX_FILES} files.`, 413);

  // ---- line items --------------------------------------------------------
  // Strict, not forgiving: a quotation that silently lost or changed a line is worse than
  // one that was refused with a reason the visitor can act on.
  const parsed = parseItemsStrict(form.get("items"));
  if (!parsed.ok) return bad(parsed.error, 422);
  const items = parsed.items;

  const ref = reference();

  // Stable lead contract for Branch 1 (JIDOKA AI Revenue Manager) — see docs/jidoka-branch1-integration.md.
  const lead = {
    reference: ref,
    source: "website",
    mode: record.mode || "quote",
    requirementType: record.requirementType || "General enquiry",
    /**
     * The visitor's anonymous configurator session. It identifies the working list that
     * produced these line items — never the person, who is identified only by the contact
     * details they chose to type below.
     */
    quoteId: record.quoteId || "",
    /** Stable per attempt, so a retry can be recognised downstream as the same enquiry. */
    submissionId: record.submissionId || "",
    contact: { name: record.name, company: record.company, email: record.email, phone: record.phone || "" },
    /** One entry per configured part number, each with its own quantity and specification. */
    items,
    itemCount: items.length,
    details: {
      industry: record.industry || "",
      partNumber: record.partNumber || "",
      quantity: record.quantity || "",
      reference: record.reference || "",
      building: record.building || "",
      function: record.function || "",
      notes: record.notes || "",
      requiredDate: record.requiredDate || "",
      preferredContact: record.preferredContact || "Email",
      // Readable mirror of `items` for consumers that only take flat text. The array
      // above stays the source of truth — never parse this back.
      itemsSummary: items.map((it, i) => `${i + 1}. ${it.code} × ${it.qty}${itemSpec(it) ? ` — ${itemSpec(it)}` : ""}`).join("\n"),
    },
    fileNames: files.map((f) => f.name),
    fileCount: files.length,
    receivedAt: new Date().toISOString(),
  };

  const outcome = await deliverEnquiry(lead, files);

  // Logs carry statuses, never the enquiry. Contact details and requirements used to be
  // printed in full on every submission, which put customer data into a shared platform
  // log stream for no operational benefit.
  const summary = `[enquiry] ${ref} mode=${lead.mode} items=${items.length} files=${files.length} ${describeOutcome(outcome)}`;

  if (outcome.misconfigured) {
    console.error(`${summary} — REFUSED: no delivery destination is configured for this deployment`);
    return NextResponse.json(
      {
        ok: false,
        retryable: true,
        error:
          "We could not deliver your enquiry just now. Nothing has been sent — your list is still here. Please try again shortly, or email us directly.",
      },
      { status: 503 },
    );
  }

  if (!outcome.accepted) {
    console.error(`${summary} — REFUSED: no channel accepted the complete enquiry`);
    return NextResponse.json(
      {
        ok: false,
        retryable: true,
        error:
          files.length > 0
            ? "We could not deliver your enquiry with its attachments. Nothing has been sent — your list is still here. Please try again, or email the files to us directly."
            : "We could not deliver your enquiry just now. Nothing has been sent — your list is still here. Please try again shortly.",
      },
      { status: 502 },
    );
  }

  console.info(summary);
  return NextResponse.json({ ok: true, reference: ref });
}
