"use client";
import { TrendingUp } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { isDark, clearResults } = useSearchStore();

  return (
    <nav
      className="h-14 flex items-center px-4 md:px-8 gap-3 shrink-0 sticky top-0 z-30"
      style={{
        background: isDark ? "#0a0a18" : "#ffffff",
        borderBottom: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
      }}
    >
      {/* Logo */}
      <button
        onClick={clearResults}
        className="flex items-center gap-2 shrink-0"
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background: "rgba(0,212,170,0.1)",
            border: "1px solid rgba(0,212,170,0.25)",
          }}
        >
          <TrendingUp
            size={14}
            className="text-brand-green"
            style={{ color: "#00d4aa" }}
          />
        </div>
        <span
          className="font-display font-bold tracking-tight text-sm"
          style={{ color: isDark ? "#ffffff" : "#1a1a2e" }}
        >
          Price<span style={{ color: "#00d4aa" }}>Hunt</span>
        </span>
      </button>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        <span
          className="hidden sm:block text-xs font-mono"
          style={{ color: isDark ? "#5a5a8a" : "#8888aa" }}
        >
          Compare prices instantly
        </span>
        <ThemeToggle />
      </div>
    </nav>
  );
}
