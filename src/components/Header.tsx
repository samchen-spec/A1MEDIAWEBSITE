"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#clients", label: "Clients" },
  { href: "/#founders", label: "Founders" },
  { href: "/#roadmap", label: "Roadmap" },
  { href: "/#faq", label: "FAQ" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 md:top-6 md:px-6">
      <div className="mx-auto max-w-[1140px]">
        <div className="relative flex items-center justify-between gap-6 rounded-full border border-white/[0.08] bg-[#121110]/85 px-5 py-3 backdrop-blur-xl md:px-7">
          <Link href="/" className="relative z-10 shrink-0" aria-label="A1 Media — home">
            <Image
              src="/a1-logo.png"
              alt="A1 Media"
              width={245}
              height={170}
              priority
              className="h-7 w-auto md:h-8"
            />
          </Link>

          {/* Absolutely centred so uneven logo/CTA widths can't pull it off-axis */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] text-[#B5B1AC] transition-colors duration-200 hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <a
            href="#schedule"
            className="btn-gold relative z-10 hidden shrink-0 rounded-full px-6 py-2.5 text-[13px] font-medium uppercase tracking-[0.14em] md:inline-block"
          >
            Schedule My Call
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative z-10 flex flex-col gap-[5px] p-2 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span className={`h-px w-6 bg-[#FAFAFA] transition-all duration-200 ${mobileOpen ? "translate-y-[6px] rotate-45" : ""}`} />
            <span className={`h-px w-6 bg-[#FAFAFA] transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`h-px w-6 bg-[#FAFAFA] transition-all duration-200 ${mobileOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
          </button>
        </div>

        {mobileOpen && (
          <div className="mt-2 rounded-2xl border border-white/[0.08] bg-[#121110]/95 px-6 py-6 backdrop-blur-xl md:hidden">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[16px] text-[#B5B1AC] transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="#schedule"
                onClick={() => setMobileOpen(false)}
                className="btn-gold mt-2 rounded-full px-6 py-3 text-center text-[13px] font-medium uppercase tracking-[0.14em]"
              >
                Schedule My Call
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
