"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, Search, ClipboardList } from "lucide-react";
import SideDrawer from "./SideDrawer";
import type { NavCategory } from "@/lib/nav-categories";
import { useEnquiry } from "@/app/context/EnquiryContext";

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar({ categories }: { categories: NavCategory[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { count: enquiryCount } = useEnquiry();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  const iconBtn =
    "relative grid h-11 w-11 place-items-center rounded-lg text-ink transition-colors hover:bg-surface";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="hazard-stripe h-1.5" />

        <nav className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4">
          {/* Hamburger (all screen sizes) */}
          <button onClick={() => setOpen(true)} aria-label="Open menu" className={iconBtn}>
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand font-heading text-base font-bold text-ink">
              JNB
            </span>
            <span className="font-heading text-xl font-bold tracking-wide text-ink">TOOLS</span>
          </Link>

          {/* Page links (tablet and desktop) */}
          <ul className="ml-6 hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive(link.href)
                      ? "bg-brand-light text-ink"
                      : "text-ink-soft hover:bg-surface hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-1">
            {/* Search bar (desktop) */}
            <form onSubmit={handleSearch} className="relative hidden lg:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools, brands or codes…"
                aria-label="Search products"
                className="h-10 w-72 rounded-lg border border-line bg-surface pl-9 pr-3 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/30"
              />
            </form>

            {/* Search icon (mobile and tablet) */}
            <Link href="/search" aria-label="Search" className={`${iconBtn} lg:hidden`}>
              <Search className="h-5 w-5" />
            </Link>

            {/* Enquiry list */}
            <Link
              href="/enquiry"
              aria-label={`Enquiry list, ${enquiryCount} items`}
              className={iconBtn}
            >
              <ClipboardList className="h-5 w-5" />
              {enquiryCount > 0 && (
                <span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-forest px-1 text-[11px] font-bold text-white">
                  {enquiryCount}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </header>

      <SideDrawer
        open={open}
        onClose={() => setOpen(false)}
        categories={categories}
        isActive={isActive}
      />
    </>
  );
}