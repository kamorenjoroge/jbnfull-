import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import CategoryCard from "../admin/category/CategoryCard";
import SectionHeading from "../ui/SectionHeading";
import type { CategoryWithCount } from "@/lib/types";

export default function CategoryGrid({ categories }: { categories: CategoryWithCount[] }) {
  const shown = categories.slice(0, 11);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <SectionHeading title="Shop by Category" subtitle="Tools for every trade" href="/categories" />

      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
        {shown.map((c) => (
          <CategoryCard key={c.id} category={c} compact />
        ))}

        {/* View all tile */}
        <Link
          href="/categories"
          className="flex flex-col items-center justify-center rounded-2xl bg-ink p-3 text-center text-white transition hover:-translate-y-0.5 hover:shadow-lg sm:p-5"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-ink sm:h-12 sm:w-12">
            <LayoutGrid className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
          <span className="mt-2.5 text-xs font-semibold sm:text-[15px]">View All</span>
          <span className="mt-1 text-[11px] text-white/60 sm:text-xs">{categories.length} categories</span>
        </Link>
      </div>
    </section>
  );
}