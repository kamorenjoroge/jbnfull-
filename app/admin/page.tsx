import Link from "next/link";
import { Package, FolderTree, AlertTriangle, XCircle, Plus, Megaphone, ChevronRight } from "lucide-react";
import StockBadge from "@/app/components/product/StockBadge";
import { getCategories, getProducts } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboard() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const low = products.filter((p) => p.stockStatus === "low_stock");
  const out = products.filter((p) => p.stockStatus === "out_of_stock");
  const alerts = [...out, ...low]; // out of stock first

  const stats = [
    { label: "Products", value: products.length, Icon: Package, box: "bg-brand text-ink", href: "/admin/products" },
    { label: "Categories", value: categories.length, Icon: FolderTree, box: "bg-ink text-brand", href: "/admin/categories" },
    { label: "Low stock", value: low.length, Icon: AlertTriangle, box: "bg-brand-light text-amber-700", href: "/admin/products?stock=low_stock" },
    { label: "Out of stock", value: out.length, Icon: XCircle, box: "bg-red-50 text-red-600", href: "/admin/products?stock=out_of_stock" },
  ];

  const actions = [
    { label: "Add product", href: "/admin/products/new", Icon: Plus },
    { label: "Add category", href: "/admin/categories/new", Icon: FolderTree },
    { label: "Edit promo banner", href: "/admin/settings", Icon: Megaphone },
  ];

  return (
    <>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, Icon, box, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-2xl border border-line bg-white p-4 transition hover:shadow-lg sm:p-5"
          >
            <span className={`grid h-10 w-10 place-items-center rounded-xl ${box}`}>
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-3 font-heading text-3xl font-bold text-ink">{value}</p>
            <p className="text-sm text-muted">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Stock alerts */}
        <div className="rounded-2xl border border-line bg-white lg:col-span-2">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-heading text-lg font-bold uppercase text-ink">Stock Alerts</h2>
            <span className="text-xs text-muted">{alerts.length} items</span>
          </div>
          {alerts.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted">All products are in stock. 👍</p>
          ) : (
            <ul className="divide-y divide-line">
              {alerts.slice(0, 8).map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-surface"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{p.name}</p>
                      <p className="text-xs text-muted">
                        {p.sku} · {formatPrice(p.price)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <StockBadge status={p.stockStatus} />
                      <ChevronRight className="h-4 w-4 text-muted" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-heading text-lg font-bold uppercase text-ink">Quick Actions</h2>
          <div className="mt-4 space-y-2">
            {actions.map(({ label, href, Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand hover:bg-brand-light"
              >
                <Icon className="h-5 w-5" /> {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}