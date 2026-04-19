import type {
  MatchConfidence,
  PriceSummaryStats,
  Product,
  ProductMatch,
  SearchFilters,
} from "@/types";

const ACCESSORY_TERMS = [
  "accessory",
  "accessories",
  "adapter",
  "battery",
  "cable",
  "case",
  "charger",
  "cover",
  "dock",
  "holder",
  "keyboard",
  "mount",
  "parts",
  "protector",
  "replacement",
  "screen protector",
  "skin",
  "sleeve",
  "stand",
  "strap",
];

const CONDITION_TERMS = [
  "open box",
  "open-box",
  "pre owned",
  "pre-owned",
  "refurbished",
  "renewed",
  "used",
];

const USED_ONLY_TERMS = ["used", "pre owned", "pre-owned"];

const COLOR_TERMS = [
  "beige",
  "black",
  "blue",
  "bronze",
  "brown",
  "charcoal",
  "gold",
  "graphite",
  "gray",
  "green",
  "grey",
  "navy",
  "pink",
  "purple",
  "red",
  "rose",
  "rose gold",
  "silver",
  "starlight",
  "teal",
  "titanium",
  "violet",
  "white",
  "yellow",
];

const VERSION_TERMS = [
  "air",
  "classic",
  "edition",
  "fe",
  "gen",
  "generation",
  "lite",
  "max",
  "mini",
  "plus",
  "pro",
  "se",
  "series",
  "ultra",
];

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "at",
  "by",
  "for",
  "from",
  "in",
  "new",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

const STRONG_CONFIDENCE: MatchConfidence[] = ["exact", "likely"];

type ParsedProductText = {
  normalized: string;
  tokens: string[];
  keyTokens: string[];
  brandTokens: string[];
  modelTokens: string[];
  storageTokens: string[];
  colorTokens: string[];
  versionTokens: string[];
  accessoryTerms: string[];
  conditionTerms: string[];
  usedTerms: string[];
};

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9.+/-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

function findTerms(text: string, terms: string[]): string[] {
  return terms.filter((term) => text.includes(term));
}

function extractStorageTokens(text: string): string[] {
  return unique(
    Array.from(text.matchAll(/\b\d+(?:\.\d+)?\s?(?:tb|gb|mb)\b/g)).map(
      (match) => match[0].replace(/\s+/g, ""),
    ),
  );
}

function extractVersionTokens(text: string): string[] {
  const tokens = new Set<string>();

  for (const term of VERSION_TERMS) {
    if (text.includes(term)) tokens.add(term);
  }

  for (const match of text.matchAll(/\b(?:gen|generation|series)\s?\d+\b/g)) {
    tokens.add(match[0].replace(/\s+/g, ""));
  }

  for (const match of text.matchAll(/\b\d+(?:\.\d+)?\s?(?:inch|in|mm|cm)\b/g)) {
    tokens.add(match[0].replace(/\s+/g, ""));
  }

  for (const match of text.matchAll(/\b(?:wifi|5g|4g|lte)\b/g)) {
    tokens.add(match[0]);
  }

  return Array.from(tokens);
}

function extractModelTokens(tokens: string[]): string[] {
  return unique(
    tokens.filter((token) => {
      if (token.length < 2) return false;
      const hasDigit = /\d/.test(token);
      const hasLetter = /[a-z]/.test(token);
      return hasDigit || (hasLetter && token.includes("-"));
    }),
  );
}

function parseProductText(value: string): ParsedProductText {
  const normalized = normalizeText(value);
  const tokens = normalized
    .split(" ")
    .map((token) => token.trim())
    .filter(Boolean);
  const accessoryTerms = findTerms(normalized, ACCESSORY_TERMS);
  const conditionTerms = findTerms(normalized, CONDITION_TERMS);
  const usedTerms = findTerms(normalized, USED_ONLY_TERMS);
  const storageTokens = extractStorageTokens(normalized);
  const colorTokens = findTerms(normalized, COLOR_TERMS);
  const versionTokens = extractVersionTokens(normalized);
  const keyTokens = unique(
    tokens.filter((token) => !STOP_WORDS.has(token) && token.length > 1),
  );
  const brandTokens = keyTokens
    .filter(
      (token) =>
        !storageTokens.includes(token) &&
        !versionTokens.includes(token) &&
        !accessoryTerms.includes(token) &&
        !conditionTerms.includes(token),
    )
    .slice(0, 2);

  return {
    normalized,
    tokens,
    keyTokens,
    brandTokens,
    modelTokens: extractModelTokens(tokens),
    storageTokens,
    colorTokens,
    versionTokens,
    accessoryTerms,
    conditionTerms,
    usedTerms,
  };
}

