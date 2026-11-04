import Link from "next/link";
import AdminTabs from "@/components/admin/AdminTabs";

/* The uploader's own three screens, under the admin row rather than in a fixed
   sidebar: this is a page on the site, and a sidebar would fight the header
   that floats over every other one. */
const PAGES = [
  { href: "/upload", label: "Upload ads", key: "upload" },
  { href: "/upload/history", label: "History", key: "history" },
  { href: "/upload/settings", label: "Settings", key: "settings" },
] as const;

export type UploaderTab = (typeof PAGES)[number]["key"];

export default function UploaderTabs({ active }: { active: UploaderTab }) {
  return (
    <>
      <AdminTabs active="uploader" />

      <div className="mb-9 flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="eyebrow">Meta Marketing API v22.0</p>
          <h1 className="mt-3 text-[34px] font-semibold leading-[1.2] text-[#FAFAFA]">
            Bulk Uploader
          </h1>
        </div>

        <nav aria-label="Uploader" className="inline-flex rounded-sm bg-bg-card p-1">
          {PAGES.map((page) => (
            <Link
              key={page.key}
              href={page.href}
              aria-current={page.key === active ? "page" : undefined}
              className={`rounded-[9px] px-4 py-1.5 text-[14px] font-medium transition-colors duration-200 ${
                page.key === active
                  ? "bg-accent text-[#0C0C0C]"
                  : "text-text-muted hover:text-[#FAFAFA]"
              }`}
            >
              {page.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
