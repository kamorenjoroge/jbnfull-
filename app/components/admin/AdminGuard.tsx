"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import AdminShell from "./AdminShell";

// Protects every /admin page except /admin/login
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (loading) return;
    if (!user && !isLoginPage) router.replace("/admin/login"); // not logged in → login
    if (user && isLoginPage) router.replace("/admin"); // already logged in → dashboard
  }, [loading, user, isLoginPage, router]);

  // 1. The login page is always open (no sidebar)
  if (isLoginPage) return <>{children}</>;

  // 2. Still checking, or not logged in: show only a spinner
  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted" />
      </div>
    );
  }

  // 3. Logged in: sidebar + page
  return (
    <div className="min-h-screen">
        <AdminShell>{children}</AdminShell>;
    </div>
  );
}