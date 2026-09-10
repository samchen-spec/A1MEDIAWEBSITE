"use client";

import Link from "next/link";
import Image from "next/image";
import { CAL_LINK, CONTACT_EMAIL, SECTIONS } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-[#070706] border-t border-white/[0.07]">
      <div className="max-w-content mx-auto px-6 pt-20 pb-14">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
          <div>
            <Link href="/" className="inline-block" aria-label="A1 Media — home">
              <Image src="/a1-logo.png" alt="A1 Media" width={245} height={170} className="h-11 w-auto" />
            </Link>
            <p className="mt-5 max-w-[380px] text-body text-[#8A857D]">
              We help, fund and launch creators — crafting the offer, covering the ad spend, and
              running everything behind the brand.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-6 inline-block text-body text-[#D2CEC9] hover:text-accent transition-colors"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <nav className="grid grid-cols-2 gap-x-12 gap-y-3.5 md:flex md:flex-col md:items-end">
            {SECTIONS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[16px] text-[#8A857D] hover:text-accent transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <a
              href={CAL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[16px] text-accent hover:text-[#F2DCB4] transition-colors duration-200"
            >
              Book A Call
            </a>
          </nav>
        </div>
      </div>

      <div className="border-t border-white/[0.07]">
        <div className="max-w-content mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex items-center gap-7">
              <Link href="/privacy" className="text-xs text-[#8A857D] hover:text-[#D2CEC9] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-[#8A857D] hover:text-[#D2CEC9] transition-colors">
                Terms &amp; Conditions
              </Link>
            </div>

            <p className="text-xs text-[#8A857D]">&copy; 2026 A1 Media. All rights reserved.</p>
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
