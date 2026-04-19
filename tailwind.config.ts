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
          DEFAULT: "#11181d",
          card: "#182229",
          hover: "#22303a",
          border: "#31424e",
          light: "#f4efe6",
          lightCard: "#fffaf3",
          lightBorder: "#d9ccbb",
          lightHover: "#efe6d9",
        },
        brand: {
          green: "#0f766e",
          red: "#b42318",
          blue: "#2457c5",
          gold: "#a16207",
          muted: "#6c6253",
          text: {
            dark: "#f6f1e8",
            light: "#1f2937",
          },
        },
        accent: {
          green: "rgba(15,118,110,0.12)",
          greenBorder: "rgba(15,118,110,0.24)",
          greenBorderStrong: "rgba(15,118,110,0.42)",
          greenGlow: "rgba(15,118,110,0.14)",
          blue: "rgba(36,87,197,0.1)",
          blueBorder: "rgba(36,87,197,0.22)",
          red: "rgba(180,35,24,0.1)",
          redBorder: "rgba(180,35,24,0.22)",
          gold: "rgba(161,98,7,0.08)",
          goldBorder: "rgba(161,98,7,0.24)",
          ink: "rgba(31,41,55,0.92)",
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
        brand: "0 16px 42px rgba(15,118,110,0.12)",
        focus: "0 0 0 3px rgba(15,118,110,0.16)",
        soft: "0 18px 60px rgba(46, 38, 25, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
