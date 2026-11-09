"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save, Plus, Trash2, Star, ImagePlus, X } from "lucide-react";
import FormCard from "./ui/FormCard";
import FormField, { inputClass, errorBorder } from "./ui/FormField";
import StockBadge from "@/app/components/product/StockBadge";
import { productSchema, type ProductFormValues } from "@/lib/schemas";
import { createProduct, updateProduct } from "@/app/admin/products/actions";
import { discountPercent, formatPrice, slugify } from "@/lib/utils";
import type { Product, StockStatus } from "@/lib/types";

type Props = {
  product?: Product; // given = Edit, missing = Add
  categories: { id: string; name: string; isActive: boolean }[];
  brands: string[];
  imageLibrary: string[];
};

const STOCK_OPTIONS: { value: StockStatus; label: string; hint: string }[] = [
  { value: "in_stock", label: "In stock", hint: "Available now" },
  { value: "low_stock", label: "Low stock", hint: "Only a few left" },
  { value: "out_of_stock", label: "Out of stock", hint: "Customers can still ask about it" },
];

function Switch({
  label,
  description,
  registration,
}: {
  label: string;
  description: string;
  registration: UseFormRegisterReturn;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-line p-4">
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        <span className="block text-xs text-muted">{description}</span>
      </span>
      <input type="checkbox" {...registration} className="peer sr-only" />
      <span className="relative h-7 w-12 shrink-0 rounded-full bg-line transition-colors after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-forest peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-brand" />
    </label>
  );
}

