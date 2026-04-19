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
          DEFAULT: "#111619",
          card: "#1a2328",
          hover: "#243039",
          border: "#33434f",
          light: "#f6efe2",
          lightCard: "#fffaf2",
          lightBorder: "#d8c8b6",
          lightHover: "#efe4d3",
        },
        brand: {
          green: "#385a4f",
          red: "#8f3d2f",
          blue: "#305e8f",
          gold: "#8b6b2f",
          muted: "#766b5c",
          text: {
            dark: "#f7f1e8",
            light: "#1f1a17",
          },
        },
        accent: {
          green: "rgba(56,90,79,0.12)",
          greenBorder: "rgba(56,90,79,0.26)",
          greenBorderStrong: "rgba(56,90,79,0.4)",
          greenGlow: "rgba(56,90,79,0.12)",
          blue: "rgba(48,94,143,0.1)",
          blueBorder: "rgba(48,94,143,0.22)",
          red: "rgba(143,61,47,0.1)",
          redBorder: "rgba(143,61,47,0.22)",
          gold: "rgba(139,107,47,0.09)",
          goldBorder: "rgba(139,107,47,0.22)",
          ink: "rgba(31,26,23,0.9)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        display: ["var(--font-display)", "serif"],
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
        brand: "0 20px 44px rgba(56, 90, 79, 0.15)",
        focus: "0 0 0 3px rgba(56, 90, 79, 0.14)",
        soft: "0 18px 40px rgba(63, 47, 28, 0.09)",
      },
    },
  },
  plugins: [],
};

export default config;
