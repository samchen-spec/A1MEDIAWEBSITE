import {
  FigmaMark, SlackMark, NotionMark, StripeMark, ZapierMark, MetaMark,
} from "@/components/BrandLogos";

/* Card art for the bento, drawn for the art well each one sits in. Gold stays
   the brand accent; GROWTH is used only where "up and to the right" is the
   actual meaning, and the tool logos keep their own brand colours. */

const GOLD = "#E3C08D";
const GOLD_DIM = "rgba(227,192,141,0.35)";
const GOLD_FAINT = "rgba(227,192,141,0.14)";
const GROWTH = "#6FCF7F";
const INK = "#D2CEC9";
const INK_DIM = "#8A857D";

const cap = { fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 500 } as const;
const micro = { fontFamily: "var(--font-inter), sans-serif", fontSize: 9.5, fontWeight: 400 } as const;

/* ── 01 · Growth ──────────────────────────────────────────────────────────── */

export function GrowthChart() {
  const bars = [10, 16, 13, 22, 18, 28, 24, 34, 30, 44, 38, 52, 47, 62];

  return (
    <svg viewBox="0 0 300 168" fill="none" className="h-auto w-full" role="img"
         aria-label="Revenue climbing week over week once the offer is live">
      <defs>
        <linearGradient id="growthBar" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.45" />
          <stop offset="100%" stopColor={GROWTH} stopOpacity="0.95" />
        </linearGradient>
        <radialGradient id="growthGlow">
          <stop offset="0%" stopColor={GROWTH} stopOpacity="0.30" />
          <stop offset="100%" stopColor={GROWTH} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0.5" y="0.5" width="299" height="167" rx="14" fill="#0C0B0A" stroke="rgba(255,255,255,0.06)" />
      <ellipse cx="228" cy="96" rx="72" ry="52" fill="url(#growthGlow)" />

      <text x="20" y="28" fill={GROWTH} style={{ ...cap, fontSize: 13, fontWeight: 600 }}>Growth</text>

      {bars.map((h, i) => (
        <rect key={i} x={20 + i * 19} y={126 - h} width="9" height={h} rx="4.5" fill="url(#growthBar)" />
      ))}

      <line x1="20" y1="136" x2="280" y2="136" stroke="rgba(255,255,255,0.07)" />
      <text x="20" y="152" fill={INK_DIM} style={micro}>Launch</text>
      <text x="150" y="152" textAnchor="middle" fill={INK_DIM} style={micro}>Week 6</text>
      <text x="280" y="152" textAnchor="end" fill={INK_DIM} style={micro}>Today</text>
    </svg>
  );
}

/* ── 02 · The offer, as a notification ────────────────────────────────────── */

export function StrategyCard() {
  return (
    <svg viewBox="0 0 300 168" fill="none" className="h-auto w-full" role="img"
         aria-label="A tailored offer strategy delivered to you">
      <rect x="0.5" y="0.5" width="299" height="167" rx="14" fill="#0C0B0A" stroke="rgba(255,255,255,0.06)" />

      {/* stacked card behind */}
      <rect x="46" y="24" width="208" height="44" rx="12" fill="#131211" opacity="0.75" />
      <circle cx="150" cy="34" r="2.5" fill={INK_DIM} />
      <text x="162" y="38" fill={INK_DIM} style={{ ...micro, letterSpacing: "0.1em" }}>REVIEWED</text>

      {/* front card */}
      <rect x="26" y="44" width="248" height="56" rx="14" fill="#171512" stroke="rgba(227,192,141,0.18)" />
      <rect x="38" y="56" width="32" height="32" rx="10" fill="rgba(227,192,141,0.14)" />
      <path d="M56 62 L48 73 h5 l-2 9 8-11 h-5 z" fill={GOLD} />

      <circle cx="84" cy="64" r="3" fill={GROWTH} />
      <text x="92" y="67" fill={GROWTH} style={{ ...micro, letterSpacing: "0.1em", fontWeight: 600 }}>NEW</text>
      <text x="84" y="82" fill="#FAFAFA" style={{ ...cap, fontSize: 13, fontWeight: 600 }}>Your offer, built</text>
      <text x="196" y="82" fill={INK_DIM} style={micro}>Day 1</text>

      {/* dashed queue behind */}
      {[0, 1, 2].map((i) => (
        <line key={i} x1="52" y1={118 + i * 14} x2={248 - i * 26} y2={118 + i * 14}
              stroke={GOLD_FAINT} strokeWidth="2" strokeLinecap="round" strokeDasharray="5 7" />
      ))}
    </svg>
  );
}

/* ── 03 · Where the money moves ───────────────────────────────────────────── */

export function RevenueCurve() {
  return (
    <svg viewBox="0 0 300 168" fill="none" className="h-auto w-full" role="img"
         aria-label="Our capital goes into ads and revenue comes back out">
      <defs>
        <linearGradient id="curveStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.35" />
          <stop offset="60%" stopColor={GOLD} />
          <stop offset="100%" stopColor={GROWTH} />
        </linearGradient>
        <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GROWTH} stopOpacity="0.22" />
          <stop offset="100%" stopColor={GROWTH} stopOpacity="0" />
        </linearGradient>
        <radialGradient id="dotGlow">
          <stop offset="0%" stopColor={GROWTH} stopOpacity="0.55" />
          <stop offset="100%" stopColor={GROWTH} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0.5" y="0.5" width="299" height="167" rx="14" fill="#0C0B0A" stroke="rgba(255,255,255,0.06)" />

      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={40 + i * 70} y1="20" x2={40 + i * 70} y2="132"
              stroke="rgba(255,255,255,0.05)" strokeDasharray="3 5" />
      ))}

      <path d="M24 122 C 66 118, 84 104, 110 96 S 152 96, 176 76 S 214 40, 258 28"
            stroke="url(#curveStroke)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M24 122 C 66 118, 84 104, 110 96 S 152 96, 176 76 S 214 40, 258 28 L258 132 L24 132 Z"
            fill="url(#curveFill)" />

      <circle cx="258" cy="28" r="18" fill="url(#dotGlow)" />
      <circle cx="258" cy="28" r="5" fill={GROWTH} />

      <text x="24" y="150" fill={INK_DIM} style={micro}>We fund the spend</text>
      <text x="276" y="150" textAnchor="end" fill={GROWTH} style={{ ...micro, fontWeight: 600 }}>You get paid first</text>
    </svg>
  );
}

