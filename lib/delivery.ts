/**
 * Where an enquiry actually goes, and whether it truly got there.
 *
 * The route used to answer `{ok:true}` unconditionally: with SMTP unset, or with the send
 * throwing, or with the Branch 1 forward failing, the visitor still saw "Requirement
 * received" and a reference — and the quotation list was cleared on the strength of it.
 * A console line was treated as durable recovery. It is not: on Netlify, function logs are
 * a retention-limited stream nobody is paged on, and they never contain the attachments.
 *
 * So delivery is now explicit. Each channel reports whether it accepted the *complete*
 * enquiry. The route accepts the submission only if at least one did, and otherwise tells
 * the visitor to try again rather than quietly dropping their requirement.
 */
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { sendEnquiryEmail, smtpConfigured, type EnquiryLead } from "./email";

export type ChannelName = "email" | "forward" | "dev-sink";

export type ChannelResult = {
  channel: ChannelName;
  ok: boolean;
  /** Safe for logs: a category, never the visitor's content. */
  detail?: string;
};

export type DeliveryOutcome = {
  accepted: boolean;
  results: ChannelResult[];
  /** True when nothing is configured to receive enquiries at all — a deployment fault. */
  misconfigured: boolean;
};

/** Timeouts sit inside Netlify's 60 s synchronous budget with room to answer the visitor. */
const FORWARD_TIMEOUT_MS = 10_000;

function errorCategory(err: unknown): string {
  if (err instanceof Error) {
    if (err.name === "AbortError") return "timeout";
    if (/ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ETIMEDOUT/.test(err.message)) return "network";
    if (/auth|credential|535|534/i.test(err.message)) return "auth";
    return err.name || "error";
  }
  return "error";
}

/**
 * A local file sink so the flow can be exercised without a mailbox. Deliberately refuses
 * to run in production: a developer convenience that silently became the delivery path on
 * the live site would recreate exactly the bug this module exists to fix.
 */
async function devSink(lead: EnquiryLead, files: File[]): Promise<ChannelResult> {
  if (process.env.NODE_ENV === "production") {
    return { channel: "dev-sink", ok: false, detail: "refused-in-production" };
  }
  if (process.env.ENQUIRY_DEV_SINK !== "1") {
    return { channel: "dev-sink", ok: false, detail: "not-enabled" };
  }
  try {
    const dir = path.join(process.cwd(), ".enquiries", lead.reference);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "enquiry.json"), JSON.stringify(lead, null, 2), "utf8");
    // Write the actual bytes, not just the names — the point of the sink is to prove the
    // whole payload survives the trip.
    for (const f of files) {
      const safe = path.basename(f.name).replace(/[^\w.\- ]+/g, "_");
      await writeFile(path.join(dir, safe), Buffer.from(await f.arrayBuffer()));
    }
    return { channel: "dev-sink", ok: true, detail: dir };
  } catch (err) {
    return { channel: "dev-sink", ok: false, detail: errorCategory(err) };
  }
}

async function forward(lead: EnquiryLead, url: string): Promise<ChannelResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FORWARD_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.RFQ_FORWARD_TOKEN ? { authorization: `Bearer ${process.env.RFQ_FORWARD_TOKEN}` } : {}),
      },
      body: JSON.stringify(lead),
      signal: controller.signal,
    });
    if (!res.ok) return { channel: "forward", ok: false, detail: `http-${res.status}` };
    return { channel: "forward", ok: true };
  } catch (err) {
    return { channel: "forward", ok: false, detail: errorCategory(err) };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Note the forward carries JSON only — filenames, not file bytes. So it is *not* on its
 * own a complete delivery when the visitor attached something; email is. `deliver` below
 * accounts for that rather than counting any success as good enough.
 */
export async function deliverEnquiry(lead: EnquiryLead, files: File[]): Promise<DeliveryOutcome> {
  const results: ChannelResult[] = [];
  const forwardUrl = process.env.RFQ_FORWARD_URL;
  const hasEmail = smtpConfigured();
  const sinkEnabled = process.env.NODE_ENV !== "production" && process.env.ENQUIRY_DEV_SINK === "1";

  if (!hasEmail && !forwardUrl && !sinkEnabled) {
    return { accepted: false, results, misconfigured: true };
  }

  if (hasEmail) {
    const r = await sendEnquiryEmail(lead, files);
    results.push({ channel: "email", ok: r.sent, detail: r.sent ? undefined : errorCategory(new Error(r.error ?? "")) });
  }
  if (forwardUrl) results.push(await forward(lead, forwardUrl));
  if (sinkEnabled) results.push(await devSink(lead, files));

  // A channel that cannot carry the attachments cannot, by itself, accept an enquiry that
  // has them. Otherwise we would again be telling someone their drawing arrived when only
  // its filename did.
  const carriesFiles = (c: ChannelName) => c === "email" || c === "dev-sink";
  const sufficient = results.filter((r) => r.ok && (files.length === 0 || carriesFiles(r.channel)));

  return { accepted: sufficient.length > 0, results, misconfigured: false };
}

/** One log-safe line: statuses and categories only, never contact details or content. */
export function describeOutcome(outcome: DeliveryOutcome): string {
  if (outcome.misconfigured) return "no delivery destination configured";
  return outcome.results.map((r) => `${r.channel}=${r.ok ? "ok" : `failed(${r.detail ?? "error"})`}`).join(" ");
}
