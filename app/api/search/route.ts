import { NextRequest, NextResponse } from "next/server";
import { getCached, setCache } from "@/lib/cache";
import { fetchFromSerpAPI } from "@/lib/serpapi";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");

  // Validate
  if (!query || query.trim().length < 2) {
    return NextResponse.json(
      { error: "Search query must be at least 2 characters" },
      { status: 400 },
    );
  }

  // Check API key is configured
  if (!process.env.SERPAPI_KEY) {
    return NextResponse.json(
      { error: "Service temporarily unavailable. Please try again later." },
      { status: 500 },
    );
  }

  try {
    // 1. Check cache first
    const cached = getCached(query);
    if (cached) {
      return NextResponse.json({
        results: cached,
        cached: true,
        query,
        searchedAt: new Date().toISOString(),
      });
    }

    // 2. Fetch from SerpAPI
    const results = await fetchFromSerpAPI(query);

    // 3. Store in cache
    setCache(query, results);

    return NextResponse.json({
      results,
      cached: false,
      query,
      searchedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[Search Error]", err.message);
    console.error("[Search API Error]", err.message);

    // Handle specific SerpAPI errors
    if (err.message.includes("Invalid API key")) {
      return NextResponse.json(
        { error: "Invalid SerpAPI key — check your .env.local" },
        { status: 401 },
      );
    }

    if (err.message.includes("No results found")) {
      return NextResponse.json(
        { error: "No results found for this product. Try a different search." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: err.message ?? "Something went wrong" },
      { status: 500 },
    );
  }
}
