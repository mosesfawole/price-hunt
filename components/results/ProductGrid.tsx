"use client";

import { useMemo } from "react";
import { AlertCircle, SearchX } from "lucide-react";
import { applySearchFilters } from "@/lib/product-matching";
import { useSearchStore } from "@/store/useSearchStore";
import ProductCard from "./ProductCard";
import SkeletonCard from "@/components/ui/SkeletonCard";

export default function ProductGrid() {
  const { results, filters, isLoading, error, hasSearched } = useSearchStore();

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
    <div className="space-y-3">
      {filteredResults.map((product, index) => (
        <ProductCard
          key={`${product.store}-${product.link}-${product.price}`}
          product={product}
          rank={index}
          lowestRelevantPrice={lowestRelevantPrice}
        />
      ))}
    </div>
  );
}
