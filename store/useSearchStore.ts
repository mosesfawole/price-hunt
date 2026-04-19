"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_SEARCH_FILTERS } from "@/lib/product-matching";
import type { Product, SearchFilters, SearchHistory, SearchResult } from "@/types";

type SearchStore = {
  query: string;
  results: Product[];
  isLoading: boolean;
  error: string | null;
  isCached: boolean;
  hasSearched: boolean;
  fetchedAt: string | null;
  expiresAt: string | null;
  searchedAt: string | null;
  dataSource: string;
  market: string;
  currency: string;
  filters: SearchFilters;
  history: SearchHistory[];
  isDark: boolean;
  setQuery: (query: string) => void;
  search: (query: string) => Promise<void>;
  clearResults: () => void;
  clearHistory: () => void;
  toggleTheme: () => void;
  updateFilters: (nextFilters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
};

const DEFAULT_SOURCE = "Google Shopping via SerpAPI";
const DEFAULT_MARKET = "US";
const DEFAULT_CURRENCY = "USD";

function buildHistoryEntry(query: string, results: Product[]): SearchHistory {
  return {
    query,
    searchedAt: new Date().toISOString(),
    resultCount: results.length,
  };
}

function getResponseErrorMessage(data: unknown): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "string"
  ) {
    return data.error;
  }

  return "Search failed.";
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
      fetchedAt: null,
      expiresAt: null,
      searchedAt: null,
      dataSource: DEFAULT_SOURCE,
      market: DEFAULT_MARKET,
      currency: DEFAULT_CURRENCY,
      filters: DEFAULT_SEARCH_FILTERS,
      history: [],
      isDark: true,

      setQuery: (query) => set({ query }),

      search: async (query) => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        set({ isLoading: true, error: null, hasSearched: false });

        try {
          const res = await fetch(
            `/api/search?q=${encodeURIComponent(trimmedQuery)}`,
          );
          const data = (await res.json()) as SearchResult | { error: string };

          if (!res.ok) {
            throw new Error(getResponseErrorMessage(data));
          }

          const searchResult = data as SearchResult;

          set({
            results: searchResult.results,
            isCached: searchResult.cached,
            hasSearched: true,
            query: trimmedQuery,
            fetchedAt: searchResult.fetchedAt,
            expiresAt: searchResult.expiresAt,
            searchedAt: searchResult.searchedAt,
            dataSource: searchResult.dataSource,
            market: searchResult.market,
            currency: searchResult.currency,
            history: [
              buildHistoryEntry(trimmedQuery, searchResult.results),
              ...get().history.filter(
                (entry) => entry.query.toLowerCase() !== trimmedQuery.toLowerCase(),
              ),
            ].slice(0, 8),
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Search failed. Please try again.",
            hasSearched: true,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      clearResults: () =>
        set({
          results: [],
          error: null,
          hasSearched: false,
          query: "",
          isCached: false,
          fetchedAt: null,
          expiresAt: null,
          searchedAt: null,
          dataSource: DEFAULT_SOURCE,
          market: DEFAULT_MARKET,
          currency: DEFAULT_CURRENCY,
        }),

      clearHistory: () => set({ history: [] }),

      toggleTheme: () => {
        const next = !get().isDark;
        set({ isDark: next });
        document.documentElement.classList.toggle("dark", next);
      },

      updateFilters: (nextFilters) =>
        set((state) => ({
          filters: {
            ...state.filters,
            ...nextFilters,
          },
        })),

      resetFilters: () => set({ filters: DEFAULT_SEARCH_FILTERS }),
    }),
    {
      name: "price-hunt-storage",
      partialize: (state) => ({
        history: state.history,
        isDark: state.isDark,
        filters: state.filters,
      }),
    },
  ),
);
