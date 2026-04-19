export interface CacheRecord<T> {
  value: T;
  fetchedAt: string;
  expiresAt: string;
}

export interface CacheStore<T> {
  get: (key: string) => Promise<CacheRecord<T> | null>;
  set: (key: string, value: T, ttlMs: number) => Promise<CacheRecord<T>>;
}

type MemoryEntry<T> = {
  value: T;
  fetchedAtMs: number;
  expiresAtMs: number;
};

class MemoryCacheStore<T> implements CacheStore<T> {
  private readonly cache = new Map<string, MemoryEntry<T>>();

  async get(key: string): Promise<CacheRecord<T> | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAtMs) {
      this.cache.delete(key);
      return null;
    }

    return {
      value: entry.value,
      fetchedAt: new Date(entry.fetchedAtMs).toISOString(),
      expiresAt: new Date(entry.expiresAtMs).toISOString(),
    };
  }

  async set(key: string, value: T, ttlMs: number): Promise<CacheRecord<T>> {
    const fetchedAtMs = Date.now();
    const expiresAtMs = fetchedAtMs + ttlMs;

    this.cache.set(key, {
      value,
      fetchedAtMs,
      expiresAtMs,
    });

    return {
      value,
      fetchedAt: new Date(fetchedAtMs).toISOString(),
      expiresAt: new Date(expiresAtMs).toISOString(),
    };
  }
}

export const SEARCH_CACHE_TTL_MS = 1000 * 60 * 30;

export function createMemoryCacheStore<T>(): CacheStore<T> {
  return new MemoryCacheStore<T>();
}

export function getCacheKey(query: string): string {
  return query.trim().toLowerCase();
}
