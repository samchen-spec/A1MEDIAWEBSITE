import Link from "next/link";
import Image from "next/image";

/* Logo only, the way the reference sets it. There is no nav and no header CTA:
   the page is meant to be scrolled, and the section links live in the footer.
   Don't reintroduce a nav bar here without a reason. */
export default function Header() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-50 px-6 pt-7 md:px-10 md:pt-9">
      <Link href="/" className="pointer-events-auto inline-block" aria-label="A1 Media home">
        <Image
          src="/a1-logo.png"
          alt="A1 Media"
          width={245}
          height={170}
          priority
          className="h-8 w-auto opacity-95 transition-opacity duration-300 hover:opacity-100 md:h-9"
        />
      </Link>
    </header>
  );
}
