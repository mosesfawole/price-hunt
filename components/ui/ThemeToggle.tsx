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
      className="p-2 rounded-lg transition-all cursor-pointer"
      style={{
        background: isDark ? "#13132a" : "#e8e8f0",
        border: `1px solid ${isDark ? "#252540" : "#d0d0e0"}`,
      }}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun size={14} className="text-brand-gold" />
      ) : (
        <Moon
          size={14}
          className="text-brand-blue"
          style={{ color: "#4d9fff" }}
        />
      )}
    </button>
  );
}