function overlap(queryValues: string[], resultValues: string[]): string[] {
  if (!queryValues.length || !resultValues.length) return [];
  const resultSet = new Set(resultValues);
  return queryValues.filter((value) => resultSet.has(value));
}

function hasConflictingFacet(
  queryValues: string[],
  resultValues: string[],
): boolean {
  return (
    queryValues.length > 0 &&
    resultValues.length > 0 &&
    overlap(queryValues, resultValues).length === 0
  );
}

function getConfidence(score: number, penalties: string[]): MatchConfidence {
  const hasHardPenalty = penalties.some((penalty) =>
    ["accessory", "condition", "very-low-overlap"].includes(penalty),
  );

  if (hasHardPenalty || score < 40) return "related";
  if (score >= 88 && penalties.length === 0) return "exact";
  if (score >= 66) return "likely";
  return "variant";
}

function buildMatch(
  query: ParsedProductText,
  title: ParsedProductText,
): ProductMatch {
  let score = 0;
  const matchedAttributes: string[] = [];
  const penalties: string[] = [];

  const tokenMatches = overlap(query.keyTokens, title.keyTokens);
  const tokenCoverage = query.keyTokens.length
    ? tokenMatches.length / query.keyTokens.length
    : 0;
  score += Math.round(tokenCoverage * 40);
  if (tokenCoverage >= 0.8) matchedAttributes.push("core terms");
  if (tokenCoverage < 0.35) penalties.push("very-low-overlap");

  const brandMatches = overlap(query.brandTokens, title.keyTokens);
  if (query.brandTokens.length) {
    if (brandMatches.length === query.brandTokens.length) {
      score += 14;
      matchedAttributes.push("brand");
    } else if (brandMatches.length > 0) {
      score += 7;
    }
  }

  const modelMatches = overlap(query.modelTokens, title.tokens);
  if (query.modelTokens.length) {
    if (modelMatches.length === query.modelTokens.length) {
      score += 28;
      matchedAttributes.push("model");
    } else if (modelMatches.length > 0) {
      score += 14;
    } else {
      penalties.push("model-mismatch");
      score -= 18;
    }
  }

  const storageMatches = overlap(query.storageTokens, title.storageTokens);
  if (query.storageTokens.length) {
    if (storageMatches.length === query.storageTokens.length) {
      score += 14;
      matchedAttributes.push("storage");
    } else if (hasConflictingFacet(query.storageTokens, title.storageTokens)) {
      penalties.push("storage-mismatch");
      score -= 16;
    }
  }

  const colorMatches = overlap(query.colorTokens, title.colorTokens);
  if (query.colorTokens.length) {
    if (colorMatches.length > 0) {
      score += 8;
      matchedAttributes.push("color");
    } else if (hasConflictingFacet(query.colorTokens, title.colorTokens)) {
      penalties.push("color-mismatch");
      score -= 6;
    }
  }

  const versionMatches = overlap(query.versionTokens, title.versionTokens);
  if (query.versionTokens.length) {
    if (versionMatches.length > 0) {
      score += 12;
      matchedAttributes.push("version");
    } else if (hasConflictingFacet(query.versionTokens, title.versionTokens)) {
      penalties.push("version-mismatch");
      score -= 10;
    }
  }

  const queryAllowsAccessories = query.accessoryTerms.length > 0;
  const queryAllowsCondition = query.conditionTerms.length > 0;
  const isAccessory = title.accessoryTerms.length > 0;
  const isRefurbished = title.conditionTerms.length > 0;
  const isUsed = title.usedTerms.length > 0;

  if (isAccessory && !queryAllowsAccessories) {
    penalties.push("accessory");
    score -= 60;
  }

  if (isRefurbished && !queryAllowsCondition) {
    penalties.push("condition");
    score -= 55;
  }

  const clampedScore = Math.max(0, Math.min(100, score));

  return {
    score: clampedScore,
    confidence: getConfidence(clampedScore, penalties),
    matchedAttributes: unique(matchedAttributes),
    penalties: unique(penalties),
    isAccessory,
    isRefurbished,
    isUsed,
  };
}

