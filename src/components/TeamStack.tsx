"use client";

import Image from "next/image";
import { useState } from "react";

/* The sales seats we place, as overlapping ringed avatars.

   To use a real headshot: put the file in /public/team/ and set that seat's
   `src` below. While `src` is null the avatar renders a monogram, so the card
   is never broken and the browser never requests a file that isn't there.

   Use photos of people who actually work with us and have agreed to appear.
   Don't fill these with stock portraits: the section claims these are our
   placed staff, and strangers' faces would make that claim false. */

type Seat = { initials: string; ring: string; role: string; src: string | null };

const SEATS: Seat[] = [
  { initials: "SD", ring: "#A259FF", role: "Setter", src: null },
  { initials: "CL", ring: "#1ABCFE", role: "Closer", src: null },
  { initials: "CS", ring: "#6FCF7F", role: "Support", src: null },
];

function Avatar({ src, initials, ring, role }: Seat) {
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(src) && !failed;

  return (
    <span
      className="relative block h-[58px] w-[58px] shrink-0 overflow-hidden rounded-full bg-[#131211]"
      style={{ boxShadow: `0 0 0 2px ${ring}` }}
      title={role}
    >
      {!showPhoto ? (
        <span className="flex h-full w-full items-center justify-center text-[15px] font-semibold text-[#FAFAFA]">
          {initials}
        </span>
      ) : (
        <Image
          src={src as string}
          alt={role}
          fill
          sizes="58px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

export default function TeamStack() {
  return (
    <div className="relative flex items-center" aria-label="Setters, closers and support placed into your business">
      {SEATS.map((s, i) => (
        <span key={s.initials} style={{ marginLeft: i === 0 ? 0 : -14, zIndex: SEATS.length - i }}>
          <Avatar {...s} />
        </span>
      ))}
      {/* sits behind the stack, so it needs less overlap or the label clips */}
      <span
        className="ml-[-6px] flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#0C0B0A] pl-2 text-[13px] text-[#8A857D] ring-1 ring-white/[0.07]"
        style={{ zIndex: 0 }}
      >
        +12
      </span>
    </div>
  );
}
