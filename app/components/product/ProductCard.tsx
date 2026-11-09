import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import StockBadge from "./StockBadge";
import AddToEnquiryButton from "./AddToEnquiryButton";
import { discountPercent, formatPrice, productWhatsappLink, toEnquiryItem } from "@/lib/utils";
import type { Product } from "@/lib/types";

export default function ProductCard({ product, whatsapp }: { product: Product; whatsapp: string }) {
  const discount = discountPercent(product.price, product.oldPrice);
  const href = `/product/${product.slug}`;

  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:shadow-lg">
      <div className="relative aspect-square">
        <Link href={href} aria-label={product.name}>
          <Image
            src={product.images[0] ?? "/images/p-drill.jpg"}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-brand px-2 py-0.5 text-xs font-bold text-ink">
            -{discount}%
          </span>
        )}
        <div className="absolute right-2 top-2">
          <AddToEnquiryButton item={toEnquiryItem(product)} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs font-bold uppercase tracking-wide text-muted">{product.brand}</span>
          <StockBadge status={product.stockStatus} />
        </div>

        <Link href={href} className="mt-1.5 line-clamp-2 text-sm font-medium text-ink hover:text-brand-dark sm:text-[15px]">
          {product.name}
        </Link>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
          <span className="font-heading text-xl font-bold text-ink">{formatPrice(product.price)}</span>
          {discount > 0 && <span className="text-xs text-muted line-through">{formatPrice(product.oldPrice!)}</span>}
        </div>

        <div className="mt-auto pt-3">
          <a
            href={productWhatsappLink(whatsapp, product)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-forest text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="sm:hidden">Order</span>
            <span className="hidden sm:inline">Order on WhatsApp</span>
          </a>
        </div>
      </div>
    </article>
  );
}