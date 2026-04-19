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
    <section className="panel rounded-[2rem] p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-brand-green" />
            <h2 className="text-xl font-display font-semibold text-brand-text-light dark:text-brand-text-dark">
              Refine results
            </h2>
          </div>
          <p className="text-sm text-brand-muted">
            Keep only listings that feel trustworthy for this product search.
            {` `}
            {visibleCount} listings currently pass your filters.
          </p>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex items-center gap-2 self-start rounded-full border border-surface-lightBorder bg-surface-lightCard px-4 py-2 text-sm font-medium text-brand-text-light shadow-soft transition-colors hover:border-brand-green dark:border-surface-border dark:bg-surface-card dark:text-brand-text-dark"
        >
          <RotateCcw size={14} />
          Reset filters
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="field flex items-center justify-between rounded-[1.35rem] px-4 py-3">
            <span className="text-sm font-medium text-brand-text-light dark:text-brand-text-dark">
              Hide accessories
            </span>
            <input
              type="checkbox"
              checked={filters.hideAccessories}
              onChange={(event) =>
                updateFilters({ hideAccessories: event.target.checked })
              }
              className="h-4 w-4 accent-brand-green"
            />
          </label>

          <label className="field flex items-center justify-between rounded-[1.35rem] px-4 py-3">
            <span className="text-sm font-medium text-brand-text-light dark:text-brand-text-dark">
              Hide refurbished / used
            </span>
            <input
              type="checkbox"
              checked={filters.hideRefurbished}
              onChange={(event) =>
                updateFilters({ hideRefurbished: event.target.checked })
              }
              className="h-4 w-4 accent-brand-green"
            />
          </label>

          <label className="field flex items-center justify-between rounded-[1.35rem] px-4 py-3">
            <span className="text-sm font-medium text-brand-text-light dark:text-brand-text-dark">
              Exact matches only
            </span>
            <input
              type="checkbox"
              checked={filters.exactMatchesOnly}
              onChange={(event) =>
                updateFilters({ exactMatchesOnly: event.target.checked })
              }
              className="h-4 w-4 accent-brand-green"
            />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="field rounded-[1.35rem] px-4 py-3">
            <span className="mb-2 block text-[11px] font-mono uppercase tracking-[0.18em] text-brand-muted">
              Retailer
            </span>
            <select
              value={filters.store}
              onChange={(event) => updateFilters({ store: event.target.value })}
              className="w-full bg-transparent text-sm text-brand-text-light outline-none dark:text-brand-text-dark"
            >
              <option value="all">All retailers</option>
              {retailerOptions.map((store) => (
                <option key={store} value={store}>
                  {store}
                </option>
              ))}
            </select>
          </label>

          <label className="field rounded-[1.35rem] px-4 py-3">
            <span className="mb-2 block text-[11px] font-mono uppercase tracking-[0.18em] text-brand-muted">
              Min price
            </span>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              value={filters.minPrice}
              onChange={(event) => updateFilters({ minPrice: event.target.value })}
              placeholder="0"
              className="w-full bg-transparent text-sm text-brand-text-light outline-none placeholder:text-brand-muted dark:text-brand-text-dark"
            />
          </label>

          <label className="field rounded-[1.35rem] px-4 py-3">
            <span className="mb-2 block text-[11px] font-mono uppercase tracking-[0.18em] text-brand-muted">
              Max price
            </span>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              value={filters.maxPrice}
              onChange={(event) => updateFilters({ maxPrice: event.target.value })}
              placeholder="1999"
              className="w-full bg-transparent text-sm text-brand-text-light outline-none placeholder:text-brand-muted dark:text-brand-text-dark"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
