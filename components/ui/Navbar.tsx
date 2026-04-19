"use client";

import { TrendingUp } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { clearResults } = useSearchStore();

  return (
    <nav className="sticky top-0 z-30 border-b border-surface-lightBorder/70 bg-surface-light/88 backdrop-blur-xl dark:border-surface-border dark:bg-surface-card/82">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:h-20 md:px-8">
        <button
          onClick={clearResults}
          className="flex items-center gap-3 text-left"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-accent-greenBorder bg-accent-green shadow-brand md:h-12 md:w-12">
            <TrendingUp size={18} className="text-brand-green" />
          </div>
          <div>
            <p className="text-xl font-display font-semibold tracking-tight text-brand-text-light dark:text-brand-text-dark md:text-2xl">
              Price<span className="text-brand-green">Hunt</span>
            </p>
            <p className="hidden text-xs uppercase tracking-[0.22em] text-brand-muted md:block">
              Match-aware buying desk
            </p>
          </div>
        </button>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-3 md:flex">
            <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-brand-muted">
              Google Shopping listings
            </span>
            <div className="h-8 w-px bg-surface-lightBorder dark:bg-surface-border" />
            <span className="text-sm text-brand-muted">
              Ranked by relevance first, price second
            </span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
