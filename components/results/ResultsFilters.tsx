"use client";

import { useMemo } from "react";
import { Filter, RotateCcw } from "lucide-react";
import {
  applySearchFilters,
  getRetailerOptions,
} from "@/lib/product-matching";
import { useSearchStore } from "@/store/useSearchStore";

function FilterToggle({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-4 py-2.5 text-sm transition-colors ${
        active
          ? "border-accent-greenBorder bg-accent-green text-brand-green"
          : "border-surface-lightBorder bg-surface-lightCard text-brand-text-light dark:border-surface-border dark:bg-surface-card dark:text-brand-text-dark"
      }`}
    >
      {label}
    </button>
  );
}

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
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-brand-green" />
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-brand-muted">
              Refine the shortlist
            </p>
          </div>
          <h2 className="text-2xl font-display text-brand-text-light dark:text-brand-text-dark">
            Keep the comparison honest
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-brand-muted">
            These filters help remove accessories, used inventory, and other
            noisy listings so the shortlist stays close to your original
            product intent. {visibleCount} listings currently pass.
          </p>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex items-center gap-2 self-start rounded-full border border-surface-lightBorder bg-surface-lightCard px-4 py-2 text-sm text-brand-text-light shadow-soft transition-colors hover:border-brand-green dark:border-surface-border dark:bg-surface-card dark:text-brand-text-dark"
        >
          <RotateCcw size={14} />
          Reset filters
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <FilterToggle
          active={filters.hideAccessories}
          label="Hide accessories"
          onClick={() =>
            updateFilters({ hideAccessories: !filters.hideAccessories })
          }
        />
        <FilterToggle
          active={filters.hideRefurbished}
          label="Hide refurbished / used"
          onClick={() =>
            updateFilters({ hideRefurbished: !filters.hideRefurbished })
          }
        />
        <FilterToggle
          active={filters.exactMatchesOnly}
          label="Exact matches only"
          onClick={() =>
            updateFilters({ exactMatchesOnly: !filters.exactMatchesOnly })
          }
        />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <label className="field rounded-[1.4rem] px-4 py-3">
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

        <label className="field rounded-[1.4rem] px-4 py-3">
          <span className="mb-2 block text-[11px] font-mono uppercase tracking-[0.18em] text-brand-muted">
            Minimum price
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

        <label className="field rounded-[1.4rem] px-4 py-3">
          <span className="mb-2 block text-[11px] font-mono uppercase tracking-[0.18em] text-brand-muted">
            Maximum price
          </span>
          <input
            type="number"
            min="0"
            inputMode="decimal"
            value={filters.maxPrice}
            onChange={(event) => updateFilters({ maxPrice: event.target.value })}
            placeholder="2000"
            className="w-full bg-transparent text-sm text-brand-text-light outline-none placeholder:text-brand-muted dark:text-brand-text-dark"
          />
        </label>
      </div>
    </section>
  );
}
