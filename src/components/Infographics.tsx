/* Card art for the bento. Each is drawn for a ~300x150 box — the full-width
   editorial diagrams these replaced rendered their labels at about 5px once
   they were dropped into a bento card, which is why these exist. */

const GOLD = "#E3C08D";
const GOLD_DIM = "rgba(227,192,141,0.35)";
const GOLD_FAINT = "rgba(227,192,141,0.16)";
const INK = "#D2CEC9";
const INK_DIM = "#8A857D";

const cap = { fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 500 } as const;
const lead = { fontFamily: "var(--font-inter), sans-serif", fontSize: 15, fontWeight: 600 } as const;

/* ── 01 · The offer ───────────────────────────────────────────────────────── */

export function OfferArt() {
  const nodes = [
    { x: 40, y: 28, t: "Position" },
    { x: 40, y: 122, t: "Price" },
    { x: 260, y: 28, t: "Promise" },
    { x: 260, y: 122, t: "Deliver" },
  ];

  return (
    <svg viewBox="0 0 300 150" fill="none" className="h-auto w-full" role="img"
         aria-label="One offer assembled from positioning, price, promise and delivery">
      {nodes.map((n) => (
        <line key={`l-${n.t}`} x1={n.x} y1={n.y} x2={n.x < 150 ? 92 : 208} y2={n.y < 75 ? 54 : 96}
              stroke={GOLD_FAINT} strokeWidth="1" />
      ))}
      <rect x="92" y="42" width="116" height="66" rx="10" stroke={GOLD_DIM} strokeWidth="1" fill="rgba(227,192,141,0.06)" />
      <text x="150" y="72" textAnchor="middle" fill={GOLD} style={lead}>Your offer</text>
      <text x="150" y="92" textAnchor="middle" fill={INK_DIM} style={cap}>Built by us, free</text>
      {nodes.map((n) => (
        <g key={n.t}>
          <circle cx={n.x} cy={n.y} r="3" fill={GOLD} />
          <text x={n.x} y={n.y + (n.y < 75 ? -11 : 19)} textAnchor="middle" fill={INK} style={cap}>{n.t}</text>
        </g>
      ))}
    </svg>
  );
}

/* ── 02 · The funnel ──────────────────────────────────────────────────────── */

export function FunnelArt() {
  const bars = [
    { w: 208, t: "Traffic" },
    { w: 154, t: "Landing page" },
    { w: 104, t: "Booked call" },
    { w: 62, t: "Paid" },
  ];

  return (
    <svg viewBox="0 0 300 150" fill="none" className="h-auto w-full" role="img"
         aria-label="A funnel narrowing from traffic to paid customers">
      {bars.map((b, i) => {
        const last = i === bars.length - 1;
        return (
          <g key={b.t}>
            <rect x={150 - b.w / 2} y={12 + i * 34} width={b.w} height="24" rx="6"
                  stroke={last ? GOLD : GOLD_DIM} strokeWidth="1"
                  fill={`rgba(227,192,141,${0.04 + i * 0.045})`} />
            <text x="150" y={28 + i * 34} textAnchor="middle" fill={last ? GOLD : INK} style={cap}>{b.t}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── 03 · Where the money moves ───────────────────────────────────────────── */

export function FundingArt() {
  return (
    <svg viewBox="0 0 300 150" fill="none" className="h-auto w-full" role="img"
         aria-label="Our capital goes into the ad account, revenue comes back and is split">
      <defs>
        <marker id="fundArrow" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
          <path d="M0 1 L5 3.5 L0 6" stroke={GOLD_DIM} strokeWidth="1" fill="none" />
        </marker>
      </defs>

      <rect x="8" y="20" width="86" height="38" rx="8" stroke={GOLD} strokeWidth="1" fill="rgba(227,192,141,0.08)" />
      <text x="51" y="38" textAnchor="middle" fill={GOLD} style={cap}>Our capital</text>
      <text x="51" y="51" textAnchor="middle" fill={INK_DIM} style={{ ...cap, fontSize: 10 }}>not yours</text>

      <line x1="94" y1="39" x2="118" y2="39" stroke={GOLD_DIM} strokeWidth="1" markerEnd="url(#fundArrow)" />

      <rect x="120" y="20" width="86" height="38" rx="8" stroke={GOLD_DIM} strokeWidth="1" fill="rgba(227,192,141,0.04)" />
      <text x="163" y="44" textAnchor="middle" fill={INK} style={cap}>Ad account</text>

      <line x1="206" y1="39" x2="230" y2="39" stroke={GOLD_DIM} strokeWidth="1" markerEnd="url(#fundArrow)" />

      <rect x="232" y="20" width="60" height="38" rx="8" stroke={GOLD_DIM} strokeWidth="1" fill="rgba(227,192,141,0.04)" />
      <text x="262" y="44" textAnchor="middle" fill={INK} style={cap}>Revenue</text>

      <path d="M262 58 L262 78 L96 78 L96 96" stroke={GOLD_FAINT} strokeWidth="1" markerEnd="url(#fundArrow)" />
      <path d="M262 58 L262 78 L226 78 L226 96" stroke={GOLD_FAINT} strokeWidth="1" markerEnd="url(#fundArrow)" />

      <rect x="30" y="98" width="132" height="38" rx="8" stroke={GOLD_DIM} strokeWidth="1" fill="rgba(227,192,141,0.04)" />
      <text x="96" y="116" textAnchor="middle" fill={INK} style={cap}>You keep the majority</text>
      <text x="96" y="129" textAnchor="middle" fill={INK_DIM} style={{ ...cap, fontSize: 10 }}>paid first</text>

      <rect x="176" y="98" width="100" height="38" rx="8" stroke={GOLD} strokeWidth="1" fill="rgba(227,192,141,0.08)" />
      <text x="226" y="116" textAnchor="middle" fill={GOLD} style={cap}>Our share</text>
      <text x="226" y="129" textAnchor="middle" fill={INK_DIM} style={{ ...cap, fontSize: 10 }}>only if it works</text>
    </svg>
  );
}
