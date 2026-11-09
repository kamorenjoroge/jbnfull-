"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Trash2, MessageCircle, ClipboardList, Loader2 } from "lucide-react";
import { useEnquiry } from "@/app/context/EnquiryContext";
import { formatPrice, whatsappLink } from "@/lib/utils";

export default function EnquiryList({ whatsapp }: { whatsapp: string }) {
  const { items, loaded, remove, setQuantity, clear } = useEnquiry();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  function buildMessage() {
    const lines = items.map(
      (i, n) => `${n + 1}. ${i.name} (${i.sku}) x${i.quantity} = ${formatPrice(i.price * i.quantity)}`
    );
    return [
      "Hello JNB Tools, I'd like to enquire about these items:",
      "",
      ...lines,
      "",
      `Estimated total: ${formatPrice(total)}`,
      name.trim() && `Name: ${name.trim()}`,
      location.trim() && `Location: ${location.trim()}`,
      "",
      "Are they available?",
    ]
      .filter((l): l is string => typeof l === "string" && l !== "")
      .join("\n")
      .replace("?\n\nEstimated", "?\n\nEstimated");
  }

  function handleClear() {
    if (confirm("Remove all items from your enquiry list?")) clear();
  }

  // Waiting for saved items to load
  if (!loaded) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted" />
      </div>
    );
  }

  // Empty list
  if (items.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-light">
          <ClipboardList className="h-8 w-8 text-ink" />
        </span>
        <h2 className="mt-4 text-lg font-bold text-ink">Your enquiry list is empty</h2>
        <p className="mt-1 max-w-sm text-sm text-muted">
          Tap the clipboard icon on any product to add it here, then send the whole list to us on WhatsApp.
        </p>
        <Link
          href="/categories"
          className="mt-6 inline-flex h-12 items-center rounded-xl bg-brand px-6 font-semibold text-ink transition-colors hover:bg-brand-dark"
        >
          Browse Categories
        </Link>
      </div>
    );
  }

  const input =
    "h-12 w-full rounded-xl border border-line bg-white px-4 text-[15px] outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30";

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-3 lg:items-start">
      {/* Items */}
      <ul className="space-y-3 lg:col-span-2">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3 rounded-2xl border border-line bg-white p-3 sm:gap-4 sm:p-4">
            <Link
              href={`/product/${item.slug}`}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-line bg-white sm:h-24 sm:w-24"
            >
              <Image
                src={item.image || "/images/p-drill.jpg"}
                alt={item.name}
                fill
                sizes="96px"
                className="object-contain p-1.5"
              />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link
                    href={`/product/${item.slug}`}
                    className="line-clamp-2 text-sm font-semibold text-ink hover:text-brand-dark sm:text-[15px]"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted">Code: {item.sku}</p>
                </div>
                <button
                  onClick={() => remove(item.id)}
                  aria-label={`Remove ${item.name}`}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                {/* Quantity stepper */}
                <div className="flex items-center rounded-lg border border-line">
                  <button
                    onClick={() => setQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                    className="grid h-9 w-9 place-items-center text-ink disabled:opacity-30"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => setQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                    className="grid h-9 w-9 place-items-center text-ink"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-heading text-lg font-bold text-ink">{formatPrice(item.price * item.quantity)}</p>
                  {item.quantity > 1 && <p className="text-xs text-muted">{formatPrice(item.price)} each</p>}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Summary */}
      <aside className="rounded-2xl border border-line bg-white p-5 lg:sticky lg:top-24">
        <h2 className="font-heading text-xl font-bold uppercase text-ink">Summary</h2>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-muted">
            <span>Items</span>
            <span>{items.reduce((n, i) => n + i.quantity, 0)}</span>
          </div>
          <div className="flex justify-between border-t border-line pt-3">
            <span className="font-semibold text-ink">Estimated total</span>
            <span className="font-heading text-2xl font-bold text-ink">{formatPrice(total)}</span>
          </div>
          <p className="text-xs text-muted">Final price and delivery are confirmed on WhatsApp.</p>
        </div>

        <div className="mt-5 space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            aria-label="Your name"
            className={input}
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Delivery location (optional)"
            aria-label="Delivery location"
            className={input}
          />
        </div>

        <a
          href={whatsappLink(whatsapp, buildMessage())}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex h-12 items-center justify-center gap-2 rounded-xl bg-forest font-semibold text-white transition-colors hover:bg-forest-dark"
        >
          <MessageCircle className="h-5 w-5" /> Send on WhatsApp
        </a>

        <button
          onClick={handleClear}
          className="mt-3 h-11 w-full rounded-xl text-sm font-medium text-muted transition-colors hover:bg-red-50 hover:text-red-600"
        >
          Clear list
        </button>
      </aside>
    </div>
  );
}