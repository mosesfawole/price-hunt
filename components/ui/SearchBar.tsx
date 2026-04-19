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
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus-within:border-accent-500 transition-colors">
          <Search size={18} className="text-gray-400" />

          <input
            ref={inputRef}
            type="text"
            placeholder='Search a model, e.g. "iPhone 15 Pro 256GB"'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500"
          />

          {query && (
            <button
              title="clear"
              type="button"
              onClick={() => {
                setQuery("");
                clearResults();
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X size={14} />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-4 py-2 bg-accent-500 hover:bg-accent-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white disabled:text-gray-500 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
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
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-subtle overflow-hidden z-20">
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Recent searches
            </span>
          </div>
          {history.map((h) => (
            <button
              key={h.query}
              onClick={() => handleHistoryClick(h.query)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Clock size={16} className="text-gray-400" />
              <span className="flex-1 text-gray-700 dark:text-gray-300">
                {h.query}
              </span>
              <span className="text-sm text-gray-400">
                {h.resultCount} results
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
