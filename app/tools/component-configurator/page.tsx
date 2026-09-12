import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand, PlaceholderNotice } from "@/components/site/CtaBand";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbLd } from "@/lib/jsonld";
import { sectionByKey, productHref } from "@/data/catalogueSections";
import { catalogueProducts } from "@/data/products";

/** Self-contained configurator page under /public/tools — generated from the supplier catalogues. */
const FILE = "/tools/component-configurator.embed.html";

export const metadata: Metadata = {
  title: "Component Configurator",
  description:
    "Interactive part number configurator covering the full supplier catalogue — pick a catalogue section, product family and every size and option the book lists to build a catalogue-valid item code, then send it for quotation.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  // Only a known section key ever reaches the embedded page.
  const section = cat ? sectionByKey[cat] : undefined;
  const product = section ? catalogueProducts.find((p) => p.code === section.product) : undefined;
  const src = `${FILE}?embed=1${section ? `&cat=${encodeURIComponent(section.key)}` : ""}`;

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Engineering", href: "/engineering" },
    { label: "Component Configurator" },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbLd(crumbs)]} />
      <PageHeader
        motif="bearing"
        eyebrow="Engineering Tool · All Catalogues"
        title="Component Configurator"
        lead={
          section
            ? `Opened on the ${section.title} section — ${section.families} product families, ${section.codes} orderable codes, transcribed from the ${product?.name ?? section.title} catalogue. Work through one step per selection the catalogue asks for; only the combinations the book lists are offered.`
            : "Pick a catalogue section, then a product family, and work through one step per selection the catalogue asks for. Only the combinations the book actually lists are offered, so an impossible code cannot be built."
        }
        crumbs={crumbs}
      >
        <div className="flex flex-wrap items-center gap-3">
          {product && productHref[product.code] ? (
            <Link
              href={productHref[product.code]}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
            >
              {product.name} catalogue <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
            >
              Browse the product families <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          {/*
            `rel="opener"` is deliberate and must stay. Chrome applies noopener to every
            target="_blank" by default, which puts the new tab in its own browsing context
            group — and a tab in a new group does not inherit this one's sessionStorage,
            so the visitor's quotation list would vanish on the way to full-screen.
            Opting back in is safe here: this is a same-origin link to our own tool file,
            which is exactly the case noopener is not protecting against. (Verified: with
            the default, and with rel="" , the new tab starts empty; only rel="opener"
            carries the list.)
          */}
          <a
            href={src}
            target="_blank"
            rel="opener"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-subtle hover:text-fg"
          >
            Open full-screen <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </PageHeader>

      <div className="container-page py-8">
        <ol className="mb-6 grid gap-3 sm:grid-cols-3">
          {[
            ["Find the product", "50 catalogue sections, 1,227 product families — each with its photo, dimensioned drawing and catalogue page number."],
            ["Build the code", "Type, material, bore, length, tolerance, thread and any optional processing the catalogue offers."],
            ["Send it for quotation", "Collect several items into a list, then hand it to our engineers — no account, no checkout."],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-3 rounded-lg border border-border bg-surface p-4 shadow-card">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-accent font-mono text-xs font-semibold text-accent-fg">{i + 1}</span>
              <span>
                <span className="block text-sm font-semibold text-fg">{t}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-fg-subtle">{d}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
          <iframe
            src={src}
            title="Component Configurator"
            className="block h-[calc(100vh-9rem)] min-h-[40rem] w-full"
            loading="lazy"
          />
        </div>
        <div className="mt-6 max-w-3xl">
          <PlaceholderNotice>
            The drawings and photographs are stored inside the page, so the first load is large and may take a
            while on a phone. Part numbers and dimensions are transcribed from the printed catalogue tables and
            may contain reading errors — this is a tool for checking a part number, not an official ordering
            system. Our engineers confirm every item against the current catalogue before quoting.
          </PlaceholderNotice>
        </div>
      </div>

      <CtaBand
        title="Built your part number?"
        body="Send the configured codes with quantities. If anything is unclear — end machining, tolerance, surface treatment — ask an engineer and we will specify it with you."
        primary={{ label: "Request a Quote", href: "/request-a-quote" }}
        secondary={{ label: "Ask an Engineer", href: "/engineering-desk" }}
      />
    </>
  );
}
