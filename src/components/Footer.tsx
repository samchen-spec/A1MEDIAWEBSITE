"use client";

import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
];

export default function Footer() {
  return (
    <footer className="bg-black">
      {/* Top section */}
      <div className="max-w-content mx-auto px-6 pt-20 pb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <Link href="/" className="inline-block">
            <span className="font-serif text-2xl font-bold tracking-tight">
              <span className="text-accent">A1</span> Media
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#9CA3AF] hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Contact */}
      <div className="max-w-content mx-auto px-6 pb-12">
        <p className="text-sm text-[#6B7280] text-center md:text-left">
          contact@a1media.info
        </p>
      </div>

      {/* Divider + Legal */}
      <div className="border-t border-white/5">
        <div className="max-w-content mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Legal links */}
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-xs text-[#4B5563] hover:text-[#9CA3AF] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-[#4B5563] hover:text-[#9CA3AF] transition-colors">
                Terms &amp; Conditions
              </Link>
            </div>

            <p className="text-xs text-[#4B5563]">
              &copy; 2026 A1 Media. All rights reserved.
            </p>
          </div>

          <p className="mt-8 text-xs text-[#374151] leading-relaxed max-w-3xl">
            A1 Media is an independent creator partnership agency. Results mentioned are based on real partner outcomes but are not guaranteed. Individual results vary based on effort, market conditions, and offer quality.
          </p>
        </div>
      </div>
    </footer>
  );
}
