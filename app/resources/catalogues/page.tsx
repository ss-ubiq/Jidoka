import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { CatalogueDownload } from "@/components/products/CatalogueDownload";
import { familiesByDemand, productsOf, catalogueProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Catalogue Library",
  description:
    "Download JIDOKA product catalogues across all component families — springs, linear motion, power transmission, pneumatics, automation, functional components and more.",
};

export default function CatalogueLibraryPage() {
  const withCat = catalogueProducts.filter((p) => p.catalogueFile);
  const totalGB = (withCat.reduce((s, p) => s + p.catalogueSizeMB, 0) / 1024).toFixed(1);
  const familiesWithCat = familiesByDemand.filter((f) => productsOf(f.id).some((p) => p.catalogueFile));
  const familiesWithout = familiesByDemand.filter((f) => !productsOf(f.id).some((p) => p.catalogueFile));

  return (
    <>
      <PageHeader
        motif="sheet"
        eyebrow="Technical Library"
        title="Catalogue Library"
        lead="Download product catalogues across the JIDOKA range. Each catalogue carries the dimensions, materials and variants for its family."
        crumbs={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Catalogues" }]}
      >
        <p className="font-mono text-xs uppercase tracking-wider text-muted">
          {withCat.length} catalogues · {totalGB} GB · {familiesWithCat.length} families
        </p>
      </PageHeader>

      <div className="container-page space-y-14 py-14">
        {familiesWithCat.map((f) => {
          const items = productsOf(f.id).filter((p) => p.catalogueFile);
          return (
            <section key={f.id}>
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-3 text-xl font-semibold text-fg">
                  <span className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface-2 font-mono text-xs font-semibold text-muted">
                    {f.code}
                  </span>
                  {f.name}
                  <span className="font-mono text-xs font-normal text-muted">{items.length}</span>
                </h2>
                <Link href={`/products/${f.slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                  View family <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.flatMap((p) => [
                  <CatalogueDownload
                    key={p.code}
                    href={p.catalogueFile!}
                    title={`${p.name} — Product Catalogue`}
                    sizeMB={p.catalogueSizeMB}
                    productCode={p.code}
                    downloadName={`${p.name.replace(/\//g, "-")}.pdf`}
                  />,
                  ...(p.extraDocs ?? []).map((d) => (
                    <CatalogueDownload key={d.file} href={d.file} title={d.title} sizeMB={d.sizeMB} productCode={p.code} downloadName={`${d.title.replace(/[—/]/g, "-")}.pdf`} />
                  )),
                ])}
              </div>
            </section>
          );
        })}

        {/* Honest note about families supplied on enquiry */}
        {familiesWithout.length > 0 && (
          <section className="rounded-xl border border-border bg-surface-2/50 p-6">
            <h2 className="text-base font-semibold text-fg">Supplied on enquiry</h2>
            <p className="mt-1.5 text-sm text-fg-subtle">
              Catalogues for these families are provided on request — tell us what you need and we&apos;ll send the
              relevant technical documentation.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {familiesWithout.map((f) => (
                <li key={f.id}>
                  <Link href={`/products/${f.slug}`} className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-fg-subtle hover:border-accent/40 hover:text-accent">
                    {f.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/engineering-desk" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
              Request a catalogue <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        )}
      </div>

      <CtaBand
        title="Need a datasheet, drawing or CAD?"
        body="Catalogues are here to download; datasheets and CAD are provided per product on request."
        primary={{ label: "Ask an Engineer", href: "/engineering-desk" }}
        secondary={{ label: "Browse Products", href: "/products" }}
      />
    </>
  );
}
