"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Loader2, Upload, AlertCircle, Plus, Trash2, RotateCcw } from "lucide-react";
import { requirementTypes } from "@/lib/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { tools } from "@/data/tools";
import {
  ALLOWED_EXTENSIONS,
  UPLOAD_MAX_FILES,
  UPLOAD_MAX_TOTAL_BYTES,
  UPLOAD_MAX_FILE_BYTES,
  checkUploads,
  formatBytes,
} from "@/lib/uploads";
import {
  QUOTE_MAX_QTY,
  clearQuote,
  itemSpec,
  newQuoteId,
  normalizeQty,
  purgeLegacyQuoteStorage,
  readQuote,
  writeQuote,
  type QuoteItem,
} from "@/lib/quote";

export type EnquiryPrefill = { quantity?: string; notes?: string; via?: string };

export type EnquiryMode = "quote" | "requirement" | "alternative" | "bom" | "custom" | "engineer";

const ACCEPT = ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(",");

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
  quoteId: expectedQuoteId,
  prefill,
}: {
  mode: EnquiryMode;
  className?: string;
  reference?: string;
  /**
   * Quote session the hand-off link expects. When present it must match the list held in
   * this tab, so a shared or bookmarked link can never adopt an unrelated quotation list.
   */
  quoteId?: string;
  prefill?: EnquiryPrefill;
}) {
  const cfg = modeConfig[mode];
  const viaTool = prefill?.via ? tools.find((t) => t.slug === prefill.via) : undefined;
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [lostFiles, setLostFiles] = useState(false);
  // Stable for the life of this form, so a retry after a lost response is recognisable
  // downstream as the same enquiry rather than a second one.
  const [submissionId] = useState(() => newQuoteId().replace("JQ-", "SUB-"));

  // The configurator wrote the list into this tab's sessionStorage before navigating
  // here, so the line items survive the hand-off with their structure intact — no
  // flattening into the URL, and nothing left behind for the next visitor.
  useEffect(() => {
    purgeLegacyQuoteStorage();
    if (!cfg.showParts) return;
    const session = readQuote();
    if (!session?.items.length) return;
    if (expectedQuoteId && session.quoteId !== expectedQuoteId) return;
    setItems(session.items);
    setQuoteId(session.quoteId);
  }, [cfg.showParts, expectedQuoteId]);

  useEffect(() => {
    track("rfq_start", { mode });
  }, [mode]);

  const updateItems = useCallback((next: QuoteItem[]) => {
    setItems(next);
    if (next.length) setQuoteId(writeQuote(next).quoteId);
    else {
      clearQuote();
      setQuoteId(null);
    }
  }, []);

  const setQty = (id: string, value: string) =>
    updateItems(items.map((it) => (it.id === id ? { ...it, qty: normalizeQty(value) } : it)));
  const removeItem = (id: string) => updateItems(items.filter((it) => it.id !== id));
  const startNewQuote = () => updateItems([]);

  // The tool the list came from, so "add another" returns to the same configurator.
  const listTool = tools.find((t) => t.slug === items.find((it) => it.via)?.via) ?? viaTool;
  const hasItems = items.length > 0;

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    // Same rules as the server, applied here only so the visitor finds out now rather
    // than after filling in the form. The server never trusts this.
    const check = checkUploads(files);
    if (!check.ok) {
      setError(check.error);
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
      fd.set("submissionId", submissionId);
      // Line items travel as structured JSON — one object per configured part number —
      // so the quantity stays attached to its own code all the way to the email.
      if (hasItems) {
        fd.set("items", JSON.stringify(items));
        if (quoteId) fd.set("quoteId", quoteId);
      }
      const res = await fetch("/api/enquiry", { method: "POST", body: fd });
      // The hosting platform rejects an oversized request itself, with an HTML error
      // page rather than our JSON. Treat an unreadable body as a failure, never a pass.
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        throw new Error(
          data?.error ||
            (res.status === 413
              ? "Those attachments are too large to send with the form. Please attach less and email the rest."
              : "We could not deliver your enquiry. Nothing has been sent — please try again."),
        );
      }
      const ref = typeof data.reference === "string" ? data.reference : null;
      track("rfq_submit", { mode, items: items.length, files: fileNames.length });
      setSubmittedRef(ref);
      // Only a confirmed delivery ends the quote. Every failure path below leaves the
      // list and the typed fields exactly as they are so the same enquiry can be resent.
      clearQuote();
      setStatus("done");
    } catch (err) {
      setStatus("error");
      // Browsers will not let us re-populate a file input, so say so rather than letting
      // someone retry and silently send an enquiry without their drawing.
      setLostFiles(fileNames.length > 0);
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
        {hasItems && (
          <p className="mx-auto mt-3 max-w-md text-sm text-fg-subtle">
            {items.length} line item{items.length === 1 ? "" : "s"} sent — your quotation list has been
            cleared.{" "}
            {listTool && (
              <Link href={`/tools/${listTool.slug}`} className="font-medium text-accent hover:underline">
                Start a new quote
              </Link>
            )}
          </p>
        )}
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
      {hasItems && (
        <QuoteItems
          items={items}
          quoteId={quoteId}
          tool={listTool}
          onQty={setQty}
          onRemove={removeItem}
          onStartNew={startNewQuote}
        />
      )}
      {!hasItems && (reference || viaTool) && (
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
      {/*
        Honeypot. Hidden from sight and from screen readers, excluded from tab order and
        from autofill — a person cannot reach it, so anything in it came from a script.
      */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

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

      {cfg.showParts && !hasItems && (
        <FieldGrid>
          <Field label="Product / Part number"><input name="partNumber" defaultValue={reference} placeholder="e.g. MYKP32-120, or a supplier reference" className={inputCls} /></Field>
          <Field label="Quantity"><input name="quantity" defaultValue={prefill?.quantity} placeholder="e.g. 100 pcs / month" className={inputCls} /></Field>
        </FieldGrid>
      )}

      {cfg.showParts && hasItems && (
        // Quantities live on the rows above; this is only for a code the configurator
        // does not cover, so it never competes with a line item.
        <Field label="Any other part number not in the list above">
          <input name="partNumber" placeholder="e.g. a supplier reference, or a code from a drawing" className={inputCls} />
        </Field>
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
              <>
                Click to attach files{" "}
                <span className="text-muted">
                  · {ALLOWED_EXTENSIONS.join(", ")} · up to {UPLOAD_MAX_FILES} files,{" "}
                  {formatBytes(UPLOAD_MAX_FILE_BYTES)} each, {formatBytes(UPLOAD_MAX_TOTAL_BYTES)} total
                </span>
              </>
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
        <div className="rounded-md border border-danger/30 bg-danger/5 p-3.5">
          <p className="flex items-start gap-2 text-sm text-danger">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
          </p>
          {lostFiles && (
            <p className="mt-2 pl-6 text-xs text-fg-subtle">
              Your details and quotation list are still here. Please re-select your
              attachments before sending again — browsers clear the file field on a failed
              submission.
            </p>
          )}
        </div>
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

/**
 * The quotation list, one row per configured part number. Never collapsed into a single
 * field: each code keeps its own quantity, its own configuration and its own controls.
 */
function QuoteItems({
  items,
  quoteId,
  tool,
  onQty,
  onRemove,
  onStartNew,
}: {
  items: QuoteItem[];
  quoteId: string | null;
  tool?: { slug: string; name: string };
  onQty: (id: string, value: string) => void;
  onRemove: (id: string) => void;
  onStartNew: () => void;
}) {
  // Two-step, so a mis-click never wipes a list the visitor spent time building.
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <section className="rounded-xl border border-border bg-surface shadow-card" aria-label="Quotation list">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border px-4 py-3 sm:px-5">
        <h2 className="text-sm font-semibold text-fg">
          Quotation list <span className="font-normal text-muted">· {items.length} line item{items.length === 1 ? "" : "s"}</span>
        </h2>
        {quoteId && (
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">Quote {quoteId}</span>
        )}
      </header>

      <ul className="divide-y divide-border">
        {items.map((it, i) => {
          const spec = itemSpec(it);
          return (
            <li key={it.id} className="flex flex-wrap items-start gap-x-4 gap-y-3 px-4 py-4 sm:flex-nowrap sm:px-5">
              <span className="mt-2 w-5 shrink-0 font-mono text-xs text-muted">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="break-all font-mono text-sm font-semibold text-fg">{it.code}</p>
                {spec && <p className="mt-1 text-xs leading-relaxed text-fg-subtle">{spec}</p>}
                {(it.catalogue || it.page) && (
                  <p className="mt-0.5 text-xs text-muted">
                    {it.catalogue}
                    {it.catalogue && it.page ? " · " : ""}
                    {it.page ? `catalogue p. ${it.page}` : ""}
                  </p>
                )}
              </div>
              <label className="flex shrink-0 items-center gap-2">
                <span className="text-xs text-fg-subtle sm:sr-only">Qty</span>
                <input
                  type="number"
                  min={1}
                  max={QUOTE_MAX_QTY}
                  step={1}
                  inputMode="numeric"
                  value={it.qty}
                  onChange={(e) => onQty(it.id, e.target.value)}
                  aria-label={`Quantity for ${it.code}`}
                  className="h-10 w-24 rounded-md border border-border-strong bg-surface px-2.5 text-center text-base text-fg outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 sm:text-sm"
                />
              </label>
              <button
                type="button"
                onClick={() => onRemove(it.id)}
                aria-label={`Remove ${it.code}`}
                className="mt-1 shrink-0 rounded-md p-2 text-muted transition-colors hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          );
        })}
      </ul>

      {/* Each row is submitted on its own; this is only a readable mirror of the list. */}
      <input type="hidden" name="itemsSummary" value={items.map((it) => `${it.code} × ${it.qty}${itemSpec(it) ? ` (${itemSpec(it)})` : ""}`).join("\n")} />

      <footer className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border px-4 py-3 sm:px-5">
        {tool && (
          <Link
            href={`/tools/${tool.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            <Plus className="h-4 w-4" /> Add another product
          </Link>
        )}
        {confirmClear ? (
          <span className="inline-flex items-center gap-3 text-sm">
            <span className="text-fg-subtle">Remove all {items.length} items?</span>
            <button type="button" onClick={onStartNew} className="font-medium text-danger hover:underline">
              Yes, start new quote
            </button>
            <button type="button" onClick={() => setConfirmClear(false)} className="text-muted hover:underline">
              Cancel
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="inline-flex items-center gap-1.5 text-sm text-fg-subtle transition-colors hover:text-danger"
          >
            <RotateCcw className="h-4 w-4" /> Start new quote
          </button>
        )}
      </footer>
    </section>
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
