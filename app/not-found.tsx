import Link from "next/link";
import { ArrowRight } from "lucide-react";
export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-accent">404</p>
      <h1 className="mt-4 text-heading-lg font-bold text-fg">This page couldn&apos;t be found</h1>
      <p className="mt-3 max-w-md text-fg-subtle">The page may have moved. Try searching for a product or part number — or tell us what you need.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/search" className="inline-flex h-11 items-center gap-2 rounded-md bg-accent px-5 font-medium text-accent-fg hover:brightness-110">Search products <ArrowRight className="h-4 w-4" /></Link>
        <Link href="/send-requirement" className="inline-flex h-11 items-center gap-2 rounded-md border border-border-strong bg-surface px-5 font-medium text-fg hover:bg-surface-2">Send a requirement</Link>
      </div>
    </div>
  );
}
