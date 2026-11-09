"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

type Props = { children: React.ReactNode; activeCount: number; total: number };

export default function MobileFilters({ children, activeCount, total }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-semibold text-ink lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {activeCount > 0 && (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold">
            {activeCount}
          </span>
        )}
      </button>

      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`} inert={!open}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className={`absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-3xl bg-white shadow-2xl transition-transform duration-300 ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-line" />
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <h2 className="font-heading text-xl font-bold uppercase text-ink">Filters</h2>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close filters"
              className="grid h-10 w-10 place-items-center rounded-lg hover:bg-surface"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

          <div className="border-t border-line p-4">
            <button
              onClick={() => setOpen(false)}
              className="h-12 w-full rounded-xl bg-brand font-semibold text-ink transition-colors hover:bg-brand-dark"
            >
              Show {total} {total === 1 ? "result" : "results"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}