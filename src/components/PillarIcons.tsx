/* Help / Fund / Launch glyphs. 64px, filled, one colour each, and each one
   animates on a loop. Keyframes live in globals.css so prefers-reduced-motion
   can stop them. */

const BOX = "h-16 w-16";

export function HelpIcon() {
  const bars = [
    { x: 4, y: 30, h: 26 },
    { x: 24, y: 18, h: 38 },
    { x: 44, y: 8, h: 48 },
  ];
  return (
    <svg viewBox="0 0 64 64" className={BOX} fill="#1ABCFE" aria-hidden>
      {bars.map((b, i) => (
        <rect
          key={i}
          className="ico-bar"
          x={b.x}
          y={b.y}
          width="16"
          height={b.h}
          rx="5"
          style={{ transformOrigin: `${b.x + 8}px 56px`, animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </svg>
  );
}

export function FundIcon() {
  return (
    <svg viewBox="0 0 64 64" className={BOX} aria-hidden>
      {/* the note drops in behind the wallet */}
      <rect className="ico-note" x="19" y="2" width="26" height="18" rx="3" fill="#C79E58" />
      <rect x="5" y="17" width="54" height="39" rx="10" fill="#E3C08D" />
      {/* card pocket, cut into the wallet face */}
      <path d="M43 29h16v14H43a7 7 0 0 1 0-14Z" fill="#0C0B0A" />
      <circle className="ico-coin" cx="49" cy="36" r="3.6" fill="#F2DCB4" />
    </svg>
  );
}

export function LaunchIcon() {
  return (
    <svg viewBox="0 0 64 64" className={BOX} aria-hidden>
      {/* flame sits behind the body so the fins overlap it cleanly */}
      <path
        className="ico-flame"
        d="M32 40c4.5 6 6 10.5 0 18-6-7.5-4.5-12 0-18Z"
        fill="#F2A03C"
      />
      <g className="ico-rocket">
        {/* fins, joined to the body rather than floating */}
        <path d="M21 31c-6 5-9 10-9 17l9-4Zm22 0c6 5 9 10 9 17l-9-4Z" fill="#3E9E57" />
        {/* body */}
        <path d="M32 4c8 8 11.5 17 11.5 26v14h-23V30C20.5 21 24 12 32 4Z" fill="#6FCF7F" />
        <circle cx="32" cy="25" r="5.5" fill="#0C0B0A" />
      </g>
    </svg>
  );
}
