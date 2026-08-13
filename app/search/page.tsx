import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Boxes, Layers, Package, Upload } from "lucide-react";
import { SearchBox } from "@/components/search/SearchBox";
import { TrackOnMount } from "@/components/analytics/TrackOnMount";
import { searchCatalogue, type SearchHit } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Search",
  description: "Search JIDOKA products, part numbers, component families and applications.",
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const hits = query ? searchCatalogue(query) : [];

  const familyHits = hits.filter((h) => h.kind === "family");
  const subfamilyHits = hits.filter((h) => h.kind === "subfamily");
  const productHits = hits.filter((h) => h.kind === "product");

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-heading-lg font-bold text-fg">Search</h1>
        <p className="mt-2 text-fg-subtle">Products, part numbers, component families, applications and requirements.</p>
        <div className="mt-6">
          <SearchBox initial={query} />
        </div>
      </div>

      {query && hits.length === 0 && <TrackOnMount event="search_no_result" props={{ q: query }} />}

      {query && (
        <div className="mx-auto mt-12 max-w-3xl space-y-10">
          <p className="text-sm text-muted">
            {hits.length > 0
              ? `${hits.length} result${hits.length > 1 ? "s" : ""} for “${query}”`
              : `No exact match for “${query}”`}
          </p>

          {familyHits.length > 0 && (
            <ResultGroup icon={Boxes} title="Product Families">
              {familyHits.map((h) => h.kind === "family" && (
                <ResultRow key={h.family.id} href={`/products/${h.family.slug}`} title={h.family.name} sub={h.family.tagline} tag={h.family.code} />
              ))}
            </ResultGroup>
          )}

          {subfamilyHits.length > 0 && (
            <ResultGroup icon={Layers} title="Subfamilies">
              {subfamilyHits.map((h, i) => h.kind === "subfamily" && (
                <ResultRow key={i} href={`/products/${h.family.slug}`} title={h.name} sub={`in ${h.family.name}`} tag={h.family.code} />
              ))}
            </ResultGroup>
          )}

          {productHits.length > 0 && (
            <ResultGroup icon={Package} title="Catalogue Products">
              {productHits.map((h) => h.kind === "product" && (
                <ResultRow
                  key={h.product.code}
                  href={h.family ? `/products/${h.family.slug}/${h.product.slug}` : "/products"}
                  title={h.product.name}
                  sub={h.product.code}
                  tag={h.family?.code ?? "—"}
                />
              ))}
            </ResultGroup>
          )}

          {/* No-result / can't-find experience (§24, §58) */}
          <div className="rounded-xl border border-accent/20 bg-accent-soft/50 p-7">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                <Upload className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-fg">
                  {hits.length > 0 ? "Not quite what you needed?" : "We couldn't find an exact match."}
                </h2>
                <p className="mt-1 text-sm text-fg-subtle">
                  Send us the part number, a drawing, a photo or your requirement — our engineering team will
                  identify the right component or an alternative.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href={`/send-requirement`} className="inline-flex h-11 items-center gap-2 rounded-md bg-accent px-5 text-sm font-medium text-accent-fg transition-all hover:brightness-110">
                    Submit Requirement <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/engineering/find-an-alternative" className="inline-flex h-11 items-center gap-2 rounded-md border border-border-strong bg-surface px-5 text-sm font-medium text-fg transition-colors hover:bg-surface-2">
                    Find an Alternative
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultGroup({ icon: Icon, title, children }: { icon: typeof Boxes; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-muted">
        <Icon className="h-4 w-4" /> {title}
      </h2>
      <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">{children}</div>
    </section>
  );
}

function ResultRow({ href, title, sub, tag }: { href: string; title: string; sub: string; tag: string }) {
  return (
    <Link href={href} className="group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-surface-2">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded border border-border bg-surface-2 font-mono text-[0.65rem] font-semibold text-muted">{tag}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-fg group-hover:text-accent">{title}</span>
        <span className="block truncate text-xs text-muted">{sub}</span>
      </span>
      <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
