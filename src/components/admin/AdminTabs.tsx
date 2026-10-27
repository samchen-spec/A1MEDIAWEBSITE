import Link from "next/link";

/* The two password-protected pages, so either one is a click from the other.
   Both sit behind the same admin session. */
const PAGES = [
  { href: "/goals", label: "Goals", key: "goals" },
  { href: "/admin", label: "Submissions", key: "submissions" },
] as const;

export default function AdminTabs({ active }: { active: (typeof PAGES)[number]["key"] }) {
  return (
    <nav aria-label="Admin" className="mb-10 inline-flex rounded-sm bg-bg-card p-1">
      {PAGES.map((p) => (
        <Link
          key={p.key}
          href={p.href}
          aria-current={p.key === active ? "page" : undefined}
          className={`rounded-[9px] px-4 py-1.5 text-[14px] font-medium transition-colors duration-200 ${
            p.key === active ? "bg-accent text-[#0C0C0C]" : "text-text-muted hover:text-[#FAFAFA]"
          }`}
        >
          {p.label}
        </Link>
      ))}
    </nav>
  );
}
