"use client";

import { ExternalLink, ShieldAlert, Star } from "lucide-react";
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

function getMatchLine(product: Product): string {
  if (product.match.matchedAttributes.length > 0) {
    return `Matched on ${product.match.matchedAttributes.join(", ")}.`;
  }

  if (product.match.confidence === "related") {
    return "This listing has weak overlap with the original query.";
  }

  return "Review the full retailer listing to confirm the exact specs.";
}

function getSafetyNote(product: Product): string | null {
  if (product.match.isAccessory) {
    return "Accessory listing detected. Double-check that this is not an add-on item.";
  }

  if (product.match.isRefurbished || product.match.isUsed) {
    return "Condition terms suggest refurbished or used inventory.";
  }

  if (product.match.confidence === "variant") {
    return "Variant listing. Storage, size, or generation may differ.";
  }

  if (product.match.confidence === "related") {
    return "Low-confidence match. Treat this as a related item, not a verified equivalent.";
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
  const safetyNote = getSafetyNote(product);

  return (
    <a
      href={product.link}
      target="_blank"
      rel="noopener noreferrer"
      className="panel group block overflow-hidden rounded-[2rem] p-4 transition-transform duration-200 hover:-translate-y-0.5 md:p-5"
    >
      <div className="grid gap-4 md:grid-cols-[9rem_minmax(0,1fr)_10rem] md:gap-5">
        <div className="space-y-2">
          <div className="overflow-hidden rounded-[1.6rem] border border-surface-lightBorder bg-surface-lightCard shadow-soft dark:border-surface-border dark:bg-surface-card">
            <div className="relative aspect-square">
              <ProductThumbnail src={product.image} alt={product.title} />
            </div>
          </div>
          <div className="flex items-center justify-between px-1 text-[11px] font-mono uppercase tracking-[0.18em] text-brand-muted">
            <span>Listing {rank + 1}</span>
            <span>{product.store}</span>
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
            {product.match.isAccessory && (
              <span className="rounded-full border border-surface-lightBorder px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-brand-muted dark:border-surface-border">
                Accessory
              </span>
            )}
            {(product.match.isRefurbished || product.match.isUsed) && (
              <span className="rounded-full border border-accent-redBorder px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-brand-red">
                Refurbished / used
              </span>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="line-clamp-3 text-[1.45rem] font-display leading-tight text-brand-text-light dark:text-brand-text-dark">
              {product.title}
            </h3>
            <p className="max-w-2xl text-sm leading-6 text-brand-muted">
              {getMatchLine(product)}
            </p>
          </div>

          <div className="editorial-rule" />

          <div className="grid gap-3 text-sm text-brand-muted sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div className="space-y-2">
              {rating > 0 && (
                <div className="inline-flex items-center gap-2">
                  <span className="inline-flex items-center gap-0.5 text-brand-gold">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={12}
                        className={
                          index < Math.round(rating)
                            ? "fill-current"
                            : "opacity-25"
                        }
                      />
                    ))}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em]">
                    {rating}
                    {product.reviews ? ` • ${product.reviews.toLocaleString()} reviews` : ""}
                  </span>
                </div>
              )}
              {safetyNote && (
                <div className="flex items-start gap-2 rounded-[1.25rem] border border-accent-goldBorder bg-accent-gold px-3 py-2 text-xs leading-5 text-brand-muted">
                  <ShieldAlert
                    size={14}
                    className="mt-0.5 shrink-0 text-brand-gold"
                  />
                  <p>{safetyNote}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-brand-muted">
              <span>Open retailer</span>
              <span className="rounded-full border border-surface-lightBorder p-2 text-brand-text-light transition-colors group-hover:border-brand-green group-hover:text-brand-green dark:border-surface-border dark:text-brand-text-dark">
                <ExternalLink size={14} />
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-surface-lightBorder pt-3 md:flex-col md:items-end md:justify-between md:border-t-0 md:border-l md:pl-5 md:pt-0 dark:border-surface-border">
          <div className="text-left md:text-right">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-muted">
              Listing price
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-brand-text-light dark:text-brand-text-dark">
              ${product.price.toFixed(2)}
            </p>
            {showPriceDiff && (
              <p className="mt-1 text-[11px] font-mono uppercase tracking-[0.16em] text-brand-red">
                +${priceDiff.toFixed(2)} vs top match
              </p>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
