import type { EnquiryItem, Product } from "./types";

export function formatPrice(amount: number) {
  return `KSh ${amount.toLocaleString("en-KE")}`;
}

export function discountPercent(price: number, oldPrice: number | null) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

const digits = (n: string) => n.replace(/\D/g, "");

export function whatsappLink(phone: string, message = "") {
  return `https://wa.me/${digits(phone)}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

export function productWhatsappLink(phone: string, p: Product) {
  return whatsappLink(
    phone,
    `Hello JNB Tools, I'd like to order:\n\n${p.name}\nCode: ${p.sku}\nPrice: ${formatPrice(p.price)}\n\nIs it available?`
  );
}

export function telLink(phone: string) {
  return `tel:+${digits(phone)}`;
}

// The small version of a product that goes into the enquiry list
export function toEnquiryItem(p: Product): Omit<EnquiryItem, "quantity"> {
  return { id: p.id, slug: p.slug, name: p.name, sku: p.sku, price: p.price, image: p.images[0] ?? "" };
}
// "Carpentry & Woodwork" -> "carpentry-woodwork"
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-") // anything that's not a letter or number becomes a dash
    .replace(/^-+|-+$/g, ""); // no dashes at the start or end
}