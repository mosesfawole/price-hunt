import type { Product } from "@/types";

interface CacheEntry {
  results: Product[];
  expiresAt: number;
}

// In-memory cache — lives as long as the server process is running
const cache = new Map<string, CacheEntry>();

export function getCached(query: string): Product[] | null {
  const entry = cache.get(query.toLowerCase());
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(query.toLowerCase());
    return null;
  }
  return entry.results;
}

export function setCache(query: string, results: Product[]): void {
  cache.set(query.toLowerCase(), {
    results,
    expiresAt: Date.now() + 1000 * 60 * 60, // 1 hour
  });
}

export function getCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}
