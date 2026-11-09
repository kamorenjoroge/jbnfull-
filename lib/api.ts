// The only module allowed to read mock data. Swap these bodies for real fetches later.
import categoriesData from "./mock-data/categories.json";
import productsData from "./mock-data/products.json";
import brandsData from "./mock-data/brands.json";
import testimonialsData from "./mock-data/testimonials.json";
import siteData from "./mock-data/site.json";
import type {
  Brand,
  Category,
  CategoryWithCount,
  Product,
  ProductFilters,
  SiteInfo,
  Testimonial,
} from "./types";

const categories = categoriesData as Category[];
const products = productsData as Product[];

const delay = async (ms = 350) => {
  if (typeof window === "undefined") return; // no delay on the server
  await new Promise<void>((r) => setTimeout(r, ms));
};

export async function getSiteInfo(): Promise<SiteInfo> {
  await delay(100);
  return siteData as SiteInfo;
}

export async function getCategories(): Promise<CategoryWithCount[]> {
  await delay();
  return categories
    .filter((c) => c.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((c) => ({ ...c, productCount: products.filter((p) => p.categoryId === c.id).length }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  await delay(150);
  return categories.find((c) => c.slug === slug && c.isActive) ?? null;
}

function matches(p: Product, q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  return [p.name, p.brand, p.sku, ...p.tags].some((f) => f.toLowerCase().includes(s));
}


export async function getProductBySlug(slug: string): Promise<Product | null> {
  await delay(200);
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  await delay();
  return products.filter((p) => p.isFeatured).slice(0, limit);
}

export async function getPopularProducts(limit = 8): Promise<Product[]> {
  await delay();
  return products.filter((p) => p.isPopular).slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  await delay();
  return products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, limit);
}

export async function searchProducts(query: string): Promise<Product[]> {
  await delay();
  if (!query.trim()) return [];
  return products.filter((p) => matches(p, query));
}

export async function getBrands(): Promise<Brand[]> {
  await delay(150);
  return brandsData as Brand[];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  await delay(150);
  return testimonialsData as Testimonial[];
}

export function getCategoryNameById(id: string): string {
  return categories.find((c) => c.id === id)?.name ?? "";
}



export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  await delay();
  let list = [...products]; // copy, so sorting never changes the original data

  if (filters.categorySlug) {
    const cat = categories.find((c) => c.slug === filters.categorySlug);
    list = cat ? list.filter((p) => p.categoryId === cat.id) : [];
  }
  if (filters.brand) list = list.filter((p) => p.brand.toLowerCase() === filters.brand!.toLowerCase());
  if (filters.query) list = list.filter((p) => matches(p, filters.query!));
  if (filters.minPrice !== undefined) list = list.filter((p) => p.price >= filters.minPrice!);
  if (filters.maxPrice !== undefined) list = list.filter((p) => p.price <= filters.maxPrice!);
  if (filters.inStock) list = list.filter((p) => p.stockStatus !== "out_of_stock");

  switch (filters.sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      list.reverse(); // mock data has no dates, so the last product in the file counts as newest
      break;
    case "popular":
      list.sort((a, b) => Number(b.isPopular) - Number(a.isPopular));
      break;
  }

  return filters.limit ? list.slice(0, filters.limit) : list;
}


// ADMIN: every category, including hidden ones, with product counts
export async function getAllCategories(): Promise<CategoryWithCount[]> {
  await delay();
  return [...categories]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((c) => ({ ...c, productCount: products.filter((p) => p.categoryId === c.id).length }));
}

// ADMIN: one category by id, for the edit form
export async function getCategoryById(id: string): Promise<Category | null> {
  await delay(150);
  return categories.find((c) => c.id === id) ?? null;
}

// ADMIN: one product by id, for the edit form
export async function getProductById(id: string): Promise<Product | null> {
  await delay(150);
  return products.find((p) => p.id === id) ?? null;
}