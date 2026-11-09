import Link from "next/link";
import CategoryIcon from "../CategoryIcon";
import type { CategoryWithCount } from "@/lib/types";

type Props = { category: CategoryWithCount; compact?: boolean };

export default function CategoryCard({ category, compact = false }: Props) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`flex flex-col items-center rounded-2xl border border-line bg-white text-center transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lg ${
        compact ? "p-3 sm:p-5" : "p-5"
      }`}
    >
      <span
        className={`grid place-items-center rounded-xl bg-brand-light text-ink ${
          compact ? "h-11 w-11 sm:h-12 sm:w-12" : "h-12 w-12"
        }`}
      >
        <CategoryIcon name={category.icon} className={compact ? "h-5 w-5 sm:h-6 sm:w-6" : "h-6 w-6"} />
      </span>
      <span
        className={`mt-2.5 font-semibold leading-tight text-ink ${
          compact ? "text-xs sm:text-[15px]" : "text-sm sm:text-[15px]"
        }`}
      >
        {category.name}
      </span>
      <span className="mt-1 text-[11px] text-muted sm:text-xs">
        {category.productCount} {category.productCount === 1 ? "item" : "items"}
      </span>
    </Link>
  );
}