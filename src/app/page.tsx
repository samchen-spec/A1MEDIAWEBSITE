"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SectionLabel from "@/components/SectionLabel";
import CTAButton from "@/components/CTAButton";
import AnimatedSection from "@/components/AnimatedSection";
import ScheduleCall from "@/components/ScheduleCall";
import SectionCTA from "@/components/SectionCTA";
import VSL from "@/components/VSL";
import FounderPhoto from "@/components/FounderPhoto";
import { SystemDiagram, FundingFlow, CeilingChart, WeekArc } from "@/components/Infographics";

// ─── Clients ────────────────────────────────────────────────────────────────────

const clients = [
  { name: "Angus Jobson", role: "Testosterone Coach", image: "/clients/angus-jobson.jpg" },
  { name: "Zaki Abanifi", role: "Dating Coach", image: "/clients/zaki-abanifi.jpg" },
  { name: "David James Seed", role: "Lust Coach", image: "/clients/david-james-seed.jpg" },
];

// ─── Founders ───────────────────────────────────────────────────────────────────
// Drop the headshots at these paths and they appear automatically; until then
// each card falls back to a monogram.
const founders = [
  {
    name: "Sam Chen",
    title: "Co-Founder & CMO | Head Of Marketing",
    image: "/founders/sam-chen.jpg",
    points: [
      "Been in the info space for 2+ years",
      "Generated $1,000,000 in client revenue in the past 12 months",
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
      "Currently based in Ireland",
    ],
  },
];

// ─── How it works ───────────────────────────────────────────────────────────────

const howItWorks = [
  { num: "01", title: "We craft the high-ticket offer", desc: "Research, positioning, price, promise and delivery. One premium offer built end to end that makes sense coming from you specifically — not a rebrand of what you're already selling." },
  { num: "02", title: "We market it and design the funnel", desc: "Landing pages, sales pages, VSL scripts, email and DM sequences, checkout and CRM. The whole path from attention to payment, built and owned by us, running under your brand." },
  { num: "03", title: "Organic coaching and strategy", desc: "We work with you on the content that actually drives buyers — what to post, what to say, and how to move an audience from watching to booking without turning your feed into an advert." },
  { num: "04", title: "Done-for-you long-form scripting", desc: "Our team writes the long-form: hooks, angles, scripts and ideation calendars. You show up and deliver it. The content engine stops depending on you having a good idea that week." },
  { num: "05", title: "We scale with ads — with our own money", desc: "Once the offer converts organically, our capital goes into the ad account. Creative, testing, media buying, scaling. Not your budget. Ours." },
  { num: "06", title: "We staff setters, closers and support", desc: "Hired from our own network of trained sales talent and placed into your business. They take the calls, handle the objections and close, so selling never becomes your job." },
  { num: "07", title: "Access to our private financing", desc: "Partners get access to financing options we've built relationships for — the kind of facility an individual creator can't get on their own, used to push spend further." },
];

// ─── The traditional model ──────────────────────────────────────────────────────

const traditionalModel = [
  { label: "Brand deals", body: "You get paid once for renting your audience to somebody else's business. They keep the customer, the data and the equity. Next month you start from zero and negotiate again." },
  { label: "Affiliate offers", body: "You send your best buyers to someone else's asset for a slice of the sale. The list, the repeat revenue and the backend all sit with the person who owns the offer. You're their acquisition channel." },
  { label: "Low-ticket ebooks & digital products", body: "A $27 product needs enormous volume to matter, and the margin can't fund ads or a sales team. So it stays capped at whatever your organic reach happens to be that month." },
  { label: "Low-ticket communities", body: "A $49/month community means churn, endless support and a business that punishes you for growing. You end up running a community full time instead of running a company." },
];

// ─── Launch roadmap ─────────────────────────────────────────────────────────────

