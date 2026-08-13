import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, HelpCircle, Layers, Link2 } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { JsonLd } from "@/components/site/JsonLd";
import { faqLd, breadcrumbLd } from "@/lib/jsonld";
import { keywordPages, keywordBySlug } from "@/data/keywords";
import { familyById } from "@/lib/catalog";

export function generateStaticParams() {
  return keywordPages.map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const k = keywordBySlug.get(slug);
  if (!k) return {};
  return {
    title: k.searchTitle,
    description: k.metaDescription,
    keywords: k.keywords,
    alternates: { canonical: `/components/${k.slug}` },
  };
}

export default async function KeywordPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const k = keywordBySlug.get(slug);
  if (!k) notFound();
  const family = familyById.get(k.familyId);
  const related = k.related.map((s) => keywordBySlug.get(s)).filter(Boolean);
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Components", href: "/components" },
    { label: k.term },
  ];
  const refLabel = k.term;

  return (
    <>
      <JsonLd data={[faqLd(k.faqs), breadcrumbLd(crumbs)]} />
      <PageHeader eyebrow="Component Guide" title={k.term} lead={k.intro} crumbs={crumbs}>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/request-a-quote?ref=${encodeURIComponent(refLabel)}`}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-5 text-sm font-medium text-accent-fg transition-all hover:brightness-110"
          >
            Request a Quote <ArrowRight className="h-4 w-4" />
          </Link>
          {family && (
            <Link href={`/products/${family.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
              Browse {family.name} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </PageHeader>

      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-14">
          {/* What is it */}
          <section>
            <h2 className="text-xl font-semibold text-fg">What are {k.term.toLowerCase()}?</h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-fg-subtle">{k.whatIs}</p>
            {k.materials && (
              <div className="mt-5 rounded-lg border border-border bg-surface p-5">
                <p className="font-mono text-xs uppercase tracking-wider text-muted">Typical materials</p>
                <p className="mt-2 text-sm leading-relaxed text-fg-subtle">{k.materials}</p>
              </div>
            )}
          </section>

          {/* Types */}
          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-fg">
              <Layers className="h-5 w-5 text-accent" /> Types of {k.term.toLowerCase()}
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {k.types.map((t) => (
                <div key={t.name} className="rounded-lg border border-border bg-surface p-5 shadow-card">
                  <h3 className="text-sm font-semibold text-fg">{t.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-fg-subtle">{t.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Selection */}
          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-fg">
              <CheckCircle2 className="h-5 w-5 text-accent" /> How to select {k.term.toLowerCase()}
            </h2>
            <ul className="mt-5 space-y-3">
              {k.selection.map((s) => (
                <li key={s} className="flex gap-3 rounded-lg border border-border bg-surface p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-sm leading-relaxed text-fg-subtle">{s}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">
              Not sure? Send what you have — a part number, drawing or photo — and our engineering team will confirm the selection.
            </p>
          </section>

          {/* FAQs */}
          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-fg">
              <HelpCircle className="h-5 w-5 text-accent" /> Frequently asked questions
            </h2>
            <dl className="mt-5 divide-y divide-border rounded-lg border border-border bg-surface">
              {k.faqs.map((f) => (
                <div key={f.q} className="p-5">
                  <dt className="text-sm font-semibold text-fg">{f.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-fg-subtle">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Related component guides */}
          {related.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-fg">
                <Link2 className="h-5 w-5 text-accent" /> Related components
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {related.map((r) => r && (
                  <Link key={r.slug} href={`/components/${r.slug}`} className="group rounded-lg border border-border bg-surface p-4 shadow-card transition-colors hover:border-accent/40">
                    <p className="text-sm font-medium text-fg group-hover:text-accent">{r.term}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted">{r.intro}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
            <h3 className="text-sm font-semibold text-fg">Get {k.term.toLowerCase()} quoted</h3>
            <p className="mt-1 text-sm text-fg-subtle">Send sizes, a part number or a drawing — we&apos;ll respond with a quotation.</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link href={`/request-a-quote?ref=${encodeURIComponent(refLabel)}`} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-fg transition-all hover:brightness-110">
                Request a Quote <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/engineering/find-an-alternative" className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border-strong bg-surface px-4 text-sm font-medium text-fg transition-colors hover:bg-surface-2">
                Find an Alternative
              </Link>
              <Link href="/engineering-desk" className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border-strong bg-surface px-4 text-sm font-medium text-fg transition-colors hover:bg-surface-2">
                Ask an Engineer
              </Link>
            </div>
          </div>
          {family && (
            <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
              <h3 className="text-sm font-semibold text-fg">Product family</h3>
              <Link href={`/products/${family.slug}`} className="mt-3 flex items-center gap-3 rounded-md border border-border bg-surface-2/60 p-3 transition-colors hover:border-accent/40">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded border border-border bg-surface font-mono text-xs font-semibold text-muted">{family.code}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-fg">{family.name}</span>
                  <span className="block truncate text-xs text-muted">{family.tagline}</span>
                </span>
              </Link>
            </div>
          )}
        </aside>
      </div>

      <CtaBand
        title={`Need ${k.term.toLowerCase()}?`}
        body="Tell us the specification, quantity and application — or just send the drawing."
        primary={{ label: "Request a Quote", href: `/request-a-quote?ref=${encodeURIComponent(refLabel)}` }}
        secondary={{ label: "Send Requirement", href: "/send-requirement" }}
      />
    </>
  );
}
