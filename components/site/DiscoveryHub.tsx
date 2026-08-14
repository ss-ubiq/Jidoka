import Link from "next/link";
import { ArrowRight, CheckCircle2, Boxes, ListChecks } from "lucide-react";
import { PageHeader, type Crumb } from "@/components/site/PageHeader";
import { motifFor, type HeaderMotif } from "@/components/site/HeaderVisual";
import { CtaBand } from "@/components/site/CtaBand";
import { familyNeed, type DiscoveryItem } from "@/data/discovery";
import type { Family } from "@/data/families";

/** Index page for Applications / Industries (§29, §31). */
export function DiscoveryHub({
  eyebrow,
  title,
  lead,
  basePath,
  items,
  crumbs,
  motif = "gear",
}: {
  eyebrow: string;
  title: string;
  lead: string;
  basePath: string;
  items: DiscoveryItem[];
  crumbs: Crumb[];
  motif?: HeaderMotif;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} lead={lead} crumbs={crumbs} motif={motif} />
      <div className="container-page py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`${basePath}/${item.slug}`}
              className="group flex flex-col rounded-xl border border-border bg-surface p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-card-hover"
            >
              <h2 className="text-lg font-semibold text-fg group-hover:text-accent">{item.name}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-subtle">{item.blurb}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                View {item.name}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
      <CtaBand
        title="Not sure which components you need?"
        body="Describe your application or send a drawing — we'll map it to the right component families."
        primary={{ label: "Send Requirement", href: "/send-requirement" }}
        secondary={{ label: "Talk to an Engineer", href: "/engineering-desk" }}
      />
    </>
  );
}

/** Detail page for a single Solution / Application / Industry (§30). */
export function DiscoveryDetail({
  kind,
  item,
  families,
  crumbs,
}: {
  kind: string;
  item: DiscoveryItem;
  families: Family[];
  crumbs: Crumb[];
}) {
  return (
    <>
      <PageHeader
        eyebrow={kind}
        title={item.name}
        lead={item.overview ?? item.blurb}
        crumbs={crumbs}
        motif={motifFor(item.slug)}
      />

      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_17rem]">
        <div className="space-y-14">
          {/* Common component needs → families (§30) */}
          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-fg">
              <Boxes className="h-5 w-5 text-accent" /> Common component needs
            </h2>
            <p className="mt-1 text-sm text-muted">The JIDOKA component families most used in {item.name.toLowerCase()}.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {families.map((f) => (
                <Link
                  key={f.id}
                  href={`/products/${f.slug}`}
                  className="group flex items-start gap-4 rounded-xl border border-border bg-surface p-5 shadow-card transition-all hover:border-accent/40 hover:shadow-card-hover"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-border bg-surface-2 font-mono text-xs font-semibold text-muted group-hover:border-accent/40 group-hover:text-accent">
                    {f.code}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold text-fg group-hover:text-accent">{f.name}</span>
                    <span className="mt-0.5 block text-sm text-muted">{familyNeed[f.id] ?? f.tagline}</span>
                  </span>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </section>

          {/* Technical considerations (§30) */}
          {item.considerations && item.considerations.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-fg">
                <ListChecks className="h-5 w-5 text-accent" /> Technical considerations
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {item.considerations.map((c) => (
                  <li key={c} className="flex gap-3 rounded-lg border border-border bg-surface p-4 shadow-card">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span className="text-sm leading-relaxed text-fg-subtle">{c}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted">
                General engineering guidance — our team confirms the right selection for your specific application.
              </p>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
            <h3 className="text-sm font-semibold text-fg">Request technical assistance</h3>
            <p className="mt-1 text-sm text-fg-subtle">Tell us what you&apos;re building — we&apos;ll map it to the right components.</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/request-a-quote" className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-fg transition-all hover:brightness-110">
                Request a Quote <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/send-requirement" className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border-strong bg-surface px-4 text-sm font-medium text-fg transition-colors hover:bg-surface-2">
                Send Requirement
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <CtaBand
        title={`Discuss your ${item.name.toLowerCase()} requirement`}
        body="Send a requirement, drawing or BOM and our engineering team will help you specify and source."
        primary={{ label: "Ask an Engineer", href: "/engineering-desk" }}
        secondary={{ label: "Submit a BOM", href: "/engineering/submit-bom" }}
      />
    </>
  );
}
