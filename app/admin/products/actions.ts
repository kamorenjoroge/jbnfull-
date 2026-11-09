"use server";

import { revalidatePath } from "next/cache";
import { readData, writeData } from "@/lib/mock-db";
import { productSchema, type ProductFormValues } from "@/lib/schemas";
import type { Category, Product, StockStatus } from "@/lib/types";

export type ProductActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; field?: keyof ProductFormValues };

function refresh() {
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}

// Checks shared by add and edit
function checkUnique(products: Product[], data: ProductFormValues, ignoreId?: string): ProductActionResult | null {
  const others = products.filter((p) => p.id !== ignoreId);
  if (others.some((p) => p.slug === data.slug)) {
    return { ok: false, error: "Another product already uses this slug.", field: "slug" };
  }
  if (others.some((p) => p.sku.toLowerCase() === data.sku.toLowerCase())) {
    return { ok: false, error: "Another product already uses this product code.", field: "sku" };
  }
  return null;
}

export async function createProduct(data: ProductFormValues): Promise<ProductActionResult> {
  const parsed = productSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: "Some fields are not valid." };

  const [products, categories] = await Promise.all([
    readData<Product[]>("products"),
    readData<Category[]>("categories"),
  ]);

  if (!categories.some((c) => c.id === parsed.data.categoryId)) {
    return { ok: false, error: "Choose a category that exists.", field: "categoryId" };
  }
  const clash = checkUnique(products, parsed.data);
  if (clash) return clash;

  const id = `p-${Date.now().toString(36)}`;
  products.push({ id, ...parsed.data }); // added at the end, so it counts as "newest"
  await writeData("products", products);

  refresh();
  return { ok: true, id };
}

export async function updateProduct(id: string, data: ProductFormValues): Promise<ProductActionResult> {
  const parsed = productSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: "Some fields are not valid." };

  const [products, categories] = await Promise.all([
    readData<Product[]>("products"),
    readData<Category[]>("categories"),
  ]);

  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return { ok: false, error: "This product no longer exists." };
  if (!categories.some((c) => c.id === parsed.data.categoryId)) {
    return { ok: false, error: "Choose a category that exists.", field: "categoryId" };
  }
  const clash = checkUnique(products, parsed.data, id);
  if (clash) return clash;

  products[index] = { id, ...parsed.data };
  await writeData("products", products);

  refresh();
  return { ok: true, id };
}

export async function deleteProduct(id: string): Promise<ProductActionResult> {
  const products = await readData<Product[]>("products");
  if (!products.some((p) => p.id === id)) return { ok: false, error: "This product no longer exists." };

  await writeData("products", products.filter((p) => p.id !== id));

  refresh();
  return { ok: true };
}

// Quick change from the table: stock dropdown
export async function updateProductStock(id: string, stockStatus: StockStatus): Promise<ProductActionResult> {
  const products = await readData<Product[]>("products");
  const product = products.find((p) => p.id === id);
  if (!product) return { ok: false, error: "This product no longer exists." };

  product.stockStatus = stockStatus;
  await writeData("products", products);

  refresh();
  return { ok: true };
}

// Quick change from the table: featured / popular stars
export async function toggleProductFlag(id: string, flag: "isFeatured" | "isPopular"): Promise<ProductActionResult> {
  const products = await readData<Product[]>("products");
  const product = products.find((p) => p.id === id);
  if (!product) return { ok: false, error: "This product no longer exists." };

  product[flag] = !product[flag];
  await writeData("products", products);

  refresh();
  return { ok: true };
}