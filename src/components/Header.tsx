import Link from "next/link";
import Image from "next/image";

/* Logo only, the way the reference sets it. There is no nav and no header CTA:
   the page is meant to be scrolled, and the section links live in the footer.
   Don't reintroduce a nav bar here without a reason.

   The mark is a stacked lockup (GO over the wordmark), so it needs more height
   than a single-line logo would: below about 44px the wordmark stops reading.
   The source art is keyed to transparency, so it sits on any dark band. */
export default function Header() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-50 px-6 pt-7 md:px-10 md:pt-9">
      <Link href="/" className="pointer-events-auto inline-block" aria-label="GrowingOffers home">
        <Image
          src="/growingoffers-logo.png"
          alt="GrowingOffers"
          width={830}
          height={385}
          priority
          className="h-12 w-auto opacity-95 transition-opacity duration-300 hover:opacity-100 md:h-14"
        />
      </Link>
    </header>
  );
}
