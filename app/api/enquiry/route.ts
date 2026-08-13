import { NextResponse } from "next/server";
import { sendEnquiryEmail, smtpConfigured } from "@/lib/email";

/**
 * Enquiry / RFQ intake — the clean integration point with Branch 1 (JIDOKA AI Revenue
 * Manager) (§65). It never behaves like an e-commerce endpoint: it captures a technical
 * requirement and routes it to become a qualified lead.
 *
 * Behaviour:
 *  - Validates required fields and enforces file type/size limits (§81 security).
 *  - If RFQ_FORWARD_URL is set, forwards the enquiry (multipart) to Branch 1.
 *  - Otherwise it logs the enquiry server-side and returns success, so the public site
 *    is fully functional without any paid or external service (§78).
 */

export const runtime = "nodejs";

const MAX_BYTES = 25 * 1024 * 1024;
const ALLOWED_EXT = new Set([
  "pdf", "dwg", "dxf", "step", "stp", "igs", "iges",
  "png", "jpg", "jpeg", "xlsx", "xls", "csv", "zip",
]);
const REQUIRED = ["name", "company", "email"];

function ext(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  // Validate required text fields.
  for (const key of REQUIRED) {
    const v = form.get(key);
    if (typeof v !== "string" || !v.trim()) {
      return NextResponse.json({ error: `Missing required field: ${key}.` }, { status: 400 });
    }
  }
  const email = String(form.get("email"));
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  // Validate files.
  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  for (const f of files) {
    if (f.size > MAX_BYTES) {
      return NextResponse.json({ error: `"${f.name}" exceeds the 25 MB limit.` }, { status: 413 });
    }
    if (!ALLOWED_EXT.has(ext(f.name))) {
      return NextResponse.json({ error: `File type not allowed: ${f.name}.` }, { status: 415 });
    }
  }

  // Assemble a structured, non-sensitive enquiry record.
  const record: Record<string, string> = {};
  for (const [k, v] of form.entries()) {
    if (typeof v === "string") record[k] = v;
  }
  const reference = `RFQ-${Date.now().toString(36).toUpperCase()}`;

  // Stable lead contract for Branch 1 (JIDOKA AI Revenue Manager) — see docs/jidoka-branch1-integration.md.
  const lead = {
    reference,
    source: "website",
    mode: record.mode || "quote",
    requirementType: record.requirementType || "General enquiry",
    contact: { name: record.name, company: record.company, email: record.email, phone: record.phone || "" },
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
    },
    fileNames: files.map((f) => f.name),
    fileCount: files.length,
    receivedAt: new Date().toISOString(),
  };

  // 1) Email the sales team (launch-critical delivery) — with attachments.
  let emailed = false;
  if (smtpConfigured()) {
    const r = await sendEnquiryEmail(lead, files);
    emailed = r.sent;
    if (!r.sent) console.error(`[enquiry] email failed (${reference}):`, r.error);
  }

  // 2) Forward to Branch 1 (AI Revenue Manager) as a qualified lead, if configured.
  const forwardUrl = process.env.RFQ_FORWARD_URL;
  if (forwardUrl) {
    // Timeout so a slow/unreachable Branch 1 never blocks the visitor's confirmation.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    try {
      const res = await fetch(forwardUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(process.env.RFQ_FORWARD_TOKEN ? { authorization: `Bearer ${process.env.RFQ_FORWARD_TOKEN}` } : {}),
        },
        body: JSON.stringify(lead),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`Upstream ${res.status}`);
    } catch (err) {
      // Do not lose the enquiry — log it and still succeed for the visitor.
      console.error(`[enquiry] forward failed (${reference}), logged locally:`, err, lead);
    } finally {
      clearTimeout(timer);
    }
  }

  // 3) Always log so an enquiry is never lost, whatever the delivery path.
  console.info(`[enquiry] ${reference} received (emailed=${emailed}, forwarded=${Boolean(forwardUrl)}):`, lead);

  return NextResponse.json({ ok: true, reference });
}
