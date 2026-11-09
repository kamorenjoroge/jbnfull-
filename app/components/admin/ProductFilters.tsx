"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, X } from "lucide-react";

type Props = {
  categories: { id: string; name: string }[];
  category: string;
  stock: string;
};

const selectClass =
  "h-11 w-full appearance-none rounded-xl border border-line bg-white pl-3.5 pr-9 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/30 sm:w-auto";

export default function ProductFilters({ categories, category, stock }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Change one filter and keep the rest
  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function clearAll() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("stock");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <label className="relative">
        <span className="sr-only">Filter by category</span>
        <select value={category} onChange={(e) => update("category", e.target.value)} className={selectClass}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      </label>

      <label className="relative">
        <span className="sr-only">Filter by stock</span>
        <select value={stock} onChange={(e) => update("stock", e.target.value)} className={selectClass}>
          <option value="">All stock</option>
          <option value="in_stock">In stock</option>
          <option value="low_stock">Low stock</option>
          <option value="out_of_stock">Out of stock</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      </label>

      {(category || stock) && (
        <button
          onClick={clearAll}
          className="inline-flex h-11 items-center justify-center gap-1 rounded-xl px-3 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          <X className="h-4 w-4" /> Clear
        </button>
      )}
    </div>
  );
}