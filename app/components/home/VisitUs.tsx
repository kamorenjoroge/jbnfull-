import { MapPin, Clock, Phone, Navigation } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import { telLink } from "@/lib/utils";
import type { SiteInfo } from "@/lib/types";

export default function VisitUs({ site }: { site: SiteInfo }) {
  const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <SectionHeading title="Visit Our Shop" subtitle="Come see the tools in person" />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Info card */}
        <div className="flex flex-col rounded-2xl border border-line bg-white p-6 lg:col-span-2">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand text-ink">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold text-ink">Address</p>
              <p className="mt-0.5 text-sm text-muted">{site.address}</p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand text-ink">
              <Clock className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="font-bold text-ink">Opening Hours</p>
              <ul className="mt-1 divide-y divide-line text-sm">
                {site.hours.map((h) => (
                  <li key={h.days} className="flex justify-between gap-4 py-1.5">
                    <span className="text-muted">{h.days}</span>
                    <span className={`font-semibold ${h.time === "Closed" ? "text-red-600" : "text-ink"}`}>
                      {h.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand text-ink">
              <Phone className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold text-ink">Phone</p>
              <a href={telLink(site.phone)} className="mt-0.5 block text-sm text-muted hover:text-ink">
                {site.phone}
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-auto lg:pt-8">
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-5 font-semibold text-ink transition-colors hover:bg-brand-dark"
            >
              <Navigation className="h-4 w-4" /> Get Directions
            </a>
            <a
              href={telLink(site.phone)}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-ink px-5 font-semibold text-white transition-colors hover:bg-ink-soft"
            >
              <Phone className="h-4 w-4" /> Call Us
            </a>
          </div>
        </div>

        {/* Map */}
        <div className="overflow-hidden rounded-2xl border border-line lg:col-span-3">
          <iframe
            src={mapEmbed}
            title={`Map showing ${site.name} at ${site.address}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-72 w-full border-0 sm:h-96 lg:h-full lg:min-h-[420px]"
          />
        </div>
      </div>
    </section>
  );
}