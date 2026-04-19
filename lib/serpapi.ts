import { scoreProductTitleMatch, sortProductsByMatch } from "@/lib/product-matching";
import type { Product } from "@/types";

export const SEARCH_REGION = "US";
export const SEARCH_LANGUAGE = "en";
export const SEARCH_CURRENCY = "USD";
export const SEARCH_DATA_SOURCE = "Google Shopping via SerpAPI";

export class SearchServiceError extends Error {
  constructor(
    public readonly code:
      | "AUTH"
      | "CONFIG"
      | "NO_RESULTS"
      | "RATE_LIMIT"
      | "UPSTREAM",
    message: string,
  ) {
    super(message);
    this.name = "SearchServiceError";
  }
}

type SerpApiShoppingResult = {
  title?: string;
  price?: string;
  extracted_price?: number;
  source?: string;
  product_link?: string;
  link?: string;
  serpapi_product_api?: string;
  thumbnail?: string | null;
  rating?: number | null;
  reviews?: number | null;
};

type SerpApiResponse = {
  error?: string;
  shopping_results?: SerpApiShoppingResult[];
};

function normalizePrice(item: SerpApiShoppingResult): number {
  if (typeof item.extracted_price === "number") {
    return item.extracted_price;
  }

  return parseFloat(item.price?.replace(/[^0-9.]/g, "") ?? "0");
}

function normalizeShoppingResult(
  item: SerpApiShoppingResult,
  query: string,
): Product | null {
  const price = normalizePrice(item);
  if (!Number.isFinite(price) || price <= 0) return null;

  const title = item.title?.trim() || "Unknown Product";

  return {
    title,
    price,
    store: item.source?.trim() || "Unknown Store",
    link: item.product_link ?? item.link ?? item.serpapi_product_api ?? "#",
    image: item.thumbnail ?? null,
    rating: item.rating ?? null,
    reviews: item.reviews ?? null,
    currency: SEARCH_CURRENCY,
    match: scoreProductTitleMatch(query, title),
  };
}

export async function fetchFromSerpAPI(query: string): Promise<Product[]> {
  const params = new URLSearchParams({
    engine: "google_shopping",
    q: query,
    api_key: process.env.SERPAPI_KEY!,
    num: "20",
    gl: SEARCH_REGION.toLowerCase(),
    hl: SEARCH_LANGUAGE,
  });

  const res = await fetch(`https://serpapi.com/search.json?${params}`, {
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    let payload: SerpApiResponse | null = null;

    try {
      payload = (await res.json()) as SerpApiResponse;
    } catch {
      payload = null;
    }

    const message = payload?.error ?? "SerpAPI request failed";

    if (res.status === 401 || message.toLowerCase().includes("invalid api key")) {
      throw new SearchServiceError("AUTH", message);
    }

    if (res.status === 429) {
      throw new SearchServiceError("RATE_LIMIT", message);
    }

    throw new SearchServiceError("UPSTREAM", message);
  }

  const data = (await res.json()) as SerpApiResponse;

  if (!data.shopping_results?.length) {
    throw new SearchServiceError("NO_RESULTS", "No results found");
  }

  const results = data.shopping_results
    .map((item) => normalizeShoppingResult(item, query))
    .filter((item): item is Product => item !== null);

  if (!results.length) {
    throw new SearchServiceError("NO_RESULTS", "No priced results found");
  }

  return sortProductsByMatch(results);
}
