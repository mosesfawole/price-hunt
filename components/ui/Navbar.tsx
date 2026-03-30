"use client";
import { TrendingUp } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { isDark, clearResults } = useSearchStore();

  return (
    <nav className="h-14 flex items-center px-4 md:px-8 gap-3 shrink-0 sticky top-0 z-30 bg-surface-light dark:bg-surface-card border-b border-surface-lightBorder dark:border-surface-border">
      {/* Logo */}
      <button
        onClick={clearResults}
        className="flex items-center gap-2 shrink-0 cursor-pointer"
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-accent-green border border-accent-greenBorder">
          <TrendingUp size={14} className="text-brand-green" />
        </div>
        <span className="font-display font-bold tracking-tight text-sm text-brand-text-light dark:text-brand-text-dark">
          Price<span className="text-brand-green">Hunt</span>
        </span>
      </button>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden sm:block text-xs font-mono text-brand-muted">
          Compare prices instantly
        </span>
        <ThemeToggle />
      </div>
    </nav>
  );
}
