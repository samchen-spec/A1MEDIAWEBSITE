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

const shared =
  "inline-flex items-center justify-center rounded-full px-9 py-4 text-[14px] font-medium uppercase tracking-[0.16em]";

export default function CTAButton({
  href,
  children,
  variant = "primary",
  className = "",
  type,
  external,
  onClick,
}: CTAButtonProps) {
  const base = variant === "primary" ? `${shared} btn-gold` : `${shared} btn-ghost`;

  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${base} ${className}`}>
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={`${base} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type || "button"} onClick={onClick} className={`${base} ${className}`}>
      {children}
    </button>
  );
}
