"use client";

import { useMemo } from "react";
import {
  AlertTriangle,
  ArrowRight,
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
          icon: <TrendingDown size={16} />,
          label: "Lowest relevant price",
          value: `$${summary.lowestPrice.toFixed(2)}`,
          accentClass: "border-brand-green",
          iconClass: "text-brand-green",
          sub: summary.lowestStore,
        },
        {
          icon: <TrendingUp size={16} />,
          label: "Highest relevant price",
          value: `$${summary.highestPrice.toFixed(2)}`,
          accentClass: "border-brand-red",
          iconClass: "text-brand-red",
          sub: summary.highestStore,
        },
        {
          icon: <BarChart2 size={16} />,
          label: "Average of strong matches",
          value: `$${summary.averagePrice.toFixed(2)}`,
          accentClass: "border-brand-blue",
          iconClass: "text-brand-blue",
          sub: `${summary.productCount} matched listings`,
        },
        {
          icon: <Zap size={16} />,
          label: "Price spread",
          value: `$${summary.savings.toFixed(2)}`,
          accentClass: "border-brand-gold",
          iconClass: "text-brand-gold",
          sub: `${summary.savingsPercent}% difference`,
        },
      ]
    : [];

  return (
    <section className="space-y-4">
      <div className="panel rounded-[2rem] p-5 md:p-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.9fr)]">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-accent-greenBorder bg-accent-green px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-brand-green">
                  Search snapshot
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] ${
                    isCached
                      ? "border border-accent-blueBorder bg-accent-blue text-brand-blue"
                      : "border border-accent-greenBorder bg-accent-green text-brand-green"
                  }`}
                >
                  {isCached ? "Cached" : "Freshly fetched"}
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-display font-semibold leading-tight text-brand-text-light dark:text-brand-text-dark">
                  Results for &quot;{query}&quot;
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-brand-muted">
                  We rank listings by how closely they match the product you
                  searched for, then compare prices across the strongest
                  matches. Low-confidence related items do not affect the key
                  price insights below.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-[1.5rem] border border-surface-lightBorder bg-surface-lightCard p-4 shadow-soft dark:border-surface-border dark:bg-surface-card ${stat.accentClass}`}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className={stat.iconClass}>{stat.icon}</span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-brand-muted">
                      {stat.label}
                    </span>
                  </div>
                  <p className="text-2xl font-semibold tracking-tight text-brand-text-light dark:text-brand-text-dark">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-brand-muted">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-[1.5rem] border border-surface-lightBorder bg-surface-lightCard p-4 shadow-soft dark:border-surface-border dark:bg-surface-card">
              <div className="mb-3 flex items-center gap-2">
                <Database size={15} className="text-brand-blue" />
                <h3 className="text-sm font-semibold text-brand-text-light dark:text-brand-text-dark">
                  Data transparency
                </h3>
              </div>
              <div className="space-y-2.5 text-sm text-brand-muted">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center gap-2">
                    <Store size={13} />
                    Source
                  </span>
                  <span className="max-w-[13rem] text-right text-brand-text-light dark:text-brand-text-dark">
                    {dataSource}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center gap-2">
                    <ArrowRight size={13} />
                    Market
                  </span>
                  <span className="text-brand-text-light dark:text-brand-text-dark">
                    {market}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center gap-2">
                    <Clock3 size={13} />
                    Last checked
                  </span>
                  <span className="text-right text-brand-text-light dark:text-brand-text-dark">
                    {formatTimestamp(fetchedAt)}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck size={13} />
                    Cache expiry
                  </span>
                  <span className="text-right text-brand-text-light dark:text-brand-text-dark">
                    {formatTimestamp(expiresAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-accent-goldBorder bg-accent-gold p-4 text-sm leading-6 text-brand-muted">
              <div className="flex items-start gap-2">
                <AlertTriangle
                  size={16}
                  className="mt-1 shrink-0 text-brand-gold"
                />
                <p>
                  These are aggregated shopping listings, not direct live
                  retailer checks. Variants, bundles, accessories, and stale
                  prices can still appear, so confirm details on the store page
                  before purchasing.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-surface-lightBorder bg-surface-lightCard px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.18em] text-brand-muted shadow-soft dark:border-surface-border dark:bg-surface-card">
                {filteredResults.length} of {results.length} listings visible
              </span>
              <span className="rounded-full border border-surface-lightBorder bg-surface-lightCard px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.18em] text-brand-muted shadow-soft dark:border-surface-border dark:bg-surface-card">
                {retailers.length} retailers
              </span>
            </div>
          </div>
        </div>
      </div>

      {!summary && (
        <div className="panel rounded-[1.5rem] p-4 text-sm text-brand-muted">
          The current filters leave only low-confidence related items, so Price
          Hunt is hiding the price summary to avoid misleading comparisons.
        </div>
      )}
    </section>
  );
}
