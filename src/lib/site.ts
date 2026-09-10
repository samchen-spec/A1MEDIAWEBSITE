/* Single source of truth for the outbound links. The site is informational —
   there is no application form and no VSL; every CTA goes straight to the
   calendar. Swap CAL_LINK here and the whole site follows. */

export const CAL_LINK = "https://calendly.com/samchen-a1media/call-60";
export const CONTACT_EMAIL = "contact@a1media.info";

/* In-page anchors used by the header and footer navigation. */
export const SECTIONS = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#why-a1", label: "Why A1" },
  { href: "/#founders", label: "Founders" },
  { href: "/#clients", label: "Clients" },
  { href: "/#faq", label: "FAQ" },
] as const;
