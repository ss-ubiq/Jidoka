/**
 * 301 redirect map from the legacy Jidoka web presence to the new IA (§59).
 *
 * Sources (verified 2026-08-17): the legacy shop was a WordPress/WooCommerce site at
 * ec.jidoka.in (URLs still in Google's index; the subdomain's DNS no longer resolves),
 * plus a handful of WP pages on the root domain (e.g. /news/). Because none of the
 * legacy paths collide with the new site's routes, these are plain path redirects —
 * they fire for any host pointed at this deployment. If ec.jidoka.in is later added
 * as a Netlify domain alias, its old indexed URLs land correctly too.
 *
 * Order matters: specific entries must precede their catch-alls (first match wins).
 * `:path*` matches zero or more segments, so "/news/:path*" also covers "/news".
 *
 * Each entry becomes a permanent (301) redirect via next.config.ts `redirects()`.
 */
export type Redirect = { source: string; destination: string; permanent: boolean };

export const redirects: Redirect[] = [
  // --- Legacy product pages (ec.jidoka.in /product/<slug>/) → closest new page ---
  { source: "/product/oil-free-bushing", destination: "/products/linear-motion-and-bearings/oil-free-bushing", permanent: true },
  { source: "/product/guide-shaft", destination: "/products/linear-motion-and-bearings/guide-shaft", permanent: true },
  { source: "/product/xy-table", destination: "/products/linear-motion-and-bearings/manual-displacement-table", permanent: true },
  { source: "/product/ball-roller", destination: "/products/linear-motion-and-bearings", permanent: true },
  { source: "/product/conveyer-rollers", destination: "/products/power-transmission/roller", permanent: true },
  { source: "/product/sealing-ring", destination: "/products/machine-standard-components/sealing-ring", permanent: true },
  { source: "/product/handles", destination: "/products/functional-components/handles", permanent: true },
  { source: "/product/hinge-pins", destination: "/products/functional-components/hinge-and-cantilever-pin", permanent: true },
  { source: "/product/shock-absorber-pads", destination: "/products/springs-and-force-components/shock-absorbers-and-protectives", permanent: true },
  { source: "/product/cutter-cutting-tools", destination: "/products/cutting-and-engineering-tools/cutters", permanent: true },
  // Any other legacy product slug → the products hub (never a 404).
  { source: "/product/:slug*", destination: "/products", permanent: true },

  // --- Legacy category archives (ec.jidoka.in /product-category/<slug>/) ---
  { source: "/product-category/linear-motion-parts", destination: "/products/linear-motion-and-bearings", permanent: true },
  { source: "/product-category/transmission-parts", destination: "/products/power-transmission", permanent: true },
  { source: "/product-category/pneumatic-components", destination: "/products/pneumatic-components", permanent: true },
  { source: "/product-category/mechanical-standard-components", destination: "/products/machine-standard-components", permanent: true },
  { source: "/product-category/profile-and-frame-components", destination: "/products/profile-frame-and-structural", permanent: true },
  { source: "/product-category/industrial-materials", destination: "/products/industrial-materials", permanent: true },
  { source: "/product-category/other-functional-components", destination: "/products/functional-components", permanent: true },
  { source: "/product-category/:slug*", destination: "/products", permanent: true },

  // --- Legacy WordPress pages ---
  { source: "/news/:path*", destination: "/resources", permanent: true },
  { source: "/blog/:path*", destination: "/resources", permanent: true },
  { source: "/promotions/:path*", destination: "/products", permanent: true },
  { source: "/support/:path*", destination: "/contact", permanent: true },
  { source: "/contact-us", destination: "/contact", permanent: true },
  { source: "/about-us", destination: "/about", permanent: true },
  { source: "/shop/:path*", destination: "/products", permanent: true },

  // --- WooCommerce shop plumbing → the enquiry flow (site is not e-commerce) ---
  { source: "/cart", destination: "/request-a-quote", permanent: true },
  { source: "/checkout", destination: "/request-a-quote", permanent: true },
  { source: "/my-account/:path*", destination: "/request-a-quote", permanent: true },

  // --- Legacy uploaded catalogue PDFs (/wp-content/uploads/...) → catalogue library ---
  { source: "/wp-content/:path*", destination: "/resources/catalogues", permanent: true },
];
