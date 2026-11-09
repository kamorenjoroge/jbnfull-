"use client";

import Link from "next/link";
import { useEffect } from "react";
import { X, ChevronRight, LayoutGrid } from "lucide-react";
import { navLinks } from "./Navbar";
import type { NavCategory } from "@/lib/nav-categories";

type Props = {
  open: boolean;
  onClose: () => void;
  categories: NavCategory[];
  isActive: (href: string) => boolean;
};

export default function SideDrawer({ open, onClose, categories, isActive }: Props) {
  // Lock page scroll and close with the Escape key while open
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} inert={!open}>
      {/* Dark backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        className={`absolute left-0 top-0 flex h-full w-80 max-w-[85vw] flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="hazard-stripe h-1.5" />

        {/* Title and close button */}
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand font-heading text-sm font-bold text-ink">
              JNB
            </span>
            <span className="font-heading text-lg font-bold tracking-wide text-ink">JNB TOOLS</span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-10 w-10 place-items-center rounded-lg text-ink hover:bg-surface"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          {/* Page links */}
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={`block rounded-lg px-3 py-3 text-[15px] font-semibold transition-colors ${
                    isActive(link.href) ? "bg-brand-light text-ink" : "text-ink-soft hover:bg-surface"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Categories */}
          <p className="mb-2 mt-6 px-3 font-heading text-sm font-bold uppercase tracking-wider text-muted">
            Shop by Category
          </p>
          <ul className="space-y-0.5">
            {categories.map((cat) => {
              const href = `/categories/${cat.slug}`;
              return (
                <li key={cat.slug}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      isActive(href)
                        ? "bg-brand-light font-semibold text-ink"
                        : "text-ink-soft hover:bg-surface hover:text-ink"
                    }`}
                  >
                    {cat.name}
                    <ChevronRight className="h-4 w-4 text-muted" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom button */}
        <div className="border-t border-line p-4">
          <Link
            href="/categories"
            onClick={onClose}
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-brand font-semibold text-ink transition-colors hover:bg-brand-dark"
          >
            <LayoutGrid className="h-4 w-4" />
            View All Categories
          </Link>
        </div>
      </aside>
    </div>
  );
}