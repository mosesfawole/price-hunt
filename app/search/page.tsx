"use client";
import { useEffect } from "react";
import { useSearchStore } from "@/store/useSearchStore";
import Navbar from "@/components/ui/Navbar";
import SearchBar from "@/components/ui/SearchBar";
import PriceSummary from "@/components/results/PriceSummary";
import ProductGrid from "@/components/results/ProductGrid";
import { TrendingDown, Clock, X, Sparkles } from "lucide-react";

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

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const handleHistoryClick = (q: string) => {
    setQuery(q);
    search(q);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-surface-DEFAULT light:bg-surface-light">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* ── Hero section — shown before search ── */}
        {!hasSearched && !isLoading && (
          <div className="flex flex-col items-center justify-center flex-1 px-4 py-16 gap-8">
            {/* Title */}
            <div className="text-center space-y-3 animate-slide-up">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="px-3 py-1 rounded-full text-[11px] font-mono flex items-center gap-1.5 bg-accent-green border border-accent-greenBorder text-brand-green">
                  <Sparkles size={10} />
                  Real-time price comparison
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight text-brand-text-light dark:text-brand-text-dark">
                Find the <span className="text-brand-green">lowest price</span>
                <br />
                for anything
              </h1>

              <p className="text-sm md:text-base font-mono max-w-md mx-auto text-brand-muted">
                Search any product and instantly compare prices across multiple
                retailers — Amazon, Walmart, Best Buy and more
              </p>
            </div>

            {/* Search bar */}
            <div className="w-full max-w-2xl px-4 animate-slide-up">
              <SearchBar />
            </div>
            <div className="w-full max-w-2xl px-4 animate-fade-in">
              <div className="flex items-start gap-2 px-4 py-3 rounded-xl text-xs font-mono bg-accent-gold border border-accent-goldBorder text-brand-muted">
                <span className="text-brand-gold mt-0.5">⚠</span>
                <span>
                  Results are aggregated from Google Shopping and may include
                  accessories or related products alongside the item you
                  searched for. Always verify the product details before
                  purchasing.
                </span>
              </div>
            </div>

            {/* Recent searches */}
            {history.length > 0 && (
              <div className="w-full max-w-2xl px-4 animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-brand-muted" />
                    <span className="text-[11px] font-mono tracking-widest uppercase text-brand-muted">
                      Recent Searches
                    </span>
                  </div>
                  <button
                    onClick={clearHistory}
                    className="text-[11px] font-mono transition-colors hover:text-brand-red text-brand-muted"
                  >
                    Clear all
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {history.map((h) => (
                    <button
                      title="title"
                      key={h.query}
                      onClick={() => handleHistoryClick(h.query)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all bg-surface-lightCard dark:bg-surface-card border border-surface-lightBorder dark:border-surface-border text-brand-text-light dark:text-brand-text-dark hover:border-brand-green"
                    >
                      <TrendingDown size={10} className="text-brand-green" />
                      {h.query}
                      <span className="text-brand-muted">{h.resultCount}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular searches */}
            <div className="w-full max-w-2xl px-4 animate-fade-in">
              <p className="text-[11px] font-mono tracking-widest uppercase mb-3 text-brand-muted">
                Try searching for
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Logitech Mouse",
                  "iPhone 15",
                  "Samsung TV",
                  "Nike Air Max",
                  "MacBook Pro",
                  "Sony Headphones",
                  "iPad",
                  "Gaming Chair",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleHistoryClick(suggestion)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all bg-surface-lightCard dark:bg-surface-card border border-surface-lightBorder dark:border-surface-border text-brand-muted hover:text-brand-text-light dark:hover:text-brand-text-dark hover:border-brand-green"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Results section — shown after search ── */}
        {(hasSearched || isLoading) && (
          <div className="flex-1 px-4 md:px-8 py-6 max-w-3xl mx-auto w-full space-y-5">
            <SearchBar />
            {!isLoading && <PriceSummary />}
            <ProductGrid />
          </div>
        )}
      </main>
      <footer className="py-6 text-center text-[11px] font-mono text-brand-muted border-t border-surface-lightBorder dark:border-surface-border">
        © 2026 PriceHunt — Made by{" "}
        <a
          href="https://github.com/mosesfawole"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-brand-text-light dark:hover:text-brand-text-dark text-brand-green"
        >
          Moses Fawole
        </a>
      </footer>
    </div>
  );
}
