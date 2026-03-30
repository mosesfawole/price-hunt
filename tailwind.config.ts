import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#08080f",
          card: "#0f0f20",
          hover: "#161628",
          border: "#252540",
          light: "#f4f4f8",
          lightCard: "#ffffff",
          lightBorder: "#e0e0f0",
          lightHover: "#f4f4f8",
        },
        brand: {
          green: "#00d4aa",
          red: "#ff4d6d",
          blue: "#4d9fff",
          gold: "#f0c040",
          muted: "#5a5a8a",
          text: {
            dark: "#ffffff",
            light: "#1a1a2e",
          },
        },
        accent: {
          green: "rgba(0,212,170,0.1)",
          greenBorder: "rgba(0,212,170,0.2)",
          greenBorderStrong: "rgba(0,212,170,0.3)",
          greenGlow: "rgba(0,212,170,0.08)",
          red: "rgba(255,77,109,0.1)",
          gold: "rgba(240,192,64,0.06)",
          goldBorder: "rgba(240,192,64,0.2)",
        },
      },
      fontFamily: {
        mono: ["var(--font-jetbrains)", "monospace"],
        display: ["var(--font-syne)", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease forwards",
        "slide-up": "slideUp 0.4s ease forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        brand: "0 0 20px rgba(0,212,170,0.08)",
        focus: "0 0 0 3px rgba(0,212,170,0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
