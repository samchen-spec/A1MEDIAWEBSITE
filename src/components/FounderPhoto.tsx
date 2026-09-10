"use client";

import Image from "next/image";
import { useState } from "react";

/* Renders the headshot once the file exists at `src`; until then it falls back to
   a monogram so the layout is never broken by a missing image. */
export default function FounderPhoto({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  const initials = name.split(" ").map((w) => w[0]).join("");

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#151413]">
      {failed ? (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-[64px] font-semibold text-accent/40">{initials}</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 420px"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
