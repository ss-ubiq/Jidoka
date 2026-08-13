import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with correct precedence. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolve a catalogue file path to its serving location.
 * Locally/self-hosted: files live in /public/catalogues → path passes through.
 * On hosts without the 2 GB of PDFs (e.g. Netlify), set NEXT_PUBLIC_CATALOGUE_BASE
 * to an external base URL (e.g. a public release/bucket) and links rewrite to it.
 */
export function catalogueHref(path: string): string {
  const base = process.env.NEXT_PUBLIC_CATALOGUE_BASE;
  if (!base) return path;
  return base.replace(/\/$/, "") + path.replace(/^\/catalogues/, "");
}

/** URL-safe slug from any label. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}
