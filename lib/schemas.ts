import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.url("Enter a full link starting with https://")]);

export const siteSchema = z.object({
  name: z.string().trim().min(2, "Business name is required"),
  tagline: z.string().trim().min(2, "Tagline is required"),
  about: z.string().trim().min(10, "Write at least 10 characters"),
  phone: z.string().trim().min(9, "Enter a phone number"),
  whatsapp: z.string().trim().regex(/^254\d{9}$/, "Use the 254 format, e.g. 254712345678"),
  email: z.email("Enter a valid email"),
  address: z.string().trim().min(3, "Address is required"),
  mapsUrl: z.url("Enter a full link starting with https://"),
  hours: z
    .array(
      z.object({
        days: z.string().trim().min(1, "Required"),
        time: z.string().trim().min(1, "Required"),
      })
    )
    .min(1, "Add at least one row"),
  social: z.object({
    facebook: optionalUrl,
    instagram: optionalUrl,
    tiktok: optionalUrl,
  }),
  promo: z.object({
    title: z.string().trim().min(2, "Title is required"),
    text: z.string().trim().min(2, "Text is required"),
    cta: z.string().trim().min(2, "Button text is required"),
    categorySlug: z.string().min(1, "Choose a category"),
  }),
});

export type SiteFormValues = z.infer<typeof siteSchema>;
export const categorySchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(60, "Keep it under 60 characters"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes, e.g. power-tools"),
  icon: z.string().min(1, "Choose an icon"),
  image: z.string().trim(),
  description: z.string().trim().max(160, "Keep it under 160 characters"),
  parentId: z.string().nullable(),
  sortOrder: z.number({ message: "Enter a number" }).int().min(0, "Must be 0 or more"),
  isActive: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const productSchema = z
  .object({
    name: z.string().trim().min(2, "Name is required").max(120, "Keep it under 120 characters"),
    slug: z
      .string()
      .trim()
      .min(2, "Slug is required")
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes"),
    sku: z.string().trim().min(2, "Product code is required").max(40, "Keep it under 40 characters"),
    brand: z.string().trim().min(1, "Brand is required"),
    categoryId: z.string().min(1, "Choose a category"),
    price: z.number({ message: "Enter a price" }).int("Use whole shillings").positive("Price must be more than 0"),
    oldPrice: z.number().int("Use whole shillings").positive().nullable(),
    images: z.array(z.string().trim().min(1)).min(1, "Add at least one image"),
    shortDescription: z.string().trim().min(10, "Write at least 10 characters").max(160, "Keep it under 160 characters"),
    description: z.string().trim().min(20, "Write at least 20 characters"),
    specs: z.array(
      z.object({
        label: z.string().trim().min(1, "Required"),
        value: z.string().trim().min(1, "Required"),
      })
    ),
    stockStatus: z.enum(["in_stock", "low_stock", "out_of_stock"]),
    isFeatured: z.boolean(),
    isPopular: z.boolean(),
    warranty: z.string().trim(),
    tags: z.array(z.string().trim().min(1)),
  })
  .refine((d) => d.oldPrice === null || d.oldPrice > d.price, {
    message: "Old price must be higher than the current price",
    path: ["oldPrice"],
  });

export type ProductFormValues = z.infer<typeof productSchema>;