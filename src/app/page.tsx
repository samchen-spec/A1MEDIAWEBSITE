"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CTAButton from "@/components/CTAButton";
import AnimatedSection from "@/components/AnimatedSection";
import FounderPhoto from "@/components/FounderPhoto";
import {
  GrowthChart, StrategyCard, RevenueCurve, ToolStack, WebinarMaths,
} from "@/components/Infographics";
import TeamStack from "@/components/TeamStack";
import { CAL_LINK } from "@/lib/site";

const CTA_LABEL = "Talk To Our Advisors";

// ─── How a webinar works ────────────────────────────────────────────────────────
// Six steps, in plain English. The point of the block is that the creator's own
// job is step 4 and nothing else, so the numbers carry the reading order.

const webinarSteps = [
  "We run ads and tell your audience you’re doing a free live class.",
  "They sign up with their name and email.",
  "We send emails and texts so they actually turn up. (People are forgetful. We’re persistent. It works out.)",
  "You go live for about 2 hours. You teach something useful, then you show them your offer.",
  "The people who want in book a call, and our closers take it from there.",
  "You go back to posting like nothing happened.",
];

// ─── Gurus vs us ────────────────────────────────────────────────────────────────
// Paired rows: same index, opposite column. Nothing here is a claim about anyone
// in particular, it is the course-versus-partnership contrast in the copy.

const guruColumn = [
  "Sell you a course, then leave you to it",
  "47 videos, a Facebook group and a framework with a name",
  "You write the offer, build the funnel, run the ads and hire the team",
  "Get paid the moment you buy",
  "Teach you how to swim",
];

const usColumn = [
  "Partner with you and do the work",
  "A built offer, a live webinar, a running ad account and a sales team",
  "We write it, build it, launch it and sell it with you",
  "Make our real money out of your profit",
  "Get in the boat with you",
];

// ─── How it works ───────────────────────────────────────────────────────────────
// Five bento cards. The `wide` pair runs text-left / art-right on the second
// row; the rest are art-top / text-bottom. The webinar is the whole offer:
// card two carries it, and nothing on the page sells any other funnel type.

const bento = [
  {
    title: "We craft the high-ticket offer",
    body: "We do the research and work out who it’s for, the price, the promise and how it gets delivered.",
    art: "growth" as const,
  },
  {
    title: "We build and run the webinar",
    body: "The sign-up page, the slides, the script, the emails and texts, and the replay.",
    art: "strategy" as const,
  },
  {
    title: "We run your ads",
    body: "We write, launch and test your ads, and track every click, so you know exactly where your buyers come from.",
    art: "revenue" as const,
  },
];

