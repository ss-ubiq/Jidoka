"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Upload, AlertCircle } from "lucide-react";
import { requirementTypes } from "@/lib/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { tools } from "@/data/tools";

export type EnquiryPrefill = { quantity?: string; notes?: string; via?: string };

export type EnquiryMode = "quote" | "requirement" | "alternative" | "bom" | "custom" | "engineer";

const ACCEPT = ".pdf,.dwg,.dxf,.step,.stp,.igs,.iges,.png,.jpg,.jpeg,.xlsx,.xls,.csv,.zip";
const MAX_MB = 25;

const modeConfig: Record<EnquiryMode, { defaultType: string; showParts: boolean; showBuild: boolean; fileLabel: string }> = {
  quote: { defaultType: "Product quotation", showParts: true, showBuild: false, fileLabel: "Drawing, CAD, BOM or photo (optional)" },
  requirement: { defaultType: "General enquiry", showParts: false, showBuild: true, fileLabel: "Drawing, photo, CAD or BOM (optional)" },
  alternative: { defaultType: "Alternative / replacement", showParts: true, showBuild: false, fileLabel: "Drawing / photo / spec of the existing part (optional)" },
  bom: { defaultType: "BOM review", showParts: false, showBuild: false, fileLabel: "BOM — Excel / CSV / PDF (recommended)" },
  custom: { defaultType: "Custom component", showParts: false, showBuild: false, fileLabel: "Drawing / CAD / PDF / image (recommended)" },
  engineer: { defaultType: "Technical recommendation", showParts: true, showBuild: true, fileLabel: "Anything that helps — drawing, photo, CAD, BOM (optional)" },
};

