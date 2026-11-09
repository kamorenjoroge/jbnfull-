import type { Metadata } from "next";
import CategoryCard from "./CategoryCard";
import { getCategories } from "@/lib/api";

export const metadata: Metadata = {
  title: "All Categories | JNB Tools",
  description: "Browse power tools, hand tools, masonry, welding, electrical, solar and more.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-heading text-4xl font-bold uppercase text-ink">All Categories</h1>
      <p className="mt-1 text-muted">Find the right tool by trade.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </div>
    </section>
  );
}