const roadmap = [
  { day: "Day 1", title: "Audit and offer architecture", desc: "We go through your audience, numbers and current products, then lock the offer: promise, price, delivery model and guarantee." },
  { day: "Day 2", title: "Messaging and sales assets", desc: "Positioning, VSL script, sales page copy and the objection map your closers will work from." },
  { day: "Day 3", title: "Funnel built", desc: "Landing page, sales page, booking flow, checkout and email sequences live and tested end to end." },
  { day: "Day 4", title: "Sales team placed", desc: "Setters and closers pulled from our network, onboarded onto your offer and trained on your audience." },
  { day: "Day 5", title: "Systems and tracking", desc: "CRM, pipeline, reporting and attribution wired up so every call and every dollar is accounted for." },
  { day: "Day 6", title: "Content and organic plan", desc: "Launch content scripted and scheduled, with the ideation calendar that carries the first 30 days." },
  { day: "Day 7", title: "Launch — and we fund the ads", desc: "The offer goes live to your organic audience. Once the numbers hold, our capital goes into the ad account." },
];

// ─── Qualifier ──────────────────────────────────────────────────────────────────

const notForYou = [
  "You're starting from zero, or the audience is still small",
  "You want a course that teaches you to do this yourself",
  "You want a brand-deal agent, not a business",
  "You'd rather keep selling a low-ticket product on volume",
  "You don't want your name on a premium offer",
];

