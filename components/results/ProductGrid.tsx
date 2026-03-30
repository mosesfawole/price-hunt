"use client";
import { useSearchStore } from "@/store/useSearchStore";
import ProductCard from "./ProductCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { AlertCircle, SearchX } from "lucide-react";

export default function ProductGrid() {
  const { results, isLoading, error, hasSearched, isDark } = useSearchStore();
  console.log(
    "results:",
    results,
    "hasSearched:",
    hasSearched,
    "isLoading:",
    isLoading,
  );
  const lowestPrice = results.length > 0 ? results[0].price : 0;
  const highestPrice =
    results.length > 0 ? results[results.length - 1].price : 0;

  // Loading skeletons
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-xl bg-surface-lightCard dark:bg-surface-card border border-surface-lightBorder dark:border-surface-border">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-accent-red">
          <AlertCircle size={20} className="text-brand-red" />
        </div>
        <p className="text-sm font-semibold text-brand-text-light dark:text-brand-text-dark">
          Search Failed
        </p>
        <p className="text-xs font-mono text-center max-w-xs text-brand-muted">
          {error}
        </p>
      </div>
    );
  }

  // No results
  if (hasSearched && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-xl bg-surface-lightCard dark:bg-surface-card border border-surface-lightBorder dark:border-surface-border">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-lightHover dark:bg-surface-hover">
          <SearchX size={20} className="text-brand-muted" />
        </div>
        <p className="text-sm font-semibold text-brand-text-light dark:text-brand-text-dark">
          No results found
        </p>
        <p className="text-xs font-mono text-brand-muted">
          Try a different search term
        </p>
      </div>
    );
  }

  // Results
  if (results.length > 0) {
    return (
      <div className="space-y-3">
        {results.map((product, i) => (
          <ProductCard
            key={`${product.store}-${i}`}
            product={product}
            rank={i}
            lowestPrice={lowestPrice}
            highestPrice={highestPrice}
          />
        ))}
      </div>
    );
  }

  return null;
}
