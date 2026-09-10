"use client";

import Link from "next/link";

interface CTAButtonProps {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  type?: "button" | "submit";
  external?: boolean;
  onClick?: () => void;
}

/* Primary is the ring button: a 1.5px gold gradient ring (the outer box's
   padding) around a near-black face at 10px radius. Deliberately small and
   soft-square — see CLAUDE.md. */
function Inner({ variant, children }: { variant: string; children: React.ReactNode }) {
  if (variant === "secondary") return <>{children}</>;
  return <span className="btn-ring__face">{children}</span>;
}

export default function CTAButton({
  href,
  children,
  variant = "primary",
  className = "",
  type,
  external,
  onClick,
}: CTAButtonProps) {
  const base = variant === "primary" ? "btn-ring" : "btn-quiet";
  const cls = `${base} ${className}`.trim();
  const inner = <Inner variant={variant}>{children}</Inner>;

  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type || "button"} onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
