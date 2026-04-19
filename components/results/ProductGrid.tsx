"use client";

import { useMemo, useState } from "react";
import { AlertCircle, SearchX } from "lucide-react";
import { applySearchFilters } from "@/lib/product-matching";
import { useSearchStore } from "@/store/useSearchStore";
import ProductCard from "./ProductCard";
import SkeletonCard from "@/components/ui/SkeletonCard";

const DEFAULT_VISIBLE_RESULTS = 12;

function EmptyState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="panel rounded-[2rem] px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-lightHover dark:bg-surface-hover">
        <SearchX size={20} className="text-brand-muted" />
      </div>
      <h3 className="mt-4 text-2xl font-display text-brand-text-light dark:text-brand-text-dark">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-muted">
        {body}
      </p>
    </div>
  );
}

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
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel rounded-[2rem] px-6 py-14 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-red">
          <AlertCircle size={20} className="text-brand-red" />
        </div>
        <h3 className="mt-4 text-2xl font-display text-brand-text-light dark:text-brand-text-dark">
          Search failed
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-muted">
          {error}
        </p>
      </div>
    );
  }

  if (hasSearched && results.length === 0) {
    return (
      <EmptyState
        title="No results found"
        body="Try a more specific query with brand, model, storage, or size details."
      />
    );
  }

  if (hasSearched && filteredResults.length === 0) {
    return (
      <EmptyState
        title="No listings match these filters"
        body="Widen the retailer or price range filters, or allow variants if you want a broader shortlist."
      />
    );
  }

  if (!filteredResults.length) return null;

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-brand-muted">
            Ranked shortlist
          </p>
          <h2 className="text-3xl font-display text-brand-text-light dark:text-brand-text-dark">
            Listings worth reviewing
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-brand-muted">
            Each listing is ordered by match confidence first, then by price
            among the stronger matches so cheaper but irrelevant accessories do
            not dominate the page.
          </p>
        </div>
        <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-brand-muted">
          {filteredResults.length} visible listings
        </div>
      </div>

      <div className="space-y-4">
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
              className="rounded-full border border-surface-lightBorder bg-surface-lightCard px-5 py-2.5 text-sm text-brand-text-light shadow-soft transition-colors hover:border-brand-green dark:border-surface-border dark:bg-surface-card dark:text-brand-text-dark"
            >
              Show more listings
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setVisibleCount(DEFAULT_VISIBLE_RESULTS)}
              className="rounded-full border border-surface-lightBorder bg-surface-lightCard px-5 py-2.5 text-sm text-brand-text-light shadow-soft transition-colors hover:border-brand-green dark:border-surface-border dark:bg-surface-card dark:text-brand-text-dark"
            >
              Show fewer listings
            </button>
          )}
        </div>
      )}
    </section>
  );
}
