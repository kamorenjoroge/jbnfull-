"use client";

import { ClipboardPlus, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";
import { useEnquiry } from "@/app/context/EnquiryContext";
import type { EnquiryItem } from "@/lib/types";

type Props = { item: Omit<EnquiryItem, "quantity">; variant?: "icon" | "full" };

export default function AddToEnquiryButton({ item, variant = "icon" }: Props) {
  const { add, has } = useEnquiry();
  const added = has(item.id);
  const Icon = added ? ClipboardCheck : ClipboardPlus;

  function handleClick() {
    if (added) return toast.info("Already in your enquiry list");
    add(item);
    toast.success("Added to your enquiry list");
  }

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        aria-label={added ? "In enquiry list" : "Add to enquiry list"}
        className={`grid h-10 w-10 place-items-center rounded-full border shadow-sm transition-colors ${
          added ? "border-forest bg-forest text-white" : "border-line bg-white text-ink hover:bg-brand"
        }`}
      >
        <Icon className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-6 font-semibold transition-colors ${
        added ? "border-forest bg-forest-light text-forest" : "border-line bg-surface text-ink hover:bg-brand-light"
      }`}
    >
      <Icon className="h-5 w-5" />
      {added ? "In enquiry list" : "Add to enquiry"}
    </button>
  );
}