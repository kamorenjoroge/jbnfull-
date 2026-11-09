import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import AdminSearch from "@/app/components/admin/ui/AdminSearch";
import CategoriesTable from "@/app/components/admin/CategoriesTable";
import { getAllCategories } from "@/lib/api";

type Props = { searchParams: Promise<{ q?: string }> };

export default function CategoriesPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <CategoriesContent searchParams={searchParams} />
    </Suspense>
  );
}

async function CategoriesContent({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();

  const all = await getAllCategories();
  const rows = query
    ? all.filter((c) => c.name.toLowerCase().includes(query) || c.slug.includes(query))
    : all;

  const visible = all.filter((c) => c.isActive).length;
  const hidden = all.length - visible;

  return (
    <>
      {/* Counts */}
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-white px-3 py-1 font-semibold text-ink ring-1 ring-line">
          {all.length} categories
        </span>
        <span className="rounded-full bg-forest-light px-3 py-1 font-semibold text-forest">{visible} visible</span>
        {hidden > 0 && (
          <span className="rounded-full bg-white px-3 py-1 font-semibold text-muted ring-1 ring-line">
            {hidden} hidden
          </span>
        )}
      </div>

      {/* Toolbar */}
      <div className="mb-4 mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AdminSearch placeholder="Search categories…" defaultValue={q} />
        <Link
          href="/admin/categories/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-ink transition-colors hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" /> Add category
        </Link>
      </div>

      <CategoriesTable categories={rows} allCategories={all} hasSearch={!!query} />
    </>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-64 animate-pulse rounded-full bg-white" />
      <div className="h-11 animate-pulse rounded-xl bg-white" />
      <div className="h-96 animate-pulse rounded-2xl bg-white" />
    </div>
  );
}