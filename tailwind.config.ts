import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        "bg-card": "var(--bg-card)",
        accent: "var(--accent)",
        "accent-glow": "var(--accent-glow)",
        "accent-light": "var(--accent-light)",
        blue: "var(--blue)",
        success: "#4ADE80",
        error: "#E05C5C",
      },
      fontFamily: {
        sans: ['"Inter"', "sans-serif"],
        serif: ['"Playfair Display"', "serif"],
      },
      letterSpacing: {
        hero: "-0.02em",
        body: "0.01em",
      },
      maxWidth: {
        content: "1200px",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        ticker: "ticker 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
