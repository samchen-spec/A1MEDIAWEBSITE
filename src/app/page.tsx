"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import CTAButton from "@/components/CTAButton";
import AnimatedSection from "@/components/AnimatedSection";
import FounderPhoto from "@/components/FounderPhoto";
import {
  GrowthChart, StrategyCard, RevenueCurve, ToolStack, TeamStack, PipelineLoop,
} from "@/components/Infographics";
import { CAL_LINK } from "@/lib/site";

// ─── How it works ───────────────────────────────────────────────────────────────
// The seven-step list compressed to five bento cards. The `wide` pair runs
// text-left / art-right on the second row; the rest are art-top / text-bottom.

const bento = [
  {
    title: "We craft the high-ticket offer",
    body: "Research, positioning, price, promise and delivery, built end to end.",
    art: "growth" as const,
  },
  {
    title: "We build and own the funnel",
    body: "Pages, scripts, sequences, checkout and CRM. Attention through to payment.",
    art: "strategy" as const,
  },
  {
    title: "We scale it with our own money",
    body: "Once it converts organically, our capital goes into the ad account.",
    art: "revenue" as const,
  },
];

const bentoWide = [
  {
    title: "We run the whole stack",
    body: "Design, docs, automations, ad accounts and checkout. All of it under your brand, none of it your problem.",
    art: "tools" as const,
  },
  {
    title: "We staff setters and closers",
    body: "Placed from our own network, so selling never becomes your job.",
    art: "team" as const,
  },
];

const capabilities = [
  "Done-For-You Funnels",
  "Done-For-You Ads",
  "Done-For-You Offers",
  "Done-For-You Copywriting",
  "Done-For-You Sales Teams",
];

// ─── Why A1 ─────────────────────────────────────────────────────────────────────
// The three verbs from the positioning, one per column.

const pillars = [
  {
    title: "Help",
    body: "We work with you on the content that actually drives buyers, and script the long-form so the engine stops depending on your best week.",
    icon: (
      <>
        <rect x="4" y="22" width="7" height="14" rx="2" />
        <rect x="16.5" y="14" width="7" height="22" rx="2" />
        <rect x="29" y="4" width="7" height="32" rx="2" />
      </>
    ),
  },
  {
    title: "Fund",
    body: "No retainer, no setup fee, no media budget from you. Our capital goes into the ad account and we take a share of what comes back out.",
    icon: (
      <>
        <path d="M6 9h21a5 5 0 0 1 5 5v1H10a4 4 0 0 0 0 8h22v10a5 5 0 0 1-5 5H6a4 4 0 0 1-4-4V13a4 4 0 0 1 4-4Z" />
        <circle cx="30" cy="19" r="3" />
      </>
    ),
  },
  {
    title: "Launch",
    body: "Offer locked, funnel built, sales team placed and tracking wired up, live to your audience inside the first week.",
    icon: (
      <>
        <path d="M20 2c6 5 9 11 9 18l-9 7-9-7c0-7 3-13 9-18Zm0 10a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
        <path d="M13 31l-4 7 7-2Zm14 0l4 7-7-2Z" />
      </>
    ),
  },
];

// ─── Founders ───────────────────────────────────────────────────────────────────

const founders = [
  {
    name: "Sam Chen",
    title: "Co-Founder & CMO | Head Of Marketing",
    image: "/founders/sam-chen.jpg",
    points: [
      "Generated $1,000,000 in client revenue in the past 12 months",
      "Been in the info space for 2+ years",
      "Builds the offer, the funnel and the content engine end to end",
      "Runs media buying across the portfolio's ad accounts",
    ],
  },
  {
    name: "Wiktor Domasat",
    title: "Co-Founder & CSO | Head Of Sales",
    image: "/founders/wiktor-domasat.jpg",
    points: [
      "Cash collected $2,500,000 as a closer",
      "Now managing our portfolio's sales teams",
      "Hires and trains every setter and closer we place",
      "Builds the objection maps our partners' teams sell from",
    ],
  },
];

// ─── Portfolio ──────────────────────────────────────────────────────────────────
// Live landing pages we built and run. One per row so each one gets read rather
// than scanned. Screenshots are captured from the live pages.

