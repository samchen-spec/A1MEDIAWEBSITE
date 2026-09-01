"use client";

import { useRef, useState, useEffect } from "react";
import { useInView, useMotionValue, useTransform, animate } from "framer-motion";
import SectionLabel from "@/components/SectionLabel";
import CTAButton from "@/components/CTAButton";
import AnimatedSection from "@/components/AnimatedSection";

// Everyone goes through the application on the homepage before booking.
const CAL_LINK = "/#schedule";

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

// ─── Data ───────────────────────────────────────────────────────────────────────

const steps = [
  {
    num: "01",
    title: "We craft the offer",
    lede: "One high-ticket offer, built end to end.",
    desc:
      "We research your market, interview your audience, and work out what they'd genuinely pay several thousand for — then we build it. Positioning, promise, price, curriculum or delivery model, guarantee, and every sales asset that carries it. You sign off. You never have to design it.",
    deliverables: ["Market & audience research", "Positioning and promise", "Pricing and packaging", "Delivery model built out"],
  },
  {
    num: "02",
    title: "We build the machine",
    lede: "Everything behind the offer, made by us.",
    desc:
      "Landing pages, sales pages, VSL scripts, email sequences, checkout, CRM, booking flows and reporting. It runs under your brand, and it is built to hold volume from day one rather than be rebuilt the moment paid traffic arrives.",
    deliverables: ["Funnels and sales pages", "Email and DM sequences", "Checkout and CRM", "Tracking and reporting"],
  },
  {
    num: "03",
    title: "We launch to your organic audience",
    lede: "Your existing audience proves it first.",
    desc:
      "Before anyone spends on ads, we launch to the people who already follow you. A trained closing team takes the calls, so you never have to sell. This is where cash flow starts — and where we find out exactly what the offer converts at.",
    deliverables: ["Launch content plan", "Trained closers on the phones", "Objection and follow-up systems", "Real conversion data"],
  },
  {
    num: "04",
    title: "We fund the ads and scale",
    lede: "Our capital goes into the ad account, not yours.",
    desc:
      "Once the numbers hold organically, we put our own money behind paid acquisition — creative, testing, targeting, scaling spend across Meta and YouTube. Your reach stops being capped by the algorithm, and it costs you nothing upfront because we're paid out of what the offer produces.",
    deliverables: ["Ad creative and scripting", "Media buying and testing", "Spend funded by us", "Scale across platforms"],
  },
];

const comparisonRows = [
  { aspect: "Who pays for ads", diy: "You do, before you know if it works", a1: "We do, out of our own capital" },
  { aspect: "Cost to start", diy: "Retainers, tools, freelancers, ad budget", a1: "Nothing. Revenue share only." },
  { aspect: "The offer", diy: "A low-ticket product or a brand deal", a1: "A high-ticket offer built from scratch" },
  { aspect: "Who does the work", diy: "You, plus freelancers you manage", a1: "Our team — build, launch, ads, closers" },
  { aspect: "Who carries the risk", diy: "You, on every line item", a1: "Us. No revenue, no payment." },
];