export default function ProductForm({ product, categories, brands, imageLibrary }: Props) {
  const router = useRouter();
  const isEdit = !!product;
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [newImage, setNewImage] = useState("");
  const [showLibrary, setShowLibrary] = useState(!isEdit);
  const [tagsText, setTagsText] = useState(product?.tags.join(", ") ?? "");

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          brand: product.brand,
          categoryId: product.categoryId,
          price: product.price,
          oldPrice: product.oldPrice ?? null,
          images: product.images,
          shortDescription: product.shortDescription,
          description: product.description,
          specs: product.specs,
          stockStatus: product.stockStatus,
          isFeatured: product.isFeatured,
          isPopular: product.isPopular,
          warranty: product.warranty ?? "",
          tags: product.tags,
        }
      : {
          name: "",
          slug: "",
          sku: "",
          brand: "",
          categoryId: "",
          oldPrice: null,
          images: [],
          shortDescription: "",
          description: "",
          specs: [],
          stockStatus: "in_stock",
          isFeatured: false,
          isPopular: false,
          warranty: "",
          tags: [],
        },
  });

  const { fields: specFields, append: addSpec, remove: removeSpec } = useFieldArray({ control, name: "specs" });

  const [name, images, brand, price, oldPrice, stockStatus, shortDescription] = useWatch({
    control,
    name: ["name", "images", "brand", "price", "oldPrice", "stockStatus", "shortDescription"],
  });

  // Fill the slug from the name while adding (until the slug is typed by hand)
  useEffect(() => {
    if (!slugTouched) setValue("slug", slugify(name ?? ""), { shouldDirty: true });
  }, [name, slugTouched, setValue]);

  // ---------- Images ----------
  const imageList = images ?? [];
  const setImages = (next: string[]) => setValue("images", next, { shouldDirty: true, shouldValidate: true });

  function addImage(value: string) {
    const v = value.trim();
    if (!v) return;
    if (!v.startsWith("/images/")) return toast.error("For now, use an image from /images/, e.g. /images/p-drill.jpg");
    if (imageList.includes(v)) return toast.error("That image is already added");
    setImages([...imageList, v]);
    setNewImage("");
  }
  const removeImage = (i: number) => setImages(imageList.filter((_, idx) => idx !== i));
  const makeMain = (i: number) => setImages([imageList[i], ...imageList.filter((_, idx) => idx !== i)]);

  // ---------- Tags ----------
  function handleTags(text: string) {
    setTagsText(text);
    setValue(
      "tags",
      text.split(",").map((t) => t.trim()).filter(Boolean),
      { shouldDirty: true }
    );
  }

  async function onSubmit(values: ProductFormValues) {
    const res = isEdit ? await updateProduct(product!.id, values) : await createProduct(values);
    if (!res.ok) {
      if (res.field) setError(res.field, { message: res.error });
      return toast.error(res.error);
    }
    toast.success(isEdit ? `"${values.name}" updated` : `"${values.name}" added`);
    router.push("/admin/products");
  }

  // ---------- Preview values ----------
  const hasPrice = Number.isFinite(price) && price > 0;
  const discount = hasPrice && oldPrice ? discountPercent(price, oldPrice) : 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>
      <h1 className="mt-2 font-heading text-2xl font-bold uppercase text-ink">
        {isEdit ? `Edit: ${product!.name}` : "Add product"}
      </h1>

      <div className="mt-5 grid gap-6 lg:grid-cols-3">
        {/* ================= LEFT ================= */}
        <div className="space-y-6 lg:col-span-2">
          {/* 1. Basic info */}
          <FormCard title="Basic info" description="What the product is and where it belongs.">
            <FormField label="Product name" required error={errors.name?.message}>
              <input
                {...register("name")}
                placeholder="e.g. Ingco Cordless Drill 20V"
                autoFocus={!isEdit}
                className={`${inputClass} ${errorBorder(!!errors.name)}`}
              />
            </FormField>

            <FormField
              label="Slug (web address)"
              required
              error={errors.slug?.message}
              hint={isEdit ? "Changing this changes the product's web address." : "Filled in from the name. You can change it."}
            >
              <div
                className={`flex items-center overflow-hidden rounded-xl border bg-white transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/30 ${
                  errors.slug ? "border-red-500" : "border-line"
                }`}
              >
                <span className="shrink-0 border-r border-line bg-surface px-3 py-3 text-sm text-muted">/product/</span>
                <input
                  {...register("slug", { onChange: () => setSlugTouched(true) })}
                  className="h-11 min-w-0 flex-1 px-3 text-[15px] outline-none"
                />
              </div>
            </FormField>

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField label="Product code (SKU)" required error={errors.sku?.message}>
                <input {...register("sku")} placeholder="e.g. CDLI20051" className={`${inputClass} ${errorBorder(!!errors.sku)}`} />
              </FormField>
              <FormField label="Brand" required error={errors.brand?.message}>
                <input
                  {...register("brand")}
                  list="brand-list"
                  placeholder="e.g. Ingco"
                  className={`${inputClass} ${errorBorder(!!errors.brand)}`}
                />
                <datalist id="brand-list">
                  {brands.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </FormField>
              <FormField label="Category" required error={errors.categoryId?.message}>
                <select {...register("categoryId")} className={`${inputClass} ${errorBorder(!!errors.categoryId)}`}>
                  <option value="">Choose…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {c.isActive ? "" : " (hidden)"}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          </FormCard>

          {/* 2. Pricing */}
          <FormCard title="Pricing" description="Prices are in Kenyan shillings (KSh).">
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField label="Price (KSh)" required error={errors.price?.message}>
                <input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="8500"
                  className={`${inputClass} ${errorBorder(!!errors.price)}`}
                />
              </FormField>
              <FormField label="Old price (KSh)" error={errors.oldPrice?.message} hint="Optional. Shows a discount.">
                <input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  {...register("oldPrice", { setValueAs: (v) => (v === "" || v === null ? null : Number(v)) })}
                  placeholder="9800"
                  className={`${inputClass} ${errorBorder(!!errors.oldPrice)}`}
                />
              </FormField>
              <div>
                <span className="mb-1.5 block text-sm font-semibold text-ink">Discount</span>
                <div className="flex h-11 items-center rounded-xl border border-dashed border-line bg-surface px-3.5">
                  {discount > 0 ? (
                    <span className="rounded-full bg-brand px-2.5 py-0.5 text-sm font-bold text-ink">−{discount}%</span>
                  ) : (
                    <span className="text-sm text-muted">No discount</span>
                  )}
                </div>
              </div>
            </div>
          </FormCard>

          {/* 3. Descriptions */}
          <FormCard title="Descriptions">
            <FormField
              label="Short description"
              required
              error={errors.shortDescription?.message}
              hint={`${shortDescription?.length ?? 0}/160. Shown in search results and link previews.`}
            >
              <textarea
                rows={2}
                {...register("shortDescription")}
                className={`${inputClass} h-auto py-2.5 ${errorBorder(!!errors.shortDescription)}`}
              />
            </FormField>
            <FormField label="Full description" required error={errors.description?.message}>
              <textarea
                rows={5}
                {...register("description")}
                className={`${inputClass} h-auto py-2.5 ${errorBorder(!!errors.description)}`}
              />
            </FormField>
          </FormCard>

          {/* 4. Specifications */}
          <FormCard title="Specifications" description="Shown as a table on the product page, e.g. Power: 20V.">
            {specFields.length === 0 && <p className="text-sm text-muted">No specifications yet.</p>}
            {specFields.map((field, i) => (
              <div key={field.id} className="flex items-start gap-2">
                <input
                  {...register(`specs.${i}.label`)}
                  placeholder="Label, e.g. Power"
                  aria-label="Specification label"
                  className={`${inputClass} flex-1 ${errorBorder(!!errors.specs?.[i]?.label)}`}
                />
                <input
                  {...register(`specs.${i}.value`)}
                  placeholder="Value, e.g. 20V"
                  aria-label="Specification value"
                  className={`${inputClass} flex-1 ${errorBorder(!!errors.specs?.[i]?.value)}`}
                />
                <button
                  type="button"
                  onClick={() => removeSpec(i)}
                  aria-label="Remove specification"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-muted hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addSpec({ label: "", value: "" })}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-dashed border-line px-4 text-sm font-semibold text-ink hover:border-brand hover:bg-brand-light"
            >
              <Plus className="h-4 w-4" /> Add row
            </button>
          </FormCard>

          {/* 5. Images */}
          <FormCard title="Images" description="The first image (★) is the main photo. Photo uploads come with Cloudinary.">
            {imageList.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                {imageList.map((src, i) => (
                  <div key={src} className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-full w-full object-contain p-1.5" />
                    {i === 0 ? (
                      <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-0.5 rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold text-ink">
                        <Star className="h-3 w-3 fill-current" /> Main
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => makeMain(i)}
                        className="absolute left-1.5 top-1.5 rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-ink shadow-sm hover:bg-brand"
                      >
                        Make main
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      aria-label="Remove image"
                      className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-muted shadow-sm hover:bg-red-600 hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`rounded-xl border border-dashed p-4 text-center text-sm ${errors.images ? "border-red-400 text-red-600" : "border-line text-muted"}`}>
                No images yet. Pick one below.
              </p>
            )}
            {errors.images?.message && <p className="text-xs text-red-600">{errors.images.message}</p>}

            {/* Type a path */}
            <div className="flex gap-2">
              <input
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // don't submit the form
                    addImage(newImage);
                  }
                }}
                placeholder="/images/p-drill.jpg"
                aria-label="Image path"
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() => addImage(newImage)}
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-line px-4 text-sm font-semibold text-ink hover:border-brand hover:bg-brand-light"
              >
                <ImagePlus className="h-4 w-4" /> Add
              </button>
            </div>

            {/* Pick from existing images */}
            {imageLibrary.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowLibrary((s) => !s)}
                  className="text-sm font-semibold text-ink underline-offset-4 hover:underline"
                >
                  {showLibrary ? "Hide" : "Choose from"} existing images ({imageLibrary.length})
                </button>
                {showLibrary && (
                  <div className="mt-3 grid max-h-64 grid-cols-4 gap-2 overflow-y-auto rounded-xl bg-surface p-2 sm:grid-cols-6">
                    {imageLibrary.map((src) => {
                      const added = imageList.includes(src);
                      return (
                        <button
                          type="button"
                          key={src}
                          onClick={() => (added ? removeImage(imageList.indexOf(src)) : addImage(src))}
                          title={src}
                          aria-pressed={added}
                          className={`relative aspect-square overflow-hidden rounded-lg border-2 bg-white transition ${
                            added ? "border-forest" : "border-transparent hover:border-brand"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt="" className="h-full w-full object-contain p-1" />
                          {added && (
                            <span className="absolute inset-x-0 bottom-0 bg-forest py-0.5 text-[10px] font-bold text-white">Added</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </FormCard>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="space-y-6">
          {/* 6. Stock & visibility */}
          <FormCard title="Stock & visibility">
            <div className="space-y-2">
              {STOCK_OPTIONS.map((o) => (
                <label
                  key={o.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${
                    stockStatus === o.value ? "border-brand bg-brand-light" : "border-line hover:bg-surface"
                  }`}
                >
                  <input type="radio" value={o.value} {...register("stockStatus")} className="h-4 w-4 accent-[#15803D]" />
                  <span>
                    <span className="block text-sm font-semibold text-ink">{o.label}</span>
                    <span className="block text-xs text-muted">{o.hint}</span>
                  </span>
                </label>
              ))}
            </div>
            <Switch label="Featured" description="Show in Featured Products on the Home page." registration={register("isFeatured")} />
            <Switch label="Popular" description="Show in Popular Products on the Home page." registration={register("isPopular")} />
          </FormCard>

          {/* 7. Preview */}
          <FormCard title="Preview" description="How it looks in the shop.">
            <div className="mx-auto w-full max-w-[240px] overflow-hidden rounded-2xl border border-line bg-white">
              <div className="relative aspect-square bg-white">
                {imageList[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageList[0]} alt="" className="h-full w-full object-contain p-3" />
                ) : (
                  <div className="grid h-full place-items-center text-xs text-muted">No image</div>
                )}
                {discount > 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-brand px-2 py-0.5 text-xs font-bold text-ink">−{discount}%</span>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-bold uppercase tracking-wide text-muted">{brand || "Brand"}</span>
                  <StockBadge status={stockStatus ?? "in_stock"} />
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm font-medium text-ink">{name || "Product name"}</p>
                <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
                  <span className="font-heading text-xl font-bold text-ink">{hasPrice ? formatPrice(price) : "KSh —"}</span>
                  {discount > 0 && <span className="text-xs text-muted line-through">{formatPrice(oldPrice!)}</span>}
                </div>
                <div className="mt-3 flex h-10 items-center justify-center rounded-xl bg-forest text-sm font-semibold text-white">
                  Order on WhatsApp
                </div>
              </div>
            </div>
          </FormCard>

          {/* 8. Extras */}
          <FormCard title="Extras">
            <FormField label="Warranty" hint="e.g. 6 months. Leave empty if none.">
              <input {...register("warranty")} className={inputClass} />
            </FormField>
            <FormField label="Search tags" hint="Separate with commas, e.g. drill, cordless, 20v">
              <input value={tagsText} onChange={(e) => handleTags(e.target.value)} className={inputClass} />
            </FormField>
          </FormCard>
        </div>
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-0 -mx-4 mt-6 flex items-center justify-end gap-2 border-t border-line bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <Link
          href="/admin/products"
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
          {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Add product"}
        </button>
      </div>
    </form>
  );
}