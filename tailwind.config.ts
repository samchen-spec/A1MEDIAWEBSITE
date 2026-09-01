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
        accent: "rgb(var(--accent-channels) / <alpha-value>)",
        "accent-glow": "rgb(var(--accent-glow-channels) / <alpha-value>)",
        "accent-light": "rgb(var(--accent-light-channels) / <alpha-value>)",
        blue: "rgb(var(--accent-channels) / <alpha-value>)",
        "accent-deep": "rgb(var(--accent-deep-channels) / <alpha-value>)",
        success: "#4ADE80",
        error: "#E05C5C",
      },
      fontFamily: {
        // Geometric sans for body and UI, high-contrast serif for display.
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        serif: ['"Playfair Display"', "Georgia", "serif"],
        text: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      letterSpacing: {
        hero: "-0.022em",
        body: "0",
        label: "0.26em",
      },
      maxWidth: {
        content: "1200px",
      },
      borderRadius: {
        none: "0",
        sm: "6px",
        DEFAULT: "10px",
        md: "10px",
        lg: "12px",
        xl: "14px",
        "2xl": "16px",
        full: "9999px",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        ticker: "ticker 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
