import type { Metadata } from "next";
import "./globals.css";
import { inter, playfair } from "./fonts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "GrowingOffers | Done-For-You High-Ticket Webinar Funnels",
  description:
    "We build and run done-for-you high-ticket webinar funnels for established creators, live within 14 days. Paid on profit share, so we only win when you do.",
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
