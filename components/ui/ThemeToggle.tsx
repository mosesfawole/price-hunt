"use client";
import { useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useSearchStore();

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-all cursor-pointer bg-surface-lightHover dark:bg-surface-hover border border-surface-lightBorder dark:border-surface-border"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun size={14} className="text-brand-gold" />
      ) : (
        <Moon size={14} className="text-brand-blue" />
      )}
    </button>
  );
}
