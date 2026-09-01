/* Editorial line-art infographics. Gold hairlines on transparent — they sit on
   whichever band they're dropped into. */

const GOLD = "#E3C08D";
const GOLD_DIM = "rgba(227,192,141,0.35)";
const GOLD_FAINT = "rgba(227,192,141,0.14)";
const INK = "#B5B1AC";
const INK_DIM = "#7A756D";

const label = { fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 400 } as const;
const micro = { fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.14em" } as const;
const numeral = { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22 } as const;

/* ── The build pipeline ───────────────────────────────────────────────────── */

export function SystemDiagram() {
  const stages = [
    { x: 80, n: "01", label: "Offer" },
    { x: 220, n: "02", label: "Funnel" },
    { x: 360, n: "03", label: "Content" },
    { x: 500, n: "04", label: "Ads" },
    { x: 640, n: "05", label: "Closers" },
  ];

  return (
    <svg viewBox="0 0 720 240" fill="none" className="h-auto w-full" role="img" aria-label="The build pipeline: offer, funnel, content, ads, closers, all feeding revenue">
      <defs>
        <marker id="sysArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0 1 L6 4 L0 7" stroke={GOLD_DIM} strokeWidth="1" fill="none" />
        </marker>
      </defs>

      {stages.map((s, i) => (
        <g key={s.n}>
          {i < stages.length - 1 && (
            <line x1={s.x + 34} y1="96" x2={s.x + 104} y2="96" stroke={GOLD_DIM} strokeWidth="1" markerEnd="url(#sysArrow)" />
          )}
          <circle cx={s.x} cy="96" r="33" stroke={GOLD_DIM} strokeWidth="1" fill="rgba(227,192,141,0.04)" />
          <text x={s.x} y="104" textAnchor="middle" fill={GOLD} style={numeral}>{s.n}</text>
          <text x={s.x} y="152" textAnchor="middle" fill={INK} style={label}>{s.label}</text>
        </g>
      ))}

      {/* Funding bracket under the paid stages */}
      <path d="M462 178 L462 190 L678 190 L678 178" stroke={GOLD} strokeWidth="1" fill="none" opacity="0.7" />
      <text x="570" y="212" textAnchor="middle" fill={GOLD} style={micro}>FUNDED BY US</text>

      {/* Free bracket under the build stages */}
      <path d="M42 178 L42 190 L398 190 L398 178" stroke={GOLD_FAINT} strokeWidth="1" fill="none" />
      <text x="220" y="212" textAnchor="middle" fill={INK_DIM} style={micro}>BUILT FREE</text>
    </svg>
  );
}

/* ── Where the money comes from ───────────────────────────────────────────── */

export function FundingFlow() {
  return (
    <svg viewBox="0 0 720 300" fill="none" className="h-auto w-full" role="img" aria-label="Our capital funds the ads, the ads produce revenue, and we are paid from a share of it">
      <defs>
        <marker id="flowArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0 1 L6 4 L0 7" stroke={GOLD} strokeWidth="1" fill="none" />
        </marker>
        <marker id="flowArrowDim" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0 1 L6 4 L0 7" stroke={GOLD_DIM} strokeWidth="1" fill="none" />
        </marker>
      </defs>

      {/* Our capital */}
      <rect x="20" y="60" width="170" height="76" rx="10" stroke={GOLD} strokeWidth="1" fill="rgba(227,192,141,0.06)" />
      <text x="105" y="94" textAnchor="middle" fill={GOLD} style={{ ...label, fontSize: 15 }}>Our capital</text>
      <text x="105" y="116" textAnchor="middle" fill={INK_DIM} style={micro}>NOT YOURS</text>

      <line x1="196" y1="98" x2="256" y2="98" stroke={GOLD} strokeWidth="1" markerEnd="url(#flowArrow)" />

      {/* Ad account */}
      <rect x="262" y="60" width="170" height="76" rx="10" stroke={GOLD_DIM} strokeWidth="1" fill="rgba(255,255,255,0.02)" />
      <text x="347" y="94" textAnchor="middle" fill={INK} style={{ ...label, fontSize: 15 }}>Ad account</text>
      <text x="347" y="116" textAnchor="middle" fill={INK_DIM} style={micro}>MANAGED BY US</text>

      <line x1="438" y1="98" x2="498" y2="98" stroke={GOLD_DIM} strokeWidth="1" markerEnd="url(#flowArrowDim)" />

      {/* Revenue */}
      <rect x="504" y="60" width="196" height="76" rx="10" stroke={GOLD_DIM} strokeWidth="1" fill="rgba(255,255,255,0.02)" />
      <text x="602" y="94" textAnchor="middle" fill={INK} style={{ ...label, fontSize: 15 }}>Offer revenue</text>
      <text x="602" y="116" textAnchor="middle" fill={INK_DIM} style={micro}>YOUR BRAND</text>

      {/* Split back out */}
      <path d="M602 142 L602 176 L300 176 L300 206" stroke={GOLD_DIM} strokeWidth="1" fill="none" markerEnd="url(#flowArrowDim)" />
      <path d="M602 142 L602 176 L640 176 L640 206" stroke={GOLD} strokeWidth="1" fill="none" markerEnd="url(#flowArrow)" />

      <rect x="150" y="212" width="300" height="62" rx="10" stroke={GOLD_DIM} strokeWidth="1" fill="rgba(255,255,255,0.02)" />
      <text x="300" y="240" textAnchor="middle" fill={INK} style={{ ...label, fontSize: 15 }}>You keep the majority</text>
      <text x="300" y="260" textAnchor="middle" fill={INK_DIM} style={micro}>PAID FIRST</text>

      <rect x="530" y="212" width="170" height="62" rx="10" stroke={GOLD} strokeWidth="1" fill="rgba(227,192,141,0.06)" />
      <text x="615" y="240" textAnchor="middle" fill={GOLD} style={{ ...label, fontSize: 15 }}>Our share</text>
      <text x="615" y="260" textAnchor="middle" fill={INK_DIM} style={micro}>ONLY IF IT WORKS</text>
    </svg>
  );
}

/* ── Ceiling comparison ───────────────────────────────────────────────────── */

export function CeilingChart() {
  const bars = [
    { x: 60, h: 34, name: "Brand deals", sub: "One-off" },
    { x: 190, h: 26, name: "$27 product", sub: "Volume game" },
    { x: 320, h: 48, name: "$49 community", sub: "Churn + support" },
    { x: 470, h: 176, name: "$5,000 offer", sub: "50 clients a month", gold: true },
  ];
  const baseline = 266;

  return (
    <svg viewBox="0 0 660 330" fill="none" className="h-auto w-full" role="img" aria-label="Monthly ceiling of brand deals, low-ticket products and communities against one high-ticket offer">
      {/* baseline */}
      <line x1="30" y1={baseline} x2="630" y2={baseline} stroke="rgba(255,255,255,0.10)" strokeWidth="1" />

      {/* ceiling marker for the small three */}
      <line x1="40" y1={baseline - 62} x2="430" y2={baseline - 62} stroke={GOLD_FAINT} strokeWidth="1" strokeDasharray="4 5" />
      <text x="44" y={baseline - 70} fill={INK_DIM} style={micro}>THE USUAL CEILING</text>

      {bars.map((b) => (
        <g key={b.name}>
          <rect
            x={b.x}
            y={baseline - b.h}
            width={b.gold ? 120 : 90}
            height={b.h}
            rx="4"
            fill={b.gold ? "rgba(227,192,141,0.16)" : "rgba(255,255,255,0.05)"}
            stroke={b.gold ? GOLD : "rgba(255,255,255,0.14)"}
            strokeWidth="1"
          />
          <text
            x={b.x + (b.gold ? 60 : 45)}
            y={baseline + 24}
            textAnchor="middle"
            fill={b.gold ? GOLD : INK}
            style={label}
          >
            {b.name}
          </text>
          <text x={b.x + (b.gold ? 60 : 45)} y={baseline + 44} textAnchor="middle" fill={INK_DIM} style={{ ...micro, letterSpacing: "0.08em" }}>
            {b.sub}
          </text>
        </g>
      ))}

      <text x="530" y={baseline - 208} textAnchor="middle" fill={GOLD} style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28 }}>
        $250,000
      </text>
      <text x="530" y={baseline - 190} textAnchor="middle" fill={INK_DIM} style={micro}>PER MONTH</text>
    </svg>
  );
}

