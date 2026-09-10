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
        "text-body": "var(--text-body)",
        "text-muted": "var(--text-muted)",
        "text-dim": "var(--text-dim)",
        accent: "rgb(var(--accent-channels) / <alpha-value>)",
        "accent-glow": "rgb(var(--accent-glow-channels) / <alpha-value>)",
        "accent-light": "rgb(var(--accent-light-channels) / <alpha-value>)",
        blue: "rgb(var(--accent-channels) / <alpha-value>)",
        "accent-deep": "rgb(var(--accent-deep-channels) / <alpha-value>)",
        success: "#4ADE80",
        error: "#E05C5C",
      },
      fontFamily: {
        // Inter does all the work. Playfair is applied via .accent-italic only.
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1248px",
        inner: "1128px",
        prose: "760px",
      },
      borderRadius: {
        none: "0",
        sm: "10px",
        DEFAULT: "14px",
        md: "20px",
        lg: "24px",
        xl: "30px",
        full: "9999px",
      },
      fontSize: {
        // Reference scale: headings at 1.2, body at 1.6.
        h1: ["72px", { lineHeight: "1.2", fontWeight: "600" }],
        h2: ["52px", { lineHeight: "1.2", fontWeight: "600" }],
        h3: ["28px", { lineHeight: "1.4", fontWeight: "500" }],
        h4: ["24px", { lineHeight: "1.4", fontWeight: "500" }],
        statement: ["44px", { lineHeight: "1.2", fontWeight: "500" }],
        body: ["18px", { lineHeight: "1.6" }],
      },
    },
  },
  plugins: [],
};

export default config;
