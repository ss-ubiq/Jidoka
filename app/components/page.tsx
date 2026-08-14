import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { keywordPages } from "@/data/keywords";
import { familyById } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Industrial Components Guide — Ejector Pins, Springs, Bearings & More",
  description:
    "Engineering guides to the industrial components JIDOKA supplies — ejector pins, punches, button dies, die springs, gas springs, linear bearings, guide pins, aluminium profile and more. Learn, select, and request a quote.",
  keywords: keywordPages.flatMap((k) => k.keywords.slice(0, 3)),
  alternates: { canonical: "/components" },
};

export default function ComponentsHub() {
  // group by family for a scannable A–Z style hub
  const groups = new Map<string, typeof keywordPages>();
  for (const k of keywordPages) {
    const arr = groups.get(k.familyId) ?? [];
    arr.push(k);
    groups.set(k.familyId, arr);
  }

  return (
    <>
      <PageHeader
        motif="draft"
        eyebrow="Component Guides"
        title="Industrial components, explained and quoted"
        lead="Plain-language engineering guides to the components JIDOKA supplies — what they are, the types, how to select them, and how to get them quoted."
        crumbs={[{ label: "Home", href: "/" }, { label: "Components" }]}
      />
      <div className="container-page space-y-12 py-14">
        {[...groups.entries()].map(([familyId, items]) => {
          const family = familyById.get(familyId);
          return (
            <section key={familyId}>
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-3 text-xl font-semibold text-fg">
                  {family && (
                    <span className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface-2 font-mono text-xs font-semibold text-muted">
                      {family.code}
                    </span>
                  )}
                  {family?.name ?? familyId}
                </h2>
                {family && (
                  <Link href={`/products/${family.slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                    View family <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((k) => (
                  <Link
                    key={k.slug}
                    href={`/components/${k.slug}`}
                    className="group flex flex-col rounded-xl border border-border bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-card-hover"
                  >
                    <h3 className="text-base font-semibold text-fg group-hover:text-accent">{k.term}</h3>
                    <p className="mt-1.5 flex-1 line-clamp-2 text-sm leading-relaxed text-fg-subtle">{k.intro}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                      Guide &amp; quote <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <CtaBand
        title="Can't find your component here?"
        body="These guides cover our highest-demand components — but we supply far more. Send the part number, drawing or requirement."
        primary={{ label: "Send Requirement", href: "/send-requirement" }}
        secondary={{ label: "Browse All Products", href: "/products" }}
      />
    </>
  );
}