export function scoreProductTitleMatch(query: string, title: string): ProductMatch {
  return buildMatch(parseProductText(query), parseProductText(title));
}

export function sortProductsByMatch(products: Product[]): Product[] {
  const confidenceRank: Record<MatchConfidence, number> = {
    exact: 0,
    likely: 1,
    variant: 2,
    related: 3,
  };

  return [...products].sort((left, right) => {
    const leftRank = confidenceRank[left.match.confidence];
    const rightRank = confidenceRank[right.match.confidence];

    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }

    const leftStrong = STRONG_CONFIDENCE.includes(left.match.confidence);
    const rightStrong = STRONG_CONFIDENCE.includes(right.match.confidence);

    if (leftStrong && rightStrong) {
      if (left.match.score !== right.match.score) {
        return right.match.score - left.match.score;
      }

      if (left.price !== right.price) {
        return left.price - right.price;
      }
    }

    if (left.match.score !== right.match.score) {
      return right.match.score - left.match.score;
    }

    if (left.price !== right.price) {
      return left.price - right.price;
    }

    return left.store.localeCompare(right.store);
  });
}

export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  hideAccessories: true,
  hideRefurbished: true,
  exactMatchesOnly: false,
  store: "all",
  minPrice: "",
  maxPrice: "",
};

function parsePriceInput(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function applySearchFilters(
  products: Product[],
  filters: SearchFilters,
): Product[] {
  const minPrice = parsePriceInput(filters.minPrice);
  const maxPrice = parsePriceInput(filters.maxPrice);

  return products.filter((product) => {
    if (filters.hideAccessories && product.match.isAccessory) return false;
    if (
      filters.hideRefurbished &&
      (product.match.isRefurbished || product.match.isUsed)
    ) {
      return false;
    }
    if (filters.exactMatchesOnly && product.match.confidence !== "exact") {
      return false;
    }
    if (filters.store !== "all" && product.store !== filters.store) return false;
    if (minPrice !== null && product.price < minPrice) return false;
    if (maxPrice !== null && product.price > maxPrice) return false;
    return true;
  });
}

export function getRetailerOptions(products: Product[]): string[] {
  return unique(products.map((product) => product.store)).sort((left, right) =>
    left.localeCompare(right),
  );
}

export function buildSummaryStats(
  products: Product[],
): PriceSummaryStats | null {
  const eligibleProducts = products.filter(
    (product) => product.match.confidence !== "related",
  );

  if (!eligibleProducts.length) return null;

  const sortedByPrice = [...eligibleProducts].sort((left, right) => {
    if (left.price !== right.price) return left.price - right.price;
    return left.store.localeCompare(right.store);
  });

  const lowest = sortedByPrice[0];
  const highest = sortedByPrice[sortedByPrice.length - 1];
  const total = eligibleProducts.reduce((sum, product) => sum + product.price, 0);
  const averagePrice = total / eligibleProducts.length;
  const savings = highest.price - lowest.price;

  return {
    lowestPrice: lowest.price,
    highestPrice: highest.price,
    averagePrice,
    savings,
    savingsPercent:
      highest.price > 0 ? Math.round((savings / highest.price) * 100) : 0,
    productCount: eligibleProducts.length,
    retailerCount: unique(eligibleProducts.map((product) => product.store)).length,
    lowestStore: lowest.store,
    highestStore: highest.store,
  };
}

export function getConfidenceLabel(confidence: MatchConfidence): string {
  switch (confidence) {
    case "exact":
      return "Exact Match";
    case "likely":
      return "Likely Match";
    case "variant":
      return "Variant";
    default:
      return "Related Item";
  }
}
