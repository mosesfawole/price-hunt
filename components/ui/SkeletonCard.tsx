"use client";

export default function SkeletonCard() {
  return (
    <div className="panel rounded-[2rem] p-4 md:p-5">
      <div className="grid gap-4 md:grid-cols-[9rem_minmax(0,1fr)_10rem] md:gap-5">
        <div className="space-y-2">
          <div className="aspect-square w-28 animate-pulse rounded-[1.6rem] bg-surface-lightHover dark:bg-surface-hover md:w-36" />
          <div className="h-3 w-28 animate-pulse rounded bg-surface-lightHover dark:bg-surface-hover" />
        </div>
        <div className="space-y-3">
          <div className="h-6 w-40 animate-pulse rounded-full bg-surface-lightHover dark:bg-surface-hover" />
          <div className="h-8 w-5/6 animate-pulse rounded bg-surface-lightHover dark:bg-surface-hover" />
          <div className="h-8 w-2/3 animate-pulse rounded bg-surface-lightHover dark:bg-surface-hover" />
          <div className="editorial-rule" />
          <div className="h-16 w-full animate-pulse rounded-[1.25rem] bg-surface-lightHover dark:bg-surface-hover" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-24 animate-pulse rounded bg-surface-lightHover dark:bg-surface-hover" />
          <div className="h-10 w-28 animate-pulse rounded bg-surface-lightHover dark:bg-surface-hover" />
        </div>
      </div>
    </div>
  );
}
