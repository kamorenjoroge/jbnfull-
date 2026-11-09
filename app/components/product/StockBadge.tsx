import type { StockStatus } from "@/lib/types";

const styles: Record<StockStatus, { label: string; box: string; dot: string }> = {
  in_stock: { label: "In stock", box: "bg-forest-light text-forest", dot: "bg-forest" },
  low_stock: { label: "Low stock", box: "bg-brand-light text-amber-700", dot: "bg-brand-dark" },
  out_of_stock: { label: "Out of stock", box: "bg-red-50 text-red-600", dot: "bg-red-500" },
};

export default function StockBadge({ status }: { status: StockStatus }) {
  const s = styles[status];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${s.box}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}