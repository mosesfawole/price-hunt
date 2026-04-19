"use client";

import { TrendingUp } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { clearResults } = useSearchStore();

  return (
    <nav className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-surface-lightBorder bg-surface-light px-4 dark:border-surface-border dark:bg-surface-card md:px-8">
      <button
        onClick={clearResults}
        className="flex shrink-0 items-center gap-2"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-accent-greenBorder bg-accent-green">
          <TrendingUp size={14} className="text-brand-green" />
        </div>
        <span className="text-sm font-display font-bold tracking-tight text-brand-text-light dark:text-brand-text-dark">
          Price<span className="text-brand-green">Hunt</span>
        </span>
      </button>

      <div className="ml-auto flex items-center gap-3">
        <span className="hidden text-xs font-mono text-brand-muted sm:block">
          Google Shopping price snapshots
        </span>
        <ThemeToggle />
      </div>
    </nav>
  );
}
