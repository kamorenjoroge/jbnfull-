import Link from "next/link";
import { Phone, MessageCircle, Mail, MapPin, Clock, ChevronRight } from "lucide-react";
import { FacebookIcon, InstagramIcon, TiktokIcon } from "./ui/SocialIcons";
import type { SiteInfo } from "@/lib/types";
import type { NavCategory } from "@/lib/nav-categories";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Enquiry list", href: "/enquiry" },
];

type Props = { site: SiteInfo; categories: NavCategory[] };

export default function Footer({ site, categories }: Props) {
  const digits = (n: string) => n.replace(/\D/g, "");

  const socials = [
    { label: "Facebook", href: site.social.facebook, Icon: FacebookIcon },
    { label: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
    { label: "TikTok", href: site.social.tiktok, Icon: TiktokIcon },
  ];

  const heading = "mb-4 font-heading text-lg font-bold uppercase tracking-wide text-brand";
  const link = "text-sm text-white/75 transition-colors hover:text-brand";

  return (
    <footer className="bg-ink text-white">
      <div className="hazard-stripe h-1.5" />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand font-heading text-base font-bold text-ink">
              JNB
            </span>
            <span className="font-heading text-xl font-bold tracking-wide">TOOLS</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/75">{site.about}</p>
          <div className="mt-5 flex gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition-colors hover:bg-brand hover:text-ink"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className={heading}>Categories</h3>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-1">
            {categories.slice(0, 8).map((cat) => (
              <li key={cat.slug}>
                <Link href={`/categories/${cat.slug}`} className={link}>
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/categories"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
          >
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Quick links */}
        <div>
          <h3 className={heading}>Quick Links</h3>
          <ul className="space-y-3">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={link}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className={heading}>Contact</h3>
          <ul className="space-y-3 text-sm text-white/75">
            <li>
              <a href={`tel:+${digits(site.phone)}`} className="flex items-center gap-3 hover:text-brand">
                <Phone className="h-4 w-4 shrink-0 text-brand" /> {site.phone}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${digits(site.whatsapp)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-brand"
              >
                <MessageCircle className="h-4 w-4 shrink-0 text-brand" /> WhatsApp us
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 hover:text-brand">
                <Mail className="h-4 w-4 shrink-0 text-brand" /> {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-brand"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {site.address}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <div className="space-y-1">
                {site.hours.map((h) => (
                  <p key={h.days}>
                    {h.days}: {h.time}
                  </p>
                ))}
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-white/60">
          © 2026 {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}