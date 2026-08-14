"use client";

import { useEffect, useRef } from "react";

/**
 * Animated engineering drawing for the hero — JIDOKA's real flagship
 * components (ejector pin, die spring, linear bearing, oil-free bush) drawn
 * blueprint-style. Strokes self-draw on load (pathLength=1 + .draw-path),
 * centrelines march, the spring breathes, the bearing cage rotates, a scan
 * line sweeps, and the whole scene has depth-layered mouse parallax.
 * Dimension callouts use symbols (Ø d, L) — no invented spec numbers.
 */
export function HeroVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number>(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const px = e.clientX / window.innerWidth - 0.5;
        const py = e.clientY / window.innerHeight - 0.5;
        root.style.setProperty("--px", px.toFixed(3));
        root.style.setProperty("--py", py.toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="relative animate-float-slow select-none"
      style={{ "--px": 0, "--py": 0 } as React.CSSProperties}
    >
      {/* Panel chrome: blueprint sheet */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-surface/70 shadow-card-lg backdrop-blur-sm">
        {/* Sweeping scan line */}
        <div className="scan-line pointer-events-none absolute inset-y-0 left-0 z-10 w-1/5 bg-gradient-to-r from-transparent via-accent/10 to-transparent" />

        <svg viewBox="0 0 520 540" className="block w-full" role="presentation">
          <defs>
            <pattern id="hatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="7" stroke="hsl(var(--muted) / 0.45)" strokeWidth="1" />
            </pattern>
            <marker id="dim-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,1.5 L9,5 L0,8.5 z" fill="hsl(var(--accent))" />
            </marker>
          </defs>

          {/* ---- Sheet frame + registration marks (depth 0.4) ---- */}
          <g
            className="parallax-layer"
            style={{ transform: "translate(calc(var(--px) * -5px), calc(var(--py) * -4px))" }}
          >
            <rect x="14" y="14" width="492" height="512" fill="none" stroke="hsl(var(--border-strong))" strokeWidth="1" pathLength={1} className="draw-path" />
            {/* corner ticks */}
            <g stroke="hsl(var(--muted) / 0.8)" strokeWidth="1.2">
              {[
                [26, 26], [494, 26], [26, 514], [494, 514],
              ].map(([x, y]) => (
                <g key={`${x}-${y}`}>
                  <line x1={x - 7} y1={y} x2={x + 7} y2={y} pathLength={1} className="draw-path" style={{ "--draw-delay": "0.2s" } as React.CSSProperties} />
                  <line x1={x} y1={y - 7} x2={x} y2={y + 7} pathLength={1} className="draw-path" style={{ "--draw-delay": "0.2s" } as React.CSSProperties} />
                </g>
              ))}
            </g>
            {/* registration crosshairs */}
            <g stroke="hsl(var(--accent) / 0.55)" strokeWidth="1" className="animate-pulse-soft">
              <line x1="70" y1="86" x2="82" y2="86" />
              <line x1="76" y1="80" x2="76" y2="92" />
              <line x1="452" y1="310" x2="464" y2="310" />
              <line x1="458" y1="304" x2="458" y2="316" />
            </g>
            {/* title block */}
            <line x1="14" y1="486" x2="506" y2="486" stroke="hsl(var(--border-strong))" strokeWidth="1" pathLength={1} className="draw-path" style={{ "--draw-delay": "0.5s" } as React.CSSProperties} />
            <line x1="300" y1="486" x2="300" y2="526" stroke="hsl(var(--border))" strokeWidth="1" />
            <g fill="hsl(var(--muted))" fontSize="9.5" fontFamily="var(--font-mono)" letterSpacing="0.14em" className="animate-fade-in" style={{ animationDelay: "1.4s" }}>
              <text x="30" y="503">JIDOKA ENGINEERING</text>
              <text x="30" y="517">PRECISION COMPONENT REFERENCE</text>
              <text x="314" y="503">PROJECTION · FIRST ANGLE</text>
              <text x="314" y="517">UNITS · MM</text>
            </g>
          </g>

          {/* ---- Linear bearing section, top-right (depth 1.6) ---- */}
          <g
            className="parallax-layer"
            style={{ transform: "translate(calc(var(--px) * 16px), calc(var(--py) * 12px))" }}
          >
            <g stroke="hsl(var(--fg-subtle))" strokeWidth="1.4" fill="none">
              <circle cx="392" cy="128" r="62" pathLength={1} className="draw-path" style={{ "--draw-delay": "0.45s" } as React.CSSProperties} />
              <circle cx="392" cy="128" r="50" pathLength={1} className="draw-path" style={{ "--draw-delay": "0.55s" } as React.CSSProperties} />
              <circle cx="392" cy="128" r="34" pathLength={1} className="draw-path" style={{ "--draw-delay": "0.65s" } as React.CSSProperties} />
              <circle cx="392" cy="128" r="22" stroke="hsl(var(--accent))" pathLength={1} className="draw-path" style={{ "--draw-delay": "0.75s" } as React.CSSProperties} />
            </g>
            {/* rolling elements — rotating cage */}
            <g className="animate-spin-slow" style={{ transformOrigin: "392px 128px", transformBox: "view-box" }}>
              {Array.from({ length: 8 }).map((_, i) => {
                const a = (i * Math.PI) / 4;
                return (
                  <circle
                    key={i}
                    cx={392 + 42 * Math.cos(a)}
                    cy={128 + 42 * Math.sin(a)}
                    r="6.5"
                    fill="hsl(var(--accent) / 0.14)"
                    stroke="hsl(var(--accent))"
                    strokeWidth="1.2"
                    pathLength={1}
                    className="draw-path"
                    style={{ "--draw-delay": `${0.8 + i * 0.06}s` } as React.CSSProperties}
                  />
                );
              })}
            </g>
            {/* crosshair centrelines */}
            <g stroke="hsl(var(--accent) / 0.7)" strokeWidth="1">
              <line x1="316" y1="128" x2="468" y2="128" className="centerline" />
              <line x1="392" y1="52" x2="392" y2="204" className="centerline" />
            </g>
            <g className="animate-fade-in" style={{ animationDelay: "1.5s" }}>
              <line x1="342" y1="176" x2="308" y2="212" stroke="hsl(var(--muted))" strokeWidth="1" />
              <text x="220" y="224" fill="hsl(var(--fg-subtle))" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="0.12em">
                LINEAR BEARING
              </text>
            </g>
          </g>

          {/* ---- Ejector pin, mid-left (depth 1.0) ---- */}
          <g
            className="parallax-layer"
            style={{ transform: "translate(calc(var(--px) * 10px), calc(var(--py) * 8px))" }}
          >
            <g stroke="hsl(var(--fg))" strokeWidth="1.5" fill="hsl(var(--surface-2) / 0.6)">
              {/* head */}
              <rect x="46" y="262" width="20" height="40" rx="1.5" pathLength={1} className="draw-path" style={{ "--draw-delay": "0.25s" } as React.CSSProperties} />
              {/* shaft */}
              <rect x="66" y="273" width="256" height="18" rx="1" pathLength={1} className="draw-path" style={{ "--draw-delay": "0.35s" } as React.CSSProperties} />
              {/* tip chamfer */}
              <path d="M322 273 l10 4 v10 l-10 4" fill="none" pathLength={1} className="draw-path" style={{ "--draw-delay": "0.55s" } as React.CSSProperties} />
            </g>
            {/* centreline */}
            <line x1="32" y1="282" x2="348" y2="282" stroke="hsl(var(--accent) / 0.7)" strokeWidth="1" className="centerline" />
            {/* length dimension */}
            <g stroke="hsl(var(--accent))" strokeWidth="1" className="animate-fade-in" style={{ animationDelay: "1.2s" }}>
              <line x1="66" y1="306" x2="66" y2="330" stroke="hsl(var(--muted))" />
              <line x1="322" y1="306" x2="322" y2="330" stroke="hsl(var(--muted))" />
              <line x1="66" y1="324" x2="322" y2="324" markerStart="url(#dim-arrow)" markerEnd="url(#dim-arrow)" />
              <text x="188" y="318" fill="hsl(var(--accent))" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle">
                L
              </text>
            </g>
            {/* diameter callout */}
            <g className="animate-fade-in" style={{ animationDelay: "1.35s" }}>
              <line x1="200" y1="273" x2="228" y2="242" stroke="hsl(var(--muted))" strokeWidth="1" />
              <line x1="228" y1="242" x2="262" y2="242" stroke="hsl(var(--muted))" strokeWidth="1" />
              <text x="268" y="246" fill="hsl(var(--fg-subtle))" fontSize="11" fontFamily="var(--font-mono)">
                Ø d
              </text>
            </g>
            <text x="46" y="248" fill="hsl(var(--fg-subtle))" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="0.12em" className="animate-fade-in" style={{ animationDelay: "1.1s" }}>
              EJECTOR PIN
            </text>
          </g>

          {/* ---- Die spring, bottom-left (depth 1.3) ---- */}
          <g
            className="parallax-layer"
            style={{ transform: "translate(calc(var(--px) * 13px), calc(var(--py) * 10px))" }}
          >
            <g className="spring-breathe">
              <g stroke="hsl(var(--heat))" strokeWidth="1.6" fill="none">
                {Array.from({ length: 7 }).map((_, i) => (
                  <path
                    key={i}
                    d={`M${74 + i * 24} 452 l12 -54 h12`}
                    pathLength={1}
                    className="draw-path"
                    style={{ "--draw-delay": `${0.7 + i * 0.07}s` } as React.CSSProperties}
                  />
                ))}
              </g>
              <g stroke="hsl(var(--fg-subtle))" strokeWidth="1.4" fill="none">
                <line x1="70" y1="398" x2="70" y2="452" pathLength={1} className="draw-path" style={{ "--draw-delay": "0.6s" } as React.CSSProperties} />
                <line x1="250" y1="398" x2="250" y2="452" pathLength={1} className="draw-path" style={{ "--draw-delay": "0.6s" } as React.CSSProperties} />
                <line x1="62" y1="398" x2="258" y2="398" pathLength={1} className="draw-path" style={{ "--draw-delay": "0.65s" } as React.CSSProperties} />
                <line x1="62" y1="452" x2="258" y2="452" pathLength={1} className="draw-path" style={{ "--draw-delay": "0.65s" } as React.CSSProperties} />
              </g>
            </g>
            <text x="70" y="384" fill="hsl(var(--fg-subtle))" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="0.12em" className="animate-fade-in" style={{ animationDelay: "1.5s" }}>
              DIE SPRING
            </text>
          </g>

          {/* ---- Oil-free bush section, bottom-right (depth 1.45) ---- */}
          <g
            className="parallax-layer"
            style={{ transform: "translate(calc(var(--px) * 14px), calc(var(--py) * 11px))" }}
          >
            {/* hatched walls with clear bore */}
            <rect x="316" y="386" width="128" height="18" fill="url(#hatch)" stroke="hsl(var(--fg-subtle))" strokeWidth="1.3" pathLength={1} className="draw-path" style={{ "--draw-delay": "0.85s" } as React.CSSProperties} />
            <rect x="316" y="432" width="128" height="18" fill="url(#hatch)" stroke="hsl(var(--fg-subtle))" strokeWidth="1.3" pathLength={1} className="draw-path" style={{ "--draw-delay": "0.9s" } as React.CSSProperties} />
            <line x1="304" y1="418" x2="456" y2="418" stroke="hsl(var(--accent) / 0.7)" strokeWidth="1" className="centerline" />
            <text x="316" y="374" fill="hsl(var(--fg-subtle))" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="0.12em" className="animate-fade-in" style={{ animationDelay: "1.6s" }}>
              OIL-FREE BUSH · SECTION
            </text>
          </g>
        </svg>
      </div>

      {/* Accent glow behind the sheet */}
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-accent/10 blur-3xl" />
    </div>
  );
}
