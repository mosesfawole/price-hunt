"use client";
import { useState, useRef } from "react";
import { Search, X, Clock, ArrowRight } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";

export default function SearchBar() {
  const { query, setQuery, search, isLoading, history, isDark, clearResults } =
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
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all bg-surface-lightCard dark:bg-surface-card border-2 border-surface-lightBorder dark:border-surface-border focus-within:border-brand-green focus-within:shadow-focus">
          <Search
            size={16}
            className="text-brand-muted focus-within:text-brand-green"
          />

          <input
            ref={inputRef}
            type="text"
            placeholder='Search for a product (e.g. "Logitech Mouse")'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            className="flex-1 bg-transparent outline-none text-base md:text-sm text-brand-text-light dark:text-brand-text-dark"
          />

          {query && (
            <button
              title="clear"
              type="button"
              onClick={() => {
                setQuery("");
                clearResults();
              }}
              className="shrink-0 text-brand-muted"
            >
              <X size={14} />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 disabled:cursor-not-allowed bg-brand-green disabled:bg-surface-lightBorder dark:disabled:bg-surface-border text-black disabled:text-brand-muted"
          >
            {isLoading ? (
              <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Search <ArrowRight size={12} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Search history dropdown */}
      {showHistory && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-20 animate-fade-in bg-surface-lightCard dark:bg-surface-card border border-surface-lightBorder dark:border-surface-border shadow-2xl">
          <div className="px-4 py-2 text-[10px] font-mono tracking-widest uppercase text-brand-muted">
            Recent Searches
          </div>
          {history.map((h) => (
            <button
              key={h.query}
              onClick={() => handleHistoryClick(h.query)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors text-brand-text-light dark:text-brand-text-dark hover:bg-surface-lightHover dark:hover:bg-surface-hover"
            >
              <Clock size={12} className="text-brand-muted" />
              <span className="text-sm flex-1">{h.query}</span>
              <span className="text-[11px] font-mono text-brand-muted">
                {h.resultCount} results
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
