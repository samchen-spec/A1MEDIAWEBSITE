import { Inter, Playfair_Display } from "next/font/google";

/* Self-hosted via next/font. Do NOT go back to an @import in globals.css — it
   lands after Tailwind's rules in the compiled sheet, which makes it invalid,
   and the browser silently drops it (everything falls back to system fonts). */

export const inter = Inter({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-inter",
});

/* The headline accent phrase — italic 600 is the only cut used anywhere. */
export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: "600",
  style: "italic",
  display: "swap",
  variable: "--font-playfair",
});
