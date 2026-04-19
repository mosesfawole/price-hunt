"use client";
import { useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useSearchStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full border border-surface-lightBorder bg-surface-lightCard p-2.5 shadow-soft transition-all hover:border-brand-green dark:border-surface-border dark:bg-surface-card"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun size={15} className="text-brand-gold" />
      ) : (
        <Moon size={15} className="text-brand-blue" />
      )}
    </button>
  );
}
