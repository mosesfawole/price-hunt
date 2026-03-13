"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, SearchHistory } from "@/types";

interface SearchStore {
  // Current search state
  query: string;
  results: Product[];
  isLoading: boolean;
  error: string | null;
  isCached: boolean;
  hasSearched: boolean;

  // History
  history: SearchHistory[];

  // Theme
  isDark: boolean;

  // Actions
  setQuery: (q: string) => void;
  search: (q: string) => Promise<void>;
  clearResults: () => void;
  clearHistory: () => void;
  toggleTheme: () => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      query: "",
      results: [],
      isLoading: false,
      error: null,
      isCached: false,
      hasSearched: false,
      history: [],
      isDark: true,

      setQuery: (query) => set({ query }),

      search: async (query) => {
        if (!query.trim()) return;

        set({ isLoading: true, error: null, hasSearched: false });

        try {
          const res = await fetch(
            `/api/search?q=${encodeURIComponent(query.trim())}`,
          );
          const data = await res.json();

          if (!res.ok) throw new Error(data.error ?? "Search failed");

          // Sort by price ascending — cheapest first
          const sorted = [...data.results].sort((a, b) => a.price - b.price);

          set({
            results: sorted,
            isCached: data.cached,
            hasSearched: true,
            query: query.trim(),
            // Add to history, avoid duplicates, keep last 8
            history: [
              {
                query: query.trim(),
                searchedAt: new Date().toISOString(),
                resultCount: sorted.length,
              },
              ...get().history.filter(
                (h) => h.query.toLowerCase() !== query.trim().toLowerCase(),
              ),
            ].slice(0, 8),
          });
        } catch (err: any) {
          set({ error: err.message, hasSearched: true });
        } finally {
          set({ isLoading: false });
        }
      },

      clearResults: () =>
        set({ results: [], error: null, hasSearched: false, query: "" }),

      clearHistory: () => set({ history: [] }),

      toggleTheme: () => {
        const next = !get().isDark;
        set({ isDark: next });
        // Apply to html element for Tailwind dark mode
        document.documentElement.classList.toggle("dark", next);
      },
    }),
    {
      name: "price-hunt-storage",
      // Only persist history and theme — not search results
      partialize: (s) => ({ history: s.history, isDark: s.isDark }),
    },
  ),
);
