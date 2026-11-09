// Temporary site details. Later, replaced by getSiteInfo() from api.ts.
import type { SiteInfo } from "./types";

export const siteInfo: SiteInfo = {
  name: "JNB Tools",
  tagline: "The Right Tools for Every Job",
  about:
    "Genuine power tools, hand tools and hardware for Kenya's builders, fundis and homeowners.",
  phone: "+254 712 345 678",
  whatsapp: "254712345678",
  email: "sales@jnbtools.co.ke",
  address: "Kirinyaga Road, Nairobi CBD, Kenya",
  hours: [
    { days: "Mon – Fri", time: "8:00am – 6:00pm" },
    { days: "Saturday", time: "8:00am – 4:00pm" },
    { days: "Sunday", time: "Closed" },
  ],
  mapsUrl: "https://maps.google.com/?q=Kirinyaga+Road+Nairobi",
  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
  },
  promo: {
    title: "Tool Week Offers",
    text: "Up to 20% off selected power tools this week.",
    cta: "Shop Power Tools",
    categorySlug: "power-tools",
  },
};