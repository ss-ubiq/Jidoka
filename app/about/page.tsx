import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { families } from "@/data/families";
export const metadata: Metadata = { title: "About JIDOKA", description: "JIDOKA supplies precision industrial components and engineering solutions for automation, mould & die, machine building and manufacturing." };
const pillars = [
  { title: "What we do", body: "We help industrial companies find, specify, source and discuss components for machines, tooling, automation and manufacturing — across twelve engineering families." },
  { title: "How we work", body: "You send a part number, a drawing, a photo or a requirement. Our engineering team reviews it and responds with a quotation, an alternative or a recommendation — never an invented equivalence." },
  { title: "Who we serve", body: "Engineers, procurement teams, OEMs and machine builders in tool & die, automotive, packaging, automation and general manufacturing." },
];
export default function Page() {
  return (
    <>
      <PageHeader motif="caliper" eyebrow="About JIDOKA" title="An engineering partner for industrial components" lead="JIDOKA combines a broad, engineering-organised component range with genuine technical support — so you don't have to figure everything out on your own." crumbs={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <div className="container-page py-14">
        <div className="grid gap-4 lg:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-xl border border-border bg-surface p-7 shadow-card">
              <h2 className="text-lg font-semibold text-fg">{p.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-subtle">{p.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-xl border border-border bg-surface-2/50 p-7">
          <h2 className="text-lg font-semibold text-fg">Our component range</h2>
          <p className="mt-2 max-w-2xl text-sm text-fg-subtle">Twelve families, with real depth in mould &amp; die, springs, linear motion and aluminium profile — the areas our customers rely on us for most.</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {families.map((f) => (
              <li key={f.id}>
                <Link
                  href={`/products/${f.slug}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-fg-subtle transition-all hover:border-accent/50 hover:bg-accent-soft hover:text-accent"
                >
                  {f.name}
                  <ArrowRight className="h-3.5 w-3.5 -translate-x-0.5 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <CtaBand title="Let's discuss your requirement" body="Whether it's one component or a full BOM, start a technical conversation with JIDOKA." primary={{ label: "Request a Quote", href: "/request-a-quote" }} secondary={{ label: "Contact Us", href: "/contact" }} />
    </>
  );
}
