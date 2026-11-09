"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  Pencil, ExternalLink, Star, Flame, Loader2, Package, SearchX, Plus, ChevronDown, Trash2, // NEW: Trash2
} from "lucide-react";
import DataTable, { type Column } from "./ui/DataTable";
import EmptyState from "./ui/EmptyState";
import ConfirmDialog from "./ui/ConfirmDialog"; // NEW
import { updateProductStock, toggleProductFlag, deleteProduct } from "@/app/admin/products/actions"; // NEW: deleteProduct
import { formatPrice } from "@/lib/utils";
import type { Product, StockStatus } from "@/lib/types";

type Props = {
  products: Product[];
  categoryNames: Record<string, string>;
  hasFilters: boolean;
};

const stockStyles: Record<StockStatus, string> = {
  in_stock: "border-forest/30 bg-forest-light text-forest",
  low_stock: "border-brand/40 bg-brand-light text-amber-700",
  out_of_stock: "border-red-200 bg-red-50 text-red-600",
};

const stockLabels: Record<StockStatus, string> = {
  in_stock: "In stock",
  low_stock: "Low stock",
  out_of_stock: "Out of stock",
};

export default function ProductsTable({ products, categoryNames, hasFilters }: Props) {
  const [pending, setPending] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Product | null>(null); // NEW
  const [deleting, setDeleting] = useState(false); // NEW

  async function handleStock(p: Product, value: StockStatus) {
    setPending(`${p.id}-stock`);
    const res = await updateProductStock(p.id, value);
    setPending(null);
    if (!res.ok) return toast.error(res.error);
    toast.success(`${p.name}: ${stockLabels[value]}`);
  }

  async function handleFlag(p: Product, flag: "isFeatured" | "isPopular") {
    setPending(`${p.id}-${flag}`);
    const res = await toggleProductFlag(p.id, flag);
    setPending(null);
    if (!res.ok) return toast.error(res.error);
    const label = flag === "isFeatured" ? "Featured" : "Popular";
    toast.success(p[flag] ? `Removed from ${label}` : `Added to ${label}`);
  }

  // NEW: clicking "Delete product" in the popup
  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const res = await deleteProduct(toDelete.id);
    setDeleting(false);
    if (!res.ok) return toast.error(res.error);
    toast.success(`"${toDelete.name}" deleted`);
    setToDelete(null);
  }

  const flagButton = (p: Product, flag: "isFeatured" | "isPopular") => {
    const on = p[flag];
    const Icon = flag === "isFeatured" ? Star : Flame;
    const label = flag === "isFeatured" ? "Featured" : "Popular";
    const busy = pending === `${p.id}-${flag}`;
    return (
      <button
        onClick={() => handleFlag(p, flag)}
        disabled={busy}
        aria-pressed={on}
        aria-label={`${on ? "Remove from" : "Add to"} ${label}`}
        title={label}
        className={`grid h-9 w-9 place-items-center rounded-lg border transition-colors disabled:opacity-60 ${
          on ? "border-brand bg-brand text-ink" : "border-line bg-white text-muted hover:border-brand hover:text-ink"
        }`}
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className={`h-4 w-4 ${on ? "fill-current" : ""}`} />}
      </button>
    );
  };

  const columns: Column<Product>[] = [
    {
      header: "Product",
      cell: (p) => (
        <div className="flex items-center gap-3 text-left">
          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-line bg-white">
            <Image src={p.images[0] ?? "/images/p-drill.jpg"} alt="" fill sizes="48px" className="object-contain p-1" />
          </span>
          <div className="min-w-0 max-w-[16rem]">
            <p className="truncate font-semibold text-ink">{p.name}</p>
            <p className="truncate text-xs text-muted">
              {p.sku} · {p.brand}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      cell: (p) => <span className="text-muted">{categoryNames[p.categoryId] ?? "—"}</span>,
    },
    {
      header: "Price",
      align: "right",
      cell: (p) => (
        <div className="whitespace-nowrap">
          <p className="font-semibold text-ink">{formatPrice(p.price)}</p>
          {p.oldPrice && p.oldPrice > p.price && (
            <p className="text-xs text-muted line-through">{formatPrice(p.oldPrice)}</p>
          )}
        </div>
      ),
    },
    {
      header: "Stock",
      cell: (p) => (
        <label className="relative inline-flex items-center">
          <span className="sr-only">Stock for {p.name}</span>
          <select
            value={p.stockStatus}
            onChange={(e) => handleStock(p, e.target.value as StockStatus)}
            disabled={pending === `${p.id}-stock`}
            className={`h-9 appearance-none rounded-full border pl-3 pr-8 text-xs font-semibold outline-none focus:ring-2 focus:ring-brand/30 disabled:opacity-60 ${stockStyles[p.stockStatus]}`}
          >
            <option value="in_stock">In stock</option>
            <option value="low_stock">Low stock</option>
            <option value="out_of_stock">Out of stock</option>
          </select>
          {pending === `${p.id}-stock` ? (
            <Loader2 className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5" />
          )}
        </label>
      ),
    },
    {
      header: "Featured",
      align: "center",
      cell: (p) => flagButton(p, "isFeatured"),
    },
    {
      header: "Popular",
      align: "center",
      cell: (p) => flagButton(p, "isPopular"),
    },
    {
      header: "Actions",
      align: "right",
      cell: (p) => (
        <div className="inline-flex items-center gap-2">
          <Link
            href={`/admin/products/${p.id}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-xs font-semibold text-ink transition-colors hover:border-brand hover:bg-brand-light"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Link>
          <Link
            href={`/product/${p.slug}`}
            target="_blank"
            aria-label={`View ${p.name} in the shop`}
            title="View in shop"
            className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-brand hover:text-ink"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
          {/* NEW: delete button */}
          <button
            onClick={() => setToDelete(p)}
            aria-label={`Delete ${p.name}`}
            title="Delete"
            className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const empty = hasFilters ? (
    <EmptyState Icon={SearchX} title="No products match" text="Try another search word or clear the filters." />
  ) : (
    <EmptyState
      Icon={Package}
      title="No products yet"
      text="Add your first product to start selling."
      action={
        <Link
          href="/admin/products/new"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-ink hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" /> Add product
        </Link>
      }
    />
  );

  return (
    <>
      <DataTable columns={columns} rows={products} rowKey={(p) => p.id} empty={empty} />

      {/* NEW: confirmation popup */}
      <ConfirmDialog
        open={!!toDelete}
        title="Delete product?"
        message={
          <>
            <strong className="text-ink">&ldquo;{toDelete?.name}&rdquo;</strong> ({toDelete?.sku}) will be removed from
            the shop permanently. This can&apos;t be undone.
            <span className="mt-2 block rounded-lg bg-brand-light px-3 py-2 text-xs text-ink">
              Only out of stock for now? Set its stock to <strong>Out of stock</strong> instead, so you keep its details.
            </span>
          </>
        }
        confirmLabel="Delete product"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}