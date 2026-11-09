import ProductRail from "../product/ProductRail";
import SectionHeading from "../ui/SectionHeading";
import type { Product } from "@/lib/types";

type Props = { products: Product[]; whatsapp: string };

export default function FeaturedProducts({ products, whatsapp }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <SectionHeading title="Featured Products" subtitle="Hand-picked by our team" href="/shop" />
        <ProductRail products={products} whatsapp={whatsapp} />
      </div>
    </section>
  );
}