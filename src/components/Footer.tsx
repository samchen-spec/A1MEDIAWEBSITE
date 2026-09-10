import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

/* Deliberately sparse. The final CTA above it does the work; this is just the
   address and the legal minimum. Don't rebuild the link farm here: the page is
   meant to end quietly.

   The results disclaimer stays. The site makes revenue claims, so dropping it
   would be a bad trade for a few pixels. */
export default function Footer() {
  return (
    <footer className="bg-[#070706] px-6 pb-14 pt-10">
      <div className="mx-auto max-w-content">
        <div className="flex flex-col items-center gap-6 border-t border-white/[0.06] pt-10 sm:flex-row sm:justify-between">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-[17px] text-[#D2CEC9] transition-colors hover:text-accent"
          >
            {CONTACT_EMAIL}
          </a>

          <div className="flex items-center gap-7 text-[13px] text-[#5F5A53]">
            <Link href="/privacy" className="transition-colors hover:text-[#D2CEC9]">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[#D2CEC9]">
              Terms
            </Link>
            <span>&copy; 2026 A1 Media</span>
          </div>
        </div>

        <p className="mt-8 max-w-3xl text-[11px] leading-relaxed text-[#3F3B36]">
          A1 Media is an independent creator partnership agency. Results mentioned are based on
          real partner outcomes but are not guaranteed. Individual results vary based on effort,
          market conditions, and offer quality.
        </p>
      </div>
    </footer>
  );
}
