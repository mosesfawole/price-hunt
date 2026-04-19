"use client";

import { useEffect } from "react";
import { Clock, Sparkles, TrendingDown } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import SearchBar from "@/components/ui/SearchBar";
import PriceSummary from "@/components/results/PriceSummary";
import ResultsFilters from "@/components/results/ResultsFilters";
import ProductGrid from "@/components/results/ProductGrid";
import { useSearchStore } from "@/store/useSearchStore";

const POPULAR_SEARCHES = [
  "Logitech MX Master 3S",
  "iPhone 15 Pro 256GB Natural Titanium",
  "Samsung S24 Ultra 512GB",
  "Sony WH-1000XM5",
  "MacBook Pro M4 14-inch 16GB 512GB",
  "Apple Watch Series 10 45mm GPS",
];

export default function SearchPage() {
  const {
    hasSearched,
    isLoading,
    isDark,
    history,
    clearHistory,
    search,
    setQuery,
  } = useSearchStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const handleQuickSearch = (value: string) => {
    setQuery(value);
    search(value);
  };

  return (
    <div className="bg-grid flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 flex-col">
        {!hasSearched && !isLoading && (
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-10 px-4 py-14 md:px-8 md:py-20">
            <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_22rem] lg:items-end">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-accent-greenBorder bg-accent-green px-4 py-2 text-[11px] font-mono uppercase tracking-[0.22em] text-brand-green">
                  <Sparkles size={12} />
                  Trust-first price comparison
                </div>

                <div className="space-y-4">
                  <h1 className="max-w-3xl text-4xl font-display font-semibold leading-tight text-brand-text-light dark:text-brand-text-dark md:text-6xl">
                    Shop by the
                    <span className="text-brand-green"> right product</span>,
                    not just the lowest number.
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-brand-muted md:text-lg">
                    Price Hunt compares Google Shopping listings with match
                    confidence, condition checks, and cleaner filters so you can
                    spot the best relevant offer faster.
                  </p>
                </div>

                <div className="max-w-3xl">
                  <SearchBar />
                </div>
              </div>

              <div className="panel rounded-[2rem] p-5">
                <h2 className="text-lg font-display font-semibold text-brand-text-light dark:text-brand-text-dark">
                  Search tips that improve accuracy
                </h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-brand-muted">
                  <li>Include brand and model name or number.</li>
                  <li>Add storage, size, color, or version when it matters.</li>
                  <li>Use filters to hide accessories and used listings.</li>
                  <li>Review low-confidence or variant listings before buying.</li>
                </ul>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
              <div className="panel rounded-[2rem] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <TrendingDown size={14} className="text-brand-green" />
                  <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-brand-muted">
                    Try a precise search
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleQuickSearch(suggestion)}
                      className="rounded-full border border-surface-lightBorder bg-surface-lightCard px-4 py-2 text-sm text-brand-text-light shadow-soft transition-colors hover:border-brand-green dark:border-surface-border dark:bg-surface-card dark:text-brand-text-dark"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {history.length > 0 && (
                <div className="panel rounded-[2rem] p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-brand-muted" />
                      <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-brand-muted">
                        Recent
                      </h2>
                    </div>
                    <button
                      onClick={clearHistory}
                      className="text-xs font-medium text-brand-muted transition-colors hover:text-brand-red"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-2">
                    {history.map((entry) => (
                      <button
                        key={entry.query}
                        onClick={() => handleQuickSearch(entry.query)}
                        className="flex w-full items-center justify-between rounded-[1.15rem] border border-surface-lightBorder bg-surface-lightCard px-4 py-3 text-left shadow-soft transition-colors hover:border-brand-green dark:border-surface-border dark:bg-surface-card"
                      >
                        <span className="truncate pr-3 text-sm text-brand-text-light dark:text-brand-text-dark">
                          {entry.query}
                        </span>
                        <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-muted">
                          {entry.resultCount}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {(hasSearched || isLoading) && (
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 px-4 py-6 md:px-8 md:py-8">
            <SearchBar />
            {!isLoading && (
              <>
                <PriceSummary />
                <ResultsFilters />
              </>
            )}
            <ProductGrid />
          </div>
        )}
      </main>

      <footer className="border-t border-surface-lightBorder/80 py-6 text-center text-sm text-brand-muted dark:border-surface-border">
        Price Hunt surfaces shopping listings for research. Always verify final
        product specs, condition, and shipping terms on the retailer site.
      </footer>
    </div>
  );
}
