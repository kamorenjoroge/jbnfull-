import type { ReactNode } from "react";

export type Column<T> = {
  header: string; // must be unique, e.g. "Name", "Status", "Actions"
  cell: (row: T) => ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: ReactNode; // shown when there are no rows
};

const alignClass = (a?: Column<unknown>["align"]) =>
  a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left";

export default function DataTable<T>({ columns, rows, rowKey, empty }: Props<T>) {
  if (rows.length === 0) return <>{empty}</>;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      {/* Laptop: table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
            <tr>
              {columns.map((c) => (
                <th key={c.header} scope="col" className={`px-4 py-3 font-semibold ${alignClass(c.align)} ${c.className ?? ""}`}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr key={rowKey(row)} className="transition-colors hover:bg-surface/60">
                {columns.map((c) => (
                  <td key={c.header} className={`px-4 py-3 align-middle ${alignClass(c.align)} ${c.className ?? ""}`}>
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phone: one card per row */}
      <ul className="divide-y divide-line md:hidden">
        {rows.map((row) => (
          <li key={rowKey(row)} className="space-y-2.5 p-4">
            {columns.map((c) => (
              <div key={c.header} className="flex items-center justify-between gap-4 text-sm">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">{c.header}</span>
                <div className="min-w-0 text-right">{c.cell(row)}</div>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}