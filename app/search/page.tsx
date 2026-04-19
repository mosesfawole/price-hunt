"use client";

import { useEffect } from "react";
import { Clock3, Sparkles, WandSparkles } from "lucide-react";
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
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-4 py-12 md:px-8 md:py-16">
            <section className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] xl:items-end">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-accent-greenBorder bg-accent-green px-4 py-2 text-[11px] font-mono uppercase tracking-[0.22em] text-brand-green">
                  <Sparkles size={12} />
                  Editorial marketplace mode
                </div>

                <div className="space-y-4">
                  <h1 className="max-w-4xl text-5xl font-display leading-[0.96] text-brand-text-light dark:text-brand-text-dark md:text-7xl">
                    Compare offers by the
                    <span className="text-brand-green"> right product</span>,
                    not just the cheapest listing.
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-brand-muted md:text-lg">
                    Price Hunt reads Google Shopping listings, scores how well
                    they match your query, and helps you compare a cleaner set
                    of options before you click through to a retailer.
                  </p>
                </div>

                <div className="max-w-4xl">
                  <SearchBar />
                </div>
              </div>

              <div className="panel rounded-[2.2rem] p-6">
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-brand-muted">
                  What makes this different
                </p>
                <div className="mt-4 space-y-4">
                  <div>
                    <h2 className="text-2xl font-display text-brand-text-light dark:text-brand-text-dark">
                      A shortlist, not a dump of search results
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-brand-muted">
                      We rank brand, model, storage, size, color, and product
                      condition before price so accessories and wrong variants
                      stop hijacking the top of the page.
                    </p>
                  </div>
                  <div className="editorial-rule" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-muted">
                        Signals
                      </p>
                      <p className="mt-1 text-sm leading-6 text-brand-text-light dark:text-brand-text-dark">
                        Exact match, likely match, variant, and related item
                        confidence tags.
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-muted">
                        Guardrails
                      </p>
                      <p className="mt-1 text-sm leading-6 text-brand-text-light dark:text-brand-text-dark">
                        Filters and summaries that ignore low-confidence noise.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
              <div className="panel rounded-[2.2rem] p-6">
                <div className="mb-4 flex items-center gap-2">
                  <WandSparkles size={15} className="text-brand-green" />
                  <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-brand-muted">
                    Precise prompts
                  </p>
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

              <div className="panel rounded-[2.2rem] p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Clock3 size={15} className="text-brand-muted" />
                  <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-brand-muted">
                    Search advice
                  </p>
                </div>
                <div className="space-y-3 text-sm leading-6 text-brand-muted">
                  <p>Include brand and model name or number.</p>
                  <p>Add storage, size, color, or version when it matters.</p>
                  <p>Use filters to remove accessories and used inventory.</p>
                  <p>Review low-confidence variants before purchasing.</p>
                </div>
              </div>
            </section>

            {history.length > 0 && (
              <section className="panel rounded-[2.2rem] p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-brand-muted">
                      Recent searches
                    </p>
                    <h2 className="mt-1 text-2xl font-display text-brand-text-light dark:text-brand-text-dark">
                      Resume a past comparison
                    </h2>
                  </div>
                  <button
                    onClick={clearHistory}
                    className="text-sm text-brand-muted transition-colors hover:text-brand-red"
                  >
                    Clear history
                  </button>
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {history.map((entry) => (
                    <button
                      key={entry.query}
                      onClick={() => handleQuickSearch(entry.query)}
                      className="rounded-[1.4rem] border border-surface-lightBorder bg-surface-lightCard px-4 py-3 text-left shadow-soft transition-colors hover:border-brand-green dark:border-surface-border dark:bg-surface-card"
                    >
                      <p className="line-clamp-2 text-sm text-brand-text-light dark:text-brand-text-dark">
                        {entry.query}
                      </p>
                      <p className="mt-2 text-[11px] font-mono uppercase tracking-[0.18em] text-brand-muted">
                        {entry.resultCount} results
                      </p>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {(hasSearched || isLoading) && (
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 px-4 py-6 md:px-8 md:py-8">
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

      <footer className="border-t border-surface-lightBorder/70 py-6 text-center text-sm text-brand-muted dark:border-surface-border">
        Price Hunt surfaces aggregated retailer listings for research. Always
        verify final product specs, condition, and delivery terms on the
        retailer site.
      </footer>
    </div>
  );
}
