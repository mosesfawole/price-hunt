"use client";

import { useMemo } from "react";
import {
  AlertTriangle,
  BarChart2,
  Clock3,
  Database,
  ShieldCheck,
  Store,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  applySearchFilters,
  buildSummaryStats,
  getRetailerOptions,
} from "@/lib/product-matching";
import { useSearchStore } from "@/store/useSearchStore";

function formatTimestamp(value: string | null): string {
  if (!value) return "Unknown";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function PriceSummary() {
  const {
    results,
    query,
    filters,
    isCached,
    fetchedAt,
    expiresAt,
    dataSource,
    market,
  } = useSearchStore();

  const filteredResults = useMemo(
    () => applySearchFilters(results, filters),
    [results, filters],
  );

  const summary = useMemo(
    () => buildSummaryStats(filteredResults),
    [filteredResults],
  );

  const retailers = useMemo(() => getRetailerOptions(results), [results]);

  if (!results.length) return null;

  const stats = summary
    ? [
        {
          icon: <TrendingDown size={14} />,
          label: "Lowest",
          value: `$${summary.lowestPrice.toFixed(2)}`,
          accentClass: "border-brand-green",
          iconClass: "text-brand-green",
          sub: summary.lowestStore,
        },
        {
          icon: <TrendingUp size={14} />,
          label: "Highest",
          value: `$${summary.highestPrice.toFixed(2)}`,
          accentClass: "border-brand-red",
          iconClass: "text-brand-red",
          sub: summary.highestStore,
        },
        {
          icon: <BarChart2 size={14} />,
          label: "Average",
          value: `$${summary.averagePrice.toFixed(2)}`,
          accentClass: "border-brand-blue",
          iconClass: "text-brand-blue",
          sub: `${summary.productCount} matched listings`,
        },
        {
          icon: <Zap size={14} />,
          label: "Max Savings",
          value: `$${summary.savings.toFixed(2)}`,
          accentClass: "border-brand-gold",
          iconClass: "text-brand-gold",
          sub: `${summary.savingsPercent}% spread`,
        },
      ]
    : [];

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-surface-lightBorder dark:border-surface-border bg-surface-lightCard dark:bg-surface-card p-4 md:p-5 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm md:text-base font-display font-bold text-brand-text-light dark:text-brand-text-dark">
                Results for{" "}
                <span className="text-brand-green">&quot;{query}&quot;</span>
              </h2>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.2em] ${
                  isCached
                    ? "bg-accent-blue text-brand-blue"
                    : "bg-accent-green text-brand-green"
                }`}
              >
                {isCached ? "Cached Snapshot" : "Fresh Fetch"}
              </span>
            </div>

            <p className="text-xs font-mono text-brand-muted">
              Showing {filteredResults.length} of {results.length} listings.
              Summary cards only use non-related matches.
            </p>
          </div>

          <div className="grid gap-2 text-[11px] font-mono text-brand-muted sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-xl bg-surface-lightHover dark:bg-surface-hover px-3 py-2">
              <Database size={12} className="text-brand-blue" />
              <span>{dataSource}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-surface-lightHover dark:bg-surface-hover px-3 py-2">
              <Store size={12} className="text-brand-green" />
              <span>Market: {market}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-surface-lightHover dark:bg-surface-hover px-3 py-2">
              <Clock3 size={12} className="text-brand-gold" />
              <span>Last checked: {formatTimestamp(fetchedAt)}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-surface-lightHover dark:bg-surface-hover px-3 py-2">
              <ShieldCheck size={12} className="text-brand-green" />
              <span>Expires: {formatTimestamp(expiresAt)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-accent-goldBorder bg-accent-gold px-4 py-3 text-xs font-mono text-brand-muted">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="mt-0.5 text-brand-gold" />
            <p>
              Prices come from aggregated Google Shopping listings, not direct
              live retailer verification. Listings can still be variants,
              bundles, accessories, or stale prices, so confirm product details
              on the retailer page before buying.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-brand-muted">
          <span className="rounded-full border border-surface-lightBorder dark:border-surface-border px-2.5 py-1">
            Retailers in result set: {retailers.length}
          </span>
          <span className="rounded-full border border-surface-lightBorder dark:border-surface-border px-2.5 py-1">
            Accessories hidden: {filters.hideAccessories ? "Yes" : "No"}
          </span>
          <span className="rounded-full border border-surface-lightBorder dark:border-surface-border px-2.5 py-1">
            Refurbished hidden: {filters.hideRefurbished ? "Yes" : "No"}
          </span>
          <span className="rounded-full border border-surface-lightBorder dark:border-surface-border px-2.5 py-1">
            Exact-only: {filters.exactMatchesOnly ? "On" : "Off"}
          </span>
        </div>
      </div>

      {summary ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl border border-surface-lightBorder dark:border-surface-border ${stat.accentClass} border-b-2 bg-surface-lightCard dark:bg-surface-card p-3`}
            >
              <div className="mb-2 flex items-center gap-1.5">
                <span className={stat.iconClass}>{stat.icon}</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-muted">
                  {stat.label}
                </span>
              </div>
              <p className="text-base font-bold font-mono text-brand-text-light dark:text-brand-text-dark">
                {stat.value}
              </p>
              <p className="mt-0.5 text-[10px] font-mono text-brand-muted">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-surface-lightBorder dark:border-surface-border bg-surface-lightCard dark:bg-surface-card p-4 text-sm text-brand-muted">
          The current filters leave only low-confidence related items, so the
          price summary is hidden to avoid misleading insights.
        </div>
      )}
    </section>
  );
}
