import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { Badge } from "@/components/ui/Primitives";
import { familiesByDemand, productsOf } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Products — Engineering Component Explorer",
  description:
    "Explore JIDOKA's industrial components across 12 engineering families — mould & die, linear motion, springs, power transmission, pneumatics, automation and more.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Engineering Product Explorer"
        title="Industrial components, organised by engineering family"
        lead="Browse twelve component families ordered by real demand. Open a family to see its subfamilies, catalogue products, technical resources and related components."
        crumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
        motif="pin"
      />

      <div className="container-page py-14">
        <div className="grid gap-5 lg:grid-cols-2">
          {familiesByDemand.map((f) => {
            const count = productsOf(f.id).length;
            return (
              <Link
                key={f.id}
                href={`/products/${f.slug}`}
                className="group flex gap-5 rounded-xl border border-border bg-surface p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-card-hover"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg border border-border bg-surface-2 font-mono text-base font-semibold text-muted transition-colors group-hover:border-accent/40 group-hover:text-accent">
                  {f.code}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-fg group-hover:text-accent">{f.name}</h2>
                    {f.status === "catalogue" ? (
                      <Badge tone="positive">In catalogue</Badge>
                    ) : (
                      <Badge tone="heat">High demand</Badge>
                    )}
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-fg-subtle">{f.blurb}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted">
                    <span>{f.subfamilies.length} subfamilies</span>
                    {count > 0 && <span>{count} catalogue product{count > 1 ? "s" : ""}</span>}
                    <span className="ml-auto inline-flex items-center gap-1 font-medium text-accent">
                      Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <CtaBand
        title="Can't find the exact component?"
        body="Send a part number, a drawing or a description of what you're building. Our engineering team will help you find it."
        primary={{ label: "Send Requirement", href: "/send-requirement" }}
        secondary={{ label: "Request a Quote", href: "/request-a-quote" }}
      />
    </>
  );
}
