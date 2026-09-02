import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand, PlaceholderNotice } from "@/components/site/CtaBand";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbLd } from "@/lib/jsonld";
import { tools } from "@/data/tools";

const tool = tools.find((t) => t.slug === "shaft-configurator")!;

export const metadata: Metadata = {
  title: "Linear Shaft Configurator",
  description:
    "Interactive linear shaft part number configurator — choose family, material, diameter, length, end dimensions and optional processing to build a catalogue-valid JIDOKA item code, then request a quote.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code } = await searchParams;
  const safeCode = (code ?? "").toUpperCase().replace(/\s+/g, "-").replace(/[^A-Z0-9.\-]/g, "").slice(0, 64);
  const src = `${tool.file}?embed=1${safeCode ? `&code=${safeCode}` : ""}`;
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Engineering", href: "/engineering" },
    { label: tool.name },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbLd(crumbs)]} />
      <PageHeader
        motif="bearing"
        eyebrow="Engineering Tool · Linear Motion"
        title={tool.name}
        lead={tool.short}
        crumbs={crumbs}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/products/linear-motion-and-bearings/guide-shaft"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
          >
            Guide Shaft catalogue product <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={tool.file}
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
            ["Pick the shaft type", "Solid or hollow, plain or with tapped, threaded or stepped ends — straight from the catalogue pages."],
            ["Set the dimensions", "Diameter, length, end sizes and optional processing. The tool only allows combinations the catalogue lists."],
            ["Send it for quotation", "One click hands the part number and its specification to our engineers — no account, no checkout."],
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
            title={tool.name}
            className="block h-[calc(100vh-9rem)] min-h-[40rem] w-full"
            loading="eager"
          />
        </div>
        <div className="mt-6 max-w-3xl">
          <PlaceholderNotice>
            Rules are transcribed from the {tool.source}. The configurator is an example build for checking a part
            number, not an official ordering tool — add your codes to the quotation list and send them to us, and
            our engineers confirm every item against the current catalogue before quoting.
          </PlaceholderNotice>
        </div>
      </div>

      <CtaBand
        title="Built your part number?"
        body="Send the configured code with a quantity. If anything is unclear — end machining, tolerance, surface treatment — ask an engineer and we will specify it with you."
        primary={{ label: "Request a Quote", href: "/request-a-quote" }}
        secondary={{ label: "Ask an Engineer", href: "/engineering-desk" }}
      />
    </>
  );
}
