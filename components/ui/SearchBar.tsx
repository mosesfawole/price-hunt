"use client";

import { useRef, useState } from "react";
import { Clock, Search, X } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";

export default function SearchBar() {
  const { query, setQuery, search, isLoading, history, clearResults } =
    useSearchStore();
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;

    search(query);
    setFocused(false);
    inputRef.current?.blur();
  };

  const handleHistoryClick = (value: string) => {
    setQuery(value);
    search(value);
    setFocused(false);
  };

  const showHistory = focused && history.length > 0 && !query.trim();

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="overflow-hidden rounded-[2rem] bg-[#171d22] text-white shadow-[0_24px_80px_rgba(19,25,29,0.24)] dark:bg-[#0f1518]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 text-[11px] font-mono uppercase tracking-[0.22em] text-white/55">
            <span>Product query</span>
            <span>Brand, model, storage, size</span>
          </div>

          <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:p-4">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[1.4rem] bg-white/8 px-4 py-4">
              <Search size={18} className="shrink-0 text-white/50" />
              <input
                ref={inputRef}
                type="text"
                placeholder='Try "HP EliteBook 840 G7 16GB 512GB"'
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/38 md:text-lg"
              />

              {query && (
                <button
                  title="Clear search"
                  type="button"
                  onClick={() => {
                    setQuery("");
                    clearResults();
                  }}
                  className="shrink-0 rounded-full border border-white/10 p-1.5 text-white/55 transition-colors hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="rounded-[1.35rem] bg-[#fbf4e8] px-5 py-4 text-sm font-semibold text-[#1f1a17] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/35 sm:px-6"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#1f1a17] border-t-transparent" />
              ) : (
                "Search listings"
              )}
            </button>
          </div>
        </div>
      </form>

      {showHistory && (
        <div className="panel absolute left-0 right-0 top-full z-20 mt-3 overflow-hidden rounded-[1.6rem]">
          <div className="border-b border-surface-lightBorder px-4 py-3 dark:border-surface-border">
            <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-brand-muted">
              Recent searches
            </span>
          </div>
          {history.map((entry) => (
            <button
              key={entry.query}
              onClick={() => handleHistoryClick(entry.query)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-lightHover dark:hover:bg-surface-hover"
            >
              <Clock size={15} className="text-brand-muted" />
              <span className="flex-1 text-brand-text-light dark:text-brand-text-dark">
                {entry.query}
              </span>
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-muted">
                {entry.resultCount}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
