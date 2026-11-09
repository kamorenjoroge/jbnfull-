"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, FolderTree, MessageSquare, Settings,
  ExternalLink, LogOut, X,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const items = [
  { label: "Dashboard", href: "/admin", Icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", Icon: Package },
  { label: "Categories", href: "/admin/categories", Icon: FolderTree },
  { label: "Messages", href: "/admin/messages", Icon: MessageSquare },
  { label: "Settings", href: "/admin/settings", Icon: Settings },
];

type Props = { open: boolean; onClose: () => void };

export default function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  function handleLogout() {
    logout();
    router.replace("/admin/login");
  }

  const content = (
    <div className="flex h-full flex-col">
      {/* Logo (same height as the top bar) */}
      <div className="flex h-16 items-center gap-2 px-5">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand font-heading text-base font-bold text-ink">
          JNB
        </span>
        <div>
          <p className="font-heading text-lg font-bold leading-none tracking-wide">TOOLS</p>
          <p className="text-xs text-white/60">Admin panel</p>
        </div>
      </div>
      <div className="hazard-stripe h-1.5" />

      {/* Menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">Menu</p>
        {items.map(({ label, href, Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
              isActive(href) ? "bg-brand text-ink" : "text-white/75 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="h-5 w-5" /> {label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="h-5 w-5" /> View website
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/75 hover:bg-red-500/20 hover:text-red-300"
        >
          <LogOut className="h-5 w-5" /> Log out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-ink text-white lg:block">{content}</aside>

      {/* Phone drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`} inert={!open}>
        <div
          onClick={onClose}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-ink text-white shadow-2xl transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={onClose}
            aria-label="Close admin menu"
            className="absolute right-3 top-3.5 grid h-9 w-9 place-items-center rounded-lg text-white/70 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
          {content}
        </aside>
      </div>
    </>
  );
}