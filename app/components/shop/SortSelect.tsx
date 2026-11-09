"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { SORT_OPTIONS, shopUrl, type ShopParams } from "@/lib/shop";
import type { SortOption } from "@/lib/types";

export default function SortSelect({ current }: { current: ShopParams }) {
  const router = useRouter();

  return (
    <label className="relative">
      <span className="sr-only">Sort products</span>
      <select
        value={current.sort}
        onChange={(e) => router.push(shopUrl(current, { sort: e.target.value as SortOption }), { scroll: false })}
        className="h-11 appearance-none rounded-xl border border-line bg-white pl-4 pr-10 text-sm font-semibold text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
    </label>
  );
}