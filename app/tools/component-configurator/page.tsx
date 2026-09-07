import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand, PlaceholderNotice } from "@/components/site/CtaBand";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbLd } from "@/lib/jsonld";

/** Self-contained configurator page under /public/tools — generated from the supplier catalogues. */
const FILE = "/tools/component-configurator.html";

export const metadata: Metadata = {
  title: "Component Configurator",
  description:
    "Interactive part number configurator covering the full supplier catalogue — pick a catalogue section, product family and every size and option the book lists to build a catalogue-valid item code, then send it for quotation.",
};

export default function Page() {
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
        lead="Pick a catalogue section, then a product family, and work through one step per selection the catalogue asks for. Only the combinations the book actually lists are offered, so an impossible code cannot be built."
        crumbs={crumbs}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
          >
            Browse the product families <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={FILE}
            target="_blank"
            rel="noopener noreferrer"
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
            src={FILE}
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
