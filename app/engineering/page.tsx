import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { engineeringMenu } from "@/lib/site";
export const metadata: Metadata = { title: "Engineering", description: "JIDOKA for engineers — product finder, part number search, compare components, technical library, ask an engineer, find an alternative, submit BOM and custom components." };
export default function Page() {
  return (
    <>
      <PageHeader motif="caliper" eyebrow="JIDOKA for Engineers" title="Engineering tools & technical support" lead="Everything an engineer or procurement team needs to find, specify, compare, replace or customise a component — without a shopping cart in sight." crumbs={[{ label: "Home", href: "/" }, { label: "Engineering" }]} />
      <div className="container-page py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {engineeringMenu.map((it) => (
            <Link key={it.href} href={it.href} className="group flex flex-col rounded-xl border border-border bg-surface p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-card-hover">
              <h2 className="text-lg font-semibold text-fg group-hover:text-accent">{it.label}</h2>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-fg-subtle">{it.hint}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
            </Link>
          ))}
        </div>
      </div>
      <CtaBand title="Have a requirement in hand?" body="Send a part number, drawing or BOM — our engineering team will take it from there." primary={{ label: "Ask an Engineer", href: "/engineering-desk" }} secondary={{ label: "Request a Quote", href: "/request-a-quote" }} />
    </>
  );
}
