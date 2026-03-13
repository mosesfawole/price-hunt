import type { Product } from "@/types";

export async function fetchFromSerpAPI(query: string): Promise<Product[]> {
  const params = new URLSearchParams({
    engine: "google_shopping",
    q: query,
    api_key: process.env.SERPAPI_KEY!,
    num: "20",
    gl: "us",
    hl: "en",
  });

  const res = await fetch(`https://serpapi.com/search.json?${params}`, {
    next: { revalidate: 0 }, // never cache at Next.js level — we handle caching ourselves
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "SerpAPI request failed");
  }

  const data = await res.json();

  if (!data.shopping_results?.length) {
    throw new Error("No results found for this product");
  }

  // Define the type for shopping_results items
  type ShoppingResult = {
    title?: string;
    price?: string;
    source?: string;
    product_link?: string;
    link?: string;
    serpapi_product_api?: string;
    thumbnail?: string | null;
    rating?: number | null;
    reviews?: number | null;
  };

  // Normalize each result into our Product shape
  return data.shopping_results
    .map((item: ShoppingResult) => ({
      title: item.title ?? "Unknown Product",
      price: parseFloat(item.price?.replace(/[^0-9.]/g, "") ?? "0"),
      store: item.source ?? "Unknown Store",
      link: item.product_link ?? item.link ?? item.serpapi_product_api ?? "#",
      image: item.thumbnail ?? null,
      rating: item.rating ?? null,
      reviews: item.reviews ?? null,
    }))
    .filter((p: Product) => p.price > 0); // remove items with no price
}
