"use client";

import { useRef, useState, useEffect } from "react";
import { useInView, useMotionValue, useTransform, animate } from "framer-motion";
import SectionLabel from "@/components/SectionLabel";
import CTAButton from "@/components/CTAButton";
import AnimatedSection from "@/components/AnimatedSection";

// ─── CountUp ────────────────────────────────────────────────────────────────────

function CountUp({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    if (isInView) { const c = animate(count, target, { duration: 2, ease: "easeOut" }); return c.stop; }
  }, [isInView, count, target]);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplayVal(v));
    return unsub;
  }, [rounded]);

  return <span ref={ref}>{prefix}{displayVal}{suffix}</span>;
}

// ─── Infographic SVGs ───────────────────────────────────────────────────────────

function OrganicInfographic() {
  return (
    <svg viewBox="0 0 400 300" fill="none" className="w-full h-full">
      {/* Background */}
      <rect width="400" height="300" rx="16" fill="#111" />
      {/* Instagram icon */}
      <rect x="60" y="80" width="56" height="56" rx="14" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.3)" strokeWidth="1" />
      <circle cx="88" cy="108" r="14" stroke="#3B82F6" strokeWidth="1.5" fill="none" />
      <circle cx="88" cy="108" r="5" stroke="#3B82F6" strokeWidth="1.5" fill="none" />
      <circle cx="100" cy="96" r="2" fill="#3B82F6" />
      {/* YouTube icon */}
      <rect x="60" y="160" width="56" height="56" rx="14" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.3)" strokeWidth="1" />
      <polygon points="80,188 100,178 100,198" fill="#3B82F6" opacity="0.7" />
      {/* TikTok icon */}
      <rect x="140" y="120" width="56" height="56" rx="14" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.3)" strokeWidth="1" />
      <text x="157" y="155" fill="#3B82F6" fontFamily="Inter" fontSize="14" fontWeight="600" opacity="0.8">TT</text>
      {/* Arrows */}
      <line x1="130" y1="108" x2="220" y2="148" stroke="#3B82F6" strokeWidth="1" opacity="0.4" />
      <line x1="130" y1="188" x2="220" y2="148" stroke="#3B82F6" strokeWidth="1" opacity="0.4" />
      <line x1="210" y1="148" x2="220" y2="148" stroke="#3B82F6" strokeWidth="1" opacity="0.4" />
      {/* Arrow tip */}
      <polygon points="220,145 228,148 220,151" fill="#3B82F6" opacity="0.5" />
      {/* Revenue circle */}
      <circle cx="290" cy="148" r="50" fill="rgba(212,168,83,0.08)" stroke="rgba(212,168,83,0.25)" strokeWidth="1.5" />
      <text x="290" y="142" textAnchor="middle" fill="#D4A853" fontFamily="Playfair Display" fontSize="24" fontWeight="700">£</text>
      <text x="290" y="166" textAnchor="middle" fill="rgba(212,168,83,0.6)" fontFamily="Inter" fontSize="11">Revenue</text>
      {/* Connecting line */}
      <line x1="228" y1="148" x2="240" y2="148" stroke="rgba(212,168,83,0.3)" strokeWidth="1.5" strokeDasharray="4 3" />
    </svg>
  );
}

function FunnelInfographic() {
  return (
    <svg viewBox="0 0 400 300" fill="none" className="w-full h-full">
      <rect width="400" height="300" rx="16" fill="#111" />
      {/* Funnel shape */}
      <path d="M120 60 L280 60 L250 120 L150 120 Z" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.25)" strokeWidth="1.5" />
      <text x="200" y="96" textAnchor="middle" fill="#3B82F6" fontFamily="Inter" fontSize="11" fontWeight="500">Landing Page</text>
      <path d="M150 130 L250 130 L230 190 L170 190 Z" fill="rgba(59,130,246,0.12)" stroke="rgba(59,130,246,0.3)" strokeWidth="1.5" />
      <text x="200" y="166" textAnchor="middle" fill="#3B82F6" fontFamily="Inter" fontSize="11" fontWeight="500">Email Sequence</text>
      <path d="M170 200 L230 200 L215 240 L185 240 Z" fill="rgba(212,168,83,0.12)" stroke="rgba(212,168,83,0.3)" strokeWidth="1.5" />
      <text x="200" y="226" textAnchor="middle" fill="#D4A853" fontFamily="Inter" fontSize="11" fontWeight="500">Booking</text>
      {/* Nodes on right side */}
      <circle cx="310" cy="90" r="6" fill="rgba(59,130,246,0.2)" stroke="#3B82F6" strokeWidth="1" />
      <text x="325" y="94" fill="#6B7280" fontFamily="Inter" fontSize="10">Sales Page</text>
      <circle cx="310" cy="160" r="6" fill="rgba(59,130,246,0.2)" stroke="#3B82F6" strokeWidth="1" />
      <text x="325" y="164" fill="#6B7280" fontFamily="Inter" fontSize="10">CRM</text>
      <circle cx="310" cy="220" r="6" fill="rgba(212,168,83,0.2)" stroke="#D4A853" strokeWidth="1" />
      <text x="325" y="224" fill="#6B7280" fontFamily="Inter" fontSize="10">Checkout</text>
      {/* Connecting lines */}
      <line x1="280" y1="90" x2="304" y2="90" stroke="rgba(59,130,246,0.2)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="250" y1="160" x2="304" y2="160" stroke="rgba(59,130,246,0.2)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="230" y1="220" x2="304" y2="220" stroke="rgba(212,168,83,0.2)" strokeWidth="1" strokeDasharray="3 3" />
      {/* Drop arrows */}
      <line x1="200" y1="120" x2="200" y2="130" stroke="rgba(59,130,246,0.3)" strokeWidth="1" />
      <line x1="200" y1="190" x2="200" y2="200" stroke="rgba(59,130,246,0.3)" strokeWidth="1" />
    </svg>
  );
}

