import Link from "next/link";
import { ChevronRight, TrendingUp } from "lucide-react";
import ProductCard from "../product/ProductCard";
import type { Product } from "@/lib/types";

type Props = { products: Product[]; whatsapp: string };

export default function PopularProducts({ products, whatsapp }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 ">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-forest-light px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-forest">
            <TrendingUp className="h-3.5 w-3.5" /> Best Sellers
          </span>
          <h2 className="mt-2 font-heading text-2xl font-bold uppercase text-ink sm:text-3xl">
            Popular Products
          </h2>
          <p className="mt-1 text-sm text-muted">What fundis keep coming back for</p>
        </div>
        <Link
          href="/shop"
          className="inline-flex shrink-0 items-center gap-0.5 text-sm font-semibold text-ink underline-offset-4 hover:text-brand-dark hover:underline"
        >
          View all <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} whatsapp={whatsapp} />
        ))}
      </div>
    </section>
    
  );
}