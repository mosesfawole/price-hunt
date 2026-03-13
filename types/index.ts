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
        },
        brand: {
          green: "#00d4aa",
          red: "#ff4d6d",
          blue: "#4d9fff",
          gold: "#f0c040",
          muted: "#5a5a8a",
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
    },
  },
  plugins: [],
};

export default config;