export function EnquiryForm({
  mode,
  className,
  reference,
  prefill,
}: {
  mode: EnquiryMode;
  className?: string;
  reference?: string;
  prefill?: EnquiryPrefill;
}) {
  const cfg = modeConfig[mode];
  const viaTool = prefill?.via ? tools.find((t) => t.slug === prefill.via) : undefined;
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  useEffect(() => {
    track("rfq_start", { mode });
  }, [mode]);

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const tooBig = files.find((f) => f.size > MAX_MB * 1024 * 1024);
    if (tooBig) {
      setError(`"${tooBig.name}" exceeds the ${MAX_MB} MB limit.`);
      e.target.value = "";
      setFileNames([]);
      return;
    }
    setError(null);
    setFileNames(files.map((f) => f.name));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      const fd = new FormData(e.currentTarget);
      fd.set("mode", mode);
      const res = await fetch("/api/enquiry", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Submission failed.");
      track("rfq_submit", { mode });
      setSubmittedRef(typeof data?.reference === "string" ? data.reference : null);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div className={cn("rounded-xl border border-positive/30 bg-positive/5 p-8 text-center", className)}>
        <CheckCircle2 className="mx-auto h-12 w-12 text-positive" />
        <h3 className="mt-4 text-xl font-semibold text-fg">Requirement received</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-fg-subtle">
          Thank you — your requirement has reached the JIDOKA engineering team. We&apos;ll review it and
          respond with a quotation, an alternative, or the technical information you need.
        </p>
        {submittedRef && (
          <p className="mt-4 inline-block rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-xs text-fg-subtle">
            Reference: <span className="font-semibold text-fg">{submittedRef}</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-6", className)}>
      {(reference || viaTool) && (
        <div className="rounded-md border border-accent/20 bg-accent-soft/50 px-3.5 py-2.5 text-sm">
          {reference && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-muted">Regarding</span>
              <span className="font-medium text-fg">{reference}</span>
              <input type="hidden" name="reference" value={reference} />
            </div>
          )}
          {viaTool && (
            <div className={cn("flex flex-wrap items-center gap-x-2 text-xs text-fg-subtle", reference && "mt-1.5")}>
              <span>Built in the {viaTool.name} — the full specification is in the notes below.</span>
              <Link href={`/tools/${viaTool.slug}`} className="font-medium text-accent hover:underline">
                Edit in configurator
              </Link>
            </div>
          )}
        </div>
      )}
      {/* Contact block */}
      <FieldGrid>
        <Field label="Name" required><input name="name" required autoComplete="name" className={inputCls} /></Field>
        <Field label="Company" required><input name="company" required autoComplete="organization" className={inputCls} /></Field>
        <Field label="Email" required><input name="email" type="email" required autoComplete="email" className={inputCls} /></Field>
        <Field label="Phone"><input name="phone" type="tel" autoComplete="tel" className={inputCls} /></Field>
      </FieldGrid>

      <FieldGrid>
        <Field label="Industry"><input name="industry" placeholder="e.g. Tool & Die, Automotive" className={inputCls} /></Field>
        <Field label="Requirement type">
          <select name="requirementType" defaultValue={cfg.defaultType} className={inputCls}>
            {requirementTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
      </FieldGrid>

      {cfg.showParts && (
        <FieldGrid>
          <Field label="Product / Part number"><input name="partNumber" defaultValue={reference} placeholder="e.g. MYKP32-120, or a supplier reference" className={inputCls} /></Field>
          <Field label="Quantity"><input name="quantity" defaultValue={prefill?.quantity} placeholder="e.g. 100 pcs / month" className={inputCls} /></Field>
        </FieldGrid>
      )}

      {cfg.showBuild && (
        <FieldGrid>
          <Field label="What are you building?"><input name="building" placeholder="e.g. a packaging machine, a mould, a fixture" className={inputCls} /></Field>
          <Field label="What must the component do?"><input name="function" placeholder="e.g. return an ejector plate, guide a slide" className={inputCls} /></Field>
        </FieldGrid>
      )}

      <Field label="Technical requirement / notes" required={mode === "requirement" || mode === "custom"}>
        <textarea
          name="notes"
          rows={prefill?.notes ? 8 : 5}
          defaultValue={prefill?.notes}
          required={mode === "requirement" || mode === "custom"}
          placeholder={
            mode === "custom"
              ? "Material, dimensions, tolerance, surface finish, special requirements…"
              : "Describe the requirement, dimensions, load, motion, environment, tolerances…"
          }
          className={cn(inputCls, "resize-y")}
        />
      </Field>

      {/* File upload */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-fg">{cfg.fileLabel}</label>
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border-strong bg-surface-2 px-4 py-4 text-sm text-fg-subtle transition-colors hover:border-accent/50 hover:bg-accent-soft/40">
          <Upload className="h-5 w-5 text-muted" />
          <span>
            {fileNames.length ? (
              <span className="font-medium text-fg">{fileNames.join(", ")}</span>
            ) : (
              <>Click to attach files <span className="text-muted">· {ACCEPT.replaceAll(".", "").replaceAll(",", ", ")} · max {MAX_MB} MB each</span></>
            )}
          </span>
          <input type="file" name="files" multiple accept={ACCEPT} onChange={onFiles} className="sr-only" />
        </label>
      </div>

      <FieldGrid>
        <Field label="Required date"><input name="requiredDate" type="date" className={inputCls} /></Field>
        <Field label="Preferred contact">
          <select name="preferredContact" className={inputCls}>
            <option>Email</option><option>Phone</option><option>WhatsApp</option>
          </select>
        </Field>
      </FieldGrid>

      {error && (
        <p className="flex items-center gap-2 text-sm text-danger"><AlertCircle className="h-4 w-4" /> {error}</p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex h-12 items-center gap-2 rounded-md bg-accent px-7 font-medium text-accent-fg shadow-card transition-all hover:brightness-110 disabled:opacity-60"
        >
          {status === "submitting" ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : submitLabel[mode]}
        </button>
        <p className="text-xs text-muted">No account needed. We never share your enquiry.</p>
      </div>
    </form>
  );
}

const submitLabel: Record<EnquiryMode, string> = {
  quote: "Request Quote",
  requirement: "Send Requirement",
  alternative: "Submit for Technical Review",
  bom: "Request BOM Review",
  custom: "Request Technical Review",
  engineer: "Ask an Engineer",
};

const inputCls =
  "h-11 w-full rounded-md border border-border-strong bg-surface px-3.5 text-base text-fg sm:text-sm outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20";

function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-fg">
        {label}
        {required && <span className="ml-1 text-danger">*</span>}
      </span>
      {children}
    </label>
  );
}
