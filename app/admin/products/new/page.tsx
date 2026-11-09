import ProductForm from "@/app/components/admin/ProductForm";
import { getAllCategories, getBrands } from "@/lib/api";
import { listImages } from "@/lib/mock-db";

export default async function NewProductPage() {
  const [categories, brands, imageLibrary] = await Promise.all([getAllCategories(), getBrands(), listImages()]);

  return (
    <ProductForm
      categories={categories.map((c) => ({ id: c.id, name: c.name, isActive: c.isActive }))}
      brands={brands.map((b) => b.name)}
      imageLibrary={imageLibrary}
    />
  );
}