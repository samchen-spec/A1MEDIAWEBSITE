"use client";

import Image from "next/image";
import { useState } from "react";

/* The sales seats we place, as overlapping ringed avatars. Photos live in
   /public/team/ and are mirrored from the "sales team photos" folder at the
   repo root.

   Rings are three tints of the brand gold rather than four unrelated hues, so
   the four still read as separate people without leaving the palette.

   Any missing file falls back to a monogram, so the card never breaks. Only
   people who actually work with us belong here: the card presents them as our
   placed staff. */

type Seat = { src: string; name: string; ring: string };

const SEATS: Seat[] = [
  { src: "/team/mordecai.webp", name: "Mordecai", ring: "#C79E58" },
  { src: "/team/tomas.webp", name: "Tomas", ring: "#E3C08D" },
  { src: "/team/tommy.webp", name: "Tommy", ring: "#F2DCB4" },
  { src: "/team/wiktor.webp", name: "Wiktor", ring: "#C79E58" },
];

function Avatar({ src, name, ring }: Seat) {
  const [failed, setFailed] = useState(false);

  return (
    <span
      className="relative block h-[58px] w-[58px] shrink-0 overflow-hidden rounded-full bg-[#131211]"
      style={{ boxShadow: `0 0 0 2px ${ring}` }}
      title={name}
    >
      {failed ? (
        <span className="flex h-full w-full items-center justify-center text-[13px] font-semibold text-[#8A857D]">
          {name.charAt(0)}
        </span>
      ) : (
        <Image
          src={src}
          alt={name}
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
    <div className="flex items-center" aria-label="Setters, closers and support placed into your business">
      {SEATS.map((s, i) => (
        <span key={s.name} style={{ marginLeft: i === 0 ? 0 : -14, zIndex: SEATS.length - i }}>
          <Avatar {...s} />
        </span>
      ))}
    </div>
  );
}
