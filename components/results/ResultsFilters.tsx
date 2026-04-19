"use client";

import { useMemo } from "react";
import { Filter, RotateCcw } from "lucide-react";
import {
  applySearchFilters,
  getRetailerOptions,
} from "@/lib/product-matching";
import { useSearchStore } from "@/store/useSearchStore";

export default function ResultsFilters() {
  const { results, filters, updateFilters, resetFilters } = useSearchStore();

  const retailerOptions = useMemo(() => getRetailerOptions(results), [results]);
  const visibleCount = useMemo(
    () => applySearchFilters(results, filters).length,
    [results, filters],
  );

  if (!results.length) return null;

  return (
    <section className="rounded-2xl border border-surface-lightBorder dark:border-surface-border bg-surface-lightCard dark:bg-surface-card p-4 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-brand-green" />
          <div>
            <p className="text-sm font-display font-semibold text-brand-text-light dark:text-brand-text-dark">
              Filters
            </p>
            <p className="text-xs font-mono text-brand-muted">
              {visibleCount} visible listings from {results.length} total
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex items-center gap-2 rounded-lg border border-surface-lightBorder dark:border-surface-border px-3 py-2 text-xs font-mono text-brand-muted transition-colors hover:text-brand-text-light dark:hover:text-brand-text-dark"
        >
          <RotateCcw size={12} />
          Reset filters
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <label className="flex items-center justify-between rounded-xl bg-surface-lightHover dark:bg-surface-hover px-3 py-2 text-sm text-brand-text-light dark:text-brand-text-dark">
          <span>Hide accessories</span>
          <input
            type="checkbox"
            checked={filters.hideAccessories}
            onChange={(event) =>
              updateFilters({ hideAccessories: event.target.checked })
            }
            className="h-4 w-4 accent-green-500"
          />
        </label>

        <label className="flex items-center justify-between rounded-xl bg-surface-lightHover dark:bg-surface-hover px-3 py-2 text-sm text-brand-text-light dark:text-brand-text-dark">
          <span>Hide refurbished / used</span>
          <input
            type="checkbox"
            checked={filters.hideRefurbished}
            onChange={(event) =>
              updateFilters({ hideRefurbished: event.target.checked })
            }
            className="h-4 w-4 accent-green-500"
          />
        </label>

        <label className="flex items-center justify-between rounded-xl bg-surface-lightHover dark:bg-surface-hover px-3 py-2 text-sm text-brand-text-light dark:text-brand-text-dark">
          <span>Exact matches only</span>
          <input
            type="checkbox"
            checked={filters.exactMatchesOnly}
            onChange={(event) =>
              updateFilters({ exactMatchesOnly: event.target.checked })
            }
            className="h-4 w-4 accent-green-500"
          />
        </label>

        <label className="space-y-2 rounded-xl bg-surface-lightHover dark:bg-surface-hover px-3 py-3">
          <span className="block text-xs font-mono uppercase tracking-[0.2em] text-brand-muted">
            Retailer
          </span>
          <select
            value={filters.store}
            onChange={(event) => updateFilters({ store: event.target.value })}
            className="w-full rounded-lg border border-surface-lightBorder dark:border-surface-border bg-transparent px-3 py-2 text-sm text-brand-text-light outline-none dark:text-brand-text-dark"
          >
            <option value="all">All retailers</option>
            {retailerOptions.map((store) => (
              <option key={store} value={store}>
                {store}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 rounded-xl bg-surface-lightHover dark:bg-surface-hover px-3 py-3">
          <span className="block text-xs font-mono uppercase tracking-[0.2em] text-brand-muted">
            Min price
          </span>
          <input
            type="number"
            min="0"
            inputMode="decimal"
            value={filters.minPrice}
            onChange={(event) => updateFilters({ minPrice: event.target.value })}
            placeholder="0"
            className="w-full rounded-lg border border-surface-lightBorder dark:border-surface-border bg-transparent px-3 py-2 text-sm text-brand-text-light outline-none dark:text-brand-text-dark"
          />
        </label>

        <label className="space-y-2 rounded-xl bg-surface-lightHover dark:bg-surface-hover px-3 py-3">
          <span className="block text-xs font-mono uppercase tracking-[0.2em] text-brand-muted">
            Max price
          </span>
          <input
            type="number"
            min="0"
            inputMode="decimal"
            value={filters.maxPrice}
            onChange={(event) => updateFilters({ maxPrice: event.target.value })}
            placeholder="9999"
            className="w-full rounded-lg border border-surface-lightBorder dark:border-surface-border bg-transparent px-3 py-2 text-sm text-brand-text-light outline-none dark:text-brand-text-dark"
          />
        </label>
      </div>
    </section>
  );
}
