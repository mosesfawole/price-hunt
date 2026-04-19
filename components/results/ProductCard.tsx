"use client";

import { ExternalLink, ShieldAlert, Star, Tag } from "lucide-react";
import { getConfidenceLabel } from "@/lib/product-matching";
import type { Product } from "@/types";
import ProductThumbnail from "./ProductThumbnail";

type ProductCardProps = {
  product: Product;
  rank: number;
  lowestRelevantPrice: number | null;
};

function getConfidenceStyles(confidence: Product["match"]["confidence"]): string {
  switch (confidence) {
    case "exact":
      return "border-accent-greenBorder bg-accent-green text-brand-green";
    case "likely":
      return "border-accent-blueBorder bg-accent-blue text-brand-blue";
    case "variant":
      return "border-accent-goldBorder bg-accent-gold text-brand-gold";
    default:
      return "border-accent-redBorder bg-accent-red text-brand-red";
  }
}

function getFriendlyAttributes(product: Product): string[] {
  return product.match.matchedAttributes.map((attribute) => {
    switch (attribute) {
      case "core terms":
        return "Core title match";
      case "brand":
        return "Brand matched";
      case "model":
        return "Model matched";
      case "storage":
        return "Storage matched";
      case "color":
        return "Color matched";
      case "version":
        return "Version matched";
      default:
        return attribute;
    }
  });
}

function getSafetyNote(product: Product): string | null {
  if (product.match.isAccessory) {
    return "Accessory listing. Verify this is the main product before buying.";
  }

  if (product.match.isRefurbished || product.match.isUsed) {
    return "Condition looks refurbished or used. Review the retailer listing carefully.";
  }

  if (product.match.confidence === "related") {
    return "Low-confidence match. Specs may differ from your search.";
  }

  if (product.match.confidence === "variant") {
    return "Close variant. Check storage, size, or version before you click through.";
  }

  return null;
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
  const showPriceDiff = !isLowestRelevantMatch && priceDiff > 0;
  const friendlyAttributes = getFriendlyAttributes(product);
  const safetyNote = getSafetyNote(product);

  return (
    <a
      href={product.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group panel relative block overflow-hidden rounded-[1.65rem] p-4 transition-transform duration-200 hover:-translate-y-0.5 md:p-5"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-brand-green/70 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="grid gap-4 md:grid-cols-[7.25rem_minmax(0,1fr)_11rem] md:items-start">
        <div className="relative h-24 w-24 overflow-hidden rounded-[1.4rem] border border-surface-lightBorder bg-white shadow-soft dark:border-surface-border dark:bg-surface-hover md:h-28 md:w-28">
          <ProductThumbnail src={product.image} alt={product.title} />
          <div className="absolute left-2 top-2 rounded-full bg-accent-ink px-2 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-white">
            #{rank + 1}
          </div>
        </div>

        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] ${getConfidenceStyles(product.match.confidence)}`}
            >
              {getConfidenceLabel(product.match.confidence)}
            </span>
            {isLowestRelevantMatch && (
              <span className="rounded-full border border-accent-greenBorder px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-brand-green">
                Best relevant price
              </span>
            )}
            {(product.match.isRefurbished || product.match.isUsed) && (
              <span className="rounded-full border border-accent-redBorder px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-brand-red">
                Refurbished / used
              </span>
            )}
            {product.match.isAccessory && (
              <span className="rounded-full border border-surface-lightBorder px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-brand-muted dark:border-surface-border">
                Accessory
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-brand-text-light dark:text-brand-text-dark md:text-[1.1rem]">
              {product.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-brand-muted">
              <span className="font-medium text-brand-text-light dark:text-brand-text-dark">
                {product.store}
              </span>
              {rating > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-0.5 text-brand-gold">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={11}
                        className={
                          index < Math.round(rating)
                            ? "fill-current"
                            : "opacity-25"
                        }
                      />
                    ))}
                  </span>
                  <span className="font-mono text-[11px] text-brand-muted">
                    {rating}
                    {product.reviews ? ` (${product.reviews.toLocaleString()})` : ""}
                  </span>
                </span>
              )}
            </div>
          </div>

          {friendlyAttributes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {friendlyAttributes.slice(0, 3).map((attribute) => (
                <span
                  key={attribute}
                  className="inline-flex items-center gap-1 rounded-full bg-surface-lightHover px-2.5 py-1 text-[11px] text-brand-muted dark:bg-surface-hover"
                >
                  <Tag size={10} />
                  {attribute}
                </span>
              ))}
            </div>
          )}

          {safetyNote && (
            <div className="flex items-start gap-2 rounded-2xl border border-accent-goldBorder bg-accent-gold px-3 py-2 text-xs text-brand-muted">
              <ShieldAlert size={14} className="mt-0.5 shrink-0 text-brand-gold" />
              <p>{safetyNote}</p>
            </div>
          )}
        </div>

        <div className="flex flex-row items-end justify-between gap-3 border-t border-surface-lightBorder pt-3 md:flex-col md:items-end md:justify-start md:border-t-0 md:border-l md:pl-5 md:pt-0 dark:border-surface-border">
          <div className="space-y-1 text-left md:text-right">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-muted">
              Listing price
            </p>
            <p className="text-2xl font-semibold tracking-tight text-brand-text-light dark:text-brand-text-dark">
              ${product.price.toFixed(2)}
            </p>
            {showPriceDiff && (
              <p className="text-[11px] font-mono text-brand-red">
                +${priceDiff.toFixed(2)} vs top relevant
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-[11px] font-mono uppercase tracking-[0.18em] text-brand-muted md:inline">
              Open listing
            </span>
            <span className="rounded-full border border-surface-lightBorder p-2 text-brand-text-light transition-colors group-hover:border-brand-green group-hover:text-brand-green dark:border-surface-border dark:text-brand-text-dark">
              <ExternalLink size={14} />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
