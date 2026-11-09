import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PackageSearch, MessageCircle, X } from "lucide-react";
import ProductCard from "@/app/components/product/ProductCard";
import FilterPanel from "@/app/components/shop/FilterPanel";
import MobileFilters from "@/app/components/shop/MobileFilters";
import SortSelect from "@/app/components/shop/SortSelect";
import { getBrands, getCategories, getProducts, getSiteInfo } from "@/lib/api";
import { isSort, parsePrice, shopUrl, type ShopParams } from "@/lib/shop";
import { whatsappLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shop All Tools | JNB Tools",
  description: "Browse all tools and hardware at JNB Tools. Filter by category, brand and price.",
};

const PAGE_SIZE = 12;

type SP = { q?: string; category?: string; brand?: string; price?: string; stock?: string; sort?: string; show?: string };
type Props = { searchParams: Promise<SP> };

export default function ShopPage({ searchParams }: Props) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-heading text-4xl font-bold uppercase text-ink">Shop All Tools</h1>
      <p className="mt-1 text-muted">Everything in stock at JNB Tools.</p>
      <Suspense fallback={<ShopSkeleton />}>
        <ShopResults searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

async function ShopResults({ searchParams }: Props) {
  const sp = await searchParams;

  const current: ShopParams = {
    q: sp.q?.trim() ?? "",
    category: sp.category ?? "",
    brand: sp.brand ?? "",
    price: sp.price ?? "",
    stock: sp.stock === "1",
    sort: isSort(sp.sort) ? sp.sort : "popular",
  };
  const show = Math.max(PAGE_SIZE, Number(sp.show) || PAGE_SIZE);
  const { min, max } = parsePrice(current.price);

  const [all, categories, brands, site] = await Promise.all([
    getProducts({
      query: current.q || undefined,
      categorySlug: current.category || undefined,
      brand: current.brand || undefined,
      minPrice: min,
      maxPrice: max,
      inStock: current.stock,
      sort: current.sort,
    }),
    getCategories(),
    getBrands(),
    getSiteInfo(),
  ]);

  const shown = all.slice(0, show);
  const remaining = all.length - shown.length;
  const activeCount = [current.category, current.brand, current.price, current.stock].filter(Boolean).length;
  const panel = <FilterPanel categories={categories} brands={brands} current={current} />;

  return (
    <div className="mt-6 lg:grid lg:grid-cols-[250px_1fr] lg:gap-8">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-line bg-white p-5">
          {panel}
        </div>
      </aside>

      <div>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            Showing <span className="font-semibold text-ink">{shown.length}</span> of{" "}
            <span className="font-semibold text-ink">{all.length}</span> products
          </p>
          <div className="flex gap-2">
            <MobileFilters activeCount={activeCount} total={all.length}>
              {panel}
            </MobileFilters>
            <SortSelect current={current} />
          </div>
        </div>

        {/* Search term chip */}
        {current.q && (
          <Link
            href={shopUrl(current, { q: "" })}
            scroll={false}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1.5 text-sm font-medium text-ink"
          >
            &ldquo;{current.q}&rdquo; <X className="h-3.5 w-3.5" />
          </Link>
        )}

        {/* Products */}
        {shown.length > 0 ? (
          <>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
              {shown.map((p) => (
                <ProductCard key={p.id} product={p} whatsapp={site.whatsapp} />
              ))}
            </div>

            {remaining > 0 && (
              <div className="mt-8 flex justify-center">
                <Link
                  href={shopUrl(current, { show: show + PAGE_SIZE })}
                  scroll={false}
                  className="inline-flex h-12 items-center rounded-xl border-2 border-ink px-8 font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
                >
                  Load more ({remaining} left)
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface px-6 py-12 text-center">
            <PackageSearch className="h-12 w-12 text-muted" />
            <h2 className="mt-4 text-lg font-bold text-ink">No products match these filters</h2>
            <p className="mt-1 max-w-sm text-sm text-muted">Try removing a filter, or ask us. We may have it in the shop.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-brand px-6 font-semibold text-ink hover:bg-brand-dark"
              >
                Clear filters
              </Link>
              <a
                href={whatsappLink(site.whatsapp, "Hello JNB Tools, I'm looking for a tool. Can you help?")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-forest px-6 font-semibold text-white hover:bg-forest-dark"
              >
                <MessageCircle className="h-5 w-5" /> Ask on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ShopSkeleton() {
  return (
    <div className="mt-6 lg:grid lg:grid-cols-[250px_1fr] lg:gap-8">
      <div className="hidden h-[500px] animate-pulse rounded-2xl bg-surface lg:block" />
      <div>
        <div className="h-11 animate-pulse rounded-xl bg-surface" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-surface" />
          ))}
        </div>
      </div>
    </div>
  );
}