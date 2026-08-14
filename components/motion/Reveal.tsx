"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "up" | "left" | "scale" | "blur" | "fade";

const variantClass: Record<Variant, string> = {
  up: "reveal-up",
  left: "reveal-left",
  scale: "reveal-scale",
  blur: "reveal-blur",
  fade: "",
};

/**
 * Scroll-triggered reveal. SSR output is fully visible (no data-reveal attr),
 * so content never disappears without JS and SEO is unaffected. After
 * hydration the element is hidden and revealed when it enters the viewport.
 * prefers-reduced-motion users get instant visibility.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in ms. */
  delay?: number;
  variant?: Variant;
  as?: "div" | "section" | "span" | "li" | "ul" | "header";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      // Already scrolled past (hydration lagging the user): stay visible.
      el.getBoundingClientRect().bottom < 0
    ) {
      el.dataset.reveal = "in";
      return;
    }
    el.dataset.reveal = "out";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.reveal = "in";
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      // React's ref types are per-element; a single mutable ref covers all tags here.
      ref={ref as React.Ref<never>}
      className={cn("reveal", variantClass[variant], className)}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
