import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  BadgePercent,
  Wrench,
  Truck,
  Headset,
  Award,
  Phone,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { siteInfo } from "@/lib/site-config";
import { navCategories } from "@/lib/nav-categories";

export const metadata: Metadata = {
  title: "About Us | JNB Tools",
  description:
    "JNB Tools supplies genuine power tools, hand tools and hardware to builders, fundis and homeowners in Nairobi.",
};

const stats = [
  { value: "10+", label: "Years in business" },
  { value: "2,000+", label: "Products in stock" },
  { value: "15k+", label: "Happy customers" },
  { value: "20+", label: "Trusted brands" },
];

const reasons = [
  { Icon: ShieldCheck, title: "Genuine Products", text: "Original tools from trusted brands. No fakes, no shortcuts." },
  { Icon: BadgePercent, title: "Fair Prices", text: "Honest prices for fundis, contractors and homeowners alike." },
  { Icon: Award, title: "Warranty Support", text: "We stand behind what we sell and help with warranty claims." },
  { Icon: Wrench, title: "Expert Advice", text: "Not sure what you need? We'll help you pick the right tool." },
  { Icon: Truck, title: "Delivery Available", text: "We deliver within Nairobi and send orders upcountry." },
  { Icon: Headset, title: "Easy Ordering", text: "Order by WhatsApp or phone. Quick replies, no hassle." },
];

const brands = ["Deli", "Ingco", "Total", "Bosch", "Makita", "Tolsen", "Stanley", "DeWalt"];

export default function AboutPage() {
  const digits = (n: string) => n.replace(/\D/g, "");
  const whatsapp = `https://wa.me/${digits(siteInfo.whatsapp)}?text=${encodeURIComponent(
    "Hello JNB Tools, I'd like to ask about a tool."
  )}`;

  return (
    <>
      {/* Header */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">About Us</p>
          <h1 className="mt-2 font-heading text-4xl font-bold uppercase leading-tight sm:text-5xl">
            Built for the people who <span className="text-brand">build Kenya</span>
          </h1>
          <p className="mt-4 max-w-2xl text-white/75">{siteInfo.about}</p>
        </div>
        <div className="hazard-stripe h-1.5" />
      </section>

      {/* Story and stats */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="font-heading text-3xl font-bold uppercase text-ink">Our Story</h2>
          <div className="mt-4 space-y-4 leading-relaxed text-muted">
            <p>
              JNB Tools started as a small hardware shop in Nairobi with one goal: give fundis and builders
              tools they can rely on, at prices that make sense.
            </p>
            <p>
              Today we stock everything from power drills and welding machines to measuring devices, solar
              products and bathroom fittings, serving contractors, workshops and homeowners across Kenya.
            </p>
            <p>
              Our mission is simple: genuine tools, honest advice and fast service, so every job gets done
              right the first time.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-line bg-surface p-6 text-center">
              <p className="font-heading text-4xl font-bold text-ink">{s.value}</p>
              <p className="mt-1 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What we sell */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="font-heading text-3xl font-bold uppercase text-ink">What We Sell</h2>
          <p className="mt-2 text-muted">Tools and hardware for every trade.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {navCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-brand hover:bg-brand-light"
              >
                {cat.name} <ChevronRight className="h-3.5 w-3.5 text-muted" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-heading text-3xl font-bold uppercase text-ink">Why Choose Us</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map(({ Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-line bg-white p-6 transition-shadow hover:shadow-lg"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand text-ink">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Brands */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center">
          <h2 className="font-heading text-xl font-bold uppercase tracking-wide text-muted">
            Brands We Stock
          </h2>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {brands.map((b) => (
              <span
                key={b}
                className="rounded-lg bg-white px-5 py-2.5 font-heading text-lg font-bold uppercase tracking-wide text-ink shadow-sm"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-brand">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-5 px-4 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-heading text-3xl font-bold uppercase text-ink">Need a tool today?</h2>
            <p className="mt-1 text-ink/80">Call or WhatsApp us, and we'll sort you out fast.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href={`tel:+${digits(siteInfo.phone)}`}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-ink px-6 font-semibold text-white transition-colors hover:bg-ink-soft"
            >
              <Phone className="h-4 w-4" /> Call Us
            </a>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-forest px-6 font-semibold text-white transition-colors hover:bg-forest-dark"
            >
              <MessageCircle className="h-5 w-5" /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}