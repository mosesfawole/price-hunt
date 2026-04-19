"use client";
import { useState, useRef } from "react";
import { Search, X, Clock } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";

export default function SearchBar() {
  const { query, setQuery, search, isLoading, history, clearResults } =
    useSearchStore();
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      search(query);
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleHistoryClick = (q: string) => {
    setQuery(q);
    search(q);
    setFocused(false);
  };

  const showHistory = focused && history.length > 0 && !query.trim();

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3 rounded-[1.7rem] bg-[#1b2634] p-3 shadow-[0_20px_60px_rgba(17,24,39,0.22)] transition-colors focus-within:ring-4 focus-within:ring-accent-greenGlow dark:bg-[#0f171d] sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[1.25rem] bg-white/10 px-4 py-3 text-white/80">
            <Search size={18} className="shrink-0 text-white/55" />

            <input
              ref={inputRef}
              type="text"
              placeholder='Search a model, e.g. "iPhone 15 Pro 256GB"'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/45"
            />

            {query && (
              <button
                title="clear"
                type="button"
                onClick={() => {
                  setQuery("");
                  clearResults();
                }}
                className="shrink-0 text-white/55 transition-colors hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="rounded-[1.25rem] bg-[#f7f2e7] px-5 py-3 text-sm font-semibold text-[#1f2937] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/40 sm:px-6"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Search"
            )}
          </button>
        </div>
      </form>

      {/* Search history dropdown */}
      {showHistory && (
        <div className="panel absolute left-0 right-0 top-full z-20 mt-3 overflow-hidden rounded-[1.4rem]">
          <div className="border-b border-surface-lightBorder px-4 py-3 dark:border-surface-border">
            <span className="text-sm font-medium text-brand-muted">
              Recent searches
            </span>
          </div>
          {history.map((h) => (
            <button
              key={h.query}
              onClick={() => handleHistoryClick(h.query)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-lightHover dark:hover:bg-surface-hover"
            >
              <Clock size={16} className="text-brand-muted" />
              <span className="flex-1 text-brand-text-light dark:text-brand-text-dark">
                {h.query}
              </span>
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-muted">
                {h.resultCount} results
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
