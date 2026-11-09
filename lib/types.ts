export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  image: string;
  description: string;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface CategoryWithCount extends Category {
  productCount: number;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  brand: string;
  categoryId: string;
  price: number;
  oldPrice: number | null;
  images: string[];
  shortDescription: string;
  description: string;
  specs: { label: string; value: string }[];
  stockStatus: StockStatus;
  isFeatured: boolean;
  isPopular: boolean;
  warranty: string;
  tags: string[];
}

export interface Brand {
  id: string;
  name: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
}

export interface SiteInfo {
  name: string;
  tagline: string;
  about: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: { days: string; time: string }[];
  mapsUrl: string;
  social: { facebook: string; instagram: string; tiktok: string };
  promo: { title: string; text: string; cta: string; categorySlug: string };
}

export interface EnquiryItem {
  id: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  image: string;
  quantity: number;
}
export type SortOption = "popular" | "newest" | "price-asc" | "price-desc";

export interface ProductFilters {
  categorySlug?: string;
  brand?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: SortOption;
  limit?: number;
}
