"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CAL_LINK, SECTIONS } from "@/lib/site";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 md:top-6 md:px-6">
      <div className="mx-auto max-w-[1140px]">
        <div className="relative flex items-center justify-between gap-6 rounded-full border border-white/[0.07] bg-[#151413]/85 px-5 py-3 backdrop-blur-xl md:px-7">
          <Link href="/" className="relative z-10 shrink-0" aria-label="A1 Media home">
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
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 lg:flex">
            {SECTIONS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[16px] text-[#D2CEC9] transition-colors duration-200 hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href={CAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ring relative z-10 hidden shrink-0 md:inline-block"
          >
            <span className="btn-ring__face !py-[5px] !text-[16px]">Book a Call</span>
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative z-10 flex flex-col gap-[5px] p-2 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span className={`h-px w-6 bg-[#FAFAFA] transition-all duration-200 ${mobileOpen ? "translate-y-[6px] rotate-45" : ""}`} />
            <span className={`h-px w-6 bg-[#FAFAFA] transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`h-px w-6 bg-[#FAFAFA] transition-all duration-200 ${mobileOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
          </button>
        </div>

        {mobileOpen && (
          <div className="mt-2 rounded-2xl border border-white/[0.08] bg-[#151413]/95 px-6 py-6 backdrop-blur-xl lg:hidden">
            <nav className="flex flex-col gap-4">
              {SECTIONS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[17px] text-[#D2CEC9] transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={CAL_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="btn-ring mt-2 text-center"
              >
                <span className="btn-ring__face">Book a Call</span>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
