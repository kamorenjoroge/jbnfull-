"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, Search, ExternalLink } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const titles = [
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin", label: "Dashboard" },
];

export default function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [query, setQuery] = useState("");

  const title =
    titles.find((t) => (t.href === "/admin" ? pathname === "/admin" : pathname.startsWith(t.href)))?.label ?? "Admin";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.name.split(" ")[0] ?? "";
  const initials = (user?.name ?? "A")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/admin/products?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Menu (phone and tablet) */}
        <button
          onClick={onMenuClick}
          aria-label="Open admin menu"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg hover:bg-surface lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Title and greeting */}
        <div className="min-w-0">
          <p className="truncate font-heading text-xl font-bold uppercase leading-none text-ink sm:text-2xl">
            {title}
          </p>
          <p className="mt-0.5 hidden text-xs text-muted sm:block">
            {greeting}, {firstName} 👋
          </p>
        </div>

        {/* Search (tablet and desktop) */}
        <form onSubmit={handleSearch} className="relative ml-auto hidden w-full max-w-sm md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products by name or code…"
            aria-label="Search products"
            className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/30"
          />
        </form>

        {/* Right side */}
        <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
          <Link
            href="/"
            target="_blank"
            className="hidden h-10 items-center gap-2 rounded-lg border border-line px-3 text-sm font-semibold text-ink transition-colors hover:border-brand hover:bg-brand-light sm:inline-flex"
          >
            <ExternalLink className="h-4 w-4" /> View shop
          </Link>

          <div className="flex items-center gap-2.5 pl-1">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand font-heading text-base font-bold text-ink">
              {initials}
            </span>
            <div className="hidden leading-tight xl:block">
              <p className="text-sm font-semibold text-ink">{user?.name}</p>
              <p className="text-xs text-muted">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}