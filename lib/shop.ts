import type { SortOption } from "./types";

export type ShopParams = {
  q: string;
  category: string;
  brand: string;
  price: string;
  stock: boolean;
  sort: SortOption;
  show?: number;
};

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Most popular" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export const PRICE_RANGES = [
  { value: "0-1000", label: "Under KSh 1,000" },
  { value: "1000-5000", label: "KSh 1,000 – 5,000" },
  { value: "5000-15000", label: "KSh 5,000 – 15,000" },
  { value: "15000-", label: "Over KSh 15,000" },
];

export function isSort(value?: string): value is SortOption {
  return SORT_OPTIONS.some((o) => o.value === value);
}

// "1000-5000" -> { min: 1000, max: 5000 }
export function parsePrice(value?: string): { min?: number; max?: number } {
  if (!value) return {};
  const [a, b] = value.split("-");
  const min = a ? Number(a) : NaN;
  const max = b ? Number(b) : NaN;
  return {
    min: Number.isFinite(min) ? min : undefined,
    max: Number.isFinite(max) ? max : undefined,
  };
}

// Builds a /shop link from the current filters plus the changes.
// Changing any filter resets "Load more" back to the first page.
export function shopUrl(current: ShopParams, changes: Partial<ShopParams> = {}) {
  const next: ShopParams = { ...current, show: undefined, ...changes };
  const p = new URLSearchParams();
  if (next.q) p.set("q", next.q);
  if (next.category) p.set("category", next.category);
  if (next.brand) p.set("brand", next.brand);
  if (next.price) p.set("price", next.price);
  if (next.stock) p.set("stock", "1");
  if (next.sort && next.sort !== "popular") p.set("sort", next.sort);
  if (next.show) p.set("show", String(next.show));
  const qs = p.toString();
  return qs ? `/shop?${qs}` : "/shop";
}