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
    <div className="relative w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all"
          style={{
            background: isDark ? "#0f0f20" : "#ffffff",
            border: `1.5px solid ${focused ? "#00d4aa" : isDark ? "#252540" : "#e0e0f0"}`,
            boxShadow: focused ? "0 0 0 3px rgba(0,212,170,0.1)" : "none",
          }}
        >
          <Search
            size={16}
            style={{ color: focused ? "#00d4aa" : "#5a5a8a" }}
          />

          <input
            ref={inputRef}
            type="text"
            placeholder='Search for a product (e.g. "Logitech Mouse")'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            className="flex-1 bg-transparent outline-none text-base md:text-sm"
            style={{ color: isDark ? "#ffffff" : "#1a1a2e" }}
          />

          {query && (
            <button
              title="clear"
              type="button"
              onClick={() => {
                setQuery("");
                clearResults();
              }}
              className="shrink-0"
              style={{ color: "#5a5a8a" }}
            >
              <X size={14} />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0"
            style={{
              background: query.trim()
                ? "#00d4aa"
                : isDark
                  ? "#1e1e38"
                  : "#e0e0f0",
              color: query.trim() ? "#000000" : "#5a5a8a",
              cursor: isLoading || !query.trim() ? "not-allowed" : "pointer",
            }}
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
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-20 animate-fade-in"
          style={{
            background: isDark ? "#0f0f20" : "#ffffff",
            border: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <div
            className="px-4 py-2 text-[10px] font-mono tracking-widest uppercase"
            style={{ color: "#5a5a8a" }}
          >
            Recent Searches
          </div>
          {history.map((h) => (
            <button
              key={h.query}
              onClick={() => handleHistoryClick(h.query)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
              style={{
                color: isDark ? "#e0e0f4" : "#1a1a2e",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = isDark
                  ? "#161628"
                  : "#f4f4f8";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
              }}
            >
              <Clock size={12} style={{ color: "#5a5a8a" }} />
              <span className="text-sm flex-1">{h.query}</span>
              <span
                className="text-[11px] font-mono"
                style={{ color: "#5a5a8a" }}
              >
                {h.resultCount} results
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
