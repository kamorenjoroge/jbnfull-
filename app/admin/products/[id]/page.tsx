import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProductForm from "@/app/components/admin/ProductForm";
import { getAllCategories, getBrands, getProductById } from "@/lib/api";
import { listImages } from "@/lib/mock-db";

type Props = { params: Promise<{ id: string }> };

export default function EditProductPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="h-[700px] animate-pulse rounded-2xl bg-white" />}>
      <EditProduct params={params} />
    </Suspense>
  );
}

async function EditProduct({ params }: Props) {
  const { id } = await params;
  const [product, categories, brands, imageLibrary] = await Promise.all([
    getProductById(id),
    getAllCategories(),
    getBrands(),
    listImages(),
  ]);
  if (!product) notFound();

  return (
    <ProductForm
      product={product}
      categories={categories.map((c) => ({ id: c.id, name: c.name, isActive: c.isActive }))}
      brands={brands.map((b) => b.name)}
      imageLibrary={imageLibrary}
    />
  );
}