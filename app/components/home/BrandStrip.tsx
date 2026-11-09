import Link from "next/link";
import type { Brand } from "@/lib/types";

export default function BrandStrip({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) return null;

  // The list is repeated twice so the scroll loops without a gap
  const loop = [...brands, ...brands];

  return (
    <section className="border-y border-line bg-surface py-10">
      <h2 className="text-center font-heading text-lg font-bold uppercase tracking-wider text-muted">
        Brands We Stock
      </h2>

      <div className="group relative mt-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <ul className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {loop.map((brand, i) => {
            const isCopy = i >= brands.length;
            return (
              <li key={`${brand.id}-${i}`} aria-hidden={isCopy} className="mr-3">
                <Link
                  href={`/search?q=${encodeURIComponent(brand.name)}`}
                  tabIndex={isCopy ? -1 : undefined}
                  className="block rounded-xl border border-line bg-white px-6 py-3 font-heading text-xl font-bold uppercase tracking-wide text-ink shadow-sm transition-colors hover:border-brand hover:bg-brand-light"
                >
                  {brand.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}