"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import CTAButton from "@/components/CTAButton";
import AnimatedSection from "@/components/AnimatedSection";
import FounderPhoto from "@/components/FounderPhoto";
import { OfferArt, FunnelArt, FundingArt } from "@/components/Infographics";
import { CAL_LINK } from "@/lib/site";

// ─── How it works ───────────────────────────────────────────────────────────────
// The seven-step list compressed to five bento cards. The `wide` pair runs
// text-left / art-right on the second row; the rest are art-top / text-bottom.

const bento = [
  {
    title: "We craft the high-ticket offer",
    body: "Research, positioning, price, promise and delivery — built end to end.",
    art: "offer" as const,
  },
  {
    title: "We build and own the funnel",
    body: "Pages, scripts, sequences, checkout and CRM. Attention through to payment.",
    art: "funnel" as const,
  },
  {
    title: "We scale it with our own money",
    body: "Once it converts organically, our capital goes into the ad account.",
    art: "funding" as const,
  },
];

const bentoWide = [
  {
    title: "We write the content engine",
    body: "Hooks, angles, scripts and an ideation calendar. You show up and deliver it.",
  },
  {
    title: "We staff setters and closers",
    body: "Placed from our own network, so selling never becomes your job.",
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
        <path d="M4 20h24" />
        <path d="M9 20v-7M16 20V6M23 20v-11" />
      </>
    ),
  },
  {
    title: "Fund",
    body: "No retainer, no setup fee, no media budget from you. Our capital goes into the ad account and we take a share of what comes back out.",
    icon: (
      <>
        <rect x="4" y="8" width="24" height="16" rx="3" />
        <circle cx="16" cy="16" r="4" />
      </>
    ),
  },
  {
    title: "Launch",
    body: "Offer locked, funnel built, sales team placed and tracking wired up — live to your audience inside the first week.",
    icon: (
      <>
        <path d="M16 4c5 4 7 9 7 14l-7 5-7-5c0-5 2-10 7-14Z" />
        <circle cx="16" cy="14" r="3" />
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
      "Currently based in Northern Ireland",
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
      "Currently based in Ireland",
    ],
  },
];

// ─── Clients ────────────────────────────────────────────────────────────────────

const clients = [
  { name: "Angus Jobson", role: "Testosterone Coach", image: "/clients/angus-jobson.jpg" },
  { name: "Zaki Abanifi", role: "Dating Coach", image: "/clients/zaki-abanifi.jpg" },
  { name: "David James Seed", role: "Lust Coach", image: "/clients/david-james-seed.jpg" },
];

// ─── FAQ ────────────────────────────────────────────────────────────────────────

const faqItems = [
  { question: "How is all of this free?", answer: "There's no retainer, no setup fee and no ad budget from you. We're paid a percentage of the revenue the offer produces, so we earn after you do. The marketing, sales, operations and backend cost you nothing upfront because we're betting on the outcome rather than billing for the work." },
  { question: "You actually pay for the ad spend?", answer: "Yes. Once the offer is proven with your organic audience, we fund the paid campaigns out of our own pocket — creative, testing and scaling. We're not asking you to risk your own money to find out whether this works." },
  { question: "What counts as an established brand?", answer: "An audience that already knows you, watches you and responds to you — built organically over time, not bought. If you're monetising with a community, a low-ticket product or brand deals and you feel capped by it, that's the profile. If you're still building the audience, we're not the right partner yet." },
  { question: "What if I don't have an offer yet?", answer: "Most partners don't. That's the work. We handle research, positioning, pricing, packaging and delivery, and build the offer from scratch. You bring the audience and the credibility; we build the thing they buy." },
  { question: "Do I have to stop taking brand deals?", answer: "No. Most partners keep them. The difference is that brand deals become the smaller line on the invoice instead of the whole business, because the offer produces revenue every month whether or not a sponsor turns up." },
  { question: "How much of my time does this take?", answer: "You keep making content and show up for the assets we need — a handful of filming sessions and sign-off on the offer. Everything else, from funnels to closers to ad management, sits with us." },
  { question: "How selective are you?", answer: "Very, because we're spending our own capital on every partnership. We take a small number of creators at a time, and if we can't see a clear path to seven figures we'll tell you on the call rather than take you on." },
];

// ─── Pieces ─────────────────────────────────────────────────────────────────────

function PillarIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
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
              We build it for free — <span className="accent-italic text-gold">then we fund the ads</span>
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
                No retainer, no setup fee, no media budget out of your pocket — the part that
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
                  <div className="mb-8 flex h-[150px] shrink-0 items-center justify-center">
                    {card.art === "offer" && <OfferArt />}
                    {card.art === "funnel" && <FunnelArt />}
                    {card.art === "funding" && <FundingArt />}
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
                <div className="panel flex h-full flex-col justify-center p-8">
                  <div>
                    <h3 className="text-[22px] font-medium leading-[1.4] text-[#FAFAFA] md:text-h3">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-body text-[#8A857D]">{card.body}</p>
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

          <div className="mt-16 grid gap-6 md:grid-cols-3">
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
              collected the cash on the other side of them — which is why we&apos;re willing to
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

      {/* ══ 6. CLIENTS ════════════════════════════════════════════════════ */}
      <section id="clients" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto max-w-content">
          <AnimatedSection className="text-center">
            <h2 className="text-[32px] font-semibold leading-[1.2] text-balance md:text-h2">
              Some of our <span className="accent-italic text-gold">current clients</span>
            </h2>
          </AnimatedSection>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {clients.map((c, i) => (
              <AnimatedSection key={c.name} delay={i * 0.08}>
                <figure className="group">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[#151413]">
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                  <figcaption className="mt-5">
                    <p className="text-[22px] font-medium leading-[1.4] text-[#FAFAFA] md:text-h3">
                      {c.name}
                    </p>
                    <p className="mt-1 text-body text-[#8A857D]">{c.role}</p>
                  </figcaption>
                </figure>
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
              we think it works — before anyone commits to anything.
            </p>
            <CTAButton href={CAL_LINK} external>Book a Call</CTAButton>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
