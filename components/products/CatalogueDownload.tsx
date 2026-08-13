"use client";

import { FileText, Download } from "lucide-react";
import { track } from "@/lib/analytics";
import { catalogueHref } from "@/lib/utils";

/** Real catalogue PDF download (§26, §36). Only rendered when a genuine file exists. */
export function CatalogueDownload({
  href,
  title,
  sizeMB,
  productCode,
  downloadName,
}: {
  href: string;
  title: string;
  sizeMB: number;
  productCode?: string;
  /** Filename the browser saves as (defaults to the URL basename). */
  downloadName?: string;
}) {
  return (
    <a
      href={catalogueHref(href)}
      download={downloadName || true}
      onClick={() => track("resource_download", { type: "catalogue", ...(productCode ? { code: productCode } : {}) })}
      className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-4 shadow-card transition-all hover:border-accent/40 hover:shadow-card-hover"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
        <FileText className="h-6 w-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-fg group-hover:text-accent">{title}</span>
        <span className="block text-xs text-muted">PDF catalogue · {sizeMB} MB · dimensions, materials &amp; variants</span>
      </span>
      <span className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-border-strong bg-surface px-3 text-sm font-medium text-fg transition-colors group-hover:border-accent/40 group-hover:text-accent">
        <Download className="h-4 w-4" /> Download
      </span>
    </a>
  );
}
