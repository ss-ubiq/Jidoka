import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, FileText, HelpCircle, Link2, Factory, Package, ClipboardList, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { motifFor } from "@/components/site/HeaderVisual";
import { CtaBand, PlaceholderNotice } from "@/components/site/CtaBand";
import { CatalogueDownload } from "@/components/products/CatalogueDownload";
import { JsonLd } from "@/components/site/JsonLd";
import { TrackOnMount } from "@/components/analytics/TrackOnMount";
import { productLd, breadcrumbLd } from "@/lib/jsonld";
import { allProductPaths, resolveProduct, relatedProducts, relatedFamilies } from "@/lib/catalog";
import { catalogueHref } from "@/lib/utils";
import { toolsByProduct } from "@/data/tools";

export function generateStaticParams() {
  return allProductPaths();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; product: string }>;
}): Promise<Metadata> {
  const { slug, product } = await params;
  const resolved = resolveProduct(slug, product);
  if (!resolved) return {};
  const { family, product: p } = resolved;
  return {
    title: `${p.name} — ${family.name}`,
    description: `${p.name} from JIDOKA's ${family.name} range. Catalogue, technical data and quotation on request. ${family.tagline}.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; product: string }>;
}) {
  const { slug, product } = await params;
  const resolved = resolveProduct(slug, product);
  if (!resolved) notFound();
  const { family, product: p } = resolved;
  const related = relatedProducts(p);
  const relFamilies = relatedFamilies(family);

  const refLabel = `${p.name} (${p.code})`;
  const productTools = toolsByProduct[p.code] ?? [];

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: family.name, href: `/products/${family.slug}` },
    { label: p.name },
  ];

  return (
    <>
      <JsonLd data={[productLd(p, family), breadcrumbLd(crumbs)]} />
      <TrackOnMount event="product_view" props={{ code: p.code, family: family.id }} />
      <PageHeader
        eyebrow={`${family.name} · ${p.code}`}
        title={p.name}
        lead={`${p.name} is part of JIDOKA's ${family.name} range — ${family.tagline.toLowerCase()}.`}
        crumbs={crumbs}
        motif={motifFor(`${p.name} ${family.slug}`)}
      >
        <div className="flex flex-wrap items-center gap-3">
          {productTools.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-accent bg-accent-soft/60 px-5 text-sm font-medium text-accent transition-colors hover:bg-accent-soft"
            >
              <SlidersHorizontal className="h-4 w-4" /> Configure part number
            </Link>
          ))}
          <Link
            href={`/request-a-quote?ref=${encodeURIComponent(refLabel)}`}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-5 text-sm font-medium text-accent-fg transition-all hover:brightness-110"
          >
            Request a Quote <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/engineering-desk" className="inline-flex h-10 items-center gap-2 rounded-md border border-border-strong bg-surface px-5 text-sm font-medium text-fg transition-colors hover:bg-surface-2">
            <HelpCircle className="h-4 w-4" /> Ask an Engineer
          </Link>
        </div>
      </PageHeader>

      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-14">
          {/* Engineering context (§27) */}
          <section>
            <h2 className="text-xl font-semibold text-fg">Engineering context</h2>
            <dl className="mt-5 divide-y divide-border rounded-lg border border-border bg-surface">
              {[
                { q: "What is it?", a: `${p.name} — ${family.blurb}` },
                { q: "Where is it used?", a: `Commonly used in ${family.applications.map((a) => a.replace(/-/g, " ")).join(", ")}.` },
                { q: "What specifications matter?", a: "Type/size, material, load or motion parameters, tolerance and finish as applicable. Full dimensions, materials and variants are in the product catalogue below." },
                { q: "What does JIDOKA need to quote it?", a: "The variant/size and quantity, plus your application. Send a drawing, photo or part number if you have one — we'll fill any gaps." },
              ].map((row) => (
                <div key={row.q} className="grid gap-1 p-5 sm:grid-cols-[14rem_1fr]">
                  <dt className="text-sm font-medium text-fg">{row.q}</dt>
                  <dd className="text-sm leading-relaxed text-fg-subtle">{row.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Interactive configurator (where one exists for this product) */}
          {productTools.map((t) => (
            <section key={t.slug}>
              <h2 className="text-xl font-semibold text-fg">Build a part number</h2>
              <Link
                href={`/tools/${t.slug}`}
                className="group mt-5 flex flex-col justify-between gap-4 rounded-xl border border-accent/30 bg-accent-soft/40 p-6 shadow-card transition-all hover:border-accent/50 hover:shadow-card-hover sm:flex-row sm:items-center"
              >
                <div className="min-w-0">
                  <p className="text-base font-semibold text-fg group-hover:text-accent">{t.name}</p>
                  <p className="mt-1 text-sm text-fg-subtle">{t.short}</p>
                  <p className="mt-2 text-xs text-muted">Rules transcribed from the {t.source}.</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent">
                  Open configurator <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </section>
          ))}

          {/* Technical documents — REAL catalogue (§26, §36) */}
          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-fg">
              <FileText className="h-5 w-5 text-accent" /> Technical documents
            </h2>
            <div className="mt-5 space-y-4">
              {p.catalogueFile ? (
                <>
                  <CatalogueDownload href={p.catalogueFile} title={`${p.name} — Product Catalogue`} sizeMB={p.catalogueSizeMB} productCode={p.code} downloadName={`${p.name.replace(/\//g, "-")}.pdf`} />
                  {p.extraDocs?.map((d) => (
                    <CatalogueDownload key={d.file} href={d.file} title={d.title} sizeMB={d.sizeMB} productCode={p.code} downloadName={`${d.title.replace(/[—/]/g, "-")}.pdf`} />
                  ))}
                </>
              ) : (
                <PlaceholderNotice>
                  The catalogue for {p.name} is being prepared. Request it and we&apos;ll send it directly.
                </PlaceholderNotice>
              )}
              <p className="text-xs text-muted">
                Datasheets and CAD for this product are published where available — request what you need via the
                Engineering Desk.
              </p>
            </div>
          </section>

          {/* Technical specifications — never invented (§3, §26) */}
          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-fg">
              <ClipboardList className="h-5 w-5 text-accent" /> Technical specifications
            </h2>
            <div className="mt-5">
              <PlaceholderNotice>
                Structured specifications, dimensions and variant tables for {p.name} come directly from the product
                catalogue above — JIDOKA never publishes fabricated specification data. Tell us the size or variant you
                need and we&apos;ll confirm the exact technical data.
              </PlaceholderNotice>
            </div>
          </section>

          {/* Related products (same family) */}
          {related.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-fg">
                <Package className="h-5 w-5 text-accent" /> Related products
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {related.map((r) => (
                  <Link
                    key={r.code}
                    href={`/products/${family.slug}/${r.slug}`}
                    className="group rounded-lg border border-border bg-surface p-4 shadow-card transition-colors hover:border-accent/40"
                  >
                    <p className="text-sm font-medium text-fg group-hover:text-accent">{r.name}</p>
                    <p className="mt-0.5 font-mono text-xs text-muted">{r.code}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Commonly used with (families §28) */}
          {relFamilies.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-fg">
                <Link2 className="h-5 w-5 text-accent" /> Commonly used with
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {relFamilies.map((r) => (
                  <Link key={r.id} href={`/products/${r.slug}`} className="group rounded-lg border border-border bg-surface p-4 shadow-card transition-colors hover:border-accent/40">
                    <p className="text-sm font-medium text-fg group-hover:text-accent">{r.name}</p>
                    <p className="mt-1 text-xs text-muted">{r.tagline}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
            <h3 className="text-sm font-semibold text-fg">Get this specified</h3>
            <p className="mt-1 text-sm text-fg-subtle">Tell us the variant and quantity — we&apos;ll quote or recommend.</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link href={`/request-a-quote?ref=${encodeURIComponent(refLabel)}`} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-fg transition-all hover:brightness-110">
                Request a Quote <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/engineering/find-an-alternative" className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border-strong bg-surface px-4 text-sm font-medium text-fg transition-colors hover:bg-surface-2">
                Find an Alternative
              </Link>
            </div>
          </div>
          {p.catalogueFile && (
            <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-fg"><FileText className="h-4 w-4 text-accent" /> Catalogue</h3>
              <a href={catalogueHref(p.catalogueFile)} download={`${p.name.replace(/\//g, "-")}.pdf`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
                Download PDF ({p.catalogueSizeMB} MB) <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          )}
          <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-fg"><Factory className="h-4 w-4 text-accent" /> Applications</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {family.applications.map((a) => (
                <li key={a}>
                  <Link href={`/applications/${a}`} className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-fg-subtle hover:border-accent/40 hover:text-accent">
                    {a.replace(/-/g, " ")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <CtaBand
        title={`Need ${p.name}?`}
        body="Send the variant, quantity and application — or a drawing — and get a considered technical response."
        primary={{ label: "Request a Quote", href: `/request-a-quote?ref=${encodeURIComponent(refLabel)}` }}
        secondary={{ label: `Back to ${family.name}`, href: `/products/${family.slug}` }}
      />
    </>
  );
}
