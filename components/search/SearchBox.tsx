"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { track } from "@/lib/analytics";

export function SearchBox({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initial);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const term = q.trim();
        if (term) track("search_performed", { q: term });
        router.push(term ? `/search?q=${encodeURIComponent(term)}` : "/search");
      }}
      className="relative"
    >
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={q}
        autoFocus
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search products, part numbers, applications or requirements…"
        aria-label="Search"
        className="h-14 w-full rounded-lg border border-border-strong bg-surface pl-12 pr-28 text-[0.95rem] text-fg shadow-card outline-none transition-all placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/25"
      />
      <button type="submit" className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-md bg-accent px-4 text-sm font-medium text-accent-fg transition-all hover:brightness-110">
        Search
      </button>
    </form>
  );
}
