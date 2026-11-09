"use server";

import { revalidatePath } from "next/cache";
import { readData, writeData } from "@/lib/mock-db";
import { categorySchema, type CategoryFormValues } from "@/lib/schemas";
import type { Category, Product } from "@/lib/types";

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; field?: keyof CategoryFormValues };

// Refresh both the shop and the admin after any change
function refresh() {
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}

export async function createCategory(data: CategoryFormValues): Promise<ActionResult> {
  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: "Some fields are not valid." };

  const categories = await readData<Category[]>("categories");
  if (categories.some((c) => c.slug === parsed.data.slug)) {
    return { ok: false, error: "Another category already uses this slug.", field: "slug" };
  }

  const id = `c-${Date.now().toString(36)}`; // simple unique id
  categories.push({ id, ...parsed.data });
  await writeData("categories", categories);

  refresh();
  return { ok: true, id };
}

export async function updateCategory(id: string, data: CategoryFormValues): Promise<ActionResult> {
  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: "Some fields are not valid." };

  const categories = await readData<Category[]>("categories");
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return { ok: false, error: "This category no longer exists." };

  if (categories.some((c) => c.slug === parsed.data.slug && c.id !== id)) {
    return { ok: false, error: "Another category already uses this slug.", field: "slug" };
  }
  if (parsed.data.parentId === id) {
    return { ok: false, error: "A category can't be its own parent.", field: "parentId" };
  }

  categories[index] = { id, ...parsed.data };
  await writeData("categories", categories);

  refresh();
  return { ok: true, id };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const [categories, products] = await Promise.all([
    readData<Category[]>("categories"),
    readData<Product[]>("products"),
  ]);

  const category = categories.find((c) => c.id === id);
  if (!category) return { ok: false, error: "This category no longer exists." };

  // Safety rules: never leave products or sub-categories without a parent
  const productCount = products.filter((p) => p.categoryId === id).length;
  if (productCount > 0) {
    return {
      ok: false,
      error: `"${category.name}" still has ${productCount} product${productCount === 1 ? "" : "s"}. Move or delete them first, or hide the category instead.`,
    };
  }
  if (categories.some((c) => c.parentId === id)) {
    return { ok: false, error: `"${category.name}" has sub-categories. Move or delete them first.` };
  }

  await writeData("categories", categories.filter((c) => c.id !== id));

  refresh();
  return { ok: true };
}

export async function toggleCategoryActive(id: string): Promise<ActionResult> {
  const categories = await readData<Category[]>("categories");
  const category = categories.find((c) => c.id === id);
  if (!category) return { ok: false, error: "This category no longer exists." };

  category.isActive = !category.isActive;
  await writeData("categories", categories);

  refresh();
  return { ok: true };
}