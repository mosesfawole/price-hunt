"use client";
import Image from "next/image";
import { ExternalLink, Star, Award } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";
import type { Product } from "@/types";

interface Props {
  product: Product;
  rank: number;
  lowestPrice: number;
  highestPrice: number;
}

export default function ProductCard({ product, rank, lowestPrice }: Props) {
  const { isDark } = useSearchStore();
  const isBestDeal = rank === 0;
  const priceDiff = product.price - lowestPrice;
  const isExpensive = priceDiff > 0 && priceDiff <= lowestPrice * 0.5;

  return (
    <a
      href={product.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex gap-4 p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 ${
        isBestDeal
          ? "bg-accent-green border-accent-greenBorderStrong shadow-brand"
          : "bg-surface-lightCard dark:bg-surface-card border-surface-lightBorder dark:border-surface-border"
      }`}
    >
      {/* Best deal badge */}
      {isBestDeal && (
        <div className="absolute -top-2.5 left-4 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-green text-black">
          <Award size={9} />
          BEST PRICE
        </div>
      )}

      {/* Rank */}
      <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono bg-surface-lightHover dark:bg-surface-hover text-brand-muted">
        {rank + 1}
      </div>

      {/* Product image */}
      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-surface-lightHover dark:bg-surface-hover">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            width={64}
            height={64}
            className="object-contain w-full h-full"
            unoptimized
          />
        ) : (
          <div className="text-2xl">📦</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 pr-8">
        <p className="text-sm font-semibold font-display line-clamp-2 leading-snug text-brand-text-light dark:text-brand-text-dark">
          {product.title}
        </p>

        <p className="text-xs mt-1 font-mono text-brand-muted">
          {product.store}
        </p>

        {product.rating && (
          <div className="flex items-center gap-1 mt-1.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={9}
                className={`${
                  i < Math.round(product.rating!)
                    ? "text-brand-gold fill-brand-gold"
                    : "text-surface-lightBorder dark:text-surface-border"
                }`}
              />
            ))}
            <span className="text-[11px] font-mono text-brand-muted">
              {product.rating}{" "}
              {product.reviews ? `(${product.reviews.toLocaleString()})` : ""}
            </span>
          </div>
        )}
      </div>

      {/* Price column */}
      <div className="flex flex-col items-end justify-between shrink-0">
        <span
          className={`text-lg font-bold font-mono ${
            isBestDeal
              ? "text-brand-green"
              : "text-brand-text-light dark:text-brand-text-dark"
          }`}
        >
          ${product.price.toFixed(2)}
        </span>

        {isExpensive && (
          <span className="text-[10px] font-mono text-brand-red">
            +${priceDiff.toFixed(2)}
          </span>
        )}

        <ExternalLink
          size={12}
          className="transition-colors text-surface-border dark:text-surface-border"
        />
      </div>
    </a>
  );
}
