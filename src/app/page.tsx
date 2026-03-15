"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import Image from "next/image";
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
    if (isInView) {
      const controls = animate(count, target, { duration: 2, ease: "easeOut" });
      return controls.stop;
    }
  }, [isInView, count, target]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => setDisplayVal(v));
    return unsubscribe;
  }, [rounded]);

  return <span ref={ref}>{prefix}{displayVal}{suffix}</span>;
}

// ─── Data ───────────────────────────────────────────────────────────────────────

const stats = [
  { label: "Revenue Generated", value: 500, prefix: "$", suffix: "K+" },
  { label: "Active Partners", value: 6, prefix: "", suffix: "+" },
  { label: "Niches Dominated", value: 3, prefix: "", suffix: "" },
  { label: "Revenue-Share Aligned", value: 100, prefix: "", suffix: "%" },
];

const services = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    title: "Offer Creation",
    desc: "We research your market and build an offer so good your audience would feel stupid saying no.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    ),
    title: "Funnel Building",
    desc: "Landing pages, sales pages, checkout flows, upsell sequences — the entire machine, built by us.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
      </svg>
    ),
    title: "Paid Advertising",
    desc: "We manage all paid acquisition — creatives, targeting, split testing, and scaling at 3–10x ROAS.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    title: "Sales Infrastructure",
    desc: "A trained team of closers integrated into your business. They handle the calls so you don't have to.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-2.625 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
      </svg>
    ),
    title: "Content Strategy",
    desc: "We help you create content that converts — not just entertains. Strategy aligned with monetisation.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
      </svg>
    ),
    title: "Automation & Tech",
    desc: "CRM, pipeline tracking, appointment scheduling, reporting dashboards — the backend that scales.",
  },
];

const doingItYourself = [
  "You spend months guessing what offer to build",
  "You try to learn funnels, email sequences, and ad strategy on top of creating content",
  "You hire freelancers who don't understand your audience",
  "Your ad spend comes out of your own pocket with no guarantee",
  "Your organic audience sits there unmonetised",
];

const theA1Way = [
  "We research your market and build a no-brainer offer for you",
  "We build every funnel, sequence, and sales system from scratch",
  "We integrate a sales team of A-players who close on your behalf",
  "We manage all paid acquisition and scale your campaigns",
  "We monetise your organic audience first so cash flow starts immediately",
];

const faqItems = [
  { question: "What's the catch?", answer: "There's no catch. We make money when you make money — a percentage of backend revenue. If we don't generate results, we don't get paid. We take this approach because we're confident in our systems and because it aligns our incentives perfectly with yours." },
  { question: "What kind of creators do you work with?", answer: "We work with influencers and creators across a range of niches — we've had the most success in health, trading, and info products. The common thread is that our partners have an engaged audience and either want to monetise it properly for the first time or want to scale an existing offer well beyond where it is now." },
  { question: "What if I don't have an offer yet?", answer: "That's fine. Most of our partners don't come to us with a polished offer. We handle the full offer creation process — market research, positioning, pricing, and packaging. We build you something your audience actually wants to buy." },
  { question: "How long does it take to see results?", answer: "We start with monetising your organic audience, so you can see revenue coming in within the first few weeks. Paid scaling typically begins once the organic systems are generating consistent cash flow and the offer is proven." },
  { question: "How do you get paid exactly?", answer: "We take a percentage of backend revenue generated through the systems we build and the ad campaigns we run. If the partnership doesn't generate revenue, we make nothing." },
  { question: "What's my involvement day to day?", answer: "Your primary job is creating content and providing content assets when needed. We handle everything else — offer creation, funnel building, ad management, sales team, backend automation." },
  { question: "How selective are you with partnerships?", answer: "Very. We invest our own time and resources into every partnership, so we only work with creators where we see a clear path to 7 figures. If we don't think we can deliver, we'll tell you upfront." },
];

// ─── Accordion ──────────────────────────────────────────────────────────────────

function AccordionItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-white/5">
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 py-6 text-left">
        <span className="text-white font-medium text-base">{question}</span>
        <svg
          width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="shrink-0 text-accent transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-sm leading-relaxed text-[#9CA3AF]">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="bg-black text-white min-h-screen">

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="silk-bg min-h-screen flex flex-col items-center justify-center text-center px-6 py-28">
        <div className="w-full max-w-[900px] mx-auto flex flex-col items-center">
          <AnimatedSection className="flex flex-col items-center gap-7">
            <SectionLabel>FOR CREATORS & INFLUENCERS WHO WANT TO SCALE</SectionLabel>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-hero">
              We Scale Creators to 7 Figures.{" "}
              <span className="text-accent">They Just Create Content.</span>
            </h1>

            <p className="text-base md:text-lg max-w-[620px] leading-relaxed text-[#9CA3AF]">
              A1 Media is the growth engine behind high-ticket influencers and coaches. We build the offer, the funnel, the ads, and the sales team — and we only get paid when you get paid.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
              <CTAButton href="/how-it-works" variant="secondary">
                See How It Works
              </CTAButton>
              <CTAButton href="https://cal.com/sam-chen-veeqlv/discovery" external variant="primary">
                Apply to Partner
              </CTAButton>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══ STATS BAR ═════════════════════════════════════════════════════ */}
      <section className="border-y border-white/5 bg-[#0A0A0A]">
        <div className="max-w-content mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {stats.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-serif font-bold text-white">
                    <CountUp target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </div>
                  <div className="mt-2 w-8 h-[2px] bg-accent mx-auto" />
                  <p className="mt-3 text-sm text-[#6B7280]">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY WE BUILT A1 MEDIA ═════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-content mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <AnimatedSection>
              <div className="relative aspect-square max-w-[420px] mx-auto md:mx-0 rounded-2xl overflow-hidden bg-[#111]">
                <Image
                  src="/founder.jpg"
                  alt="Sam Chen, Founder"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 420px"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <SectionLabel>WHY WE BUILT A1 MEDIA</SectionLabel>
              <h2 className="mt-5 font-serif text-3xl md:text-4xl font-bold leading-tight tracking-hero">
                The Best Creators In the World Were Leaving Millions on the Table.
              </h2>
              <div className="mt-6 flex flex-col gap-5 text-[#9CA3AF] text-base leading-relaxed">
                <p>We saw that the most talented creators and influencers in the world were sitting on massive audiences — audiences that trusted them and were ready to buy — but they had no systems to capture that revenue.</p>
                <p>They were either not monetising at all, or trying to piece it together themselves with a patchwork of freelancers, half-built funnels, and offers that didn&apos;t convert.</p>
                <p>A1 Media was built to fix that. We partner directly with creators, build the entire business infrastructure, and scale revenue to 7 figures — while the creator focuses on creating content.</p>
              </div>
              <p className="mt-8 font-serif text-2xl italic text-accent">Sam Chen</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ══ WHAT YOU GET ══════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6 bg-[#0A0A0A]">
        <div className="max-w-content mx-auto">
          <AnimatedSection className="text-center">
            <SectionLabel>WHAT YOU GET</SectionLabel>
            <h2 className="mt-5 font-serif text-3xl md:text-5xl font-bold leading-tight tracking-hero">
              What You Get
            </h2>
          </AnimatedSection>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {services.map((svc, i) => (
              <AnimatedSection key={svc.title} delay={i * 0.1}>
                <div className="card-blue-glow p-10 h-full flex flex-col min-h-[280px]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6] mb-7">
                    {svc.icon}
                  </div>
                  <h3 className="font-serif text-xl font-bold">{svc.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#9CA3AF] flex-1">{svc.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══ COMPARISON ═══════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-[1000px] mx-auto">
          <AnimatedSection className="text-center">
            <SectionLabel>THE DIFFERENCE</SectionLabel>
            <h2 className="mt-5 font-serif text-3xl md:text-5xl font-bold leading-tight tracking-hero">
              Stop Trying to Figure It Out Alone.
            </h2>
          </AnimatedSection>

          <div className="mt-14 grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl p-8 flex flex-col gap-6"
              style={{
                background: "linear-gradient(135deg, rgba(220,38,38,0.06) 0%, rgba(220,38,38,0.02) 100%)",
                border: "1px solid rgba(220,38,38,0.15)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-white/60">This isn&apos;t for you if...</h3>
              </div>
              <ul className="flex flex-col gap-4">
                {doingItYourself.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    <span className="text-sm leading-relaxed text-[#6B7280]">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl p-8 flex flex-col gap-6"
              style={{
                background: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.02) 100%)",
                border: "1px solid rgba(59,130,246,0.2)",
                boxShadow: "0 0 40px rgba(59,130,246,0.06)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-white">This is for you if...</h3>
              </div>
              <ul className="flex flex-col gap-4">
                {theA1Way.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    <span className="text-sm leading-relaxed text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6 bg-[#0A0A0A]">
        <div className="max-w-[720px] mx-auto">
          <AnimatedSection className="text-center">
            <SectionLabel>QUESTIONS</SectionLabel>
            <h2 className="mt-5 font-serif text-3xl md:text-5xl font-bold leading-tight tracking-hero">
              Frequently Asked Questions
            </h2>
          </AnimatedSection>

          <div className="mt-12 border-t border-white/5">
            {faqItems.map((item, i) => (
              <AccordionItem
                key={i}
                question={item.question}
                answer={item.answer}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ════════════════════════════════════════════════════ */}
      <section className="silk-bg py-24 md:py-32 px-6">
        <div className="max-w-[700px] mx-auto text-center">
          <AnimatedSection className="flex flex-col items-center gap-7">
            <SectionLabel>APPLY TO PARTNER</SectionLabel>
            <h2 className="font-serif text-4xl md:text-6xl font-bold leading-[1.08] tracking-hero">
              Ready to Scale?
            </h2>
            <p className="text-[#9CA3AF] text-base max-w-md">
              Limited partnerships available. We only take on creators we can scale.
            </p>
            <CTAButton href="https://cal.com/sam-chen-veeqlv/discovery" external variant="primary" className="px-10 py-4">
              Apply to Partner
            </CTAButton>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
