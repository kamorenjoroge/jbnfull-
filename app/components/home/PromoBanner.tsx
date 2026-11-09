import Link from "next/link";
import { ArrowRight, BadgePercent, Zap } from "lucide-react";
import type { SiteInfo } from "@/lib/types";

export default function PromoBanner({ promo }: { promo: SiteInfo["promo"] }) {
  if (!promo?.title) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="relative overflow-hidden rounded-2xl bg-ink text-white shadow-xl">
        <div className="hazard-stripe h-2" />

        {/* Faded background icon */}
        <BadgePercent
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 top-1/2 hidden h-56 w-56 -translate-y-1/2 text-brand/10 sm:block"
        />

        <div className="relative flex flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">
              <Zap className="h-3.5 w-3.5" /> Limited Offer
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold uppercase leading-tight text-brand sm:text-4xl">
              {promo.title}
            </h2>
            <p className="mt-2 text-white/80 sm:text-lg">{promo.text}</p>
          </div>

          <Link
            href={`/categories/${promo.categorySlug}`}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-7 font-semibold text-ink transition-colors hover:bg-brand-dark md:h-14"
          >
            {promo.cta} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="hazard-stripe h-2" />
      </div>
    </section>
  );
}