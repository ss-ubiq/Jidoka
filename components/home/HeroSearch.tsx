"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { track } from "@/lib/analytics";

const examples = ["ejector pin", "gas spring", "linear bearing", "guide post", "aluminium profile"];

export function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (term) track("search_performed", { q: term });
    router.push(term ? `/search?q=${encodeURIComponent(term)}` : "/search");
  }

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={submit} className="group relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products, part numbers, applications or requirements…"
          aria-label="Search products, part numbers, applications or requirements"
          className="h-14 w-full rounded-lg border border-border-strong bg-surface pl-12 pr-28 text-base text-fg sm:text-[0.95rem] shadow-card outline-none transition-all placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/25"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-md bg-accent px-4 text-sm font-medium text-accent-fg transition-all hover:brightness-110"
        >
          Search
        </button>
      </form>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span className="font-mono uppercase tracking-wider">Try</span>
        {examples.map((ex) => (
          <button
            key={ex}
            onClick={() => router.push(`/search?q=${encodeURIComponent(ex)}`)}
            className="rounded-full border border-border bg-surface px-2.5 py-1 text-fg-subtle transition-colors hover:border-accent/40 hover:text-accent"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
