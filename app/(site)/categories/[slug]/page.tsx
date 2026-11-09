import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PackageSearch } from "lucide-react";
import ProductCard from "@/app/components/product/ProductCard";
import { getCategories, getCategoryBySlug, getProducts, getSiteInfo } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found | JNB Tools" };
  return { title: `${category.name} | JNB Tools`, description: category.description };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [products, site] = await Promise.all([getProducts({ categorySlug: slug }), getSiteInfo()]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <nav className="text-sm text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/categories" className="hover:text-ink">Categories</Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{category.name}</span>
      </nav>

      <h1 className="mt-3 font-heading text-4xl font-bold uppercase text-ink">{category.name}</h1>
      <p className="mt-1 text-muted">{category.description}</p>
      <p className="mt-4 text-sm text-muted">
        Showing <span className="font-semibold text-ink">{products.length}</span> products
      </p>

      {products.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} whatsapp={site.whatsapp} />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface p-10 text-center">
          <PackageSearch className="h-10 w-10 text-muted" />
          <p className="mt-3 font-semibold text-ink">No products here yet</p>
          <p className="mt-1 text-sm text-muted">Ask us on WhatsApp, we may have it in store.</p>
        </div>
      )}
    </section>
  );
}