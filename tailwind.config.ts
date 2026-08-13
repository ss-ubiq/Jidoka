import type { Config } from "tailwindcss";

/**
 * JIDOKA website design system — "Premium Industrial Precision".
 * Shares the DNA of the JIDOKA AI Revenue Manager (graphite neutrals, one steel-blue
 * accent, amber as an action/heat signal) so both branches read as one company, but
 * tuned for a public, editorial, high-trust marketing + discovery experience:
 * larger type scale, generous rhythm, precise engineering lines.
 * All colors are CSS variables (see app/globals.css); HSL channels are space-separated
 * for Tailwind alpha compositing.
 */
const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        "surface-2": "hsl(var(--surface-2) / <alpha-value>)",
        "surface-3": "hsl(var(--surface-3) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        "border-strong": "hsl(var(--border-strong) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        fg: "hsl(var(--fg) / <alpha-value>)",
        "fg-subtle": "hsl(var(--fg-subtle) / <alpha-value>)",
        accent: "hsl(var(--accent) / <alpha-value>)",
        "accent-fg": "hsl(var(--accent-fg) / <alpha-value>)",
        "accent-soft": "hsl(var(--accent-soft) / <alpha-value>)",
        heat: "hsl(var(--heat) / <alpha-value>)",
        positive: "hsl(var(--positive) / <alpha-value>)",
        warning: "hsl(var(--warning) / <alpha-value>)",
        danger: "hsl(var(--danger) / <alpha-value>)",
        ink: "hsl(var(--ink) / <alpha-value>)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 6px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        content: "80rem",
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      fontSize: {
        "display-lg": ["clamp(2.75rem, 6vw, 5rem)", { lineHeight: "0.98", letterSpacing: "-0.035em" }],
        display: ["clamp(2.25rem, 4.5vw, 3.75rem)", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "heading-lg": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        card: "0 1px 2px 0 hsl(var(--shadow) / 0.04), 0 1px 3px 0 hsl(var(--shadow) / 0.06)",
        "card-lg": "0 2px 8px -2px hsl(var(--shadow) / 0.08), 0 12px 32px -8px hsl(var(--shadow) / 0.12)",
        "card-hover": "0 4px 12px -2px hsl(var(--shadow) / 0.10), 0 16px 40px -8px hsl(var(--shadow) / 0.16)",
        ring: "0 0 0 1px hsl(var(--border) / 1)",
      },
      backgroundImage: {
        grid: "linear-gradient(hsl(var(--border) / 0.6) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border) / 0.6) 1px, transparent 1px)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-fast": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.98) translateY(4px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in-fast": "fade-in-fast 0.3s ease both",
        "scale-in": "scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      transitionTimingFunction: {
        precise: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
