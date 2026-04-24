import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:      "#F5F0EB",
        "bg-alt":"#FAFAF7",
        surface: "#FBF7F2",
        ink:     "#3C3A36",
        "ink-soft": "#6B655E",
        stone:   "#B8A99A",
        sand:    "#D4C9BC",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans:  ["var(--font-inter)", "-apple-system", "system-ui", "sans-serif"],
        mono:  ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      borderColor: {
        line:     "rgba(60,58,54,0.12)",
        "line-soft": "rgba(60,58,54,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
