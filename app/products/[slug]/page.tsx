import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, FileText, HelpCircle, Layers, Link2, Factory } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { motifFor } from "@/components/site/HeaderVisual";
import { CtaBand, PlaceholderNotice } from "@/components/site/CtaBand";
import { CatalogueDownload } from "@/components/products/CatalogueDownload";
import { JsonLd } from "@/components/site/JsonLd";
import { TrackOnMount } from "@/components/analytics/TrackOnMount";
import { familyItemListLd, breadcrumbLd } from "@/lib/jsonld";
import { Badge } from "@/components/ui/Primitives";
import { families, familyBySlug, productsOf, relatedFamilies } from "@/lib/catalog";
import { keywordsByFamily } from "@/data/keywords";
import { slugify } from "@/lib/utils";

export function generateStaticParams() {
  return families.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const family = familyBySlug.get(slug);
  if (!family) return {};
  return {
    title: `${family.name} — ${family.tagline}`,
    description: family.blurb,
  };
}

export default async function FamilyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const family = familyBySlug.get(slug);
  if (!family) notFound();

  const products = productsOf(family.id);
  const related = relatedFamilies(family);
  const guides = keywordsByFamily[family.id] ?? [];
  const crumbs = [{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: family.name }];

  return (
    <>
      <JsonLd data={[familyItemListLd(family, products), breadcrumbLd(crumbs)]} />
      <TrackOnMount event="family_view" props={{ family: family.id }} />
      <PageHeader
        eyebrow={`${family.code} · Component Family`}
        title={family.name}
        lead={family.blurb}
        crumbs={crumbs}
        motif={motifFor(family.slug)}
      >
        <div className="flex flex-wrap items-center gap-3">
          {family.status === "catalogue" ? (
            <Badge tone="positive">In catalogue</Badge>
          ) : (
            <Badge tone="heat">High real demand</Badge>
          )}
          <Link href="/request-a-quote" className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
            Request a quote for this family <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </PageHeader>

      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-14">
          {/* Subfamilies */}
          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-fg">
              <Layers className="h-5 w-5 text-accent" /> Subfamilies
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {family.subfamilies.map((sub) => (
                <div
                  key={sub.name}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface p-4 shadow-card"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-fg">{sub.name}</p>
                    {sub.product ? (
                      <p className="truncate text-xs text-muted">Catalogue: {sub.product}</p>
                    ) : (
                      <p className="truncate text-xs text-muted">Available on enquiry</p>
                    )}
                  </div>
                  <Link
                    href={`/request-a-quote?ref=${encodeURIComponent(family.name + " · " + sub.name)}`}
                    className="ml-3 shrink-0 rounded-md border border-border-strong bg-surface px-2.5 py-1.5 text-xs font-medium text-fg transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    Quote
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Catalogue products */}
          {products.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-fg">Catalogue products</h2>
              <p className="mt-1 text-sm text-muted">
                Verified products in the JIDOKA catalogue. Technical data is available in the product
                catalogue documents — request it with a quote.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {products.map((p) => (
                  <Link
                    key={p.code}
                    href={`/products/${family.slug}/${p.slug}`}
                    className="group flex items-center justify-between rounded-lg border border-border bg-surface p-4 shadow-card transition-all hover:border-accent/40 hover:shadow-card-hover"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-fg group-hover:text-accent">{p.name}</p>
                      <p className="mt-0.5 font-mono text-xs text-muted">{p.code}</p>
                    </div>
                    <div className="ml-3 flex shrink-0 items-center gap-2">
                      {p.catalogueFile && <Badge tone="neutral">PDF</Badge>}
                      <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Component guides for this family (SEO cross-links) */}
          {guides.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-fg">Component guides</h2>
              <p className="mt-1 text-sm text-muted">Selection guides for the most-requested components in this family.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {guides.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/components/${g.slug}`}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-fg-subtle transition-all hover:border-accent/50 hover:bg-accent-soft hover:text-accent"
                  >
                    {g.term}
                    <ArrowRight className="h-3.5 w-3.5 -translate-x-0.5 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Engineering context (§27) */}
          <section>
            <h2 className="text-xl font-semibold text-fg">Engineering context</h2>
            <dl className="mt-5 divide-y divide-border rounded-lg border border-border bg-surface">
              {[
                { q: "What is it?", a: family.blurb },
                { q: "Where is it used?", a: `Typical applications include ${family.applications.map((a) => a.replace(/-/g, " ")).join(", ")}.` },
                { q: "What information does JIDOKA need to quote it?", a: "Type/size, material, quantity and application — plus a drawing, photo or part number where you have one. Send what you have; we'll fill the gaps." },
              ].map((row) => (
                <div key={row.q} className="grid gap-1 p-5 sm:grid-cols-[14rem_1fr]">
                  <dt className="text-sm font-medium text-fg">{row.q}</dt>
                  <dd className="text-sm leading-relaxed text-fg-subtle">{row.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Related component intelligence (§28) */}
          {related.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-fg">
                <Link2 className="h-5 w-5 text-accent" /> Commonly used with
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/products/${r.slug}`}
                    className="group rounded-lg border border-border bg-surface p-4 shadow-card transition-colors hover:border-accent/40"
                  >
                    <p className="text-sm font-medium text-fg group-hover:text-accent">{r.name}</p>
                    <p className="mt-1 text-xs text-muted">{r.tagline}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Technical resources — real catalogue downloads */}
          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-fg">
              <FileText className="h-5 w-5 text-accent" /> Technical resources
            </h2>
            <div className="mt-5 space-y-3">
              {products.filter((p) => p.catalogueFile).length > 0 ? (
                <>
                  {products
                    .filter((p) => p.catalogueFile)
                    .map((p) => (
                      <CatalogueDownload key={p.code} href={p.catalogueFile!} title={`${p.name} — Product Catalogue`} sizeMB={p.catalogueSizeMB} productCode={p.code} downloadName={`${p.name.replace(/\//g, "-")}.pdf`} />
                    ))}
                  <p className="text-xs text-muted">
                    Datasheets and CAD are published per product where available — request what you need via the
                    Engineering Desk.
                  </p>
                </>
              ) : (
                <PlaceholderNotice>
                  Catalogues for {family.name} are supplied on enquiry. Request the technical documentation you need and
                  we&apos;ll send it directly.
                </PlaceholderNotice>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
            <h3 className="text-sm font-semibold text-fg">Get this specified</h3>
            <p className="mt-1 text-sm text-fg-subtle">Tell us the requirement — we&apos;ll quote or recommend.</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/request-a-quote" className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-fg transition-all hover:brightness-110">
                Request a Quote <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/engineering-desk" className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border-strong bg-surface px-4 text-sm font-medium text-fg transition-colors hover:bg-surface-2">
                <HelpCircle className="h-4 w-4" /> Ask an Engineer
              </Link>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-fg">
              <Factory className="h-4 w-4 text-accent" /> Applications
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {family.applications.map((a) => (
                <li key={a}>
                  <Link href={`/applications/${slugify(a)}`} className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-fg-subtle hover:border-accent/40 hover:text-accent">
                    {a.replace(/-/g, " ")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <CtaBand
        title={`Need ${family.name.toLowerCase()}?`}
        body="Send a part number, drawing or requirement and get a considered technical response."
        primary={{ label: "Request a Quote", href: "/request-a-quote" }}
        secondary={{ label: "Find an Alternative", href: "/engineering/find-an-alternative" }}
      />
    </>
  );
}
