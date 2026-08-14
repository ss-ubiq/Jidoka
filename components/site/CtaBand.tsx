import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

/** Reusable "next action" band so every page has an appropriate CTA (§67). */
export function CtaBand({
  title,
  body,
  primary,
  secondary,
}: {
  title: string;
  body?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="relative overflow-hidden border-t border-border bg-surface-2/40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid opacity-[0.3] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_60%_100%_at_85%_50%,black,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-accent/[0.08] blur-3xl"
      />
      <Reveal className="container-page relative flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
        <div>
          <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-fg">{title}</h2>
          {body && <p className="mt-2 max-w-lg text-fg-subtle">{body}</p>}
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link
            href={primary.href}
            className="btn-sheen inline-flex h-12 items-center gap-2 rounded-md bg-accent px-6 font-medium text-accent-fg shadow-card transition-all hover:-translate-y-px hover:brightness-110 hover:shadow-card-lg"
          >
            {primary.label} <ArrowRight className="h-4 w-4" />
          </Link>
          {secondary && (
            <Link
              href={secondary.href}
              className="inline-flex h-12 items-center gap-2 rounded-md border border-border-strong bg-surface px-6 font-medium text-fg transition-colors hover:bg-surface-2"
            >
              {secondary.label}
            </Link>
          )}
        </div>
      </Reveal>
    </section>
  );
}

/** Honest "in progress" notice for content still being finalised (§3 — no fabrication). */
export function PlaceholderNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-warning/30 bg-warning/5 p-5 text-sm text-fg-subtle">
      <p className="font-medium text-fg">Content in preparation</p>
      <p className="mt-1">{children}</p>
    </div>
  );
}
