import Link from "next/link";
import { Check } from "lucide-react";
import { PRICE_RANGES, shopUrl, type ShopParams } from "@/lib/shop";
import type { Brand, CategoryWithCount } from "@/lib/types";

type Props = { categories: CategoryWithCount[]; brands: Brand[]; current: ShopParams };

export default function FilterPanel({ categories, brands, current }: Props) {
  const hasFilters = current.category || current.brand || current.price || current.stock;

  const row = (active: boolean) =>
    `flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
      active ? "bg-brand-light font-semibold text-ink" : "text-ink-soft hover:bg-surface hover:text-ink"
    }`;
  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
      active ? "border-brand bg-brand text-ink" : "border-line bg-white text-ink-soft hover:border-brand"
    }`;
  const title = "mb-2 font-heading text-sm font-bold uppercase tracking-wider text-muted";

  return (
    <div className="space-y-6">
      {hasFilters && (
        <Link
          href={shopUrl(current, { category: "", brand: "", price: "", stock: false })}
          scroll={false}
          className="inline-block text-sm font-semibold text-red-600 hover:underline"
        >
          Clear all filters
        </Link>
      )}

      {/* Category */}
      <div>
        <p className={title}>Category</p>
        <ul className="space-y-0.5">
          <li>
            <Link href={shopUrl(current, { category: "" })} scroll={false} className={row(!current.category)}>
              All categories
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={shopUrl(current, { category: c.slug })}
                scroll={false}
                className={row(current.category === c.slug)}
              >
                {c.name}
                <span className="text-xs text-muted">{c.productCount}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Brand */}
      <div>
        <p className={title}>Brand</p>
        <div className="flex flex-wrap gap-2">
          <Link href={shopUrl(current, { brand: "" })} scroll={false} className={chip(!current.brand)}>
            All
          </Link>
          {brands.map((b) => (
            <Link
              key={b.id}
              href={shopUrl(current, { brand: b.name })}
              scroll={false}
              className={chip(current.brand.toLowerCase() === b.name.toLowerCase())}
            >
              {b.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className={title}>Price</p>
        <ul className="space-y-0.5">
          <li>
            <Link href={shopUrl(current, { price: "" })} scroll={false} className={row(!current.price)}>
              Any price
            </Link>
          </li>
          {PRICE_RANGES.map((r) => (
            <li key={r.value}>
              <Link
                href={shopUrl(current, { price: r.value })}
                scroll={false}
                className={row(current.price === r.value)}
              >
                {r.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Availability */}
      <div>
        <p className={title}>Availability</p>
        <Link
          href={shopUrl(current, { stock: !current.stock })}
          scroll={false}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink hover:bg-surface"
        >
          <span
            className={`grid h-5 w-5 place-items-center rounded border ${
              current.stock ? "border-forest bg-forest text-white" : "border-line bg-white"
            }`}
          >
            {current.stock && <Check className="h-3.5 w-3.5" />}
          </span>
          In stock only
        </Link>
      </div>
    </div>
  );
}