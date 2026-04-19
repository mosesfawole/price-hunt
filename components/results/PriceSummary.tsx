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

  const sideStats = summary
    ? [
        {
          icon: <TrendingUp size={15} />,
          label: "Highest relevant",
          value: `$${summary.highestPrice.toFixed(2)}`,
          note: summary.highestStore,
        },
        {
          icon: <BarChart2 size={15} />,
          label: "Average strong match",
          value: `$${summary.averagePrice.toFixed(2)}`,
          note: `${summary.productCount} included listings`,
        },
        {
          icon: <TrendingDown size={15} />,
          label: "Price spread",
          value: `$${summary.savings.toFixed(2)}`,
          note: `${summary.savingsPercent}% difference`,
        },
      ]
    : [];

  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.85fr)]">
      <div className="panel overflow-hidden rounded-[2.2rem]">
        <div className="border-b border-surface-lightBorder/80 px-5 py-4 dark:border-surface-border">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-accent-greenBorder bg-accent-green px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-brand-green">
              Search dossier
            </span>
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] ${
                isCached
                  ? "border border-accent-blueBorder bg-accent-blue text-brand-blue"
                  : "border border-accent-greenBorder bg-accent-green text-brand-green"
              }`}
            >
              {isCached ? "Cached snapshot" : "Fresh fetch"}
            </span>
          </div>
        </div>

        <div className="grid gap-6 p-5 md:p-6 lg:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-brand-muted">
                Query reviewed
              </p>
              <h2 className="text-3xl font-display leading-tight text-brand-text-light dark:text-brand-text-dark md:text-[2.6rem]">
                {query}
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-brand-muted md:text-base">
                Price Hunt compares the strongest matches first, then surfaces
                the most competitive prices from those comparable listings. Low
                confidence related items do not shape the headline pricing.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(14rem,0.7fr)]">
              <div className="rounded-[1.8rem] border border-accent-greenBorder bg-accent-green p-5">
                <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-green">
                  Best relevant offer
                </p>
                {summary ? (
                  <>
                    <p className="mt-3 text-5xl font-semibold tracking-tight text-brand-text-light dark:text-brand-text-dark">
                      ${summary.lowestPrice.toFixed(2)}
                    </p>
                    <p className="mt-2 text-sm text-brand-muted">
                      Lowest strong match from {summary.lowestStore}
                    </p>
                  </>
                ) : (
                  <p className="mt-3 max-w-sm text-sm leading-6 text-brand-muted">
                    Current filters only leave low-confidence or excluded
                    listings, so there is no trustworthy headline price to show.
                  </p>
                )}
              </div>

              <div className="rounded-[1.8rem] border border-surface-lightBorder bg-surface-lightCard p-5 shadow-soft dark:border-surface-border dark:bg-surface-card">
                <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-muted">
                  Visible shortlist
                </p>
                <p className="mt-3 text-4xl font-semibold tracking-tight text-brand-text-light dark:text-brand-text-dark">
                  {filteredResults.length}
                </p>
                <p className="mt-2 text-sm text-brand-muted">
                  Listings passing your current filters out of {results.length} total.
                </p>
              </div>
            </div>
          </div>

          {summary && (
            <div className="space-y-3">
              {sideStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.5rem] border border-surface-lightBorder bg-surface-lightCard p-4 shadow-soft dark:border-surface-border dark:bg-surface-card"
                >
                  <div className="mb-2 flex items-center gap-2 text-brand-muted">
                    {item.icon}
                    <span className="text-[11px] font-mono uppercase tracking-[0.18em]">
                      {item.label}
                    </span>
                  </div>
                  <p className="text-2xl font-semibold tracking-tight text-brand-text-light dark:text-brand-text-dark">
                    {item.value}
                  </p>
                  <p className="mt-1 text-sm text-brand-muted">{item.note}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="panel rounded-[2rem] p-5">
          <div className="mb-4 flex items-center gap-2">
            <Database size={15} className="text-brand-blue" />
            <h3 className="text-xl font-display text-brand-text-light dark:text-brand-text-dark">
              Transparency notes
            </h3>
          </div>

          <div className="space-y-3 text-sm text-brand-muted">
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex items-center gap-2">
                <Store size={13} />
                Source
              </span>
              <span className="max-w-[12rem] text-right text-brand-text-light dark:text-brand-text-dark">
                {dataSource}
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
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex items-center gap-2">
                <TrendingDown size={13} />
                Retailers
              </span>
              <span className="text-brand-text-light dark:text-brand-text-dark">
                {retailers.length}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex items-center gap-2">
                <Store size={13} />
                Market
              </span>
              <span className="text-brand-text-light dark:text-brand-text-dark">
                {market}
              </span>
            </div>
          </div>
        </div>

        <div className="panel rounded-[2rem] border-accent-goldBorder bg-accent-gold p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-brand-gold" />
            <h3 className="text-xl font-display text-brand-text-light dark:text-brand-text-dark">
              Before you buy
            </h3>
          </div>
          <p className="text-sm leading-6 text-brand-muted">
            Price Hunt uses aggregated Google Shopping listings. Prices, stock,
            bundles, storage tiers, and product condition can vary across
            retailers, so always verify the final specs on the retailer page.
          </p>
        </div>
      </div>
    </section>
  );
}
