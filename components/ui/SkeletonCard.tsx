"use client";

export default function SkeletonCard() {
  return (
    <div className="panel rounded-[1.65rem] p-4 md:p-5">
      <div className="grid gap-4 md:grid-cols-[7.25rem_minmax(0,1fr)_11rem]">
        <div className="h-24 w-24 animate-pulse rounded-[1.4rem] bg-surface-lightHover dark:bg-surface-hover md:h-28 md:w-28" />
        <div className="space-y-3">
          <div className="h-6 w-32 animate-pulse rounded-full bg-surface-lightHover dark:bg-surface-hover" />
          <div className="h-5 w-5/6 animate-pulse rounded bg-surface-lightHover dark:bg-surface-hover" />
          <div className="h-5 w-2/3 animate-pulse rounded bg-surface-lightHover dark:bg-surface-hover" />
          <div className="flex gap-2">
            <div className="h-8 w-28 animate-pulse rounded-full bg-surface-lightHover dark:bg-surface-hover" />
            <div className="h-8 w-32 animate-pulse rounded-full bg-surface-lightHover dark:bg-surface-hover" />
          </div>
          <div className="h-12 w-full animate-pulse rounded-2xl bg-surface-lightHover dark:bg-surface-hover" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-20 animate-pulse rounded bg-surface-lightHover dark:bg-surface-hover" />
          <div className="h-8 w-24 animate-pulse rounded bg-surface-lightHover dark:bg-surface-hover" />
          <div className="h-10 w-10 animate-pulse rounded-full bg-surface-lightHover dark:bg-surface-hover" />
        </div>
      </div>
    </div>
  );
}
