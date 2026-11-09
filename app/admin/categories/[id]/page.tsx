import { Suspense } from "react";
import { notFound } from "next/navigation";
import CategoryForm from "@/app/components/admin/CategoryForm";
import { getAllCategories, getCategoryById } from "@/lib/api";

type Props = { params: Promise<{ id: string }> };

export default function EditCategoryPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="h-[600px] animate-pulse rounded-2xl bg-white" />}>
      <EditCategory params={params} />
    </Suspense>
  );
}

async function EditCategory({ params }: Props) {
  const { id } = await params;
  const [category, all] = await Promise.all([getCategoryById(id), getAllCategories()]);
  if (!category) notFound();

  const productCount = all.find((c) => c.id === id)?.productCount ?? 0;

  return (
    <CategoryForm
      category={category}
      productCount={productCount}
      parents={all.filter((c) => c.id !== id).map((c) => ({ id: c.id, name: c.name }))}
    />
  );
}