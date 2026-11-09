import CategoryForm from "@/app/components/admin/CategoryForm";
import { getAllCategories } from "@/lib/api";

export default async function NewCategoryPage() {
  const categories = await getAllCategories();
  const nextOrder = categories.reduce((max, c) => Math.max(max, c.sortOrder), 0) + 1;

  return (
    <CategoryForm
      parents={categories.map((c) => ({ id: c.id, name: c.name }))}
      nextOrder={nextOrder}
    />
  );
}