import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle, Phone, ShieldCheck } from "lucide-react";
import ProductCard from "@/app/components/product/ProductCard";
import StockBadge from "@/app/components/product/StockBadge";
import AddToEnquiryButton from "@/app/components/product/AddToEnquiryButton";
import { getCategories, getProductBySlug, getProducts, getRelatedProducts, getSiteInfo } from "@/lib/api";
import { discountPercent, formatPrice, productWhatsappLink, telLink, toEnquiryItem } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found | JNB Tools" };
  return {
    title: `${product.name} | JNB Tools`,
    description: `${product.shortDescription} ${formatPrice(product.price)}`,
    openGraph: { images: product.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [site, categories, related] = await Promise.all([
    getSiteInfo(),
    getCategories(),
    getRelatedProducts(product),
  ]);
  const category = categories.find((c) => c.id === product.categoryId);
  const discount = discountPercent(product.price, product.oldPrice);
  const hasWarranty = product.warranty && product.warranty.toLowerCase() !== "none";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="text-sm text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-1.5">/</span>
        {category && (
          <>
            <Link href={`/categories/${category.slug}`} className="hover:text-ink">{category.name}</Link>
            <span className="mx-1.5">/</span>
          </>
        )}
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-5 grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-white">
          <Image
            src={product.images[0] ?? "/images/p-drill.jpg"}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            loading="eager"
            className="object-contain p-6"
          />
          {discount > 0 && (
            <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-sm font-bold text-ink">
              -{discount}%
            </span>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-muted">{product.brand}</p>
          <h1 className="mt-1 font-heading text-3xl font-bold uppercase leading-tight text-ink sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-1 text-xs text-muted">SKU: {product.sku}</p>
          <div className="mt-3"><StockBadge status={product.stockStatus} /></div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-heading text-4xl font-bold text-ink">{formatPrice(product.price)}</span>
            {discount > 0 && <span className="text-muted line-through">{formatPrice(product.oldPrice!)}</span>}
          </div>

          <p className="mt-4 leading-relaxed text-ink-soft">{product.description}</p>

          {hasWarranty && (
            <p className="mt-4 flex items-center gap-2 text-sm font-medium text-ink">
              <ShieldCheck className="h-4 w-4 text-forest" /> {product.warranty} warranty
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={productWhatsappLink(site.whatsapp, product)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-forest px-6 font-semibold text-white transition-colors hover:bg-forest-dark"
            >
              <MessageCircle className="h-5 w-5" /> Order on WhatsApp
            </a>
            <AddToEnquiryButton item={toEnquiryItem(product)} variant="full" />
          </div>
          <a href={telLink(site.phone)} className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink">
            <Phone className="h-4 w-4" /> Or call to order: {site.phone}
          </a>

          {/* Specs */}
          {product.specs.length > 0 && (
            <div className="mt-8">
              <h2 className="font-heading text-xl font-bold uppercase text-ink">Specifications</h2>
              <dl className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line bg-white text-sm">
                {product.specs.map((s) => (
                  <div key={s.label} className="flex justify-between gap-4 px-4 py-3">
                    <dt className="text-muted">{s.label}</dt>
                    <dd className="text-right font-medium text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="font-heading text-2xl font-bold uppercase text-ink">You May Also Need</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} whatsapp={site.whatsapp} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}