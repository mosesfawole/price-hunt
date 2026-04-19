"use client";

import { useMemo, useState } from "react";
import { AlertCircle, SearchX } from "lucide-react";
import { applySearchFilters } from "@/lib/product-matching";
import { useSearchStore } from "@/store/useSearchStore";
import ProductCard from "./ProductCard";
import SkeletonCard from "@/components/ui/SkeletonCard";

const DEFAULT_VISIBLE_RESULTS = 12;

export default function ProductGrid() {
  const { results, filters, isLoading, error, hasSearched } = useSearchStore();
  const [visibleCount, setVisibleCount] = useState(DEFAULT_VISIBLE_RESULTS);

  const filteredResults = useMemo(
    () => applySearchFilters(results, filters),
    [results, filters],
  );

  const lowestRelevantPrice = useMemo(() => {
    const eligible = filteredResults.filter(
      (product) => product.match.confidence !== "related",
    );

    if (!eligible.length) return null;

    return Math.min(...eligible.map((product) => product.price));
  }, [filteredResults]);

  const visibleResults = filteredResults.slice(0, visibleCount);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(6)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-surface-lightBorder dark:border-surface-border bg-surface-lightCard dark:bg-surface-card py-16">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-red">
          <AlertCircle size={20} className="text-brand-red" />
        </div>
        <p className="text-sm font-semibold text-brand-text-light dark:text-brand-text-dark">
          Search Failed
        </p>
        <p className="max-w-xs text-center text-xs font-mono text-brand-muted">
          {error}
        </p>
      </div>
    );
  }

  if (hasSearched && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-surface-lightBorder dark:border-surface-border bg-surface-lightCard dark:bg-surface-card py-16">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-lightHover dark:bg-surface-hover">
          <SearchX size={20} className="text-brand-muted" />
        </div>
        <p className="text-sm font-semibold text-brand-text-light dark:text-brand-text-dark">
          No results found
        </p>
        <p className="text-xs font-mono text-brand-muted">
          Try a different search term.
        </p>
      </div>
    );
  }

  if (hasSearched && filteredResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-surface-lightBorder dark:border-surface-border bg-surface-lightCard dark:bg-surface-card py-16">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-lightHover dark:bg-surface-hover">
          <SearchX size={20} className="text-brand-muted" />
        </div>
        <p className="text-sm font-semibold text-brand-text-light dark:text-brand-text-dark">
          No listings match the current filters
        </p>
        <p className="max-w-sm text-center text-xs font-mono text-brand-muted">
          Try widening the retailer or price range filters, or allow variants
          and related listings.
        </p>
      </div>
    );
  }

  if (!filteredResults.length) return null;

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-display font-semibold text-brand-text-light dark:text-brand-text-dark">
            Ranked listings
          </h2>
          <p className="text-sm text-brand-muted">
            Best matches appear first, then lower prices among stronger matches.
          </p>
        </div>
        <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-brand-muted">
          {filteredResults.length} visible listings
        </div>
      </div>

      <div className="space-y-3">
        {visibleResults.map((product, index) => (
          <ProductCard
            key={`${product.store}-${product.link}-${product.price}`}
            product={product}
            rank={index}
            lowestRelevantPrice={lowestRelevantPrice}
          />
        ))}
      </div>

      {filteredResults.length > DEFAULT_VISIBLE_RESULTS && (
        <div className="flex justify-center">
          {visibleCount < filteredResults.length ? (
            <button
              type="button"
              onClick={() =>
                setVisibleCount((count) =>
                  Math.min(count + DEFAULT_VISIBLE_RESULTS, filteredResults.length),
                )
              }
              className="rounded-full border border-surface-lightBorder bg-surface-lightCard px-5 py-2.5 text-sm font-medium text-brand-text-light shadow-soft transition-colors hover:border-brand-green dark:border-surface-border dark:bg-surface-card dark:text-brand-text-dark"
            >
              Show more results
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setVisibleCount(DEFAULT_VISIBLE_RESULTS)}
              className="rounded-full border border-surface-lightBorder bg-surface-lightCard px-5 py-2.5 text-sm font-medium text-brand-text-light shadow-soft transition-colors hover:border-brand-green dark:border-surface-border dark:bg-surface-card dark:text-brand-text-dark"
            >
              Show fewer results
            </button>
          )}
        </div>
      )}
    </section>
  );
}
