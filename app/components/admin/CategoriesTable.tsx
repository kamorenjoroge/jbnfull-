"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Pencil, Trash2, Loader2, FolderTree, SearchX, Plus } from "lucide-react";
import DataTable, { type Column } from "./ui/DataTable";
import EmptyState from "./ui/EmptyState";
import ConfirmDialog from "./ui/ConfirmDialog"; // NEW
import CategoryIcon from "./CategoryIcon";
import { toggleCategoryActive, deleteCategory } from "@/app/admin/categories/actions"; // NEW: deleteCategory
import type { CategoryWithCount } from "@/lib/types";

type Props = {
  categories: CategoryWithCount[];
  allCategories: CategoryWithCount[];
  hasSearch: boolean;
};

export default function CategoriesTable({ categories, allCategories, hasSearch }: Props) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<CategoryWithCount | null>(null); // NEW
  const [deleting, setDeleting] = useState(false); // NEW

  const parentName = (id: string | null) => (id ? allCategories.find((c) => c.id === id)?.name ?? "—" : "—");

  async function handleToggle(cat: CategoryWithCount) {
    setPendingId(cat.id);
    const res = await toggleCategoryActive(cat.id);
    setPendingId(null);
    if (!res.ok) return toast.error(res.error);
    toast.success(cat.isActive ? `"${cat.name}" is now hidden from the shop` : `"${cat.name}" is now visible in the shop`);
  }

  // NEW: clicking the bin
  function handleDeleteClick(cat: CategoryWithCount) {
    if (cat.productCount > 0) {
      return toast.error(
        `"${cat.name}" has ${cat.productCount} product${cat.productCount === 1 ? "" : "s"}. Move or delete them first, or hide the category instead.`,
        cat.isActive ? { action: { label: "Hide it", onClick: () => handleToggle(cat) } } : undefined
      );
    }
    setToDelete(cat);
  }

  // NEW: clicking "Delete category" in the popup
  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const res = await deleteCategory(toDelete.id);
    setDeleting(false);
    if (!res.ok) return toast.error(res.error);
    toast.success(`"${toDelete.name}" deleted`);
    setToDelete(null);
  }

  const columns: Column<CategoryWithCount>[] = [
    {
      header: "Category",
      cell: (c) => (
        <div className="flex items-center gap-3 text-left">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-light text-ink">
            <CategoryIcon name={c.icon} className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">{c.name}</p>
            <p className="truncate text-xs text-muted">/categories/{c.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Parent",
      cell: (c) => <span className="text-muted">{parentName(c.parentId)}</span>,
    },
    {
      header: "Products",
      align: "center",
      cell: (c) => (
        <span className="inline-grid h-7 min-w-7 place-items-center rounded-full bg-surface px-2 text-xs font-bold text-ink">
          {c.productCount}
        </span>
      ),
    },
    {
      header: "Order",
      align: "center",
      cell: (c) => <span className="font-medium text-ink">{c.sortOrder}</span>,
    },
    {
      header: "Status",
      align: "center",
      cell: (c) => (
        <button
          onClick={() => handleToggle(c)}
          disabled={pendingId === c.id}
          aria-label={c.isActive ? `Hide ${c.name} from the shop` : `Show ${c.name} in the shop`}
          className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors disabled:opacity-60 ${
            c.isActive
              ? "bg-forest-light text-forest hover:bg-forest hover:text-white"
              : "bg-surface text-muted hover:bg-ink hover:text-white"
          }`}
        >
          {pendingId === c.id ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : c.isActive ? (
            <Eye className="h-3.5 w-3.5" />
          ) : (
            <EyeOff className="h-3.5 w-3.5" />
          )}
          {c.isActive ? "Visible" : "Hidden"}
        </button>
      ),
    },
    {
      header: "Actions",
      align: "right",
      cell: (c) => (
        <div className="inline-flex items-center gap-2">
          <Link
            href={`/admin/categories/${c.id}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-xs font-semibold text-ink transition-colors hover:border-brand hover:bg-brand-light"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Link>
          {/* NEW: delete button */}
          <button
            onClick={() => handleDeleteClick(c)}
            aria-label={`Delete ${c.name}`}
            className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const empty = hasSearch ? (
    <EmptyState Icon={SearchX} title="No categories match your search" text="Try another word, or clear the search." />
  ) : (
    <EmptyState
      Icon={FolderTree}
      title="No categories yet"
      text="Add your first category, then you can add products to it."
      action={
        <Link
          href="/admin/categories/new"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-ink hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" /> Add category
        </Link>
      }
    />
  );

  return (
    <>
      <DataTable columns={columns} rows={categories} rowKey={(c) => c.id} empty={empty} />

      {/* NEW: confirmation popup */}
      <ConfirmDialog
        open={!!toDelete}
        title="Delete category?"
        message={
          <>
            <strong className="text-ink">&ldquo;{toDelete?.name}&rdquo;</strong> will be removed permanently. This
            can&apos;t be undone.
          </>
        }
        confirmLabel="Delete category"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}