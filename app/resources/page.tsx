import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand, PlaceholderNotice } from "@/components/site/CtaBand";
import { FileText, Ruler, Layers, BookOpen, ArrowRight } from "lucide-react";
import { catalogueProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Technical Library",
  description:
    "JIDOKA technical library — product catalogues (download), datasheets, CAD, drawings, selection guides and FAQs. Only genuinely available resources are published.",
};

export default function Page() {
  const catCount = catalogueProducts.filter((p) => p.catalogueFile).length;
  return (
    <>
      <PageHeader
        eyebrow="JIDOKA Technical Library"
        title="Catalogues, datasheets, CAD & guides"
        lead="Technical documentation to help you specify with confidence. We publish only resources that genuinely exist — nothing is fabricated."
        crumbs={[{ label: "Home", href: "/" }, { label: "Resources" }]}
      />
      <div className="container-page py-14">
        {/* Featured: live catalogue library */}
        <Link
          href="/resources/catalogues"
          className="group flex flex-col justify-between gap-6 rounded-xl border border-accent/30 bg-accent-soft/50 p-7 shadow-card transition-all hover:shadow-card-hover md:flex-row md:items-center"
        >
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-accent text-accent-fg">
              <FileText className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-fg group-hover:text-accent">Catalogue Library</h2>
              <p className="mt-1 text-sm text-fg-subtle">
                Download {catCount} product catalogues across the JIDOKA range — dimensions, materials and variants.
              </p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 font-medium text-accent">
            Open library <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Ruler, title: "Datasheets & Drawings", desc: "Technical data and dimensioned drawings, per product on request." },
            { icon: Layers, title: "CAD", desc: "CAD files to drop into your assembly, per product on request." },
            { icon: BookOpen, title: "Selection Guides & FAQs", desc: "Guidance on selecting and combining components." },
          ].map((s) => (
            <div key={s.title} className="rounded-xl border border-border bg-surface p-6 shadow-card">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-surface-2 text-accent">
                <s.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-base font-semibold text-fg">{s.title}</h2>
              <p className="mt-1.5 text-sm text-fg-subtle">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 max-w-3xl">
          <PlaceholderNotice>
            Catalogues are available to download now. Datasheets, CAD and selection guides are provided per product on
            request while the downloadable set is expanded — ask the Engineering Desk for the specific document you need.
          </PlaceholderNotice>
        </div>
      </div>
      <CtaBand
        title="Need a specific document?"
        body="Tell us the product and the document you need — catalogue, datasheet, drawing or CAD."
        primary={{ label: "Request Documentation", href: "/engineering-desk" }}
        secondary={{ label: "Browse Products", href: "/products" }}
      />
    </>
  );
}
