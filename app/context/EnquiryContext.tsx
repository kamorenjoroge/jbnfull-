"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { EnquiryItem } from "@/lib/types";

type EnquiryCtx = {
    items: EnquiryItem[];
  count: number;
  loaded: boolean;
  add: (item: Omit<EnquiryItem, "quantity">) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
  clear: () => void;
  has: (id: string) => boolean;
};

const EnquiryContext = createContext<EnquiryCtx | null>(null);
const KEY = "jnb-enquiry";

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<EnquiryItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load saved items once
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  // Save whenever the list changes
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  const value: EnquiryCtx = {
    items,
  count: items.length,
  loaded,
    add: (item) =>
      setItems((prev) => (prev.some((i) => i.id === item.id) ? prev : [...prev, { ...item, quantity: 1 }])),
    remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
    setQuantity: (id, qty) =>
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i))),
    clear: () => setItems([]),
    has: (id) => items.some((i) => i.id === id),
  };

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error("useEnquiry must be used inside EnquiryProvider");
  return ctx;
}