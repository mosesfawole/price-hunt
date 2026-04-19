import { NextRequest, NextResponse } from "next/server";
import {
  createMemoryCacheStore,
  getCacheKey,
  SEARCH_CACHE_TTL_MS,
} from "@/lib/cache";
import {
  fetchFromSerpAPI,
  SEARCH_CURRENCY,
  SEARCH_DATA_SOURCE,
  SEARCH_REGION,
  SearchServiceError,
} from "@/lib/serpapi";
import type { Product, SearchResult } from "@/types";

type CachedSearchPayload = {
  query: string;
  results: Product[];
  dataSource: string;
  market: string;
  currency: string;
};

const searchCache = createMemoryCacheStore<CachedSearchPayload>();

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json(
      { error: "Search query must be at least 2 characters." },
      { status: 400 },
    );
  }

  if (!process.env.SERPAPI_KEY) {
    return NextResponse.json(
      { error: "Search is temporarily unavailable right now." },
      { status: 503 },
    );
  }

  try {
    const trimmedQuery = query.trim();
    const cacheKey = getCacheKey(trimmedQuery);
    const cached = await searchCache.get(cacheKey);

    if (cached) {
      const response: SearchResult = {
        ...cached.value,
        cached: true,
        fetchedAt: cached.fetchedAt,
        expiresAt: cached.expiresAt,
        searchedAt: new Date().toISOString(),
      };

      return NextResponse.json(response);
    }

    const results = await fetchFromSerpAPI(trimmedQuery);

    const payload: CachedSearchPayload = {
      query: trimmedQuery,
      results,
      dataSource: SEARCH_DATA_SOURCE,
      market: SEARCH_REGION,
      currency: SEARCH_CURRENCY,
    };

    const cacheRecord = await searchCache.set(
      cacheKey,
      payload,
      SEARCH_CACHE_TTL_MS,
    );

    const response: SearchResult = {
      ...cacheRecord.value,
      cached: false,
      fetchedAt: cacheRecord.fetchedAt,
      expiresAt: cacheRecord.expiresAt,
      searchedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[search-api]", {
      query: query.trim(),
      error,
      message: error instanceof Error ? error.message : "Unknown error",
    });

    if (error instanceof SearchServiceError) {
      if (error.code === "AUTH" || error.code === "CONFIG") {
        return NextResponse.json(
          { error: "Search is temporarily unavailable right now." },
          { status: 503 },
        );
      }

      if (error.code === "NO_RESULTS") {
        return NextResponse.json(
          { error: "No shopping results matched that search." },
          { status: 404 },
        );
      }

      if (error.code === "RATE_LIMIT") {
        return NextResponse.json(
          { error: "Search is busy right now. Please try again shortly." },
          { status: 503 },
        );
      }
    }

    return NextResponse.json(
      {
        error:
          "Something went wrong while fetching results. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
}
