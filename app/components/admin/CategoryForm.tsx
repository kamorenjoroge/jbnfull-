"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save, EyeOff } from "lucide-react";
import FormCard from "@/app/components/admin/ui/FormCard";
import FormField, { inputClass, errorBorder } from "@/app/components/admin/ui/FormField";
import CategoryIcon, { CATEGORY_ICONS } from "@/app/components/admin/CategoryIcon";
import { categorySchema, type CategoryFormValues } from "@/lib/schemas";
import { createCategory, updateCategory } from "@/app/admin/categories/actions";
import { slugify } from "@/lib/utils";
import type { Category } from "@/lib/types";

type Props = {
  category?: Category; // given = Edit, missing = Add
  productCount?: number;
  parents: { id: string; name: string }[];
  nextOrder?: number;
};

export default function CategoryForm({ category, productCount = 0, parents, nextOrder = 1 }: Props) {
  const router = useRouter();
  const isEdit = !!category;
  const [slugTouched, setSlugTouched] = useState(isEdit); // when editing, never auto-change the slug

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          name: category.name,
          slug: category.slug,
          icon: category.icon,
          image: category.image ?? "",
          description: category.description ?? "",
          parentId: category.parentId,
          sortOrder: category.sortOrder,
          isActive: category.isActive,
        }
      : { name: "", slug: "", icon: "Wrench", image: "", description: "", parentId: null, sortOrder: nextOrder, isActive: true },
  });

  const [name, icon, description, isActive] = useWatch({
    control,
    name: ["name", "icon", "description", "isActive"],
  });

  // Fill the slug from the name while adding (until the slug is typed by hand)
  useEffect(() => {
    if (!slugTouched) setValue("slug", slugify(name ?? ""), { shouldDirty: true });
  }, [name, slugTouched, setValue]);

  async function onSubmit(values: CategoryFormValues) {
    const res = isEdit ? await updateCategory(category!.id, values) : await createCategory(values);
    if (!res.ok) {
      if (res.field) setError(res.field, { message: res.error });
      return toast.error(res.error);
    }
    toast.success(isEdit ? `"${values.name}" updated` : `"${values.name}" added`);
    router.push("/admin/categories");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Back to categories
      </Link>
      <h1 className="mt-2 font-heading text-2xl font-bold uppercase text-ink">
        {isEdit ? `Edit: ${category!.name}` : "Add category"}
      </h1>

      <div className="mt-5 grid gap-6 lg:grid-cols-3">
        {/* Left */}
        <div className="space-y-6 lg:col-span-2">
          <FormCard title="Details" description="The name and address customers see.">
            <FormField label="Name" required error={errors.name?.message}>
              <input
                {...register("name")}
                placeholder="e.g. Hand Tools"
                autoFocus={!isEdit}
                className={`${inputClass} ${errorBorder(!!errors.name)}`}
              />
            </FormField>

            <FormField
              label="Slug (web address)"
              required
              error={errors.slug?.message}
              hint={isEdit ? "Changing this changes the category's web address." : "Filled in from the name. You can change it."}
            >
              <div
                className={`flex items-center overflow-hidden rounded-xl border bg-white transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/30 ${
                  errors.slug ? "border-red-500" : "border-line"
                }`}
              >
                <span className="shrink-0 border-r border-line bg-surface px-3 py-3 text-sm text-muted">/categories/</span>
                <input
                  {...register("slug", { onChange: () => setSlugTouched(true) })}
                  placeholder="hand-tools"
                  className="h-11 min-w-0 flex-1 px-3 text-[15px] outline-none"
                />
              </div>
            </FormField>

            <FormField label="Short description" error={errors.description?.message} hint={`${description?.length ?? 0}/160`}>
              <textarea
                rows={2}
                {...register("description")}
                placeholder="e.g. Hammers, spanners, pliers and screwdriver sets"
                className={`${inputClass} h-auto py-2.5 ${errorBorder(!!errors.description)}`}
              />
            </FormField>
          </FormCard>

          <FormCard title="Icon" description="Shown on the category card and in the menu.">
            <div className="grid grid-cols-6 gap-2 sm:grid-cols-9 xl:grid-cols-12">
              {CATEGORY_ICONS.map((n) => (
                <button
                  type="button"
                  key={n}
                  title={n}
                  aria-label={n}
                  aria-pressed={icon === n}
                  onClick={() => setValue("icon", n, { shouldDirty: true, shouldValidate: true })}
                  className={`grid aspect-square place-items-center rounded-xl border transition-colors ${
                    icon === n
                      ? "border-brand bg-brand text-ink"
                      : "border-line bg-white text-ink-soft hover:border-brand hover:bg-brand-light"
                  }`}
                >
                  <CategoryIcon name={n} className="h-5 w-5" />
                </button>
              ))}
            </div>
            {errors.icon && <p className="text-xs text-red-600">{errors.icon.message}</p>}
          </FormCard>
        </div>

        {/* Right */}
        <div className="space-y-6">
          <FormCard title="Placement">
            <FormField label="Parent category" hint="Leave as 'None' for a main category.">
              <select
                {...register("parentId", { setValueAs: (v) => (v ? v : null) })}
                className={`${inputClass} ${errorBorder(!!errors.parentId)}`}
              >
                <option value="">None (main category)</option>
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.parentId && <span className="mt-1 block text-xs text-red-600">{errors.parentId.message}</span>}
            </FormField>

            <FormField label="Menu order" error={errors.sortOrder?.message} hint="Lower numbers show first.">
              <input
                type="number"
                min={0}
                {...register("sortOrder", { valueAsNumber: true })}
                className={`${inputClass} ${errorBorder(!!errors.sortOrder)}`}
              />
            </FormField>

            {/* Show in shop switch */}
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-line p-4">
              <span>
                <span className="block text-sm font-semibold text-ink">Show in shop</span>
                <span className="block text-xs text-muted">Hidden categories stay here, but customers can&apos;t see them.</span>
              </span>
              <input type="checkbox" {...register("isActive")} className="peer sr-only" />
              <span className="relative h-7 w-12 shrink-0 rounded-full bg-line transition-colors after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-forest peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-brand" />
            </label>
          </FormCard>

          <FormCard title="Preview" description="How it looks in the shop.">
            <div className="flex justify-center rounded-xl bg-surface p-6">
              <div className="relative flex w-44 flex-col items-center rounded-2xl border border-line bg-white p-5 text-center">
                {!isActive && (
                  <span className="absolute -top-2.5 inline-flex items-center gap-1 rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                    <EyeOff className="h-3 w-3" /> Hidden
                  </span>
                )}
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-light text-ink">
                  <CategoryIcon name={icon} />
                </span>
                <span className="mt-3 text-[15px] font-semibold text-ink">{name || "Category name"}</span>
                <span className="mt-1 text-xs text-muted">
                  {productCount} {productCount === 1 ? "item" : "items"}
                </span>
              </div>
            </div>
          </FormCard>
        </div>
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-0 -mx-4 mt-6 flex items-center justify-end gap-2 border-t border-line bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <Link
          href="/admin/categories"
          className="inline-flex h-11 items-center rounded-xl border border-line px-5 text-sm font-semibold text-ink hover:bg-surface"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting || (isEdit && !isDirty)}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-ink hover:bg-brand-dark disabled:opacity-40"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Add category"}
        </button>
      </div>
    </form>
  );
}