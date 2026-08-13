import type { Metadata } from "next";
import { Mail, Phone, MessageCircle, MapPin, Navigation, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { site, telHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact JIDOKA",
  description:
    "Contact JIDOKA for quotations, technical enquiries, alternatives, BOM review and custom components. Office in Sector 132, Noida.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to JIDOKA"
        lead="Reach us directly, start a structured technical enquiry, or visit our office in Noida."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <div className="container-page grid gap-8 py-14 lg:grid-cols-2">
        {/* Direct + address */}
        <div className="rounded-xl border border-border bg-surface p-7 shadow-card">
          <h2 className="text-lg font-semibold text-fg">Direct</h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-3 text-fg-subtle hover:text-accent">
                <Mail className="h-5 w-5 text-accent" /> {site.email}
              </a>
            </li>
            <li>
              <a href={telHref} className="inline-flex items-center gap-3 text-fg-subtle hover:text-accent">
                <Phone className="h-5 w-5 text-accent" /> {site.phone}
              </a>
            </li>
            {site.whatsapp && (
              <li>
                <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-fg-subtle hover:text-accent">
                  <MessageCircle className="h-5 w-5 text-accent" /> WhatsApp
                </a>
              </li>
            )}
          </ul>

          <div className="mt-6 border-t border-border pt-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-fg">
              <MapPin className="h-5 w-5 text-accent" /> Office
            </h3>
            <address className="mt-3 text-sm not-italic leading-relaxed text-fg-subtle">{site.address.full}</address>
            <a
              href={site.maps.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex h-11 items-center gap-2 rounded-md bg-accent px-5 text-sm font-medium text-accent-fg transition-all hover:brightness-110"
            >
              <Navigation className="h-4 w-4" /> Get directions
            </a>
          </div>
        </div>

        {/* Start an enquiry */}
        <div className="rounded-xl border border-border bg-surface p-7 shadow-card">
          <h2 className="text-lg font-semibold text-fg">Start an enquiry</h2>
          <p className="mt-2 text-sm text-fg-subtle">Pick the path that fits — each one reaches the engineering team.</p>
          <div className="mt-5 flex flex-col gap-2">
            {[
              { label: "Request a Quote", href: "/request-a-quote" },
              { label: "Send a Requirement", href: "/send-requirement" },
              { label: "Ask an Engineer", href: "/engineering-desk" },
              { label: "Submit a BOM", href: "/engineering/submit-bom" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center justify-between rounded-md border border-border-strong bg-surface px-4 py-3 text-sm font-medium text-fg transition-colors hover:border-accent/40 hover:text-accent"
              >
                {l.label} <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded map */}
      <div className="container-page pb-16">
        <div className="overflow-hidden rounded-xl border border-border shadow-card">
          <iframe
            title={`Map to ${site.legalName}, ${site.address.locality}`}
            src={site.maps.embed}
            width="100%"
            height="420"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block w-full border-0"
          />
        </div>
        <a href={site.maps.directions} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
          <Navigation className="h-4 w-4" /> Open directions in Google Maps
        </a>
      </div>
    </>
  );
}
