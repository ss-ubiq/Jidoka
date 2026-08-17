import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/Primitives";
import { HeaderVisual, type HeaderMotif } from "@/components/site/HeaderVisual";

export type Crumb = { label: string; href?: string };

/** Staggered entrance delay for the header cascade. */
const rise = (i: number) => ({ animationDelay: `${i * 100}ms` });

export function PageHeader({
  eyebrow,
  title,
  lead,
  crumbs,
  children,
  motif = "gear",
}: {
  eyebrow?: string;
  title: string;
  lead?: React.ReactNode;
  crumbs?: Crumb[];
  children?: React.ReactNode;
  /** Animated blueprint motif on the right; "none" hides it. */
  motif?: HeaderMotif | "none";
}) {
  return (
    <header className="relative overflow-hidden border-b border-border bg-surface-2/40">
      {/* Drifting engineering grid — every page shares the blueprint character */}
      <div
        aria-hidden
        className="hero-grid pointer-events-none absolute inset-0 bg-grid opacity-[0.4] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_70%_90%_at_30%_0%,black,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 h-64 w-64 animate-pulse-soft rounded-full bg-accent/[0.08] blur-3xl"
      />
      {/* Blueprint scan line sweeping across the header */}
      <div
        aria-hidden
        className="scan-line pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-transparent via-accent/[0.07] to-transparent"
      />
      {/* Registration crosshair, drawing-sheet style */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-8 top-8 hidden h-6 w-6 animate-pulse-soft text-accent/60 sm:block"
      >
        <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1" />
        <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="1" />
        <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>

      <div className="container-page relative py-12 sm:py-16">
        {crumbs && crumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex animate-fade-in flex-wrap items-center gap-1 text-sm text-muted"
          >
            {crumbs.map((c, i) => (
              <span key={i} className="inline-flex items-center gap-1">
                {c.href ? (
                  <Link href={c.href} className="hover:text-fg">{c.label}</Link>
                ) : (
                  <span className="text-fg-subtle">{c.label}</span>
                )}
                {i < crumbs.length - 1 && <ChevronRight className="h-3.5 w-3.5" />}
              </span>
            ))}
          </nav>
        )}
        <div
          className={
            motif === "none"
              ? undefined
              : "grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,19rem)]"
          }
        >
          <div>
            {eyebrow && (
              <div className="animate-hero-rise" style={rise(0)}>
                <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
              </div>
            )}
            <h1 className="max-w-3xl animate-hero-rise text-heading-lg font-bold text-fg" style={rise(1)}>
              {/* Shimmer lives on an inner span — the h1's own `animation` (hero-rise)
                  would otherwise override the shimmer's, or vice versa. */}
              <span className="heading-shimmer">{title}</span>
            </h1>
            {lead && (
              <p className="mt-4 max-w-2xl animate-hero-rise text-lg leading-relaxed text-fg-subtle" style={rise(2)}>
                {lead}
              </p>
            )}
            {children && (
              <div className="mt-6 animate-hero-rise" style={rise(3)}>
                {children}
              </div>
            )}
          </div>
          {motif !== "none" && (
            <div className="hidden animate-hero-rise justify-self-end lg:block" style={rise(2)}>
              <HeaderVisual motif={motif} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