/* ── Seven-day arc ────────────────────────────────────────────────────────── */

export function WeekArc() {
  const days = ["Audit", "Messaging", "Funnel", "Sales team", "Systems", "Content", "Launch"];
  const step = 96;
  const startX = 60;

  return (
    <svg viewBox="0 0 720 200" fill="none" className="h-auto w-full" role="img" aria-label="Seven day launch arc from audit to launch">
      <path
        d={`M${startX} 150 C 220 150, 300 60, ${startX + step * 6} 44`}
        stroke={GOLD_DIM}
        strokeWidth="1"
        fill="none"
      />

      {days.map((d, i) => {
        const t = i / (days.length - 1);
        const x = startX + step * i;
        // approximate the curve for dot placement
        const y = Math.round((150 - Math.pow(t, 1.5) * 106) * 100) / 100;
        const isLast = i === days.length - 1;
        return (
          <g key={d}>
            <circle cx={x} cy={y} r={isLast ? 8 : 5} fill={isLast ? GOLD : "#0A0A0A"} stroke={GOLD} strokeWidth="1" />
            {/* Both labels sit below the dot so nothing collides with the rising path */}
            <text x={x} y={y + 24} textAnchor="middle" fill={isLast ? GOLD : INK_DIM} style={micro}>
              {`DAY ${i + 1}`}
            </text>
            <text x={x} y={y + 44} textAnchor="middle" fill={isLast ? GOLD : INK} style={label}>
              {d}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
