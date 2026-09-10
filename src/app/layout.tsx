import type { Metadata } from "next";
import "./globals.css";
import { inter, playfair } from "./fonts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "A1 Media — We Help, Fund & Launch Creators",
  description:
    "We craft established creators a high-ticket offer from start to finish — then we pay for the ad spend ourselves to scale it. No retainers. Revenue share only.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">
        <SmoothScroll />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