function SalesTeamInfographic() {
  return (
    <svg viewBox="0 0 400 300" fill="none" className="w-full h-full">
      <rect width="400" height="300" rx="16" fill="#111" />
      {/* Person icons */}
      {[140, 200, 260].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy="80" r="22" fill={i === 1 ? "rgba(212,168,83,0.1)" : "rgba(59,130,246,0.08)"} stroke={i === 1 ? "rgba(212,168,83,0.3)" : "rgba(59,130,246,0.25)"} strokeWidth="1.5" />
          <circle cx={x} cy="74" r="7" stroke={i === 1 ? "#D4A853" : "#3B82F6"} strokeWidth="1.2" fill="none" />
          <path d={`M${x - 10} 95 Q${x} 85 ${x + 10} 95`} stroke={i === 1 ? "#D4A853" : "#3B82F6"} strokeWidth="1.2" fill="none" />
          {/* Headset */}
          <path d={`M${x - 8} 72 Q${x - 8} 64 ${x} 64 Q${x + 8} 64 ${x + 8} 72`} stroke={i === 1 ? "rgba(212,168,83,0.4)" : "rgba(59,130,246,0.3)"} strokeWidth="1" fill="none" />
        </g>
      ))}
      {/* Pipeline below */}
      <rect x="100" y="140" width="200" height="4" rx="2" fill="rgba(59,130,246,0.15)" />
      {/* Pipeline stages */}
      {[{ x: 130, label: "Lead", pct: 100 }, { x: 190, label: "Call", pct: 70 }, { x: 250, label: "Close", pct: 40 }].map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy="142" r="8" fill="#111" stroke={i === 2 ? "#D4A853" : "#3B82F6"} strokeWidth="1.5" />
          <text x={s.x} y="170" textAnchor="middle" fill="#6B7280" fontFamily="Inter" fontSize="10">{s.label}</text>
          {/* Bar below */}
          <rect x={s.x - 16} y="185" width="32" height={s.pct * 0.7} rx="4" fill={i === 2 ? "rgba(212,168,83,0.15)" : "rgba(59,130,246,0.12)"} stroke={i === 2 ? "rgba(212,168,83,0.3)" : "rgba(59,130,246,0.2)"} strokeWidth="1" />
          <text x={s.x} y={185 + s.pct * 0.7 + 16} textAnchor="middle" fill={i === 2 ? "#D4A853" : "#3B82F6"} fontFamily="Inter" fontSize="10" fontWeight="600">{s.pct}%</text>
        </g>
      ))}
    </svg>
  );
}

