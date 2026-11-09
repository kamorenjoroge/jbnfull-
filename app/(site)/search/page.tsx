import type { Metadata } from "next";
import { Suspense } from "react";
import { PackageSearch, MessageCircle } from "lucide-react";
import SearchBar from "../components/search/SearchBar";
import ProductCard from "../components/product/ProductCard";
import CategoryCard from "../categories/CategoryCard";
import { getCategories, getSiteInfo, searchProducts } from "@/lib/api";
import { whatsappLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Search | JNB Tools",
  description: "Search tools by name, brand or product code.",
};

type Props = { searchParams: Promise<{ q?: string }> };

export default function SearchPage({ searchParams }: Props) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-heading text-4xl font-bold uppercase text-ink">Search</h1>
      <Suspense fallback={<ResultsSkeleton />}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

async function SearchResults({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  const [results, site, categories] = await Promise.all([
    searchProducts(query),
    getSiteInfo(),
    getCategories(),
  ]);

  return (
    <>
      <div className="mt-4 max-w-3xl">
        <SearchBar key={query} defaultValue={query} autoFocus={!query} showSuggestions={!query} />
      </div>

      {/* No search yet: show categories */}
      {!query && (
        <div className="mt-10">
          <h2 className="font-heading text-2xl font-bold uppercase text-ink">Browse by Category</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
            {categories.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {query && results.length > 0 && (
        <>
          <p className="mt-6 text-sm text-muted">
            <span className="font-semibold text-ink">{results.length}</span>{" "}
            {results.length === 1 ? "result" : "results"} for{" "}
            <span className="font-semibold text-ink">&ldquo;{query}&rdquo;</span>
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} whatsapp={site.whatsapp} />
            ))}
          </div>
        </>
      )}

      {/* Nothing found */}
      {query && results.length === 0 && (
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface px-6 py-12 text-center">
          <PackageSearch className="h-12 w-12 text-muted" />
          <h2 className="mt-4 text-lg font-bold text-ink">
            No results for &ldquo;{query}&rdquo;
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted">
            Try another word or a brand name. Or ask us. We may have it in the shop even if it&apos;s not listed here.
          </p>
          <a
            href={whatsappLink(site.whatsapp, `Hello JNB Tools, do you have: ${query}?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-forest px-6 font-semibold text-white transition-colors hover:bg-forest-dark"
          >
            <MessageCircle className="h-5 w-5" /> Ask on WhatsApp
          </a>
        </div>
      )}
    </>
  );
}

function ResultsSkeleton() {
  return (
    <div className="mt-4">
      <div className="h-14 max-w-3xl animate-pulse rounded-xl bg-surface" />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-surface" />
        ))}
      </div>
    </div>
  );
}