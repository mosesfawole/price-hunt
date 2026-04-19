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
  "iPhone 15 Pro 256GB",
  "Samsung S24 Ultra 512GB",
  "Sony WH-1000XM5",
  "MacBook Pro M4 14-inch",
  "Apple Watch Series 10 45mm",
  "Nintendo Switch OLED",
  "Kindle Paperwhite 16GB",
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
    <div className="flex min-h-screen flex-col bg-surface light:bg-surface-light dark:bg-surface-DEFAULT">
      <Navbar />

      <main className="flex flex-1 flex-col">
        {!hasSearched && !isLoading && (
          <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-16">
            <div className="space-y-3 text-center animate-slide-up">
              <div className="mb-4 flex items-center justify-center gap-2">
                <div className="flex items-center gap-1.5 rounded-full border border-accent-greenBorder bg-accent-green px-3 py-1 text-[11px] font-mono text-brand-green">
                  <Sparkles size={10} />
                  Match-aware shopping results
                </div>
              </div>

              <h1 className="text-3xl font-display font-bold leading-tight text-brand-text-light dark:text-brand-text-dark md:text-5xl">
                Compare prices with
                <span className="text-brand-green"> confidence signals</span>
              </h1>

              <p className="mx-auto max-w-xl text-sm font-mono text-brand-muted md:text-base">
                Price Hunt reads Google Shopping listings and ranks them by how
                closely they match your query before showing the cheapest strong
                options.
              </p>
            </div>

            <div className="w-full max-w-2xl px-4 animate-slide-up">
              <SearchBar />
            </div>

            <div className="w-full max-w-2xl px-4 animate-fade-in">
              <div className="rounded-xl border border-accent-goldBorder bg-accent-gold px-4 py-3 text-xs font-mono text-brand-muted">
                Search with enough detail to improve match quality: brand,
                model, capacity, color, and size help the scoring layer separate
                exact products from accessories and variants.
              </div>
            </div>

            {history.length > 0 && (
              <div className="w-full max-w-2xl px-4 animate-fade-in">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-brand-muted" />
                    <span className="text-[11px] font-mono uppercase tracking-widest text-brand-muted">
                      Recent Searches
                    </span>
                  </div>
                  <button
                    onClick={clearHistory}
                    className="text-[11px] font-mono text-brand-muted transition-colors hover:text-brand-red"
                  >
                    Clear all
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {history.map((entry) => (
                    <button
                      key={entry.query}
                      onClick={() => handleQuickSearch(entry.query)}
                      className="flex items-center gap-2 rounded-lg border border-surface-lightBorder bg-surface-lightCard px-3 py-1.5 text-xs font-mono text-brand-text-light transition-all hover:border-brand-green dark:border-surface-border dark:bg-surface-card dark:text-brand-text-dark"
                    >
                      <TrendingDown size={10} className="text-brand-green" />
                      {entry.query}
                      <span className="text-brand-muted">{entry.resultCount}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="w-full max-w-2xl px-4 animate-fade-in">
              <p className="mb-3 text-[11px] font-mono uppercase tracking-widest text-brand-muted">
                Try searching for
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleQuickSearch(suggestion)}
                    className="rounded-lg border border-surface-lightBorder bg-surface-lightCard px-3 py-1.5 text-xs font-mono text-brand-muted transition-all hover:border-brand-green hover:text-brand-text-light dark:border-surface-border dark:bg-surface-card dark:hover:text-brand-text-dark"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {(hasSearched || isLoading) && (
          <div className="mx-auto flex-1 w-full max-w-5xl space-y-5 px-4 py-6 md:px-8">
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

      <footer className="border-t border-surface-lightBorder py-6 text-center text-[11px] font-mono text-brand-muted dark:border-surface-border">
        Copyright 2026 PriceHunt. Aggregated shopping data for research only.
      </footer>
    </div>
  );
}
