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
    <div
      className="min-h-screen flex flex-col"
      style={{ background: isDark ? "#08080f" : "#f4f4f8" }}
    >
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* ── Hero section — shown before search ── */}
        {!hasSearched && !isLoading && (
          <div className="flex flex-col items-center justify-center flex-1 px-4 py-16 gap-8">
            {/* Title */}
            <div className="text-center space-y-3 animate-slide-up">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div
                  className="px-3 py-1 rounded-full text-[11px] font-mono flex items-center gap-1.5"
                  style={{
                    background: "rgba(0,212,170,0.1)",
                    border: "1px solid rgba(0,212,170,0.2)",
                    color: "#00d4aa",
                  }}
                >
                  <Sparkles size={10} />
                  Real-time price comparison
                </div>
              </div>

              <h1
                className="text-3xl md:text-5xl font-display font-bold leading-tight"
                style={{ color: isDark ? "#ffffff" : "#1a1a2e" }}
              >
                Find the <span style={{ color: "#00d4aa" }}>lowest price</span>
                <br />
                for anything
              </h1>

              <p
                className="text-sm md:text-base font-mono max-w-md mx-auto"
                style={{ color: "#5a5a8a" }}
              >
                Search any product and instantly compare prices across multiple
                retailers — Amazon, Walmart, Best Buy and more
              </p>
            </div>

            {/* Search bar */}
            <div className="w-full max-w-2xl px-4 animate-slide-up">
              <SearchBar />
            </div>
            {/* Disclaimer */}
            <div className="w-full max-w-2xl px-4 animate-fade-in">
              <div
                className="flex items-start gap-2 px-4 py-3 rounded-xl text-xs font-mono"
                style={{
                  background: "rgba(240,192,64,0.06)",
                  border: "1px solid rgba(240,192,64,0.2)",
                  color: "#5a5a8a",
                }}
              >
                <span style={{ color: "#f0c040", marginTop: "1px" }}>⚠</span>
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
                    <Clock size={12} style={{ color: "#5a5a8a" }} />
                    <span
                      className="text-[11px] font-mono tracking-widest uppercase"
                      style={{ color: "#5a5a8a" }}
                    >
                      Recent Searches
                    </span>
                  </div>
                  <button
                    onClick={clearHistory}
                    className="text-[11px] font-mono transition-colors"
                    style={{ color: "#5a5a8a" }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = "#ff4d6d")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color = "#5a5a8a")
                    }
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
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                      style={{
                        background: isDark ? "#0f0f20" : "#ffffff",
                        border: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
                        color: isDark ? "#e0e0f4" : "#1a1a2e",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "#00d4aa";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          isDark ? "#252540" : "#e0e0f0";
                      }}
                    >
                      <TrendingDown size={10} style={{ color: "#00d4aa" }} />
                      {h.query}
                      <span style={{ color: "#5a5a8a" }}>{h.resultCount}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular searches */}
            <div className="w-full max-w-2xl px-4 animate-fade-in">
              <p
                className="text-[11px] font-mono tracking-widest uppercase mb-3"
                style={{ color: "#5a5a8a" }}
              >
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
                    className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                    style={{
                      background: isDark ? "#0f0f20" : "#ffffff",
                      border: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
                      color: "#5a5a8a",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = isDark
                        ? "#ffffff"
                        : "#1a1a2e";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "#00d4aa";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "#5a5a8a";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        isDark ? "#252540" : "#e0e0f0";
                    }}
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
      {/* Footer */}
      <footer
        className="py-6 text-center text-[11px] font-mono"
        style={{
          color: "#5a5a8a",
          borderTop: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
        }}
      >
        © 2026 PriceHunt — Made by{" "}
        <a
          href="https://github.com/mosesfawole"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors"
          style={{ color: "#00d4aa" }}
          onMouseEnter={(e) =>
            ((e.target as HTMLElement).style.color = "#ffffff")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.color = "#00d4aa")
          }
        >
          Moses Fawole
        </a>
      </footer>
    </div>
  );
}
