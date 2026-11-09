"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";

const popular = ["Drill", "Grinder", "Welding machine", "Diamond disc", "Tape measure", "Toolbox"];

type Props = {
  defaultValue?: string;
  autoFocus?: boolean;
  showSuggestions?: boolean;
};

export default function SearchBar({ defaultValue = "", autoFocus = false, showSuggestions = true }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  function go(term: string) {
    const q = term.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go(query);
        }}
        role="search"
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus={autoFocus}
            placeholder="Search tools, brands or codes…"
            aria-label="Search products"
            enterKeyHint="search"
            className="h-14 w-full rounded-xl border border-line bg-white pl-12 pr-11 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-muted hover:bg-surface hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="h-14 shrink-0 rounded-xl bg-brand px-5 font-semibold text-ink transition-colors hover:bg-brand-dark sm:px-7"
        >
          Search
        </button>
      </form>

      {showSuggestions && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted">Popular:</span>
          {popular.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => go(term)}
              className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-brand hover:bg-brand-light hover:text-ink"
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}