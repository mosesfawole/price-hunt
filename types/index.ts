export type MatchConfidence = "exact" | "likely" | "variant" | "related";

export interface ProductMatch {
  score: number;
  confidence: MatchConfidence;
  matchedAttributes: string[];
  penalties: string[];
  isAccessory: boolean;
  isRefurbished: boolean;
  isUsed: boolean;
}

export interface Product {
  title: string;
  price: number;
  store: string;
  link: string;
  image: string | null;
  rating: number | null;
  reviews: number | null;
  currency: string;
  match: ProductMatch;
}

export interface SearchResult {
  results: Product[];
  cached: boolean;
  query: string;
  fetchedAt: string;
  expiresAt: string;
  searchedAt: string;
  dataSource: string;
  market: string;
  currency: string;
}

export interface SearchHistory {
  query: string;
  searchedAt: string;
  resultCount: number;
}

export interface SearchFilters {
  hideAccessories: boolean;
  hideRefurbished: boolean;
  exactMatchesOnly: boolean;
  store: string;
  minPrice: string;
  maxPrice: string;
}

export interface PriceSummaryStats {
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  savings: number;
  savingsPercent: number;
  productCount: number;
  retailerCount: number;
  lowestStore: string;
  highestStore: string;
}
