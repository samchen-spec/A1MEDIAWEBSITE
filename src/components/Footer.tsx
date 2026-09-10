import Link from "next/link";

/* Deliberately almost nothing. The final CTA above does the work; the page is
   meant to end quietly. Only the two legal links remain. */
export default function Footer() {
  return (
    <footer className="bg-[#070706] px-6 pb-12 pt-10">
      <div className="mx-auto max-w-content">
        <div className="flex items-center justify-center gap-8 border-t border-white/[0.06] pt-10 text-[13px] text-[#5F5A53]">
          <Link href="/privacy" className="transition-colors hover:text-[#D2CEC9]">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-[#D2CEC9]">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