function ScaleInfographic() {
  return (
    <svg viewBox="0 0 400 300" fill="none" className="w-full h-full">
      <rect width="400" height="300" rx="16" fill="#111" />
      {/* Graph axes */}
      <line x1="80" y1="240" x2="340" y2="240" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <line x1="80" y1="60" x2="80" y2="240" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      {/* Grid lines */}
      {[120, 160, 200].map((y) => (
        <line key={y} x1="80" y1={y} x2="340" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}
      {/* Growth curve */}
      <path d="M80 230 Q120 225 150 210 Q180 195 210 170 Q240 140 270 95 Q290 65 320 50" stroke="#3B82F6" strokeWidth="2.5" fill="none" />
      {/* Gradient fill under curve */}
      <path d="M80 230 Q120 225 150 210 Q180 195 210 170 Q240 140 270 95 Q290 65 320 50 L320 240 L80 240 Z" fill="url(#graphGradient)" />
      <defs>
        <linearGradient id="graphGradient" x1="200" y1="50" x2="200" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(59,130,246,0.15)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0)" />
        </linearGradient>
      </defs>
      {/* Dot at end */}
      <circle cx="320" cy="50" r="5" fill="#3B82F6" />
      <circle cx="320" cy="50" r="10" fill="rgba(59,130,246,0.2)" />
      {/* Platform icons */}
      <rect x="110" y="255" width="44" height="24" rx="6" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.2)" strokeWidth="0.8" />
      <text x="132" y="271" textAnchor="middle" fill="#3B82F6" fontFamily="Inter" fontSize="9" fontWeight="500">Meta</text>
      <rect x="165" y="255" width="44" height="24" rx="6" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.2)" strokeWidth="0.8" />
      <text x="187" y="271" textAnchor="middle" fill="#3B82F6" fontFamily="Inter" fontSize="9" fontWeight="500">YT</text>
      {/* Rocket */}
      <text x="330" y="42" fill="#D4A853" fontSize="18">&#x1F680;</text>
      {/* Y-axis labels */}
      <text x="70" y="244" textAnchor="end" fill="#4B5563" fontFamily="Inter" fontSize="9">£0</text>
      <text x="70" y="164" textAnchor="end" fill="#4B5563" fontFamily="Inter" fontSize="9">£500K</text>
      <text x="70" y="84" textAnchor="end" fill="#4B5563" fontFamily="Inter" fontSize="9">£1M</text>
    </svg>
  );
}

const infographics = [<OrganicInfographic key="organic" />, <FunnelInfographic key="funnel" />, <SalesTeamInfographic key="sales" />, <ScaleInfographic key="scale" />];

// ─── Data ───────────────────────────────────────────────────────────────────────

const steps = [
  { num: "01", title: "Monetise Your Organic Audience", desc: "Your audience already trusts you. We don't start with paid ads — we start with the people already paying attention. We research your market, build a no-brainer offer, and install a monetisation system that turns your existing audience into revenue. Cash flow starts here.", side: "right" as const },
  { num: "02", title: "Build the Entire Backend", desc: "We build custom funnels — landing pages, sales pages, email sequences, order flows, backend automation — the entire machine from front to back. Every page in the customer journey is designed, written, and built by our team.", side: "left" as const },
  { num: "03", title: "Install a Trained Sales Team", desc: "We integrate a team of A-player closers who know how to convert your specific audience. They handle the calls, the follow-ups, and the objections so you never have to sell. You create content. They close deals.", side: "right" as const },
  { num: "04", title: "Scale With Paid Advertising", desc: "Once organic is profitable and the offer is proven, we pour fuel on the fire. We manage the ad campaigns, test creatives, optimise targeting, and scale spend. We've run campaigns at 3–10x ROAS across health, trading, and info product niches.", side: "left" as const },
];

const comparisonRows = [
  { aspect: "Cost to you", diy: "Thousands in tools, freelancers, and ad spend", a1: "Revenue share only. No retainers. No monthly fees." },
  { aspect: "Who takes the risk", diy: "You. Every dollar comes out of your pocket.", a1: "We do. Our capital, our resources, our time." },
  { aspect: "What you receive", diy: "A patchwork of half-built systems you manage", a1: "A fully built, fully managed business infrastructure" },
  { aspect: "How they get paid", diy: "Freelancers charge by the hour regardless of results", a1: "We take a % of revenue. No results = no payment." },
  { aspect: "Skin in the game", diy: "You carry all the risk", a1: "100%. We only win when you win." },
];