const portfolio = [
  {
    brand: "Ancestor Maxxing",
    niche: "Testosterone coaching",
    blurb: "Masterclass funnel: long-form VSL, opt-in and booking flow, built end to end and running on paid.",
    image: "/portfolio/ancestormaxxing.jpg",
    href: "https://ancestormaxxing.com/masterclass",
  },
  {
    brand: "Millionaire PT Blueprint",
    niche: "Personal training",
    blurb: "Free-training opt-in with a scarcity-led offer, wired to a closer team and a tracked pipeline.",
    image: "/portfolio/prestige-fitness.jpg",
    href: "https://www.prestigefitnesscoaching.com/opt-in",
  },
  {
    brand: "Abundance Of Women",
    niche: "Dating coaching",
    blurb: "Full brand and offer build for Zaki: positioning, VSL, application and scheduler on one page.",
    image: "/portfolio/abundance-of-women.jpg",
    href: "https://www.abundanceofwomen.com/",
  },
];

// ─── FAQ ────────────────────────────────────────────────────────────────────────

const faqItems = [
  { question: "How is all of this free?", answer: "There's no retainer, no setup fee and no ad budget from you. We're paid a percentage of the revenue the offer produces, so we earn after you do. The marketing, sales, operations and backend cost you nothing upfront because we're betting on the outcome rather than billing for the work." },
  { question: "You actually pay for the ad spend?", answer: "Yes. Once the offer is proven with your organic audience, we fund the paid campaigns out of our own pocket: creative, testing and scaling. We're not asking you to risk your own money to find out whether this works." },
  { question: "What counts as an established brand?", answer: "An audience that already knows you, watches you and responds to you, built organically over time, not bought. If you're monetising with a community, a low-ticket product or brand deals and you feel capped by it, that's the profile. If you're still building the audience, we're not the right partner yet." },
  { question: "What if I don't have an offer yet?", answer: "Most partners don't. That's the work. We handle research, positioning, pricing, packaging and delivery, and build the offer from scratch. You bring the audience and the credibility; we build the thing they buy." },
  { question: "Do I have to stop taking brand deals?", answer: "No. Most partners keep them. The difference is that brand deals become the smaller line on the invoice instead of the whole business, because the offer produces revenue every month whether or not a sponsor turns up." },
  { question: "How much of my time does this take?", answer: "You keep making content and show up for the assets we need: a handful of filming sessions and sign-off on the offer. Everything else, from funnels to closers to ad management, sits with us." },
  { question: "How selective are you?", answer: "Very, because we're spending our own capital on every partnership. We take a small number of creators at a time, and if we can't see a clear path to seven figures we'll tell you on the call rather than take you on." },
];

// ─── Pieces ─────────────────────────────────────────────────────────────────────

function PillarIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 40 40" className="h-10 w-10" fill="currentColor" aria-hidden>
      {children}
    </svg>
  );
}

function AccordionItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-white/[0.07]">
      <button onClick={onToggle} className="group flex w-full items-center justify-between gap-6 py-7 text-left">
        <span className="text-[20px] font-medium leading-[1.4] text-[#FAFAFA] transition-colors duration-200 group-hover:text-accent md:text-h4">
          {question}
        </span>
        <span
          className="shrink-0 text-2xl leading-none text-accent transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
          aria-hidden
        >
          +
        </span>
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
            <p className="pb-8 pr-10 text-body text-[#D2CEC9]">{answer}</p>
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
    <main className="bg-[#070706] text-[#FAFAFA]">

      {/* ══ 1. HERO ═══════════════════════════════════════════════════════ */}
      <section className="aurora px-6 pb-28 pt-[150px] md:pb-32 md:pt-[200px]">
        <div className="mx-auto flex w-full max-w-content flex-col items-center text-center">
          <AnimatedSection className="flex flex-col items-center">
            <h1 className="max-w-[1000px] text-[38px] font-semibold leading-[1.2] text-balance sm:text-[52px] md:text-[62px] lg:text-h1">
              We build it for free. <span className="accent-italic text-gold">Then we fund the ads</span>
            </h1>

            <p className="mt-6 max-w-[640px] text-body text-[#D2CEC9]">
              A1 Media crafts established creators a high-ticket offer from start to finish, then
              pays for the ad spend out of our own pocket. You keep making content. No retainer,
              no setup fee.
            </p>
          </AnimatedSection>

          <AnimatedSection className="mt-10 flex flex-col items-center gap-4 sm:flex-row" delay={0.08}>
            <CTAButton href={CAL_LINK} external>Book a Call</CTAButton>
            <CTAButton href="#how-it-works" variant="secondary">See How It Works</CTAButton>
          </AnimatedSection>
        </div>
      </section>

      {/* ══ 2. STATEMENT ══════════════════════════════════════════════════ */}
      {/* Two-tone: the problem clause dims out, the A1 clauses stay white. */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-content text-center">
          <AnimatedSection>
            <p className="eyebrow">Where the money comes from</p>
            <p className="mx-auto mt-8 max-w-[900px] text-[28px] font-medium leading-[1.2] text-balance sm:text-[34px] md:text-statement">
              <span className="text-[#FAFAFA]">We only get paid after you do.</span>{" "}
              <span className="text-dim">
                No retainer, no setup fee, no media budget out of your pocket. The part that
                normally costs a creator thousands a month before anything works.
              </span>{" "}
              <span className="text-[#FAFAFA]">
                Our capital goes into the ad account, and we take a share of what comes back out.
              </span>
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ══ 3. HOW IT WORKS — BENTO ═══════════════════════════════════════ */}
      <section id="how-it-works" className="scroll-mt-24 px-6 py-8">
        <div className="plate mx-auto max-w-content px-6 py-24 md:px-12">
          <AnimatedSection>
            <h2 className="mx-auto max-w-[840px] text-center text-[32px] font-semibold leading-[1.2] text-balance md:text-h2">
              What you&apos;ll gain by <span className="accent-italic text-gold">partnering</span> with us
            </h2>
          </AnimatedSection>

          {/* Row A — art top, text bottom */}
          <div className="mx-auto mt-14 grid max-w-inner gap-8 md:grid-cols-3">
            {bento.map((card, i) => (
              <AnimatedSection key={card.title} delay={i * 0.06}>
                <div className="panel flex h-full flex-col p-8">
                  <div className="mb-8 shrink-0">
                    {card.art === "growth" && <GrowthChart />}
                    {card.art === "strategy" && <StrategyCard />}
                    {card.art === "revenue" && <RevenueCurve />}
                  </div>
                  <h3 className="text-balance text-[22px] font-medium leading-[1.4] text-[#FAFAFA] md:text-h3">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-body text-[#8A857D]">{card.body}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Row B — text left, art right */}
          <div className="mx-auto mt-8 grid max-w-inner gap-8 md:grid-cols-2">
            {bentoWide.map((card, i) => (
              <AnimatedSection key={card.title} delay={i * 0.06}>
                <div className="panel flex h-full flex-col items-center gap-8 p-8 sm:flex-row">
                  <div className="flex-1">
                    <h3 className="text-balance text-[22px] font-medium leading-[1.4] text-[#FAFAFA] md:text-h3">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-body text-[#8A857D]">{card.body}</p>
                  </div>
                  <div className="shrink-0">
                    {card.art === "tools" && <ToolStack />}
                    {card.art === "team" && <TeamStack />}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Row C — capability pills */}
          <AnimatedSection className="mt-12">
            <ul className="mx-auto flex max-w-[840px] flex-wrap justify-center gap-4">
              {capabilities.map((c) => (
                <li key={c} className="pill">
                  <span className="h-2.5 w-2.5 rounded-[3px] bg-accent" aria-hidden />
                  {c}
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </section>

      {/* ══ 4. WHY A1 ═════════════════════════════════════════════════════ */}
      <section id="why-a1" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto max-w-content">
          <AnimatedSection className="text-center">
            <h2 className="text-[32px] font-semibold leading-[1.2] text-balance md:text-h2">
              Help. Fund. <span className="accent-italic text-gold">Launch.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[660px] text-body text-[#D2CEC9]">
              Three things a creator can&apos;t buy separately and can&apos;t do alone. We do all
              three, and we carry the risk on the third.
            </p>
          </AnimatedSection>

          <AnimatedSection className="mt-14" delay={0.06}>
            <div className="panel overflow-hidden px-6 py-10 md:px-10">
              <PipelineLoop />
            </div>
          </AnimatedSection>

          <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
            {pillars.map((p, i) => (
              <AnimatedSection key={p.title} delay={i * 0.08}>
                <div className="px-2">
                  <span className="text-accent"><PillarIcon>{p.icon}</PillarIcon></span>
                  <h3 className="mt-6 text-[22px] font-medium leading-[1.4] text-[#FAFAFA] md:text-h3">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-body text-[#D2CEC9]">{p.body}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 5. FOUNDERS ═══════════════════════════════════════════════════ */}
      <section id="founders" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto max-w-content">
          <AnimatedSection className="text-center">
            <h2 className="text-[32px] font-semibold leading-[1.2] text-balance md:text-h2">
              Meet your <span className="accent-italic text-gold">dream team</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[820px] text-body text-[#D2CEC9]">
              Two operators, not an agency roster. Between them they&apos;ve built the offers and
              collected the cash on the other side of them, which is why we&apos;re willing to
              fund yours.
            </p>
          </AnimatedSection>

          <div className="mt-20 flex flex-col gap-20">
            {founders.map((f, i) => (
              <AnimatedSection key={f.name} delay={i * 0.05}>
                <div className="grid items-center gap-10 md:grid-cols-[400px_1fr] md:gap-16">
                  <div>
                    <FounderPhoto src={f.image} name={f.name} />
                    <h3 className="mt-6 text-[22px] font-medium leading-[1.4] text-[#FAFAFA] md:text-h3">
                      {f.name}
                    </h3>
                    <p className="mt-1 text-body text-[#8A857D]">{f.title}</p>
                  </div>

                  <div>
                    <p className="text-body font-medium text-[#FAFAFA]">
                      Here are some of {f.name.split(" ")[0]}&apos;s accomplishments:
                    </p>
                    <ul className="mt-5 flex flex-col gap-3">
                      {f.points.map((point) => (
                        <li key={point} className="flex items-start gap-4">
                          <span className="mt-[13px] h-px w-4 shrink-0 bg-accent" aria-hidden />
                          <span className="text-body text-[#D2CEC9]">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 6. PORTFOLIO ══════════════════════════════════════════════════ */}
      <section id="portfolio" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto max-w-content">
          <AnimatedSection className="text-center">
            <h2 className="text-[32px] font-semibold leading-[1.2] text-balance md:text-h2">
              Our <span className="accent-italic text-gold">portfolio</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[660px] text-body text-[#D2CEC9]">
              Offers we built, funded and still run. Every page below is live.
            </p>
          </AnimatedSection>

          <div className="mt-16 flex flex-col gap-16 md:gap-20">
            {portfolio.map((item, i) => (
              <AnimatedSection key={item.brand} delay={0.04}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="panel overflow-hidden p-3 md:p-4">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-[#0C0B0A]">
                      <Image
                        src={item.image}
                        alt={`${item.brand} landing page`}
                        fill
                        className="object-cover object-top transition-transform duration-[900ms] group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, 1248px"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between md:gap-10">
                    <div>
                      <h3 className="text-[24px] font-medium leading-[1.4] text-[#FAFAFA] md:text-h3">
                        {item.brand}
                      </h3>
                      <p className="mt-1 text-body text-accent">{item.niche}</p>
                    </div>
                    <p className="max-w-[520px] text-body text-[#8A857D]">{item.blurb}</p>
                  </div>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 7. FAQ ════════════════════════════════════════════════════════ */}
      <section id="faq" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto max-w-content">
          <AnimatedSection className="text-center">
            <h2 className="text-[32px] font-semibold leading-[1.2] text-balance md:text-h2">
              Frequently asked <span className="accent-italic text-gold">questions</span>
            </h2>
          </AnimatedSection>

          <div className="mx-auto mt-14 max-w-prose border-t border-white/[0.07]">
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

      {/* ══ 8. FINAL CTA ══════════════════════════════════════════════════ */}
      <section className="aurora px-6 py-28 md:py-36">
        <div className="mx-auto max-w-content text-center">
          <AnimatedSection className="flex flex-col items-center gap-6">
            <h2 className="max-w-[820px] text-[32px] font-semibold leading-[1.2] text-balance md:text-h2">
              Let&apos;s find out what your audience is{" "}
              <span className="accent-italic text-gold">really</span> worth
            </h2>
            <p className="max-w-[640px] text-body text-[#D2CEC9]">
              One call. We&apos;ll tell you what we&apos;d build, what we&apos;d fund, and whether
              we think it works, before anyone commits to anything.
            </p>
            <CTAButton href={CAL_LINK} external>Book a Call</CTAButton>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
