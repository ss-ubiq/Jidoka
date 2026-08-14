"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Auto-motion engine — mounted once per route (app/template.tsx). After each
 * navigation it scans <main> and applies the same motion language the
 * homepage uses by hand, to every page:
 *
 *  - scroll-triggered staggered reveals on cards (.shadow-card), section
 *    headings and definition rows;
 *  - pointer-tracking 3D tilt + cursor spotlight on cards (fine pointers
 *    only, added only after the reveal finishes so the two transitions
 *    never fight).
 *
 * It only ever touches elements NOT already animated by the explicit
 * <Reveal>/<TiltCard> components, only sets classes/inline styles
 * (transform/opacity), and does nothing for prefers-reduced-motion. Server
 * markup is untouched, so no-JS rendering and SEO are unaffected.
 */
export function MotionAuto() {
  const pathname = usePathname();

  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduced) return;

    const cleanups: Array<() => void> = [];

    // ---------- 3D tilt + spotlight ----------
    const initTilt = (el: HTMLElement) => {
      if (!finePointer || el.dataset.tilt) return;
      // Skip cards wrapping form controls (tilting under a cursor heading
      // for an input feels wrong) and very tall containers.
      if (el.querySelector("input, textarea, select, form")) return;
      if (el.offsetHeight > 520) return;
      el.dataset.tilt = "auto";
      el.classList.add("tilt-card", "card-spotlight");
      if (getComputedStyle(el).position === "static") el.classList.add("relative");

      // Gentler tilt on wide, short rows than on square cards.
      let frame = 0;
      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const max = Math.min(6, Math.max(2.5, 1900 / rect.width));
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          el.classList.add("is-tilting");
          el.style.setProperty("--rx", `${((0.5 - py) * max).toFixed(2)}deg`);
          el.style.setProperty("--ry", `${((px - 0.5) * max).toFixed(2)}deg`);
          el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
          el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
        });
      };
      const onLeave = () => {
        cancelAnimationFrame(frame);
        el.classList.remove("is-tilting");
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      };
      el.addEventListener("pointermove", onMove, { passive: true });
      el.addEventListener("pointerleave", onLeave, { passive: true });
      cleanups.push(() => {
        cancelAnimationFrame(frame);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      });
    };

    // ---------- scroll reveals ----------
    // Cards are also tilt candidates; headings and <dl> rows just reveal.
    const isCard = (el: HTMLElement) => el.classList.contains("shadow-card");
    const candidates = Array.from(
      main.querySelectorAll<HTMLElement>("section h2, .shadow-card, dl > div")
    ).filter(
      (el) =>
        !el.dataset.motion &&
        // leave the homepage's hand-tuned Reveal/TiltCard trees alone
        !el.closest("[data-reveal], .reveal, .tilt-card, .tilt-wrap") &&
        // buttons and chips carry shadow-card too — cards never use inline-flex
        !el.classList.contains("inline-flex")
    );

    if (typeof IntersectionObserver === "undefined") return;

    // Strip the reveal transition and hand the card to the tilt system so
    // the two transforms never conflict.
    const finishReveal = (el: HTMLElement) => {
      el.classList.remove("reveal", "reveal-up");
      el.style.removeProperty("--reveal-delay");
      delete el.dataset.reveal;
      if (isCard(el)) initTilt(el);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.dataset.reveal = "in";
          io.unobserve(el);
          const delay = parseFloat(el.style.getPropertyValue("--reveal-delay")) || 0;
          window.setTimeout(() => finishReveal(el), delay + 850);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );

    const siblingIndex = new Map<Element, number>();
    for (const el of candidates) {
      // Hydration can lag the user's scrolling: anything already scrolled
      // past must stay visible and static — hiding it would leave blank
      // content the user only recovers by scrolling back up.
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0) {
        el.dataset.motion = "auto";
        if (isCard(el)) initTilt(el);
        continue;
      }
      const parent = el.parentElement ?? main;
      const idx = siblingIndex.get(parent) ?? 0;
      siblingIndex.set(parent, idx + 1);
      el.dataset.motion = "auto";
      el.classList.add("reveal", "reveal-up");
      el.style.setProperty("--reveal-delay", `${Math.min(idx * 70, 420)}ms`);
      el.dataset.reveal = "out";
      io.observe(el);
      // Hovering a card shouldn't wait for the reveal handoff — snap the
      // reveal finished and engage the 3D tilt on that same hover.
      if (isCard(el) && finePointer) {
        const onEnter = () => {
          io.unobserve(el);
          finishReveal(el);
        };
        el.addEventListener("pointerenter", onEnter, { once: true });
        cleanups.push(() => el.removeEventListener("pointerenter", onEnter));
      }
    }

    return () => {
      io.disconnect();
      // If the route changes mid-reveal, never leave content hidden.
      for (const el of candidates) {
        if (el.dataset.reveal === "out") {
          el.dataset.reveal = "in";
        }
      }
      cleanups.forEach((fn) => fn());
    };
  }, [pathname]);

  return null;
}
