import nodemailer from "nodemailer";
import { site } from "./site";

/**
 * RFQ email delivery (launch-critical). Self-hostable SMTP via nodemailer — no paid SaaS.
 * If SMTP is not configured, `sendEnquiryEmail` reports `sent:false` and the caller still
 * logs/forwards so nothing is lost. Uploaded files are attached (up to a total budget) so the
 * sales team receives the actual drawing / BOM / photo, not just its name.
 */

const ATTACH_BUDGET = 18 * 1024 * 1024; // keep the whole email comfortably under common 25 MB SMTP limits

export type EnquiryLead = {
  reference: string;
  mode: string;
  requirementType: string;
  contact: { name: string; company: string; email: string; phone: string };
  details: Record<string, string>;
  fileNames: string[];
};

export function smtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT);
}

function esc(s: string) {
  return String(s ?? "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string));
}

function renderHtml(lead: EnquiryLead): string {
  const rows = [
    ["Reference", lead.reference],
    ["Type", `${lead.requirementType} (${lead.mode})`],
    ["Name", lead.contact.name],
    ["Company", lead.contact.company],
    ["Email", lead.contact.email],
    ["Phone", lead.contact.phone],
    ["Industry", lead.details.industry],
    ["Part number", lead.details.partNumber],
    ["Quantity", lead.details.quantity],
    ["Regarding", lead.details.reference],
    ["Building", lead.details.building],
    ["Function", lead.details.function],
    ["Required date", lead.details.requiredDate],
    ["Preferred contact", lead.details.preferredContact],
  ].filter(([, v]) => v);
  const tr = rows
    .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#64748b;white-space:nowrap">${esc(k)}</td><td style="padding:6px 12px;font-weight:600">${esc(v)}</td></tr>`)
    .join("");
  return `<div style="font-family:system-ui,sans-serif;max-width:640px">
    <h2 style="margin:0 0 4px">New enquiry — ${esc(lead.reference)}</h2>
    <p style="color:#64748b;margin:0 0 16px">via ${esc(site.name)} website</p>
    <table style="border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px">${tr}</table>
    ${lead.details.notes ? `<h3 style="margin:20px 0 6px">Requirement / notes</h3><p style="white-space:pre-wrap;line-height:1.5">${esc(lead.details.notes)}</p>` : ""}
    ${lead.fileNames.length ? `<p style="color:#64748b;margin-top:16px">Attachments: ${lead.fileNames.map(esc).join(", ")}</p>` : ""}
  </div>`;
}

export async function sendEnquiryEmail(
  lead: EnquiryLead,
  files: File[]
): Promise<{ sent: boolean; error?: string }> {
  if (!smtpConfigured()) return { sent: false, error: "SMTP not configured" };

  const to = process.env.RFQ_TO || site.email;
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER || site.email;

  // Attach files within budget; list the rest by name in the body.
  const attachments: { filename: string; content: Buffer }[] = [];
  let used = 0;
  for (const f of files) {
    if (used + f.size > ATTACH_BUDGET) continue;
    attachments.push({ filename: f.name, content: Buffer.from(await f.arrayBuffer()) });
    used += f.size;
  }

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });

  try {
    await transport.sendMail({
      from,
      to,
      replyTo: lead.contact.email || undefined,
      subject: `Enquiry ${lead.reference} — ${lead.contact.company} (${lead.requirementType})`,
      html: renderHtml(lead),
      attachments,
    });
    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "send failed" };
  }
}
