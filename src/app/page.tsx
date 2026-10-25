"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CTAButton from "@/components/CTAButton";
import AnimatedSection from "@/components/AnimatedSection";
import FounderPhoto from "@/components/FounderPhoto";
import { GrowthChart, StrategyCard, RevenueCurve, ToolStack } from "@/components/Infographics";
import { HelpIcon, FundIcon, LaunchIcon } from "@/components/PillarIcons";
import TeamStack from "@/components/TeamStack";
import { CAL_LINK } from "@/lib/site";

// ─── How it works ───────────────────────────────────────────────────────────────
// Five bento cards. The `wide` pair runs text-left / art-right on the second
// row; the rest are art-top / text-bottom. The webinar is the centre of the
// offer now: card two carries it.

const bento = [
  {
    title: "We craft the high-ticket offer",
    body: "Research, positioning, price, promise and delivery, built end to end.",
    art: "growth" as const,
  },
  {
    title: "We build and run the webinar",
    body: "Registration page, slides, script, replay and the email sequence around it.",
    art: "strategy" as const,
  },
  {
    title: "We scale it with our own money",
    body: "Once the webinar converts, our capital goes into the ad account.",
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
  "Done-For-You Webinars",
  "Done-For-You Funnels",
  "Done-For-You Offers",
  "Done-For-You Ads",
  "Done-For-You Copywriting",
  "Done-For-You Sales Teams",
];

// ─── Why us ─────────────────────────────────────────────────────────────────────
// The three verbs from the positioning, one per column.

const pillars = [
  {
    title: "Help",
    body: "We work with you on the content that actually drives buyers, and script the long-form so the engine stops depending on your best week.",
    Icon: HelpIcon,
  },
  {
    title: "Fund",
    body: "No retainer, no setup fee, no media budget from you. Our capital goes into the ad account and we take a share of what comes back out.",
    Icon: FundIcon,
  },
  {
    title: "Launch",
    body: "Offer locked, webinar built, sales team placed and tracking wired up, live to your audience in 10 to 14 days.",
    Icon: LaunchIcon,
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

// ─── FAQ ────────────────────────────────────────────────────────────────────────

const faqItems = [
  { question: "How is all of this free?", answer: "There's no retainer, no setup fee and no ad budget from you. We're paid a percentage of the revenue the offer produces, so we earn after you do. The marketing, sales, operations and backend cost you nothing upfront because we're betting on the outcome rather than billing for the work." },
  { question: "How fast is it live?", answer: "10 to 14 days from signing. That covers the offer, the webinar itself, the registration and replay pages, the email sequence and the booking flow, with the sales team placed and tracking wired up before it goes out. The only thing we need from you inside that window is the recording session and sign-off on the offer." },
  { question: "You actually pay for the ad spend?", answer: "Yes. Once the webinar converts with your organic audience, we fund the paid campaigns out of our own pocket: creative, testing and scaling. We're not asking you to risk your own money to find out whether this works." },
  { question: "What counts as an established brand?", answer: "An audience that already knows you, watches you and responds to you, built organically over time, not bought. If you're monetising with a community, a low-ticket product or brand deals and you feel capped by it, that's the profile. If you're still building the audience, we're not the right partner yet." },
  { question: "What if I don't have an offer yet?", answer: "Most partners don't. That's the work. We handle research, positioning, pricing, packaging and delivery, and build the offer from scratch, then build the webinar that sells it. You bring the audience and the credibility; we build the thing they buy." },
  { question: "Do I have to stop taking brand deals?", answer: "No. Most partners keep them. The difference is that brand deals become the smaller line on the invoice instead of the whole business, because the webinar produces revenue every month whether or not a sponsor turns up." },
  { question: "How much of my time does this take?", answer: "You keep making content, record the webinar once and sign off on the offer. That is the whole ask. The script, the slides, the pages, the sequences, the closers and the ad management all sit with us, and the recording is reusable rather than something you present live every week." },
  { question: "How selective are you?", answer: "Very, because we're spending our own capital on every partnership. We take a small number of creators at a time, and if we can't see a clear path to seven figures we'll tell you on the call rather than take you on." },
];

// ─── Pieces ─────────────────────────────────────────────────────────────────────

/* Section eyebrow. Always gold: the page is gold on black, and per-section
   accent colours read as three unrelated palettes rather than as variety.
   Variety comes from size, alignment and rhythm instead. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[17px] leading-[1.4] text-accent">{children}</p>;
}

/* Draws itself in on a loop, cascading across the row via --tick-delay. */
function Tick({ delay }: { delay: number }) {
  return (
    <svg viewBox="0 0 20 20" className="h-[18px] w-[18px] shrink-0" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="9" stroke="rgba(227,192,141,0.28)" strokeWidth="1.2" />
      <path
        className="tick-path"
        d="M5.6 10.4 8.7 13.5 14.4 7"
        stroke="#E3C08D"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ ["--tick-delay" as string]: `${delay}s` }}
      />
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
            <h1 className="max-w-[1100px] text-[34px] font-semibold leading-[1.15] text-balance sm:text-[44px] md:text-[54px] lg:text-[62px]">
              We Will Help Launch Your{" "}
              <span className="whitespace-nowrap">High-Ticket</span> Webinar Funnel{" "}
              <span className="accent-italic text-gold">Within 14 Days</span>
            </h1>

            <p className="mt-6 max-w-[640px] text-body text-[#D2CEC9]">
              GrowingOffers crafts established creators a high-ticket offer, launches it as a
              webinar funnel in 10 to 14 days, then pays for the ad spend out of our own pocket.
              You keep making content. No retainer, no setup fee.
            </p>
          </AnimatedSection>

          <AnimatedSection className="mt-10" delay={0.08}>
            <CTAButton href={CAL_LINK} external>Book a Call</CTAButton>
          </AnimatedSection>
        </div>
      </section>

      {/* ══ 2. STATEMENT ══════════════════════════════════════════════════ */}
      {/* Two-tone: the problem clause dims out, our clauses stay white. */}
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
          <AnimatedSection className="text-center">
            <Eyebrow>What partnering actually gets you</Eyebrow>
            <h2 className="mx-auto mt-5 max-w-[840px] text-[30px] font-semibold leading-[1.2] text-balance md:text-[46px]">
              Everything behind the brand, <span className="accent-italic text-gold">handled</span>
            </h2>
          </AnimatedSection>

          {/* Row A — art top, text bottom */}
          <div className="mx-auto mt-14 grid max-w-inner gap-8 md:grid-cols-3">
            {bento.map((card, i) => (
              <AnimatedSection key={card.title} delay={i * 0.1} variant="scale">
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
              <AnimatedSection key={card.title} delay={i * 0.1} variant={i === 0 ? "left" : "right"}>
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
              {capabilities.map((c, i) => (
                <li key={c} className="pill">
                  <Tick delay={i * 0.32} />
                  {c}
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </section>

      {/* ══ 4. WHY US ═════════════════════════════════════════════════════ */}
      <section id="why-us" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto max-w-content">
          <AnimatedSection variant="left" className="max-w-[720px]">
            <Eyebrow>The whole model, in three words</Eyebrow>
            <h2 className="mt-5 text-[34px] font-semibold leading-[1.1] md:text-[54px]">
              Help. Fund. <span className="accent-italic text-gold">Launch.</span>
            </h2>
            <p className="mt-5 max-w-[560px] text-body text-[#8A857D]">
              Three things a creator can&apos;t buy separately and can&apos;t do alone. We do all
              three, and we carry the risk on the third.
            </p>
          </AnimatedSection>

          <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
            {pillars.map((p, i) => (
              <AnimatedSection key={p.title} delay={i * 0.08}>
                <div className="px-2">
                  <p.Icon />
                  <h3 className="mt-7 text-[22px] font-medium leading-[1.4] text-[#FAFAFA] md:text-h3">
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
            <Eyebrow>Who you are actually working with</Eyebrow>
            <h2 className="mt-5 text-[30px] font-semibold leading-[1.2] text-balance md:text-[46px]">
              Meet your <span className="accent-italic text-gold">dream team</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[760px] text-body text-[#8A857D]">
              Two operators, not an agency roster. Between them they&apos;ve built the offers and
              collected the cash on the other side of them, which is why we&apos;re willing to
              fund yours.
            </p>
          </AnimatedSection>

          <div className="mt-20 flex flex-col gap-20">
            {founders.map((f, i) => (
              <AnimatedSection key={f.name} variant={i % 2 === 0 ? "left" : "right"}>
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

      {/* ══ 6. FAQ ════════════════════════════════════════════════════════ */}
      <section id="faq" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto max-w-content">
          <AnimatedSection variant="left" className="mx-auto max-w-prose">
            <Eyebrow>Before you book</Eyebrow>
            <h2 className="mt-5 text-[30px] font-semibold leading-[1.2] md:text-[44px]">
              Frequently asked <span className="accent-italic text-gold">questions</span>
            </h2>
          </AnimatedSection>

          <div className="mx-auto mt-12 max-w-prose border-t border-white/[0.07]">
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

      {/* ══ 7. FINAL CTA ══════════════════════════════════════════════════ */}
      <section className="aurora px-6 py-32 md:py-44">
        <div className="mx-auto max-w-content text-center">
          <AnimatedSection className="flex flex-col items-center gap-7">
            <h2 className="max-w-[900px] text-[36px] font-semibold leading-[1.1] text-balance md:text-[60px]">
              Unlock your audience&apos;s{" "}
              <span className="accent-italic text-gold">full potential</span>
            </h2>
            <p className="max-w-[560px] text-body text-[#D2CEC9]">
              Ready to build the offer your audience is actually worth? Book a call and
              we&apos;ll tell you what we&apos;d build and what we&apos;d fund.
            </p>
            <CTAButton href={CAL_LINK} external>Book a Call</CTAButton>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
