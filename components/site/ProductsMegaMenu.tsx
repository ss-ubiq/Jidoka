import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { families } from "@/data/families";
import { Badge } from "@/components/ui/Primitives";

/** PRODUCTS mega-menu (§53) — all 12 families + quick links. */
export function ProductsMegaMenu({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_15rem]">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="eyebrow">Component Families</p>
          <span className="font-mono text-xs text-muted">12 families</span>
        </div>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-1 lg:grid-cols-3">
          {families.map((f) => (
            <li key={f.id}>
              <Link
                href={`/products/${f.slug}`}
                onClick={onNavigate}
                className="group flex items-start gap-2.5 rounded-md px-2.5 py-2 transition-colors hover:bg-surface-2"
              >
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded border border-border bg-surface font-mono text-[0.65rem] font-semibold text-muted group-hover:border-accent/40 group-hover:text-accent">
                  {f.code}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-fg">{f.name}</span>
                  <span className="block truncate text-xs text-muted">{f.tagline}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface-2 p-4">
        <p className="eyebrow mb-1">Quick access</p>
        <Link href="/products" onClick={onNavigate} className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-fg hover:bg-surface">
          View all products <ArrowRight className="h-3.5 w-3.5 text-muted" />
        </Link>
        <Link href="/search" onClick={onNavigate} className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-fg hover:bg-surface">
          Part number search <ArrowRight className="h-3.5 w-3.5 text-muted" />
        </Link>
        <Link href="/resources" onClick={onNavigate} className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-fg hover:bg-surface">
          Technical resources <ArrowRight className="h-3.5 w-3.5 text-muted" />
        </Link>
        <Link href="/components" onClick={onNavigate} className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-fg hover:bg-surface">
          Component guides <ArrowRight className="h-3.5 w-3.5 text-muted" />
        </Link>
        <div className="mt-2 rounded-md border border-accent/20 bg-accent-soft p-3">
          <p className="text-xs font-medium text-fg">Not sure what you need?</p>
          <p className="mt-1 text-xs text-fg-subtle">Send a drawing, part number or requirement.</p>
          <Link
            href="/send-requirement"
            onClick={onNavigate}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
          >
            Send requirement <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Simple two-column link grid used by Solutions / Engineering menus. */
export function LinkGridMenu({
  items,
  onNavigate,
}: {
  items: { label: string; href: string; hint?: string }[];
  onNavigate?: () => void;
}) {
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-1 lg:grid-cols-3">
      {items.map((it) => (
        <li key={it.href}>
          <Link
            href={it.href}
            onClick={onNavigate}
            className="group flex flex-col rounded-md px-2.5 py-2 transition-colors hover:bg-surface-2"
          >
            <span className="text-sm font-medium text-fg group-hover:text-accent">{it.label}</span>
            {it.hint ? <span className="text-xs text-muted">{it.hint}</span> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export { Badge };
