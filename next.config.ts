import type { NextConfig } from "next";
import { redirects as legacyRedirects } from "./data/redirects";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // Legacy-URL map from the old jidoka.in shop (§59). `permanent: true` makes Next emit
    // **308**, not 301 — verified against the running server. Search engines treat the two
    // the same for consolidation; 308 additionally preserves the request method.
    return legacyRedirects;
  },
  async headers() {
    return [
      {
        // Long-cache the immutable catalogue PDFs.
        source: "/catalogues/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
