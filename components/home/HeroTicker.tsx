import Link from "next/link";
import { familiesByDemand } from "@/data/families";

/**
 * Infinite marquee of the 12 product families along the bottom of the hero —
 * pure CSS (see .marquee-* in globals.css), pauses on hover, each chip links
 * to its family page. The list is rendered twice for a seamless loop.
 */
export function HeroTicker() {
  const items = familiesByDemand;
  return (
    <div className="marquee-mask relative overflow-hidden border-t border-border/70 bg-surface/40">
      <div className="marquee-track flex w-max animate-marquee items-center gap-2 py-3.5 pr-2">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1 || undefined}
            className="flex items-center gap-2"
          >
            {items.map((f) => (
              <Link
                key={`${copy}-${f.id}`}
                href={`/products/${f.slug}`}
                tabIndex={copy === 1 ? -1 : undefined}
                className="group flex shrink-0 items-center gap-2.5 rounded-full border border-transparent px-3.5 py-1.5 transition-colors hover:border-accent/30 hover:bg-accent-soft/60"
              >
                <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-wider text-accent">
                  {f.code}
                </span>
                <span className="whitespace-nowrap text-sm text-fg-subtle transition-colors group-hover:text-fg">
                  {f.name}
                </span>
                <span aria-hidden className="ml-1 h-1 w-1 rounded-full bg-border-strong" />
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
