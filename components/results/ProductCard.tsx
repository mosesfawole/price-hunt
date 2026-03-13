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
      className="group relative flex gap-4 p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: isBestDeal
          ? isDark
            ? "rgba(0,212,170,0.06)"
            : "rgba(0,212,170,0.04)"
          : isDark
            ? "#0f0f20"
            : "#ffffff",
        border: `1px solid ${isBestDeal ? "rgba(0,212,170,0.3)" : isDark ? "#252540" : "#e0e0f0"}`,
        boxShadow: isBestDeal ? "0 0 20px rgba(0,212,170,0.08)" : "none",
      }}
    >
      {/* Best deal badge */}
      {isBestDeal && (
        <div
          className="absolute -top-2.5 left-4 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{ background: "#00d4aa", color: "#000000" }}
        >
          <Award size={9} />
          BEST PRICE
        </div>
      )}

      {/* Rank */}
      <div
        className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono"
        style={{
          background: isDark ? "#1e1e38" : "#f0f0f8",
          color: "#5a5a8a",
        }}
      >
        {rank + 1}
      </div>

      {/* Product image */}
      <div
        className="w-16 h-16 rounded-lg overflow-hidden shrink-0 flex items-center justify-center"
        style={{ background: isDark ? "#1a1a30" : "#f4f4f8" }}
      >
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
        <p
          className="text-sm font-semibold font-display line-clamp-2 leading-snug"
          style={{ color: isDark ? "#ffffff" : "#1a1a2e" }}
        >
          {product.title}
        </p>

        <p className="text-xs mt-1 font-mono" style={{ color: "#5a5a8a" }}>
          {product.store}
        </p>

        {product.rating && (
          <div className="flex items-center gap-1 mt-1.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={9}
                style={{
                  color:
                    i < Math.round(product.rating!)
                      ? "#f0c040"
                      : isDark
                        ? "#252540"
                        : "#e0e0f0",
                  fill: i < Math.round(product.rating!) ? "#f0c040" : "none",
                }}
              />
            ))}
            <span
              className="text-[11px] font-mono"
              style={{ color: "#5a5a8a" }}
            >
              {product.rating}{" "}
              {product.reviews ? `(${product.reviews.toLocaleString()})` : ""}
            </span>
          </div>
        )}
      </div>

      {/* Price column */}
      <div className="flex flex-col items-end justify-between shrink-0">
        <span
          className="text-lg font-bold font-mono"
          style={{
            color: isBestDeal ? "#00d4aa" : isDark ? "#ffffff" : "#1a1a2e",
          }}
        >
          ${product.price.toFixed(2)}
        </span>

        {isExpensive && (
          <span className="text-[10px] font-mono" style={{ color: "#ff4d6d" }}>
            +${priceDiff.toFixed(2)}
          </span>
        )}

        <ExternalLink
          size={12}
          className="transition-colors"
          style={{ color: isDark ? "#252540" : "#c0c0d0" }}
        />
      </div>
    </a>
  );
}
