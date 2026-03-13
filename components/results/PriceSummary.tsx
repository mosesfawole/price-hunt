"use client";
import { useSearchStore } from "@/store/useSearchStore";
import { TrendingDown, TrendingUp, BarChart2, Zap } from "lucide-react";

export default function PriceSummary() {
  const { results, query, isCached, isDark } = useSearchStore();

  if (!results.length) return null;

  const lowest = results[0].price;
  const highest = results[results.length - 1].price;
  const average = results.reduce((sum, p) => sum + p.price, 0) / results.length;
  const savings = highest - lowest;
  const savingsPercent = ((savings / highest) * 100).toFixed(0);

  const stats = [
    {
      icon: <TrendingDown size={14} />,
      label: "Lowest",
      value: `$${lowest.toFixed(2)}`,
      accent: "#00d4aa",
      sub: results[0].store,
    },
    {
      icon: <TrendingUp size={14} />,
      label: "Highest",
      value: `$${highest.toFixed(2)}`,
      accent: "#ff4d6d",
      sub: results[results.length - 1].store,
    },
    {
      icon: <BarChart2 size={14} />,
      label: "Average",
      value: `$${average.toFixed(2)}`,
      accent: "#4d9fff",
      sub: `${results.length} stores`,
    },
    {
      icon: <Zap size={14} />,
      label: "Max Savings",
      value: `$${savings.toFixed(2)}`,
      accent: "#f0c040",
      sub: `${savingsPercent}% off`,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2
          className="text-sm font-display font-bold"
          style={{ color: isDark ? "#ffffff" : "#1a1a2e" }}
        >
          Results for <span style={{ color: "#00d4aa" }}>"{query}"</span>
        </h2>
        <p className="text-xs font-mono" style={{ color: "#5a5a8a" }}>
          {results.length} products
          {isCached && (
            <span
              className="ml-2 px-1.5 py-0.5 rounded text-[10px]"
              style={{ background: "rgba(77,159,255,0.1)", color: "#4d9fff" }}
            >
              cached
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-3"
            style={{
              background: isDark ? "#0f0f20" : "#ffffff",
              border: `1px solid ${isDark ? "#252540" : "#e0e0f0"}`,
              borderBottom: `2px solid ${stat.accent}`,
            }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <span style={{ color: stat.accent }}>{stat.icon}</span>
              <span
                className="text-[10px] font-mono tracking-widest uppercase"
                style={{ color: "#5a5a8a" }}
              >
                {stat.label}
              </span>
            </div>
            <p
              className="text-base font-bold font-mono"
              style={{ color: isDark ? "#ffffff" : "#1a1a2e" }}
            >
              {stat.value}
            </p>
            <p
              className="text-[10px] font-mono mt-0.5"
              style={{ color: "#5a5a8a" }}
            >
              {stat.sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
