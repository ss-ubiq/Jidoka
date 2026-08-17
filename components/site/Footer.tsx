import Link from "next/link";
import { Mail, Phone, MessageCircle, ArrowRight, MapPin, Navigation } from "lucide-react";
import { Logo } from "./Logo";
import { site, telHref } from "@/lib/site";
import { families } from "@/data/families";
import { keywordPages } from "@/data/keywords";

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Products",
    links: families.slice(0, 6).map((f) => ({ label: f.name, href: `/products/${f.slug}` })),
  },
  {
    title: "Popular Components",
    links: [
      ...keywordPages.slice(0, 5).map((k) => ({ label: k.term, href: `/components/${k.slug}` })),
      { label: "All component guides", href: "/components" },
    ],
  },
  {
    title: "Engineering",
    links: [
      { label: "Ask an Engineer", href: "/engineering-desk" },
      { label: "Find an Alternative", href: "/engineering/find-an-alternative" },
      { label: "Submit BOM", href: "/engineering/submit-bom" },
      { label: "Custom Component", href: "/engineering/custom-component" },
      { label: "Compare Components", href: "/engineering/compare" },
      { label: "Part Number Search", href: "/search" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Solutions", href: "/solutions" },
      { label: "Applications", href: "/applications" },
      { label: "Industries", href: "/industries" },
      { label: "Technical Resources", href: "/resources" },
      { label: "About JIDOKA", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      {/* Final CTA band (§21 → FINAL RFQ) */}
      <div className="border-b border-border">
        <div className="container-page flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
          <div>
            <p className="eyebrow mb-2">Tell us what you need</p>
            <h2 className="heading-shimmer max-w-xl text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
              Send a part number, a drawing, or describe what you&apos;re building.
            </h2>
          </div>
          <Link
            href="/request-a-quote"
            className="inline-flex h-[3.25rem] items-center gap-2 rounded-md bg-accent px-7 py-3.5 font-medium text-accent-fg shadow-card transition-all hover:shadow-card-lg hover:brightness-110"
          >
            Request a Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-[1.3fr_repeat(4,1fr)]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-fg-subtle">{site.description}</p>
          <div className="flex flex-col gap-2 pt-1 text-sm">
            {site.email && (
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 text-fg-subtle hover:text-accent">
                <Mail className="h-4 w-4 shrink-0" /> {site.email}
              </a>
            )}
            {site.phone && (
              <a href={telHref} className="inline-flex items-center gap-2 text-fg-subtle hover:text-accent">
                <Phone className="h-4 w-4 shrink-0" /> {site.phone}
              </a>
            )}
            {site.whatsapp && (
              <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-fg-subtle hover:text-accent">
                <MessageCircle className="h-4 w-4 shrink-0" /> WhatsApp
              </a>
            )}
          </div>
          <div className="flex items-start gap-2 pt-1 text-sm text-fg-subtle">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
            <span>
              {site.address.full}
              <a href={site.maps.directions} target="_blank" rel="noopener noreferrer" className="mt-1 flex items-center gap-1 font-medium text-accent hover:underline">
                <Navigation className="h-3.5 w-3.5" /> Get directions
              </a>
            </span>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-muted">{col.title}</h3>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-fg-subtle transition-colors hover:text-fg">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {site.legalName}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-fg">Privacy</Link>
            <Link href="/terms" className="hover:text-fg">Terms</Link>
            <span className="font-mono">Industrial components &amp; engineering solutions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
