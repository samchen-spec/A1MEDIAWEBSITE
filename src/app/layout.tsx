import type { Metadata } from "next";
import "./globals.css";
import { inter, playfair } from "./fonts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "GrowingOffers | Done-For-You High-Ticket Webinar Funnels",
  description:
    "We build established creators a high-ticket offer and launch it as a webinar funnel in 10 to 14 days. You teach for 2 hours. We do the other 99%.",
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
