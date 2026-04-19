"use client";

export default function SkeletonCard() {
  return (
    <div className="rounded-xl p-4 flex gap-4 bg-surface-lightCard dark:bg-surface-card border border-surface-lightBorder dark:border-surface-border">
      <div className="w-16 h-16 rounded-lg shrink-0 animate-pulse bg-surface-lightHover dark:bg-surface-hover" />
      <div className="flex-1 space-y-2">
        <div className="h-3 rounded animate-pulse w-3/4 bg-surface-lightHover dark:bg-surface-hover" />
        <div className="h-3 rounded animate-pulse w-1/2 bg-surface-lightHover dark:bg-surface-hover" />
        <div className="h-3 rounded animate-pulse w-1/4 bg-surface-lightHover dark:bg-surface-hover" />
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <div className="h-5 w-16 rounded animate-pulse bg-surface-lightHover dark:bg-surface-hover" />
        <div className="h-3 w-12 rounded animate-pulse bg-surface-lightHover dark:bg-surface-hover" />
      </div>
    </div>
  );
}
