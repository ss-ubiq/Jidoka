"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Zero-dependency card carousel: a native scroll-snap track (swipeable on
 * touch, wheel-scrollable on trackpads) with arrow controls and a hairline
 * scroll-progress bar. SSR renders all slides in the track, so content is
 * fully crawlable; the chrome (arrows/progress) only activates on hydration.
 * Reduced-motion users get instant (non-smooth) arrow scrolling.
 */
export function Carousel({
  children,
  slideClassName,
  ariaLabel,
  className,
}: {
  children: React.ReactNode;
  /** Width classes for each slide, e.g. "basis-[85%] lg:basis-[31.5%]". */
  slideClassName?: string;
  ariaLabel: string;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [progress, setProgress] = useState(0);

  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    // 1px tolerance: fractional scroll positions on zoomed/hi-DPI displays.
    setCanPrev(track.scrollLeft > 1);
    setCanNext(track.scrollLeft < maxScroll - 1);
    setProgress(maxScroll > 0 ? track.scrollLeft / maxScroll : 1);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  function scrollByStep(dir: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.firstElementChild as HTMLElement | null;
    const gap = 16; // matches the track's gap-4
    const step = slide ? slide.offsetWidth + gap : track.clientWidth * 0.9;
    track.scrollBy({
      left: dir * step,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }

  return (
    <div className={cn("group/carousel", className)}>
      <div
        ref={trackRef}
        onScroll={sync}
        role="region"
        aria-label={ariaLabel}
        className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-1 px-1 pb-2 pt-1"
      >
        {Children.map(children, (child) => (
          <div className={cn("min-w-0 shrink-0 snap-start", slideClassName)}>{child}</div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-6">
        {/* Hairline scroll progress — same vocabulary as the header hairline */}
        <div aria-hidden className="relative h-px flex-1 bg-border">
          <div
            className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-150 ease-precise"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous"
            disabled={!canPrev}
            onClick={() => scrollByStep(-1)}
            className="grid h-10 w-10 place-items-center rounded-md border border-border-strong bg-surface text-fg transition-all duration-200 ease-precise hover:border-accent/50 hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-35"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next"
            disabled={!canNext}
            onClick={() => scrollByStep(1)}
            className="grid h-10 w-10 place-items-center rounded-md border border-border-strong bg-surface text-fg transition-all duration-200 ease-precise hover:border-accent/50 hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-35"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
