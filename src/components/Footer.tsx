"use client";

import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/[0.08]">
      <div className="max-w-content mx-auto px-6 pt-20 pb-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div>
            <Link href="/" className="inline-block" aria-label="A1 Media — home">
              <Image src="/a1-logo.png" alt="A1 Media" width={245} height={170} className="h-11 w-auto" />
            </Link>
            <p className="mt-5 max-w-[380px] text-[17px] leading-[1.7] text-[#B5B1AC] font-light">
              We help, fund and launch creators — crafting the offer, covering the ad spend, and
              running everything behind the brand.
            </p>
            <a
              href="mailto:contact@a1media.info"
              className="mt-6 inline-block text-[15px] text-[#B5B1AC] hover:text-accent transition-colors"
            >
              contact@a1media.info
            </a>
          </div>

          <nav className="flex flex-col gap-3.5 md:items-end">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] uppercase tracking-[0.16em] text-[#B5B1AC] hover:text-accent transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-white/[0.08]">
        <div className="max-w-content mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex items-center gap-7">
              <Link href="/privacy" className="text-xs text-[#5F5A53] hover:text-[#B5B1AC] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-[#5F5A53] hover:text-[#B5B1AC] transition-colors">
                Terms &amp; Conditions
              </Link>
            </div>

            <p className="text-xs text-[#5F5A53]">&copy; 2026 A1 Media. All rights reserved.</p>
          </div>

          <p className="mt-8 text-xs text-[#4A453F] leading-relaxed max-w-3xl">
            A1 Media is an independent creator partnership agency. Results mentioned are based on
            real partner outcomes but are not guaranteed. Individual results vary based on effort,
            market conditions, and offer quality.
          </p>
        </div>
      </div>
    </footer>
  );
}
