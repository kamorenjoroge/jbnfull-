import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, MessageCircle } from "lucide-react";
import type { SiteInfo } from "@/lib/types";

export default function Hero({ site }: { site: SiteInfo }) {
  const whatsapp = `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
    "Hello JNB Tools, I'd like to ask about a tool."
  )}`;

  return (
    <section className="bg-surface">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 md:py-16 lg:grid-cols-2 lg:gap-12">
        {/* Text */}
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">
            <BadgeCheck className="h-4 w-4" />
            Genuine brands · Nairobi
          </span>

          <h1 className="mt-4 font-heading text-5xl font-bold uppercase leading-[0.95] text-ink sm:text-6xl lg:text-7xl">
            The Right Tools <span className="text-brand-dark">for Every Job</span>
          </h1>

          <p className="mt-4 max-w-md text-base leading-relaxed text-muted sm:text-lg">
            Quality tools for builders, carpenters, welders and homeowners, at fair prices.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/categories"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 font-semibold text-ink shadow-sm transition-colors hover:bg-brand-dark"
            >
              Shop Tools <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-forest px-6 font-semibold text-white shadow-sm transition-colors hover:bg-forest-dark"
            >
              <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-xl lg:aspect-[4/3]">
          <Image
            src="/hero-tools.jpg"
            alt="Power drill, angle grinder, hammer, tape measure and spanners on a workbench"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            loading="eager"
            fetchPriority="high"
            className="object-cover"
          />
        
        </div>
      </div>
    </section>
  );
}