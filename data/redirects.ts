/**
 * 301 redirect map from the legacy jidoka.in site to the new IA (§59).
 *
 * HOW TO POPULATE: crawl the current jidoka.in (e.g. `wget --spider -r` or Screaming Frog),
 * export every indexed URL, and map each old path → its closest new page below. This preserves
 * search equity on relaunch. Until it's populated, no redirects are active (safe default).
 *
 * Each entry becomes a permanent (301) redirect via next.config.mjs `redirects()`.
 * `source` supports Next.js path patterns (e.g. "/old-products/:slug").
 */
export type Redirect = { source: string; destination: string; permanent: boolean };

export const redirects: Redirect[] = [
  // --- Examples (commented until confirmed against the real jidoka.in URL list) ---
  // { source: "/product-category/transmission-parts", destination: "/products/power-transmission", permanent: true },
  // { source: "/product-category/linear-motion-parts", destination: "/products/linear-motion-and-bearings", permanent: true },
  // { source: "/product-category/pneumatic-components", destination: "/products/pneumatic-components", permanent: true },
  // { source: "/contact-us", destination: "/contact", permanent: true },
];
