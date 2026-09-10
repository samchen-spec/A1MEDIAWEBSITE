"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/* Lenis takes ownership of the scroll, which means CSS `scroll-behavior: smooth`
   and the browser's native anchor jump both stop working. Every in-page link on
   this site is a hash anchor, so the click handler below is not optional — drop
   it and the whole nav silently dies. */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;

      const link = (e.target as HTMLElement | null)?.closest?.("a");
      if (!link) return;

      const raw = link.getAttribute("href");
      if (!raw) return;

      // Matches "#id" and "/#id" — the header uses the latter so the links also
      // work from /privacy and /terms.
      const hash = raw.startsWith("#") ? raw : raw.startsWith("/#") ? raw.slice(1) : null;
      if (!hash || hash === "#") return;

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      // No offset here — Lenis already honours the section's `scroll-mt-24`,
      // and passing one as well lands the heading twice as far down.
      lenis.scrollTo(target as HTMLElement);
      history.pushState(null, "", hash);
    };

    document.addEventListener("click", onClick);

    // Land on the right section when someone arrives with a hash already set.
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        requestAnimationFrame(() =>
          lenis.scrollTo(target as HTMLElement, { immediate: true }),
        );
      }
    }

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
