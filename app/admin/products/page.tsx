import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import AdminSearch from "@/app/components/admin/ui/AdminSearch";
import ProductFilters from "@/app/components/admin/ProductFilters";
import ProductsTable from "@/app/components/admin/ProductsTable";
import { getAllCategories, getProducts } from "@/lib/api";
import type { StockStatus } from "@/lib/types";

type SP = { q?: string; category?: string; stock?: string };
type Props = { searchParams: Promise<SP> };

const STOCK_VALUES: StockStatus[] = ["in_stock", "low_stock", "out_of_stock"];

export default function ProductsPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <ProductsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ProductsContent({ searchParams }: Props) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const category = sp.category ?? "";
  const stock = STOCK_VALUES.includes(sp.stock as StockStatus) ? (sp.stock as StockStatus) : "";

  const [all, categories] = await Promise.all([getProducts(), getAllCategories()]);

  // Apply search and filters, newest first
  let rows = [...all].reverse();
  if (q) {
    const s = q.toLowerCase();
    rows = rows.filter((p) => [p.name, p.sku, p.brand].some((f) => f.toLowerCase().includes(s)));
  }
  if (category) rows = rows.filter((p) => p.categoryId === category);
  if (stock) rows = rows.filter((p) => p.stockStatus === stock);

  const categoryNames = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const count = (s: StockStatus) => all.filter((p) => p.stockStatus === s).length;
  const hasFilters = !!(q || category || stock);

  return (
    <>
      {/* Counts */}
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-white px-3 py-1 font-semibold text-ink ring-1 ring-line">{all.length} products</span>
        <span className="rounded-full bg-forest-light px-3 py-1 font-semibold text-forest">{count("in_stock")} in stock</span>
        <span className="rounded-full bg-brand-light px-3 py-1 font-semibold text-amber-700">{count("low_stock")} low</span>
        <span className="rounded-full bg-red-50 px-3 py-1 font-semibold text-red-600">{count("out_of_stock")} out</span>
      </div>

      {/* Toolbar */}
      <div className="mb-4 mt-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <AdminSearch placeholder="Search name, code or brand…" defaultValue={q} />
          <ProductFilters
            categories={categories.map((c) => ({ id: c.id, name: c.name }))}
            category={category}
            stock={stock}
          />
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-ink transition-colors hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" /> Add product
        </Link>
      </div>

      {hasFilters && (
        <p className="mb-3 text-sm text-muted">
          Showing <span className="font-semibold text-ink">{rows.length}</span> of {all.length} products
        </p>
      )}

      <ProductsTable products={rows} categoryNames={categoryNames} hasFilters={hasFilters} />
    </>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-80 animate-pulse rounded-full bg-white" />
      <div className="h-11 animate-pulse rounded-xl bg-white" />
      <div className="h-[500px] animate-pulse rounded-2xl bg-white" />
    </div>
  );
}