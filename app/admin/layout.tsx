import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Barlow_Condensed } from "next/font/google";
import { Toaster } from "sonner";
import { Loader2 } from "lucide-react";
import { AuthProvider } from "@/app/context/AuthContext";
import AdminGuard from "@/app/components/admin/AdminGuard";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const barlow = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-barlow" });

export const metadata: Metadata = {
  title: "Admin | JNB Tools",
  robots: { index: false, follow: false },
};

function AdminLoading() {
  return (
    <div className="grid min-h-screen place-items-center bg-surface">
      <Loader2 className="h-8 w-8 animate-spin text-muted" />
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${barlow.variable}`}>
      <body className="bg-surface font-sans antialiased">
        <AuthProvider>
          <Suspense fallback={<AdminLoading />}>
            <AdminGuard>{children}</AdminGuard>
          </Suspense>
        </AuthProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}