const statCards = [
  { label: "Generated for partners", value: 500, prefix: "$", suffix: "K+" },
  { label: "Return on managed ad spend", static: "3–10x" },
  { label: "Ad spend paid by you", static: "$0" },
];

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function HowItWorksPage() {
  return (
    <main className="bg-[#0A0A0A] text-[#FAFAFA]">

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="silk-bg pt-44 pb-24 md:pb-32 px-6">
        <div className="mx-auto max-w-[900px] text-center">
          <AnimatedSection className="flex flex-col items-center gap-8">
            <SectionLabel>The system</SectionLabel>
            <h1 className="font-serif text-[42px] sm:text-6xl md:text-7xl lg:text-[80px] leading-[1.05] tracking-hero text-balance">
              Crafted, funded and <span className="text-accent italic">launched</span>
            </h1>
            <div className="rule-accent" />
            <p className="max-w-[640px] text-[19px] md:text-[21px] leading-[1.65] text-[#B5B1AC] font-light">
              Four stages from an undermonetised audience to an offer we&apos;re paying to scale.
              Here&apos;s exactly what happens, and who pays for what.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ══ STEPS ═════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-6 border-t border-white/[0.08]">
        <div className="max-w-[1080px] mx-auto">
          {steps.map((step, i) => (
            <AnimatedSection key={step.num} delay={i * 0.05}>
              <div className="grid md:grid-cols-[1fr_360px] gap-10 md:gap-16 py-14 md:py-20 border-b border-white/[0.08] first:border-t">
                <div>
                  <span className="eyebrow">Stage {step.num}</span>
                  <h2 className="mt-6 font-serif text-[34px] md:text-[52px] leading-[1.08] tracking-hero">
                    {step.title}
                  </h2>
                  <p className="mt-4 font-serif text-[22px] md:text-[26px] italic text-accent">
                    {step.lede}
                  </p>
                  <p className="mt-6 max-w-[640px] text-[17px] md:text-[18px] leading-[1.75] text-[#B5B1AC] font-light">
                    {step.desc}
                  </p>
                </div>

                <div className="md:pt-14">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[#7A756D]">
                    What lands
                  </p>
                  <ul className="mt-6 flex flex-col">
                    {step.deliverables.map((d) => (
                      <li
                        key={d}
                        className="flex items-baseline gap-4 py-3.5 border-t border-white/[0.08] last:border-b"
                      >
                        <span className="h-px w-3 shrink-0 bg-accent translate-y-[-4px]" aria-hidden />
                        <span className="text-[16px] leading-snug text-[#FAFAFA] font-light">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ══ COMPARISON ═══════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-6 bg-[#0D0C0B] border-y border-white/[0.08]">
        <div className="max-w-[1000px] mx-auto">
          <AnimatedSection className="text-center">
            <SectionLabel>The difference</SectionLabel>
            <h2 className="mt-7 font-serif text-[34px] md:text-[56px] leading-[1.1] tracking-hero">
              Doing it yourself vs. partnering
            </h2>
          </AnimatedSection>

          <AnimatedSection>
            {/* Desktop table */}
            <div className="mt-14 hidden md:block border border-white/[0.08]">
              <div className="grid grid-cols-3 border-b border-white/[0.08]">
                <div className="px-7 py-5" />
                <div className="px-7 py-5">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-[#7A756D]">On your own</span>
                </div>
                <div className="px-7 py-5">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-accent">With A1 Media</span>
                </div>
              </div>
              {comparisonRows.map((row) => (
                <div key={row.aspect} className="grid grid-cols-3 border-t border-white/[0.08]">
                  <div className="px-7 py-6">
                    <span className="font-serif text-[20px] text-[#FAFAFA]">{row.aspect}</span>
                  </div>
                  <div className="px-7 py-6">
                    <p className="text-[16px] leading-relaxed text-[#7A756D] font-light">{row.diy}</p>
                  </div>
                  <div className="px-7 py-6">
                    <p className="text-[16px] leading-relaxed text-accent font-light">{row.a1}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile stack */}
            <div className="mt-12 flex flex-col md:hidden border-t border-white/[0.08]">
              {comparisonRows.map((row) => (
                <div key={row.aspect} className="py-6 border-b border-white/[0.08]">
                  <span className="font-serif text-[22px] text-[#FAFAFA]">{row.aspect}</span>
                  <p className="mt-3 text-[16px] leading-relaxed text-[#7A756D] font-light">{row.diy}</p>
                  <p className="mt-2 text-[16px] leading-relaxed text-accent font-light">{row.a1}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══ STATS ═════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[960px] mx-auto">
          <AnimatedSection className="text-center mb-14">
            <SectionLabel>The numbers</SectionLabel>
            <h2 className="mt-7 font-serif text-[34px] md:text-[56px] leading-[1.1] tracking-hero">
              What the model has done
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-px bg-white/[0.07] border border-white/[0.08]">
            {statCards.map((card, i) => (
              <AnimatedSection key={card.label} delay={i * 0.1} className="bg-[#0A0A0A]">
                <div className="p-12 text-center min-h-[220px] flex flex-col items-center justify-center">
                  <span className="font-serif text-[52px] md:text-[64px] leading-none text-accent">
                    {"static" in card ? card.static : <CountUp target={card.value!} prefix={card.prefix} suffix={card.suffix} />}
                  </span>
                  <p className="mt-5 text-[11px] uppercase tracking-[0.2em] text-[#7A756D]">{card.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════════════════ */}
      <section className="silk-bg py-28 md:py-40 px-6 border-t border-white/[0.08]">
        <div className="max-w-[760px] mx-auto text-center">
          <AnimatedSection className="flex flex-col items-center gap-8">
            <h2 className="font-serif text-[42px] md:text-[68px] leading-[1.06] tracking-hero text-balance">
              We&apos;ll tell you what we&apos;d build
            </h2>
            <p className="text-[18px] md:text-[20px] text-[#B5B1AC] font-light max-w-[520px] leading-[1.6]">
              One call, no pitch deck. What the offer would be, what we&apos;d fund, and whether
              your audience supports it.
            </p>
            <CTAButton href={CAL_LINK} variant="primary" className="px-10 py-4">
              Schedule My Call
            </CTAButton>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