const statCards = [
  { label: "Revenue generated in 30 days", value: 500, prefix: "$", suffix: "K+" },
  { label: "ROAS on paid campaigns", static: "3–10x" },
  { label: "Revenue-share aligned", value: 100, prefix: "", suffix: "%" },
];

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function HowItWorksPage() {
  return (
    <main className="bg-black text-white">

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="silk-bg pt-32 pb-20 md:pb-28">
        <div className="mx-auto max-w-[800px] px-6 text-center">
          <AnimatedSection>
            <SectionLabel>THE SYSTEM</SectionLabel>
          </AnimatedSection>
          <AnimatedSection>
            <h1 className="mt-6 font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-hero">
              The <span className="text-accent">A1 Media</span> System
            </h1>
          </AnimatedSection>
          <AnimatedSection>
            <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-[#9CA3AF]">
              From undermonetised to 7 figures — here&apos;s what happens when you partner with us.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ══ 4-STEP TIMELINE ═══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-[1100px] mx-auto">
          <AnimatedSection className="text-center mb-16">
            <SectionLabel>THE PROCESS</SectionLabel>
            <h2 className="mt-5 font-serif text-3xl md:text-4xl font-bold tracking-hero">
              Four Steps to 7 Figures
            </h2>
          </AnimatedSection>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2" />

            <div className="flex flex-col gap-20 md:gap-28">
              {steps.map((step, i) => (
                <AnimatedSection key={step.num} delay={i * 0.1}>
                  <div className={`flex flex-col md:flex-row gap-10 md:gap-16 items-center ${step.side === "left" ? "md:flex-row-reverse" : ""}`}>
                    <div className="md:w-1/2">
                      <span className="font-serif text-6xl md:text-7xl font-bold text-accent/15">{step.num}</span>
                      <h3 className="mt-2 font-serif text-2xl md:text-3xl font-bold leading-tight">{step.title}</h3>
                      <p className="mt-4 text-[#9CA3AF] text-base leading-relaxed">{step.desc}</p>
                    </div>

                    <div className="md:w-1/2">
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(59,130,246,0.1)", boxShadow: "0 0 40px rgba(59,130,246,0.05)" }}>
                        {infographics[i]}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ COMPARISON ═══════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6 bg-[#0A0A0A]">
        <div className="max-w-[950px] mx-auto">
          <AnimatedSection className="text-center">
            <SectionLabel>THE DIFFERENCE</SectionLabel>
            <h2 className="mt-5 font-serif text-3xl md:text-5xl font-bold tracking-hero">
              Doing It Yourself vs. The A1 Way
            </h2>
          </AnimatedSection>

          <AnimatedSection>
            <div className="mt-14 overflow-hidden rounded-2xl hidden md:block" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="grid grid-cols-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="px-6 py-5 bg-[#111]" />
                <div className="px-6 py-5 bg-[#111]">
                  <span className="text-sm font-semibold uppercase tracking-wider text-white/40">Doing It Yourself</span>
                </div>
                <div className="px-6 py-5 bg-[#111]">
                  <span className="text-sm font-semibold uppercase tracking-wider text-accent">A1 Media</span>
                </div>
              </div>
              {comparisonRows.map((row, index) => (
                <div key={row.aspect} className="grid grid-cols-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="px-6 py-5" style={{ backgroundColor: index % 2 === 0 ? "#111" : "#0A0A0A" }}>
                    <span className="text-sm font-semibold text-white">{row.aspect}</span>
                  </div>
                  <div className="px-6 py-5" style={{ backgroundColor: index % 2 === 0 ? "#111" : "#0A0A0A" }}>
                    <p className="text-sm leading-relaxed text-[#6B7280]">{row.diy}</p>
                  </div>
                  <div className="px-6 py-5" style={{ backgroundColor: index % 2 === 0 ? "#111" : "#0A0A0A" }}>
                    <p className="text-sm leading-relaxed text-accent">{row.a1}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col gap-4 md:hidden">
              {comparisonRows.map((row) => (
                <div key={row.aspect} className="card-dark p-5">
                  <span className="text-sm font-semibold text-white">{row.aspect}</span>
                  <div className="mt-3 flex flex-col gap-2">
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-red-400 mt-0.5 shrink-0">✕</span>
                      <p className="text-sm leading-relaxed text-[#6B7280]">{row.diy}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-accent mt-0.5 shrink-0">✓</span>
                      <p className="text-sm leading-relaxed text-accent">{row.a1}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══ STATS ═════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-[900px] mx-auto">
          <AnimatedSection className="text-center mb-14">
            <SectionLabel>THE NUMBERS</SectionLabel>
            <h2 className="mt-5 font-serif text-3xl md:text-5xl font-bold tracking-hero">
              Built for Results
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-7">
            {statCards.map((card, i) => (
              <AnimatedSection key={card.label} delay={i * 0.1}>
                <div className="card-blue-glow p-12 text-center min-h-[200px] flex flex-col items-center justify-center">
                  <span className="font-serif text-4xl md:text-5xl font-bold text-white">
                    {"static" in card ? card.static : <CountUp target={card.value!} prefix={card.prefix} suffix={card.suffix} />}
                  </span>
                  <p className="mt-4 text-sm text-[#6B7280]">{card.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════════════════ */}
      <section className="silk-bg py-24 md:py-32 px-6">
        <div className="max-w-[700px] mx-auto text-center">
          <AnimatedSection className="flex flex-col items-center gap-7">
            <h2 className="font-serif text-4xl md:text-6xl font-bold leading-[1.08] tracking-hero">
              Ready to Scale?
            </h2>
            <p className="text-[#9CA3AF] text-base">Revenue share only. We win when you win.</p>
            <CTAButton href="https://cal.com/sam-chen-veeqlv/discovery" external variant="primary" className="px-10 py-4">
              Apply to Partner
            </CTAButton>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
