"use client";
import { useSearchStore } from "@/store/useSearchStore";

export default function SkeletonCard() {
  const { isDark } = useSearchStore();

  return (
    <div
      className="rounded-xl p-4 flex gap-4"
      style={{
        background: isDark ? "#0f0f20" : "#ffffff",
        border: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
      }}
    >
      {/* Image skeleton */}
      <div
        className="w-16 h-16 rounded-lg shrink-0 animate-pulse"
        style={{ background: isDark ? "#1e1e38" : "#e8e8f0" }}
      />

      {/* Content skeleton */}
      <div className="flex-1 space-y-2">
        <div
          className="h-3 rounded animate-pulse w-3/4"
          style={{ background: isDark ? "#1e1e38" : "#e8e8f0" }}
        />
        <div
          className="h-3 rounded animate-pulse w-1/2"
          style={{ background: isDark ? "#1e1e38" : "#e8e8f0" }}
        />
        <div
          className="h-3 rounded animate-pulse w-1/4"
          style={{ background: isDark ? "#1e1e38" : "#e8e8f0" }}
        />
      </div>

      {/* Price skeleton */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <div
          className="h-5 w-16 rounded animate-pulse"
          style={{ background: isDark ? "#1e1e38" : "#e8e8f0" }}
        />
        <div
          className="h-3 w-12 rounded animate-pulse"
          style={{ background: isDark ? "#1e1e38" : "#e8e8f0" }}
        />
      </div>
    </div>
  );
}