/* ── The stack we run partner accounts on ─────────────────────────────────── */

const TOOLS = [
  { name: "Figma", Mark: FigmaMark, cls: "h-6 w-auto" },
  { name: "Notion", Mark: NotionMark, cls: "h-6 w-6" },
  { name: "Slack", Mark: SlackMark, cls: "h-6 w-6" },
  { name: "Meta", Mark: MetaMark, cls: "h-5 w-auto" },
  { name: "Stripe", Mark: StripeMark, cls: "h-6 w-6" },
  { name: "Zapier", Mark: ZapierMark, cls: "h-6 w-6" },
];

export function ToolStack() {
  return (
    <div className="flex max-w-[210px] flex-wrap justify-center gap-3" aria-label="Tools we run partner accounts on">
      {TOOLS.map(({ name, Mark, cls }) => (
        <span
          key={name}
          title={name}
          className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#0C0B0A] ring-1 ring-white/[0.07]"
        >
          <Mark className={cls} />
        </span>
      ))}
    </div>
  );
}

/* ── The sales team we place ──────────────────────────────────────────────── */

const SEATS = [
  { initials: "SD", ring: "#A259FF", label: "Setter" },
  { initials: "CL", ring: "#1ABCFE", label: "Closer" },
  { initials: "CS", ring: GROWTH, label: "Support" },
];

export function TeamStack() {
  return (
    <div className="relative flex items-center" aria-label="Setters, closers and support placed into your business">
      {SEATS.map((s, i) => (
        <span
          key={s.initials}
          className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#131211] text-[15px] font-semibold text-[#FAFAFA]"
          style={{ marginLeft: i === 0 ? 0 : -14, boxShadow: `0 0 0 2px ${s.ring}`, zIndex: SEATS.length - i }}
        >
          {s.initials}
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

/* ── Why A1 · the animated pipeline ───────────────────────────────────────── */
/* Gold dots run left to right along the pipe on a loop. Keyframes live in
   globals.css (`.flow-dot`, `.flow-pulse`) so prefers-reduced-motion can stop
   them; each dot's travel distance comes in as --flow-dist. */

const STAGES = [
  { x: 24, w: 150, title: "Your audience", sub: "already yours" },
  { x: 222, w: 150, title: "The offer", sub: "we build it" },
  { x: 420, w: 150, title: "The funnel", sub: "we own it" },
  { x: 618, w: 150, title: "Paid ads", sub: "our money", hot: true },
  { x: 816, w: 150, title: "Revenue", sub: "you paid first", hot: true },
];

export function PipelineLoop() {
  return (
    <svg viewBox="0 0 990 130" fill="none" className="h-auto w-full" role="img"
         aria-label="Audience to offer to funnel to paid ads, funded by us, producing revenue you are paid from first">
      {STAGES.slice(0, -1).map((s, i) => {
        const from = s.x + s.w;
        const to = STAGES[i + 1].x;
        const dist = to - from;
        return (
          <g key={`gap-${i}`}>
            <line x1={from} y1="46" x2={to} y2="46" stroke={GOLD_FAINT} strokeWidth="1.5" strokeLinecap="round" />
            {[0, 1].map((d) => (
              <circle
                key={d} className="flow-dot" cx={from} cy="46" r="3" fill={GOLD}
                style={{
                  ["--flow-dist" as string]: `${dist}px`,
                  animationDelay: `${i * 0.34 + d * 1.3}s`,
                }}
              />
            ))}
          </g>
        );
      })}

      {STAGES.map((s) => (
        <g key={s.title}>
          {s.hot && (
            <rect className="flow-pulse" x={s.x - 3} y="19" width={s.w + 6} height="54" rx="15"
                  fill="none" stroke={GOLD} strokeWidth="1" />
          )}
          <rect x={s.x} y="22" width={s.w} height="48" rx="12"
                fill={s.hot ? "rgba(227,192,141,0.09)" : "#131211"}
                stroke={s.hot ? GOLD_DIM : "rgba(255,255,255,0.07)"} />
          <text x={s.x + s.w / 2} y="44" textAnchor="middle" fill={s.hot ? GOLD : INK}
                style={{ ...cap, fontSize: 13, fontWeight: 600 }}>{s.title}</text>
          <text x={s.x + s.w / 2} y="60" textAnchor="middle" fill={INK_DIM} style={micro}>{s.sub}</text>
        </g>
      ))}

      <line x1="99" y1="86" x2="891" y2="86" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 6" />
      <text x="99" y="108" fill={INK_DIM} style={micro}>You keep making content</text>
      <text x="891" y="108" textAnchor="end" fill={GOLD} style={{ ...micro, fontWeight: 600 }}>
        We carry the spend until it works
      </text>
    </svg>
  );
}
