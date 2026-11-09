import type { Metadata } from "next";
import EnquiryList from "@/app/components/enquiry/EnquiryList";
import { getSiteInfo } from "@/lib/api";

export const metadata: Metadata = {
  title: "Enquiry List | JNB Tools",
  description: "Review the tools you picked and send your enquiry to JNB Tools on WhatsApp.",
};

export default async function EnquiryPage() {
  const site = await getSiteInfo();

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-heading text-4xl font-bold uppercase text-ink">Enquiry List</h1>
      <p className="mt-1 text-muted">Check your items, then send the list to us on WhatsApp.</p>
      <EnquiryList whatsapp={site.whatsapp} />
    </section>
  );
}