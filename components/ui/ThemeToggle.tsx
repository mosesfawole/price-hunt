"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useSearchStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 rounded-full border border-surface-lightBorder bg-surface-lightCard px-3 py-2 text-sm text-brand-text-light shadow-soft transition-colors hover:border-brand-green dark:border-surface-border dark:bg-surface-card dark:text-brand-text-dark"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <>
          <Sun size={15} className="text-brand-gold" />
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon size={15} className="text-brand-blue" />
          <span className="hidden sm:inline">Dark</span>
        </>
      )}
    </button>
  );
}
