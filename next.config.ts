import type { NextConfig } from "next";
import { redirects as legacyRedirects } from "./data/redirects";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // 301 map from the legacy jidoka.in site (§59). Empty until populated — safe default.
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
