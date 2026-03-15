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

export default function CTAButton({
  href,
  children,
  variant = "primary",
  className = "",
  type,
  external,
  onClick,
}: CTAButtonProps) {
  const base =
    variant === "primary"
      ? "inline-flex items-center justify-center bg-accent text-black font-semibold px-7 py-3.5 rounded-full hover:bg-accent-glow transition-all duration-300 text-sm tracking-wide animate-glow-pulse"
      : "inline-flex items-center justify-center bg-transparent border border-white/20 text-white font-semibold px-7 py-3.5 rounded-full hover:border-accent hover:text-accent transition-all duration-300 text-sm tracking-wide";

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