const bentoWide = [
  {
    title: "We run the whole stack",
    body: "Design, docs, automations, ad accounts and checkout, all under your name. None of it your problem.",
    art: "tools" as const,
  },
  {
    title: "We staff setters and closers",
    body: "Placed from our own network, and trained by a guy who’s collected $2.5M on sales calls himself.",
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

// ─── Three options ──────────────────────────────────────────────────────────────

const options = [
  {
    title: "Do it all yourself",
    body: "Learn offers, funnels, ads, webinars, emails and sales, then hire a team and train them. If it all goes well, you’ll be live in a year or two. If it doesn’t... well, at least you’ll have some new hobbies.",
  },
  {
    title: "Hire a normal agency",
    body: "Pay them every month whether it works or not, then cross your fingers. And your toes.",
  },
  {
    title: "Partner with us",
    body: "We build the whole thing and go live in 14 days, with no monthly retainer. And we make our real money out of your profit, so we only really win when you do.",
    ours: true,
  },
];

// ─── Who this is for ────────────────────────────────────────────────────────────

const forYou = [
  "30,000+ followers on Instagram or YouTube",
  "Videos averaging 5,000 to 10,000 views, with high engagement",
  "Ready to go all in",
];

const notForYou = [
  "You want to dip a toe in",
  "You take three weeks to reply to a message",
  "You want us to care about your business more than you do",
];

// ─── Founders ───────────────────────────────────────────────────────────────────

const founders = [
  {
    name: "Sam Chen",
    title: "Co-Founder & CMO | Head Of Marketing",
    image: "/founders/sam-chen.jpg",
    points: [
      "Generated $1,000,000 in client revenue in the past 12 months",
      "2+ years in the info space",
      "Builds the offer, the funnel and the content engine end to end",
      "Runs media buying across the portfolio’s ad accounts",
    ],
    quip: "Also takes it a bit personally when a cost per lead goes up.",
  },
  {
    name: "Wiktor Domasat",
    title: "Co-Founder & CSO | Head Of Sales",
    image: "/founders/wiktor-domasat.jpg",
    points: [
      "Collected $2,500,000 as a closer",
      "Now manages our portfolio’s sales teams",
      "Hires and trains every setter and closer we place",
      "Builds the objection maps our partners’ teams sell from",
    ],
    quip: "If your buyers have an excuse, Wiktor’s heard it. Probably twice this week.",
  },
];

// ─── FAQ ────────────────────────────────────────────────────────────────────────

const faqItems = [
  { question: "How do you get paid?", answer: "We make our real money out of your profit, and there’s no monthly retainer. So the more you make, the more we make. Funny how that keeps everyone motivated." },
  { question: "Are you just another guru with a course?", answer: "Nope. No course, no coaching calls. We partner with you and do the work." },
  { question: "How fast is it live?", answer: "10 to 14 days from signing to your first live webinar. Some agencies take that long to send a welcome email." },
  { question: "What counts as an established creator?", answer: "30,000+ followers, with videos averaging 5,000 to 10,000 views and high engagement. Instagram or YouTube, it doesn’t matter which. If people watch you, comment and ask you for help, you’re who we’re looking for." },
  { question: "What if I don’t have an offer yet?", answer: "Even better. No bad habits to undo. We’ll build it with you from scratch." },
  { question: "Do I have to stop taking brand deals?", answer: "Nope. Keep them. We just think you’ll stop needing them." },
  { question: "How much of my time does this take?", answer: "About 2 hours for the webinar itself, plus a bit of prep beforehand. We do the other 99%. (Yes, we did the maths.)" },
  { question: "How selective are you?", answer: "Very. Scroll up and read the bit about expensive hobbies." },
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

/* Static counterpart to Tick, for the two "not this" columns. Dimmed, because
   nothing on the page should draw the eye to the column we are ruling out. */
function Cross() {
  return (
    <svg viewBox="0 0 20 20" className="mt-[3px] h-[18px] w-[18px] shrink-0" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="9" stroke="rgba(255,255,255,0.10)" strokeWidth="1.2" />
      <path d="M7 7 13 13 M13 7 7 13" stroke="#5F5A53" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

/* The owner asked for a CTA under every section, so it is one component used
   nine times rather than nine copies of the button. The hero and the close
   already end on their own button and don't take one. */
function CTARow() {
  return (
    <AnimatedSection variant="fade" className="mt-16 flex justify-center">
      <CTAButton href={CAL_LINK} external>{CTA_LABEL}</CTAButton>
    </AnimatedSection>
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
      {/* The headline is long, so it runs below the 72px H1 in the scale table. */}
      <section className="aurora px-6 pb-28 pt-[150px] md:pb-32 md:pt-[200px]">
        <div className="mx-auto flex w-full max-w-content flex-col items-center text-center">
          <AnimatedSection className="flex flex-col items-center">
            <h1 className="max-w-[1080px] text-[30px] font-semibold leading-[1.15] text-balance sm:text-[38px] md:text-[46px] lg:text-[54px]">
              Turn The Audience You Already Have Into A “WAIT... WE SOLD HOW MANY?”{" "}
              <span className="whitespace-nowrap">High-Ticket</span> Webinar{" "}
              <span className="accent-italic text-gold">In 14 Days</span> Instead Of Months!
            </h1>

            <p className="mt-7 text-[17px] leading-[1.4] text-accent">
              (From The Two Operators Behind $3.5M Combined In The Info Space...)
            </p>

            <p className="mt-6 max-w-[640px] text-body text-[#FAFAFA]">
              Your audience trusts you more than any brand you’ve ever promoted.
              <br />
              So why is the brand the one getting paid for it?
            </p>
          </AnimatedSection>

          <AnimatedSection className="mt-10" delay={0.08}>
            <CTAButton href={CAL_LINK} external>{CTA_LABEL}</CTAButton>
          </AnimatedSection>
        </div>
      </section>

      {/* ══ 2. THE GOLDEN GOOSE ═══════════════════════════════════════════ */}
      {/* Long prose, so it sits in the 760px column and runs left-aligned under
          a centred heading. The two closing lines are the turn into the pitch. */}
      <section id="golden-goose" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto max-w-content">
          <AnimatedSection className="text-center">
            <Eyebrow>The opportunity nobody tells creators about</Eyebrow>
            <h2 className="mx-auto mt-5 max-w-[900px] text-[30px] font-semibold leading-[1.2] text-balance md:text-[46px]">
              You’re Sitting On A Golden Goose... And Selling The Eggs For{" "}
              <span className="accent-italic text-gold">Pocket Money</span>
            </h2>
          </AnimatedSection>

          <AnimatedSection variant="fade" className="mx-auto mt-12 max-w-prose">
            <div className="flex flex-col gap-5 text-body text-[#D2CEC9]">
              <p>Here’s a funny thing about being a creator.</p>
              <p>Every week, a brand pays you to tell your audience about their stuff.</p>
              <p>
                Your audience buys it. The brand makes a fortune. And you get a nice little
                fee and a discount code with your name on it.
              </p>
              <p>
                That’s like owning a golden goose... and selling the eggs to your neighbour
                for loose change.
              </p>
              <p className="text-[#8A857D]">
                (Your neighbour thinks you’re brilliant, by the way.)
              </p>
              <p>
                Meanwhile, the people who trust you most would happily pay YOU for real help.
                Not a 15% off code. Real help, from you.
              </p>
              <p>Most creators just never give them the chance.</p>
              <p className="text-[#FAFAFA]">
                So how do you sell a high-ticket offer to people who know you from 60-second
                videos?
              </p>
              <p className="text-[#8A857D]">You don’t do it in a 60-second video.</p>
              <p className="text-[22px] font-medium leading-[1.4] text-[#FAFAFA] md:text-h3">
                You do it on a <span className="accent-italic text-gold">webinar</span>.
              </p>
            </div>
          </AnimatedSection>

          {/* How a webinar works: six numbered steps on a plate. */}
          <div className="plate mx-auto mt-16 max-w-content px-6 py-20 md:px-12">
            <AnimatedSection className="text-center">
              <h3 className="mx-auto max-w-[760px] text-[26px] font-medium leading-[1.3] text-balance text-[#FAFAFA] md:text-[34px]">
                How A Webinar Actually Works (In{" "}
                <span className="accent-italic text-gold">Plain English</span>)
              </h3>
              <p className="mx-auto mt-5 max-w-[620px] text-body text-[#8A857D]">
                A webinar is just a free live class online. There’s no stage and no suit, just
                you, a camera and a few slides.
              </p>
            </AnimatedSection>

            <ol className="mx-auto mt-12 grid max-w-inner gap-6 md:grid-cols-2">
              {webinarSteps.map((step, i) => (
                <AnimatedSection key={i} delay={i * 0.06} variant={i % 2 === 0 ? "left" : "right"}>
                  <li className="panel flex h-full items-start gap-5 p-7">
                    <span className="shrink-0 text-[26px] font-semibold leading-none text-accent/60">
                      {i + 1}
                    </span>
                    <span className="text-body text-[#D2CEC9]">{step}</span>
                  </li>
                </AnimatedSection>
              ))}
            </ol>

            <AnimatedSection variant="fade" className="mt-10">
              <p className="mx-auto max-w-[680px] text-center text-body text-[#8A857D]">
                We run it live first, so we can sharpen the pitch every week. Once it’s
                dialled in, it can run as an automated webinar that sells without you.
              </p>
            </AnimatedSection>
          </div>

          {/* The maths, as a funnel. */}
          <div className="mx-auto mt-16 max-w-inner">
            <AnimatedSection className="text-center">
              <h3 className="mx-auto max-w-[760px] text-[26px] font-medium leading-[1.3] text-balance text-[#FAFAFA] md:text-[34px]">
                Here’s Why That Beats A{" "}
                <span className="accent-italic text-gold">Brand Deal</span>
              </h3>
            </AnimatedSection>

            <AnimatedSection variant="scale" className="mx-auto mt-10 max-w-[680px]">
              <div className="panel p-8 md:p-10">
                <WebinarMaths />
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fade" className="mx-auto mt-10 max-w-prose">
              <div className="flex flex-col gap-5 text-body text-[#D2CEC9]">
                <p>
                  Say 100 people show up live. A quarter of them book a call, most of those
                  actually turn up, and the closers sign 7 of them onto a $3,000 offer.
                </p>
                <p className="text-[#FAFAFA]">
                  That’s $21,000 from one webinar. From you talking about the thing you
                  already talk about every day.
                </p>
                <p>And next week... you can do it again.</p>
              </div>
            </AnimatedSection>
          </div>
        </div>

          <CTARow />
      </section>

      {/* ══ 3. NOT ANOTHER GURU ═══════════════════════════════════════════ */}
      <section id="not-a-guru" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto max-w-content">
          <AnimatedSection variant="left" className="max-w-[860px]">
            <Eyebrow>Partners, not a vendor</Eyebrow>
            <h2 className="mt-5 text-[30px] font-semibold leading-[1.15] md:text-[46px]">
              Tried The Courses? Tried The Gurus? Good.{" "}
              <span className="accent-italic text-gold">We’re Neither.</span>
            </h2>
          </AnimatedSection>

          <AnimatedSection variant="fade" className="mt-10 max-w-prose">
            <div className="flex flex-col gap-5 text-body text-[#D2CEC9]">
              <p>Let me guess.</p>
              <p>
                You’ve already bought a course or two. Maybe from a guy with a rented Lambo
                in the thumbnail.
              </p>
              <p>
                You got 47 videos, a Facebook group and a framework with a name like “The
                Profit Pyramid.” (Not a real one. We hope.)
              </p>
              <p>
                Then you were left to write the offer, build the funnel, run the ads and hire
                a sales team yourself, all while still posting every day.
              </p>
              <p>
                That’s not your fault. A course gives you the how. It doesn’t give you the
                hours.
              </p>
              <p>So we don’t sell courses, and we don’t sell coaching calls either.</p>
              <p className="text-[22px] font-medium leading-[1.4] text-[#FAFAFA] md:text-h3">
                We <span className="accent-italic text-gold">partner</span> with you.
              </p>
              <p>
                We build it, launch it and sell it with you, and we make our real money out of
                your profit. So we’re right there in it with you.
              </p>
              <p>
                Gurus get paid when you buy their course. We only make real money when your
                audience buys yours.
              </p>
              <p className="text-[#FAFAFA]">
                A course teaches you how to swim. We get in the boat with you.
              </p>
            </div>
          </AnimatedSection>

          {/* Two columns: the one we are ruling out stays dim on purpose. */}
          <div className="mx-auto mt-16 grid max-w-inner gap-8 md:grid-cols-2">
            <AnimatedSection variant="left">
              <div className="panel h-full p-8 md:p-10">
                <p className="text-[13px] uppercase tracking-[0.14em] text-[#5F5A53]">Gurus</p>
                <ul className="mt-7 flex flex-col gap-5">
                  {guruColumn.map((row) => (
                    <li key={row} className="flex items-start gap-4">
                      <Cross />
                      <span className="text-body text-[#8A857D]">{row}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="right">
              <div className="panel h-full p-8 ring-1 ring-accent/25 md:p-10">
                <p className="text-[13px] uppercase tracking-[0.14em] text-accent">
                  GrowingOffers
                </p>
                <ul className="mt-7 flex flex-col gap-5">
                  {usColumn.map((row, i) => (
                    <li key={row} className="flex items-start gap-4">
                      <Tick delay={i * 0.32} />
                      <span className="text-body text-[#D2CEC9]">{row}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>

          <CTARow />
      </section>

      {/* ══ 4. EVERYTHING BEHIND THE BRAND — BENTO ════════════════════════ */}
      <section id="how-it-works" className="scroll-mt-24 px-6 py-8">
        <div className="plate mx-auto max-w-content px-6 py-24 md:px-12">
          <AnimatedSection className="text-center">
            <Eyebrow>What partnering actually gets you</Eyebrow>
            <h2 className="mx-auto mt-5 max-w-[880px] text-[30px] font-semibold leading-[1.2] text-balance md:text-[46px]">
              Everything Behind Your Brand,{" "}
              <span className="accent-italic text-gold">Handled</span> (Yes, Even The Boring
              Bits)
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

          <AnimatedSection variant="fade" className="mt-12">
            <p className="mx-auto max-w-[760px] text-center text-body text-[#D2CEC9]">
              It’s not a course, and it’s not a coaching call where you still do all the work.
              It’s not an agency that bills you every month whether it works or not, either.
              It’s a full team, and you’re live in 10 to 14 days.
            </p>
          </AnimatedSection>
        </div>

          <CTARow />
      </section>

      {/* ══ 5. YOUR THREE OPTIONS ═════════════════════════════════════════ */}
      <section id="options" className="scroll-mt-24 px-6 py-8">
        <div className="plate mx-auto max-w-content px-6 py-24 md:px-12">
          <AnimatedSection className="text-center">
            <h2 className="mx-auto max-w-[760px] text-[30px] font-semibold leading-[1.2] text-balance md:text-[46px]">
              You’ve Got <span className="accent-italic text-gold">Three Options</span>
            </h2>
          </AnimatedSection>

          <div className="mx-auto mt-14 grid max-w-inner gap-8 md:grid-cols-3">
            {options.map((o, i) => (
              <AnimatedSection key={o.title} delay={i * 0.1} variant="scale">
                <div
                  className={`panel flex h-full flex-col p-8 ${
                    o.ours ? "ring-1 ring-accent/30" : ""
                  }`}
                >
                  <p
                    className={`text-[13px] uppercase tracking-[0.14em] ${
                      o.ours ? "text-accent" : "text-[#5F5A53]"
                    }`}
                  >
                    Option {i + 1}
                  </p>
                  <h3
                    className={`mt-5 text-[22px] font-medium leading-[1.4] md:text-h3 ${
                      o.ours ? "text-[#FAFAFA]" : "text-[#D2CEC9]"
                    }`}
                  >
                    {o.title}
                  </h3>
                  <p className={`mt-3 text-body ${o.ours ? "text-[#D2CEC9]" : "text-[#8A857D]"}`}>
                    {o.body}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection variant="fade" className="mt-12">
            <p className="text-center text-body text-[#8A857D]">
              We’ll let you guess which one we’d pick.
            </p>
          </AnimatedSection>
        </div>

          <CTARow />
      </section>

      {/* ══ 6. MEET THE TEAM ══════════════════════════════════════════════ */}
      <section id="founders" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto max-w-content">
          <AnimatedSection className="text-center">
            <Eyebrow>Who you are actually working with</Eyebrow>
            <h2 className="mx-auto mt-5 max-w-[900px] text-[30px] font-semibold leading-[1.2] text-balance md:text-[46px]">
              Meet The Two People Who’ll Be{" "}
              <span className="accent-italic text-gold">Obsessing Over Your Numbers</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[760px] text-body text-[#8A857D]">
              We’re not a 40-person agency with account managers who’ve never sold a thing.
              We’re two operators with $3.5M combined in the info space, and we’ve built the
              offers and collected the cash on the other side of them.
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
                      Here are some of {f.name.split(" ")[0]}’s accomplishments:
                    </p>
                    <ul className="mt-5 flex flex-col gap-3">
                      {f.points.map((point) => (
                        <li key={point} className="flex items-start gap-4">
                          <span className="mt-[13px] h-px w-4 shrink-0 bg-accent" aria-hidden />
                          <span className="text-body text-[#D2CEC9]">{point}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-6 text-body text-[#8A857D]">{f.quip}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

          <CTARow />
      </section>

      {/* ══ 7. WHO THIS IS FOR ════════════════════════════════════════════ */}
      <section id="who-its-for" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto max-w-content">
          <AnimatedSection className="text-center">
            <h2 className="mx-auto max-w-[800px] text-[30px] font-semibold leading-[1.2] text-balance md:text-[44px]">
              Fair Warning... This{" "}
              <span className="accent-italic text-gold">Isn’t For Everyone</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[680px] text-body text-[#8A857D]">
              We’re picky. Our real money comes from your profit, so backing the wrong creator
              would be a very expensive hobby.
            </p>
          </AnimatedSection>

          <div className="mx-auto mt-14 grid max-w-inner gap-8 md:grid-cols-2">
            <AnimatedSection variant="left">
              <div className="panel h-full p-8 ring-1 ring-accent/25 md:p-10">
                <h3 className="text-[22px] font-medium leading-[1.4] text-[#FAFAFA] md:text-h3">
                  This is for you
                </h3>
                <ul className="mt-7 flex flex-col gap-5">
                  {forYou.map((row, i) => (
                    <li key={row} className="flex items-start gap-4">
                      <Tick delay={i * 0.32} />
                      <span className="text-body text-[#D2CEC9]">{row}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="right">
              <div className="panel h-full p-8 md:p-10">
                <h3 className="text-[22px] font-medium leading-[1.4] text-[#8A857D] md:text-h3">
                  This isn’t for you
                </h3>
                <ul className="mt-7 flex flex-col gap-5">
                  {notForYou.map((row) => (
                    <li key={row} className="flex items-start gap-4">
                      <Cross />
                      <span className="text-body text-[#8A857D]">{row}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection variant="fade" className="mt-12">
            <p className="mx-auto max-w-[680px] text-center text-body text-[#D2CEC9]">
              No hard feelings either way. Talk to our advisors and they’ll tell you straight
              if it’s a fit.
            </p>
          </AnimatedSection>
        </div>

          <CTARow />
      </section>

      {/* ══ 8. FAQ ════════════════════════════════════════════════════════ */}
      <section id="faq" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto max-w-content">
          <AnimatedSection variant="left" className="mx-auto max-w-prose">
            <Eyebrow>Before you talk to us</Eyebrow>
            <h2 className="mt-5 text-[30px] font-semibold leading-[1.2] md:text-[44px]">
              Questions You’re Probably Asking (And Some{" "}
              <span className="accent-italic text-gold">Honest Answers</span>)
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

          <CTARow />
      </section>

      {/* ══ 9. CLOSE ═════════════════════════════════════════════════════ */}
      <section className="aurora px-6 py-32 md:py-44">
        <div className="mx-auto max-w-content text-center">
          <AnimatedSection className="flex flex-col items-center gap-7">
            <h2 className="max-w-[900px] text-[36px] font-semibold leading-[1.1] text-balance md:text-[60px]">
              So... <span className="accent-italic text-gold">What’s It Going To Be?</span>
            </h2>

            <div className="flex max-w-[640px] flex-col gap-5 text-body text-[#D2CEC9]">
              <p>
                You can keep selling the eggs for loose change. Keep doing brand deals, keep
                posting, and keep hoping the algorithm is nice to you this month.
              </p>
              <p>
                Or you can talk to our advisors. They’ll look at your audience and tell you
                exactly what we’d build and how we’d sell it.
              </p>
              <p className="text-[#8A857D]">
                Either this makes total sense to you, or it’s not for you yet. Both are fine.
                We won’t chase you either way.
              </p>
              <p className="text-[#FAFAFA]">
                But if it does... let’s get that goose working for you.
              </p>
            </div>

            <CTAButton href={CAL_LINK} external>{CTA_LABEL}</CTAButton>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
