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
      <div
        className="flex flex-col items-center justify-center py-16 gap-3 rounded-xl"
        style={{
          background: isDark ? "#0f0f20" : "#ffffff",
          border: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,77,109,0.1)" }}
        >
          <AlertCircle size={20} style={{ color: "#ff4d6d" }} />
        </div>
        <p
          className="text-sm font-semibold"
          style={{ color: isDark ? "#ffffff" : "#1a1a2e" }}
        >
          Search Failed
        </p>
        <p
          className="text-xs font-mono text-center max-w-xs"
          style={{ color: "#5a5a8a" }}
        >
          {error}
        </p>
      </div>
    );
  }

  // No results
  if (hasSearched && results.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 gap-3 rounded-xl"
        style={{
          background: isDark ? "#0f0f20" : "#ffffff",
          border: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: isDark ? "#1e1e38" : "#f0f0f8" }}
        >
          <SearchX size={20} style={{ color: "#5a5a8a" }} />
        </div>
        <p
          className="text-sm font-semibold"
          style={{ color: isDark ? "#ffffff" : "#1a1a2e" }}
        >
          No results found
        </p>
        <p className="text-xs font-mono" style={{ color: "#5a5a8a" }}>
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