const forYou = [
  "You have an established organic brand and real reach",
  "You're selling a community, a low-ticket course, or taking brand deals",
  "You know what you've built is bigger than what it's returning",
  "You want one premium offer instead of five small ones",
  "You'll keep making content and let us run everything behind it",
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

// ─── Accordion ──────────────────────────────────────────────────────────────────

function AccordionItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-white/[0.08]">
      <button onClick={onToggle} className="group flex w-full items-center justify-between gap-6 py-7 text-left">
        <span className="font-serif text-[22px] text-[#FAFAFA] transition-colors duration-200 group-hover:text-accent md:text-[27px]">
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
            <p className="pb-8 pr-10 text-[17px] font-light leading-[1.8] text-[#B5B1AC]">{answer}</p>
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
    <main className="bg-[#0A0A0A] text-[#FAFAFA]">

      {/* ══ 1. HERO + VSL + APPLICATION ═══════════════════════════════════ */}
      <section className="silk-bg px-6 pb-24 pt-[132px] md:pb-28 md:pt-[184px]">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col items-center text-center">
          <AnimatedSection className="flex flex-col items-center">
            <SectionLabel>For influencers with an established brand</SectionLabel>

            <h1 className="mt-7 max-w-[920px] font-serif text-[28px] leading-[1.2] tracking-hero text-balance sm:text-[34px] md:text-[40px] lg:text-[46px]">
              We&apos;ll build <span className="mark-underline">every system</span> for{" "}
              <span className="mark-box">100% FREE</span> so you can monetise your audience, then
              put <span className="italic text-gold">our own money</span> into ads to scale it
            </h1>

            <div className="rule-accent mt-11" />
          </AnimatedSection>

          <AnimatedSection className="vsl-wrap mt-[72px]">
            <VSL />
          </AnimatedSection>

          <AnimatedSection className="mt-11">
            <CTAButton href="#schedule">Schedule My Call</CTAButton>
          </AnimatedSection>

          {/* Application sits directly under the video */}
          <div id="schedule" className="mt-16 w-full scroll-mt-28 md:mt-24">
            <AnimatedSection>
              <h2 className="font-serif text-[32px] leading-[1.14] tracking-hero md:text-[46px]">
                Schedule A Call
              </h2>
            </AnimatedSection>

            <AnimatedSection className="mt-10">
              <ScheduleCall />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ══ 2. CLIENTS ════════════════════════════════════════════════════ */}
      <section id="clients" className="scroll-mt-24 border-y border-white/[0.08] bg-[#0D0C0B] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-[1100px]">
          <AnimatedSection className="text-center">
            <h2 className="font-serif text-[32px] leading-[1.14] tracking-hero text-balance md:text-[46px]">
              Some of our current clients
            </h2>
          </AnimatedSection>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {clients.map((c, i) => (
              <AnimatedSection key={c.name} delay={i * 0.1}>
                <figure className="group">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121110]">
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 340px"
                    />
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{ background: "linear-gradient(180deg, transparent 55%, rgba(10,10,10,0.85) 100%)" }}
                      aria-hidden
                    />
                  </div>
                  <figcaption className="mt-5 text-center">
                    <p className="font-serif text-[26px] leading-tight text-[#FAFAFA]">{c.name}</p>
                    <p className="mt-2 text-[12px] uppercase tracking-[0.2em] text-accent">{c.role}</p>
                  </figcaption>
                </figure>
              </AnimatedSection>
            ))}
          </div>

          <SectionCTA />
        </div>
      </section>

      {/* ══ 3. ABOUT THE FOUNDERS ═════════════════════════════════════════ */}
      <section id="founders" className="scroll-mt-24 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-[1000px]">
          <AnimatedSection className="text-center">
            <SectionLabel>About the founders</SectionLabel>
            <h2 className="mt-7 font-serif text-[32px] leading-[1.14] tracking-hero text-balance md:text-[46px]">
              Who you&apos;re actually working with
            </h2>
          </AnimatedSection>

          <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-8">
            {founders.map((f, i) => (
              <AnimatedSection key={f.name} delay={i * 0.1}>
                <div className="panel h-full p-8 md:p-10">
                  <FounderPhoto src={f.image} name={f.name} />

                  <h3 className="mt-7 font-serif text-[30px] leading-tight text-[#FAFAFA] md:text-[34px]">
                    {f.name}
                  </h3>
                  <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
                    {f.title}
                  </p>

                  <ul className="mt-7 flex flex-col gap-4">
                    {f.points.map((point) => (
                      <li key={point} className="flex items-start gap-4">
                        <span className="mt-[10px] h-px w-4 shrink-0 bg-accent" aria-hidden />
                        <span className="text-[16px] leading-[1.6] text-[#B5B1AC] md:text-[17px]">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <SectionCTA />
        </div>
      </section>

      {/* ══ 4. HOW IT WORKS ═══════════════════════════════════════════════ */}
      <section id="how-it-works" className="scroll-mt-24 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-[1000px]">
          <AnimatedSection className="text-center">
            <SectionLabel>How it works</SectionLabel>
            <h2 className="mt-7 font-serif text-[32px] leading-[1.14] tracking-hero text-balance md:text-[46px]">
              Everything behind the brand, handled
            </h2>
            <p className="mx-auto mt-6 max-w-[620px] text-[17px] font-light leading-[1.7] text-[#B5B1AC] md:text-[19px]">
              You keep making content. This is the list of what stops being your problem.
            </p>
          </AnimatedSection>

          <AnimatedSection className="mt-14">
            <div className="panel px-6 py-10 md:px-12">
              <SystemDiagram />
            </div>
          </AnimatedSection>

          <div className="mt-14">
            {howItWorks.map((step, i) => (
              <AnimatedSection key={step.num} delay={i * 0.04}>
                <div className="grid gap-6 border-t border-white/[0.08] py-9 last:border-b md:grid-cols-[100px_1fr] md:gap-12">
                  <span className="font-serif text-[44px] leading-none text-accent/35 md:text-[52px]">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="font-serif text-[26px] leading-tight text-[#FAFAFA] md:text-[32px]">
                      {step.title}
                    </h3>
                    <p className="mt-4 max-w-[680px] text-[17px] font-light leading-[1.8] text-[#B5B1AC] md:text-[18px]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <SectionCTA />
        </div>
      </section>

      {/* ══ 5. WHY IT'S FREE ══════════════════════════════════════════════ */}
      <section className="border-y border-white/[0.08] bg-[#0D0C0B] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-[1000px]">
          <AnimatedSection className="text-center">
            <SectionLabel>Where the money comes from</SectionLabel>
            <h2 className="mt-7 font-serif text-[32px] leading-[1.14] tracking-hero text-balance md:text-[46px]">
              We only get paid <span className="text-gold italic">after you do</span>
            </h2>
            <p className="mx-auto mt-6 max-w-[640px] text-[17px] font-light leading-[1.7] text-[#B5B1AC] md:text-[19px]">
              No retainer, no setup fee, no media budget. Our capital goes into the ad account and
              we take a share of what comes back out.
            </p>
          </AnimatedSection>

          <AnimatedSection className="mt-14">
            <div className="panel px-6 py-10 md:px-12">
              <FundingFlow />
            </div>
          </AnimatedSection>

          <SectionCTA />
        </div>
      </section>

      {/* ══ 6. WHY THE TRADITIONAL MODEL DOESN'T WORK ═════════════════════ */}
      <section id="the-maths" className="scroll-mt-24 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-[1000px]">
          <AnimatedSection className="text-center">
            <SectionLabel>The maths</SectionLabel>
            <h2 className="mt-7 font-serif text-[32px] leading-[1.14] tracking-hero text-balance md:text-[46px]">
              Why the traditional model doesn&apos;t work
            </h2>
            <p className="mx-auto mt-6 max-w-[640px] text-[17px] font-light leading-[1.7] text-[#B5B1AC] md:text-[19px]">
              Every way creators are told to monetise has the same flaw: it caps out long before it
              pays you what the audience is worth.
            </p>
          </AnimatedSection>

          <AnimatedSection className="mt-14">
            <div className="panel px-6 py-10 md:px-12">
              <CeilingChart />
            </div>
          </AnimatedSection>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {traditionalModel.map((item, i) => (
              <AnimatedSection key={item.label} delay={i * 0.08}>
                <div className="panel h-full p-9 md:p-10">
                  <h3 className="font-serif text-[26px] leading-tight text-[#7A756D]">{item.label}</h3>
                  <p className="mt-5 text-[17px] font-light leading-[1.8] text-[#B5B1AC]">{item.body}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* High-ticket maths */}
          <AnimatedSection>
            <div className="mt-10 rounded-2xl border border-accent/25 bg-[#0D0C0B] px-8 py-14 text-center md:px-16">
              <span className="eyebrow">Now do the high-ticket maths</span>

              <div className="mt-10 flex flex-col items-center justify-center gap-6 md:flex-row md:gap-10">
                <div>
                  <p className="font-serif text-[52px] leading-none text-[#FAFAFA] md:text-[64px]">$5,000</p>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-[#7A756D]">High-ticket offer</p>
                </div>
                <span className="font-serif text-[32px] leading-none text-accent md:text-[40px]" aria-hidden>×</span>
                <div>
                  <p className="font-serif text-[52px] leading-none text-[#FAFAFA] md:text-[64px]">50</p>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-[#7A756D]">Conversions / mo</p>
                </div>
                <span className="font-serif text-[32px] leading-none text-accent md:text-[40px]" aria-hidden>=</span>
                <div>
                  <p className="font-serif text-[52px] leading-none text-gold md:text-[72px]">$250,000</p>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-[#7A756D]">Revenue per month</p>
                </div>
              </div>

              <p className="mx-auto mt-12 max-w-[640px] text-[17px] font-light leading-[1.8] text-[#B5B1AC] md:text-[19px]">
                Fifty buyers. That&apos;s the whole ask. A $49 community needs five thousand people
                and a support team to get anywhere near it, and a brand deal pays once and
                disappears. One premium offer, sold properly, changes the size of the business.
              </p>
            </div>
          </AnimatedSection>

          <SectionCTA />
        </div>
      </section>

      {/* ══ 7. LAUNCH ROADMAP ═════════════════════════════════════════════ */}
      <section id="roadmap" className="scroll-mt-24 border-y border-white/[0.08] bg-[#0D0C0B] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-[1000px]">
          <AnimatedSection className="text-center">
            <SectionLabel>Launch roadmap</SectionLabel>
            <h2 className="mt-7 font-serif text-[32px] leading-[1.14] tracking-hero text-balance md:text-[46px]">
              Live in <span className="text-gold italic">seven days</span>
            </h2>
            <p className="mx-auto mt-6 max-w-[620px] text-[17px] font-light leading-[1.7] text-[#B5B1AC] md:text-[19px]">
              Offer locked, funnel built, sales team placed. This is what the first week looks like
              once we sign.
            </p>
          </AnimatedSection>

          <AnimatedSection className="mt-14">
            <div className="panel hidden px-6 py-10 md:block md:px-12">
              <WeekArc />
            </div>
          </AnimatedSection>

          <div className="relative mt-12">
            <div className="absolute bottom-2 left-[7px] top-2 hidden w-px bg-white/[0.08] md:block" aria-hidden />
            <div className="flex flex-col gap-10 md:gap-12">
              {roadmap.map((item, i) => (
                <AnimatedSection key={item.day} delay={i * 0.05}>
                  <div className="grid gap-4 md:grid-cols-[16px_120px_1fr] md:gap-8">
                    <span className="mt-2 hidden h-[15px] w-[15px] rounded-full border border-accent bg-[#0D0C0B] md:block" aria-hidden />
                    <span className="text-[12px] uppercase tracking-[0.22em] text-accent md:mt-3">{item.day}</span>
                    <div>
                      <h3 className="font-serif text-[24px] leading-tight text-[#FAFAFA] md:text-[30px]">
                        {item.title}
                      </h3>
                      <p className="mt-3 max-w-[640px] text-[17px] font-light leading-[1.8] text-[#B5B1AC]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          <SectionCTA />
        </div>
      </section>

      {/* ══ 8. WHO THIS IS FOR ════════════════════════════════════════════ */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-[1000px]">
          <AnimatedSection className="text-center">
            <SectionLabel>Who this is for</SectionLabel>
            <h2 className="mt-7 font-serif text-[32px] leading-[1.14] tracking-hero text-balance md:text-[46px]">
              We&apos;d rather turn you away than waste the launch
            </h2>
            <p className="mx-auto mt-6 max-w-[600px] text-[17px] font-light leading-[1.7] text-[#B5B1AC] md:text-[19px]">
              We only take a handful of partners at a time, and we&apos;re funding each one. That
              makes us honest about fit.
            </p>
          </AnimatedSection>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <AnimatedSection>
              <div className="panel h-full p-10 md:p-12">
                <h3 className="font-serif text-[27px] text-[#7A756D]">Who we don&apos;t work with</h3>
                <ul className="mt-8 flex flex-col gap-5">
                  {notForYou.map((item) => (
                    <li key={item} className="flex items-start gap-4">
                      <span className="mt-[11px] h-px w-4 shrink-0 bg-[#3F3B36]" aria-hidden />
                      <span className="text-[17px] font-light leading-[1.6] text-[#7A756D]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="panel h-full p-10 md:p-12" style={{ borderColor: "rgba(227,192,141,0.28)" }}>
                <h3 className="font-serif text-[27px] text-gold">Who we do</h3>
                <ul className="mt-8 flex flex-col gap-5">
                  {forYou.map((item) => (
                    <li key={item} className="flex items-start gap-4">
                      <span className="mt-[11px] h-px w-4 shrink-0 bg-accent" aria-hidden />
                      <span className="text-[17px] font-light leading-[1.6] text-[#FAFAFA]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>

          <SectionCTA />
        </div>
      </section>

      {/* ══ 9. FAQ ════════════════════════════════════════════════════════ */}
      <section id="faq" className="scroll-mt-24 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-[820px]">
          <AnimatedSection className="text-center">
            <SectionLabel>Questions</SectionLabel>
            <h2 className="mt-7 font-serif text-[32px] leading-[1.14] tracking-hero md:text-[46px]">
              Before you apply
            </h2>
          </AnimatedSection>

          <div className="mt-14 border-t border-white/[0.08]">
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

          <SectionCTA />
        </div>
      </section>

      {/* ══ 10. FINAL CTA ═════════════════════════════════════════════════ */}
      <section className="silk-bg border-t border-white/[0.08] px-6 py-28 md:py-40">
        <div className="mx-auto max-w-[780px] text-center">
          <AnimatedSection className="flex flex-col items-center gap-8">
            <h2 className="font-serif text-[36px] leading-[1.1] tracking-hero text-balance md:text-[54px]">
              Let&apos;s find out what your audience is{" "}
              <span className="text-gold italic">really</span> worth
            </h2>
            <p className="max-w-[520px] text-[18px] font-light leading-[1.6] text-[#B5B1AC] md:text-[20px]">
              One call. We&apos;ll tell you what we&apos;d build, what we&apos;d fund, and whether
              we think it works — before anyone commits to anything.
            </p>
            <CTAButton href="#schedule">Schedule My Call</CTAButton>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
