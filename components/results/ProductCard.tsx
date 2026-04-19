"use client";

import Image from "next/image";
import { ExternalLink, ShieldAlert, Star, Tag } from "lucide-react";
import { getConfidenceLabel } from "@/lib/product-matching";
import type { Product } from "@/types";

type ProductCardProps = {
  product: Product;
  rank: number;
  lowestRelevantPrice: number | null;
};

function getConfidenceStyles(confidence: Product["match"]["confidence"]): string {
  switch (confidence) {
    case "exact":
      return "bg-accent-green text-brand-green border-accent-greenBorder";
    case "likely":
      return "bg-accent-blue text-brand-blue border-transparent";
    case "variant":
      return "bg-accent-gold text-brand-gold border-accent-goldBorder";
    default:
      return "bg-accent-red text-brand-red border-transparent";
  }
}

function buildProxyImageUrl(image: string): string {
  return `/api/image?src=${encodeURIComponent(image)}`;
}

export default function ProductCard({
  product,
  rank,
  lowestRelevantPrice,
}: ProductCardProps) {
  const rating = product.rating ?? 0;
  const isLowestRelevantMatch =
    lowestRelevantPrice !== null &&
    product.match.confidence !== "related" &&
    product.price === lowestRelevantPrice;
  const priceDiff =
    lowestRelevantPrice !== null ? product.price - lowestRelevantPrice : 0;
  const showPriceDiff = isLowestRelevantMatch === false && priceDiff > 0;

  return (
    <a
      href={product.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex gap-4 rounded-xl border border-surface-lightBorder bg-surface-lightCard p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-green dark:border-surface-border dark:bg-surface-card"
    >
      {isLowestRelevantMatch && (
        <div className="absolute left-4 top-[-10px] rounded-full bg-brand-green px-2 py-0.5 text-[10px] font-bold text-black">
          Lowest Relevant Price
        </div>
      )}

      <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-surface-lightHover text-[10px] font-bold font-mono text-brand-muted dark:bg-surface-hover">
        {rank + 1}
      </div>

      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-lightHover dark:bg-surface-hover">
        {product.image ? (
          <Image
            src={buildProxyImageUrl(product.image)}
            alt={product.title}
            width={64}
            height={64}
            className="h-full w-full object-contain"
          />
        ) : (
          <div
            aria-hidden="true"
            className="text-xl font-mono text-brand-muted"
          >
            PH
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 pr-8">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.18em] ${getConfidenceStyles(product.match.confidence)}`}
          >
            {getConfidenceLabel(product.match.confidence)}
          </span>
          {product.match.isAccessory && (
            <span className="rounded-full border border-surface-lightBorder px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.18em] text-brand-muted dark:border-surface-border">
              Accessory
            </span>
          )}
          {(product.match.isRefurbished || product.match.isUsed) && (
            <span className="rounded-full border border-surface-lightBorder px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.18em] text-brand-red dark:border-surface-border">
              Refurbished / Used
            </span>
          )}
        </div>

        <p className="line-clamp-2 text-sm font-display font-semibold leading-snug text-brand-text-light dark:text-brand-text-dark">
          {product.title}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-mono text-brand-muted">
          <span>{product.store}</span>
          {product.match.matchedAttributes.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <Tag size={10} />
              {product.match.matchedAttributes.join(", ")}
            </span>
          )}
          {product.match.penalties.length > 0 && (
            <span className="inline-flex items-center gap-1 text-brand-red">
              <ShieldAlert size={10} />
              {product.match.penalties.join(", ")}
            </span>
          )}
        </div>

        {rating > 0 && (
          <div className="mt-1.5 flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={9}
                className={
                  index < Math.round(rating)
                    ? "fill-brand-gold text-brand-gold"
                    : "text-surface-lightBorder dark:text-surface-border"
                }
              />
            ))}
            <span className="text-[11px] font-mono text-brand-muted">
              {rating}
              {product.reviews ? ` (${product.reviews.toLocaleString()})` : ""}
            </span>
          </div>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end justify-between">
        <span className="text-lg font-bold font-mono text-brand-text-light dark:text-brand-text-dark">
          ${product.price.toFixed(2)}
        </span>

        {showPriceDiff && (
          <span className="text-[10px] font-mono text-brand-red">
            +${priceDiff.toFixed(2)} vs. best relevant
          </span>
        )}

        <ExternalLink
          size={12}
          className="text-surface-border transition-colors group-hover:text-brand-green dark:text-surface-border"
        />
      </div>
    </a>
  );
}
