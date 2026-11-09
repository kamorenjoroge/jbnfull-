import ProductCard from "./ProductCard";
import type { Product } from "@/lib/types";

type Props = { products: Product[]; whatsapp: string };

// Swipeable row on phones and tablets, grid on desktop
export default function ProductRail({ products, whatsapp }: Props) {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:gap-4 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 lg:pb-0">
      {products.map((p) => (
        <div key={p.id} className="flex w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-auto">
          <ProductCard product={p} whatsapp={whatsapp} />
        </div>
      ))}
    </div>
  );
}