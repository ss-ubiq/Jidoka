"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, X, Search, FileText, ArrowRight } from "lucide-react";
import { catalogueHref } from "@/lib/utils";

export type ComparableProduct = {
  code: string;
  name: string;
  slug: string;
  familySlug: string;
  familyName: string;
  familyCode: string;
  category: string;
  applications: string[];
  catalogueFile: string | null;
  catalogueSizeMB: number;
  related: string[];
};

const MAX = 4;

export function CompareTool({ products }: { products: ComparableProduct[] }) {
  const [selected, setSelected] = useState<ComparableProduct[]>([]);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const chosen = new Set(selected.map((s) => s.code));
    return products
      .filter((p) => !chosen.has(p.code))
      .filter((p) => !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.familyName.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, selected, products]);

  function add(p: ComparableProduct) {
    if (selected.length >= MAX) return;
    setSelected((s) => [...s, p]);
    setQuery("");
  }
  function remove(code: string) {
    setSelected((s) => s.filter((p) => p.code !== code));
  }

  const rows: { label: string; render: (p: ComparableProduct) => React.ReactNode }[] = [
    { label: "Family", render: (p) => <Link href={`/products/${p.familySlug}`} className="text-accent hover:underline">{p.familyName}</Link> },
    { label: "Category", render: (p) => <span className="text-fg-subtle">{p.category}</span> },
    { label: "Applications", render: (p) => <span className="text-fg-subtle">{p.applications.map((a) => a.replace(/-/g, " ")).join(", ")}</span> },
    { label: "Commonly used with", render: (p) => <span className="text-fg-subtle">{p.related.join(", ") || "—"}</span> },
    {
      label: "Catalogue",
      render: (p) =>
        p.catalogueFile ? (
          <a href={catalogueHref(p.catalogueFile)} download className="inline-flex items-center gap-1.5 text-accent hover:underline">
            <FileText className="h-3.5 w-3.5" /> PDF · {p.catalogueSizeMB} MB
          </a>
        ) : (
          <span className="text-muted">On enquiry</span>
        ),
    },
    {
      label: "",
      render: (p) => (
        <Link href={`/request-a-quote?ref=${encodeURIComponent(`${p.name} (${p.code})`)}`} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-accent px-3 text-xs font-medium text-accent-fg hover:brightness-110">
          Quote <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Picker */}
      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={selected.length >= MAX ? `Maximum ${MAX} products` : "Add a component to compare…"}
          disabled={selected.length >= MAX}
          className="h-11 w-full rounded-md border border-border-strong bg-surface pl-10 pr-3 text-base text-fg sm:text-sm outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
        />
        {query && results.length > 0 && (
          <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-border bg-surface shadow-card-lg">
            {results.map((p) => (
              <li key={p.code}>
                <button onClick={() => add(p)} className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-surface-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded border border-border bg-surface-2 font-mono text-[0.6rem] font-semibold text-muted">{p.familyCode}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-fg">{p.name}</span>
                    <span className="block truncate text-xs text-muted">{p.familyName}</span>
                  </span>
                  <Plus className="h-4 w-4 text-accent" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-strong bg-surface-2/50 p-10 text-center">
          <p className="text-sm text-fg-subtle">Add up to {MAX} components above to compare them side by side.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-card">
          <table className="w-full min-w-[40rem] border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-40 border-b border-border bg-surface-2/60 p-4 text-left font-mono text-xs uppercase tracking-wider text-muted">Component</th>
                {selected.map((p) => (
                  <th key={p.code} className="border-b border-l border-border p-4 text-left align-top">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link href={`/products/${p.familySlug}/${p.slug}`} className="font-semibold text-fg hover:text-accent">{p.name}</Link>
                        <p className="mt-0.5 font-mono text-xs text-muted">{p.code}</p>
                      </div>
                      <button onClick={() => remove(p.code)} aria-label={`Remove ${p.name}`} className="grid h-6 w-6 shrink-0 place-items-center rounded text-muted hover:bg-surface-2 hover:text-danger">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="even:bg-surface-2/30">
                  <th className="border-b border-border p-4 text-left align-top font-medium text-fg">{row.label}</th>
                  {selected.map((p) => (
                    <td key={p.code} className="border-b border-l border-border p-4 align-top">{row.render(p)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="rounded-xl border border-accent/20 bg-accent-soft/50 p-6">
        <h2 className="text-base font-semibold text-fg">Detailed specification comparison</h2>
        <p className="mt-1.5 max-w-2xl text-sm text-fg-subtle">
          Dimensions, materials, load and variant data come directly from each product&apos;s catalogue — JIDOKA never
          fabricates specification values. Tell us the components and the application and our engineers will compare the
          exact specifications and recommend the right selection.
        </p>
        <Link href="/engineering-desk" className="mt-4 inline-flex h-11 items-center gap-2 rounded-md bg-accent px-5 text-sm font-medium text-accent-fg transition-all hover:brightness-110">
          Discuss selection with JIDOKA <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
