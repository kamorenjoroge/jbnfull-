import Link from "next/link";
import CategoryIcon from "../../components/admin/CategoryIcon";
import type { CategoryWithCount } from "@/lib/types";

export default function CategoryCard({ category }: { category: CategoryWithCount }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="flex flex-col items-center rounded-2xl border border-line bg-white p-5 text-center transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lg"
    >
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-light text-ink">
        <CategoryIcon name={category.icon} />
      </span>
      <span className="mt-3 text-sm font-semibold text-ink sm:text-[15px]">{category.name}</span>
      <span className="mt-1 text-xs text-muted">
        {category.productCount} {category.productCount === 1 ? "item" : "items"}
      </span>
    </Link>
  );
}