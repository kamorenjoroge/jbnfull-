import type { Metadata } from "next";
import { Phone, MessageCircle, Mail, MapPin, Clock, Navigation } from "lucide-react";
import ContactForm from "./ContactForm";
import { siteInfo } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact Us | JNB Tools",
  description: "Call, WhatsApp, email or visit JNB Tools in Nairobi CBD.",
};

export default function ContactPage() {
  const digits = (n: string) => n.replace(/\D/g, "");
  const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(siteInfo.address)}&output=embed`;

  const cards = [
    { Icon: Phone, title: "Call Us", value: siteInfo.phone, href: `tel:+${digits(siteInfo.phone)}`, external: false },
    {
      Icon: MessageCircle,
      title: "WhatsApp",
      value: "Chat with us",
      href: `https://wa.me/${digits(siteInfo.whatsapp)}?text=${encodeURIComponent("Hello JNB Tools, I'd like to ask about a tool.")}`,
      external: true,
    },
    { Icon: Mail, title: "Email", value: siteInfo.email, href: `mailto:${siteInfo.email}`, external: false },
    { Icon: MapPin, title: "Visit Us", value: siteInfo.address, href: siteInfo.mapsUrl, external: true },
  ];

  return (
    <>
      {/* Header */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">Contact</p>
          <h1 className="mt-2 font-heading text-4xl font-bold uppercase leading-tight sm:text-5xl">
            Talk to <span className="text-brand">JNB Tools</span>
          </h1>
          <p className="mt-4 max-w-2xl text-white/75">
            Ask about a tool, check stock or place an order. We usually reply on WhatsApp within minutes.
          </p>
        </div>
        <div className="hazard-stripe h-1.5" />
      </section>

      {/* Quick contact cards */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ Icon, title, value, href, external }) => (
            <a
              key={title}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 transition hover:border-brand hover:shadow-lg"
            >
              <span
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${
                  title === "WhatsApp" ? "bg-forest text-white" : "bg-brand text-ink"
                }`}
              >
                <Icon className="h-6 w-6" />
              </span>
              <span className="min-w-0">
                <span className="block font-bold text-ink">{title}</span>
                <span className="block truncate text-sm text-muted group-hover:text-ink">{value}</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Form, hours and map */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 lg:grid-cols-5">
        <div className="rounded-2xl border border-line bg-white p-6 sm:p-8 lg:col-span-3">
          <h2 className="font-heading text-2xl font-bold uppercase text-ink">Send Us a Message</h2>
          <p className="mb-6 mt-1 text-sm text-muted">Fill in the form and we'll call or WhatsApp you back.</p>
          <ContactForm />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl bg-ink p-6 text-white">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold uppercase text-brand">
              <Clock className="h-5 w-5" /> Opening Hours
            </h2>
            <ul className="mt-4 divide-y divide-white/10 text-sm">
              {siteInfo.hours.map((h) => (
                <li key={h.days} className="flex justify-between py-2.5">
                  <span className="text-white/75">{h.days}</span>
                  <span className={h.time === "Closed" ? "font-semibold text-red-400" : "font-semibold"}>
                    {h.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-2xl border border-line">
            <iframe
              src={mapEmbed}
              title="JNB Tools location map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-64 w-full border-0"
            />
            <a
              href={siteInfo.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2 bg-brand font-semibold text-ink transition-colors hover:bg-brand-dark"
            >
              <Navigation className="h-4 w-4" /> Get Directions
            </a>
          </div>
        </div>
      </section>
    </>
  );
}