export interface Product {
  title: string;
  price: number;
  store: string;
  link: string;
  image?: string;
  rating?: number;
  reviews?: number;
}

export interface SearchResult {
  results: Product[];
  cached: boolean;
  query: string;
  searchedAt: string;
}

export interface SearchHistory {
  query: string;
  searchedAt: string;
  resultCount: number;
}
