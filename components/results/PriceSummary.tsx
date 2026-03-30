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
      accentClass: "border-brand-green",
      iconClass: "text-brand-green",
      sub: results[0].store,
    },
    {
      icon: <TrendingUp size={14} />,
      label: "Highest",
      value: `$${highest.toFixed(2)}`,
      accentClass: "border-brand-red",
      iconClass: "text-brand-red",
      sub: results[results.length - 1].store,
    },
    {
      icon: <BarChart2 size={14} />,
      label: "Average",
      value: `$${average.toFixed(2)}`,
      accentClass: "border-brand-blue",
      iconClass: "text-brand-blue",
      sub: `${results.length} stores`,
    },
    {
      icon: <Zap size={14} />,
      label: "Max Savings",
      value: `$${savings.toFixed(2)}`,
      accentClass: "border-brand-gold",
      iconClass: "text-brand-gold",
      sub: `${savingsPercent}% off`,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-display font-bold text-brand-text-light dark:text-brand-text-dark">
          Results for <span className="text-brand-green">"{query}"</span>
        </h2>
        <p className="text-xs font-mono text-brand-muted">
          {results.length} products
          {isCached && (
            <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-accent-blue text-brand-blue">
              cached
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            className={`rounded-xl p-3 bg-surface-lightCard dark:bg-surface-card border border-surface-lightBorder dark:border-surface-border ${stat.accentClass} border-b-2`}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <span className={stat.iconClass}>{stat.icon}</span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-brand-muted">
                {stat.label}
              </span>
            </div>
            <p className="text-base font-bold font-mono text-brand-text-light dark:text-brand-text-dark">
              {stat.value}
            </p>
            <p className="text-[10px] font-mono mt-0.5 text-brand-muted">
              {stat.sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
