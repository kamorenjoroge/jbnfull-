import type { Metadata } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import { Toaster } from "sonner";
import Navbar from "../components/layout/Navbar";
import { navCategories } from "@/lib/nav-categories";
import Footer from "../components/layout/Footer";
import { siteInfo } from "@/lib/site-config";
import { EnquiryProvider } from "../context/EnquiryContext";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "JNB Tools | Quality Tools for Every Job",
  description:
    "Power tools, hand tools, masonry, welding, electrical, solar and more. Order easily on WhatsApp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${barlow.variable}`}>
      <body className="font-sans antialiased">
         <EnquiryProvider>
        <Navbar categories={navCategories} />
        <main>{children}</main>
        <Footer site={siteInfo} categories={navCategories} />
        </EnquiryProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}