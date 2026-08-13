import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Text wordmark with a precise engineering mark. No external logo asset is invented;
 * when JIDOKA supplies an official SVG, drop it in /public/brand and swap the mark here.
 */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="JIDOKA — home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span
        aria-hidden
        className="relative grid h-8 w-8 place-items-center rounded-[7px] bg-fg text-bg transition-colors group-hover:bg-accent"
      >
        {/* Precision aperture mark */}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="1" y="1" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.4" opacity="0.35" />
          <circle cx="9" cy="9" r="3.4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M9 1.6V4.2M9 13.8v2.6M1.6 9H4.2M13.8 9h2.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      {!compact && (
        <span className="text-[1.35rem] font-bold tracking-tightest text-fg">
          JIDOKA
        </span>
      )}
    </Link>
  );
}
