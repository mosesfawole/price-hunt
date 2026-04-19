"use client";

import { TrendingUp } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { clearResults } = useSearchStore();

  return (
    <nav className="sticky top-0 z-30 border-b border-surface-lightBorder/80 bg-surface-light/85 backdrop-blur-xl dark:border-surface-border dark:bg-surface-card/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:px-8">
      <button
        onClick={clearResults}
        className="flex shrink-0 items-center gap-3"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-accent-greenBorder bg-accent-green shadow-brand">
          <TrendingUp size={17} className="text-brand-green" />
        </div>
        <div className="text-left">
          <span className="block text-lg font-display font-semibold tracking-tight text-brand-text-light dark:text-brand-text-dark">
            Price<span className="text-brand-green">Hunt</span>
          </span>
          <span className="hidden text-xs text-brand-muted md:block">
            Cleaner product matching for shopping snapshots
          </span>
        </div>
      </button>

      <div className="ml-auto flex items-center gap-3">
        <span className="hidden rounded-full border border-surface-lightBorder bg-surface-lightCard px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.18em] text-brand-muted shadow-soft dark:border-surface-border dark:bg-surface-card sm:block">
          Google Shopping snapshots
        </span>
        <ThemeToggle />
      </div>
      </div>
    </nav>
  );
}
