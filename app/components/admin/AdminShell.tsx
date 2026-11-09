"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the phone menu after moving to another page
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="min-h-screen bg-surface">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-64">
        <AdminTopbar onMenuClick={() => setOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}