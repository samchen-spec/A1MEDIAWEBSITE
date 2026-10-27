"use client";

import type { LucideIcon } from "lucide-react";

/* The handful of controls the goal tracker needs, in the site's language:
   borderless fills, gold for the one active thing, small soft-square corners.
   The marketing components (.btn-ring etc.) are sized for a landing page at
   18px; this is a working tool, so it runs at 14px. */

export function Panel({
  title,
  subtitle,
  right,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-lg bg-bg-card p-6 ${className}`}>
      {title && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-semibold text-[#FAFAFA]">{title}</h3>
            {subtitle && <p className="mt-1 text-[13px] leading-snug text-text-muted">{subtitle}</p>}
          </div>
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const variantCls: Record<Variant, string> = {
  primary: "bg-accent text-[#0C0C0C] hover:bg-accent-glow",
  secondary: "bg-[#1B1917] text-[#FAFAFA] hover:bg-[#24211E]",
  ghost: "text-text-muted hover:bg-[#1B1917] hover:text-[#FAFAFA]",
};

const sizeCls: Record<Size, string> = {
  sm: "gap-1.5 rounded-[9px] px-3 py-1.5 text-[12px]",
  md: "gap-2 rounded-sm px-4 py-2 text-[14px]",
};

export function Button({
  variant = "secondary",
  size = "md",
  icon: Icon,
  iconRight: IconRight,
  className = "",
  children,
  ...rest
}: {
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const s = size === "sm" ? 13 : 15;
  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-40 ${variantCls[variant]} ${sizeCls[size]} ${className}`}
      {...rest}
    >
      {Icon && <Icon size={s} aria-hidden />}
      {children}
      {IconRight && <IconRight size={s} aria-hidden />}
    </button>
  );
}

export function IconButton({
  icon: Icon,
  variant = "ghost",
  className = "",
  ...rest
}: { icon: LucideIcon; variant?: Variant; size?: Size } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`grid h-8 w-8 place-items-center rounded-[9px] transition-colors duration-200 ${variantCls[variant]} ${className}`}
      {...rest}
    >
      <Icon size={15} aria-hidden />
    </button>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-sm bg-bg-card p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          aria-pressed={o.value === value}
          className={`rounded-[9px] px-4 py-1.5 text-[13px] font-medium transition-colors duration-200 ${
            o.value === value ? "bg-accent text-[#0C0C0C]" : "text-text-muted hover:text-[#FAFAFA]"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Select({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  ariaLabel?: string;
  size?: Size;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      className="rounded-[9px] bg-[#1B1917] px-2.5 py-1.5 text-[13px] text-[#FAFAFA] outline-none [color-scheme:dark] focus:shadow-[inset_0_0_0_1.5px_rgba(227,192,141,0.55)]"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
