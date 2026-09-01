"use client";

import { useState } from "react";
import SectionLabel from "@/components/SectionLabel";
import AnimatedSection from "@/components/AnimatedSection";
import ApplicationForm from "@/components/ApplicationForm";

// ─── Icons ─────────────────────────────────────────────────────────────────────

function PeopleIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}
function RocketIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
}
function LightningIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}
function TargetIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function HandshakeIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3.15M10.05 4.575a1.575 1.575 0 013.15 0v3.15M10.05 4.575v3.15M3.75 7.725h16.5M3.75 7.725a1.575 1.575 0 00-1.575 1.575v.825c0 .87.705 1.575 1.575 1.575m16.5-3.975a1.575 1.575 0 011.575 1.575v.825c0 .87-.705 1.575-1.575 1.575m0 0v5.7a2.625 2.625 0 01-2.625 2.625H6.375A2.625 2.625 0 013.75 16.35v-5.7m16.5 0H3.75" />
    </svg>
  );
}
function FlameIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const whyCards = [
  { icon: <PeopleIcon />, title: "Work with creators doing $100K–$1M+/month", description: "You won't be working on boring projects. Our partners are ambitious influencers and coaches scaling real businesses." },
  { icon: <RocketIcon />, title: "Get paid based on results, not hours", description: "We run on a revenue-share model. When our partners win, we all win. Your income grows with your output." },
  { icon: <GlobeIcon />, title: "Fully remote, async-first, no micromanagement", description: "Work from anywhere. We care about output, not hours logged. Hit your targets and own your schedule." },
  { icon: <LightningIcon />, title: "Learn more in 3 months than most do in 3 years", description: "You'll work across funnels, ads, sales, and content — gaining skills most people pay thousands to learn." },
];

const valueCards = [
  { icon: <TargetIcon />, title: "Obsessed With Results", description: "Vanity metrics mean nothing here. We measure everything by revenue generated and clients scaled." },
  { icon: <HandshakeIcon />, title: "Win-Win or No Deal", description: "We only succeed when our partners succeed. Every system we build, every campaign we run — it's all aligned." },
  { icon: <FlameIcon />, title: "Speed Over Perfection", description: "Move fast, test fast, iterate fast. We'd rather launch and improve than wait for perfect." },
  { icon: <ShieldIcon />, title: "Own It Like It's Yours", description: "No passengers. Every team member takes full ownership of their work — accountable, proactive, and relentless." },
];

const roles = [
  {
    tag: "Content", title: "Video Editor",
    meta: "Part-Time | Remote | $1,000–$3,000/mo",
    description: "Edit short-form and long-form content for creators and influencers. You'll work directly with top talent to produce scroll-stopping videos that drive views and revenue.",
    requirements: ["Proficient in Premiere Pro, Final Cut, or DaVinci Resolve", "Strong understanding of pacing, hooks, and retention editing", "Can deliver polished edits with fast turnaround", "Experience with motion graphics or After Effects a plus", "Portfolio of previous work required"],
  },
  {
    tag: "Sales", title: "Setter",
    meta: "Commission-Based | Remote | $2,000–$6,000/mo",
    description: "Handle DM outreach and book qualified calls for our partners. You're the first point of contact — fast, sharp, and relentless at filling the calendar.",
    requirements: ["Experience with Instagram/Facebook DM outreach", "Comfortable hitting daily KPIs and outreach targets", "Strong written communication skills", "Familiar with high-ticket coaching or info-product sales", "Self-motivated and metrics-driven"],
  },
  {
    tag: "Sales", title: "Closer",
    meta: "Commission-Based | Remote | $5,000–$15,000/mo",
    description: "Run high-ticket sales calls and close deals for coaching offers. If you can handle objections, build rapport, and drive decisions — this is your role.",
    requirements: ["Proven track record closing high-ticket offers ($2K+)", "Comfortable on phone and Zoom calls", "Understands consultative selling frameworks", "Can handle 5–10+ calls per day", "Experience in coaching, fitness, or info-product space preferred"],
  },
  {
    tag: "Sales", title: "Sales Manager",
    meta: "Commission-Based | Remote | $8,000–$20,000/mo",
    description: "Manage and scale the full sales operation for partner accounts. You'll lead closers, optimise pipelines, and own the revenue targets.",
    requirements: ["Experience managing a sales team of 3+ people", "Track record scaling revenue in a coaching or agency environment", "Knows how to build and optimise sales pipelines", "Strong leadership and coaching ability", "Data-driven decision maker"],
  },
  {
    tag: "Marketing", title: "Copywriter",
    meta: "Commission-Based | Remote | $1,000–$3,000/mo",
    description: "Write high-converting ad scripts, landing pages, emails, and DM sequences for coaching and info-product offers.",
    requirements: ["Experience writing direct response copy for paid ads or funnels", "Understands hooks, CTAs, and persuasion frameworks", "Familiar with health, fitness, or coaching niches preferred", "Can write in multiple formats: short-form ads, VSLs, emails", "Fast turnaround — can produce multiple variations per week"],
  },
  {
    tag: "Operations", title: "Technical Expert",
    meta: "Part-Time | Remote | $1,500–$3,000/mo",
    description: "Build and maintain funnels, automations, and tech infrastructure across tools like Make.com, Calendly, Supabase, and CRMs.",
    requirements: ["Hands-on experience with Make.com, Zapier, or similar automation tools", "Can build and troubleshoot landing pages and funnels", "Familiar with Calendly, Stripe, and CRM integrations", "Comfortable working with APIs and webhooks", "Problem-solver who can debug issues independently"],
  },
  {
    tag: "Operations", title: "Client Success Manager",
    meta: "Part-Time | Remote | $2,000–$4,000/mo",
    description: "Manage partner relationships, track deliverables, and ensure each client is hitting their growth milestones.",
    requirements: ["Experience in account management or client success", "Strong communication and follow-up skills", "Comfortable with project management tools (Notion, Slack)", "Can manage multiple client accounts simultaneously", "Proactive — flags issues before they become problems"],
  },
  {
    tag: "Content", title: "Clipper",
    meta: "Part-Time | Remote | $500–$1,500/mo",
    description: "Turn long-form content (YouTube, podcasts, coaching calls) into short-form clips optimised for Instagram Reels, TikTok, and YouTube Shorts.",
    requirements: ["Proficient in CapCut, Premiere Pro, or DaVinci Resolve", "Understands short-form content trends and pacing", "Can identify the most engaging moments from long-form content", "Adds captions, transitions, and on-brand overlays", "Can deliver 10–15 clips per week consistently"],
  },
];

const tagColors: Record<string, string> = {
  Content: "#E3C08D",
  Sales: "#FFD84D",
  Marketing: "#FFE894",
  Operations: "#C9A227",
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function scrollToRoles() {
  document.getElementById("open-roles")?.scrollIntoView({ behavior: "smooth" });
}
function scrollToForm() {
  document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth" });
}

// ─── Glow Card ─────────────────────────────────────────────────────────────────

function GlowCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="card-blue-glow p-10 h-full min-h-[240px]">
      <div className="flex h-12 w-12 items-center justify-center border border-accent/30 text-accent mb-7">
        {icon}
      </div>
      <h3 className="font-serif text-[24px] leading-snug text-[#FAFAFA]">{title}</h3>
      <p className="mt-4 text-[16px] leading-[1.7] text-[#B5B1AC] font-light">{description}</p>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function CareersPage() {
  const [selectedRole, setSelectedRole] = useState("");

  const handleApply = (roleTitle: string) => {
    setSelectedRole(roleTitle);
    scrollToForm();
  };

  return (
    <main className="bg-[#0A0A0A] text-white">

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="silk-bg pt-32 pb-20 md:pb-28">
        <div className="mx-auto max-w-[800px] px-6 text-center">
          <AnimatedSection>
            <SectionLabel>Careers at A1 Media</SectionLabel>
          </AnimatedSection>
          <AnimatedSection>
            <h1 className="mt-6 font-serif font-normal text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] tracking-hero">
              Build the Machine Behind the{" "}
              <span className="text-accent">Creator Economy</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection>
            <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-[#B5B1AC]">
              We&apos;re hiring operators, closers, creatives, and builders who want to work at the intersection of content, sales, and scale.
            </p>
          </AnimatedSection>
          <AnimatedSection>
            <div className="mt-10">
              <button
                onClick={scrollToRoles}
                className="inline-block bg-accent text-black font-medium px-8 py-4 rounded-full hover:bg-accent-glow transition-all duration-200 text-[13px] uppercase tracking-[0.18em]"
              >
                See Open Roles
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══ WHY A1 MEDIA ═════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6 bg-[#0D0C0B]">
        <div className="max-w-[950px] mx-auto">
          <AnimatedSection className="text-center">
            <SectionLabel>The upside</SectionLabel>
            <h2 className="mt-5 font-serif font-normal text-3xl md:text-4xl lg:text-5xl tracking-hero">
              Why A1 Media?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#B5B1AC]">
              Join a team that&apos;s building the future of creator monetisation.
            </p>
          </AnimatedSection>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {whyCards.map((card, i) => (
              <AnimatedSection key={card.title} delay={i * 0.1}>
                <GlowCard icon={card.icon} title={card.title} description={card.description} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CORE VALUES ══════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-[950px] mx-auto">
          <AnimatedSection className="text-center">
            <SectionLabel>How we work</SectionLabel>
            <h2 className="mt-5 font-serif font-normal text-3xl md:text-4xl lg:text-5xl tracking-hero">
              Our Core Values
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#B5B1AC]">
              These aren&apos;t just words on a wall. They drive every decision we make.
            </p>
          </AnimatedSection>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {valueCards.map((card, i) => (
              <AnimatedSection key={card.title} delay={i * 0.1}>
                <GlowCard icon={card.icon} title={card.title} description={card.description} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══ OPEN ROLES ═══════════════════════════════════════════════════ */}
      <section id="open-roles" className="py-20 md:py-28 px-6 bg-[#0D0C0B]">
        <div className="max-w-[1000px] mx-auto">
          <AnimatedSection className="text-center">
            <SectionLabel>Open roles</SectionLabel>
            <h2 className="mt-5 font-serif font-normal text-3xl md:text-4xl lg:text-5xl tracking-hero">
              Find Your Role
            </h2>
          </AnimatedSection>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {roles.map((role, i) => {
              const color = tagColors[role.tag] || "#E3C08D";
              return (
                <AnimatedSection key={role.title} delay={i * 0.05}>
                  <div className="card-dark p-7 h-full flex flex-col">
                    <div className="mb-4">
                      <span
                        className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
                        style={{ backgroundColor: `${color}15`, color }}
                      >
                        {role.tag}
                      </span>
                    </div>
                    <h3 className="font-serif font-normal text-xl text-white">{role.title}</h3>
                    <p className="mt-2 text-sm font-medium text-[#7A756D]">{role.meta}</p>
                    <p className="mt-4 text-sm leading-relaxed text-[#B5B1AC]">{role.description}</p>
                    <ul className="mt-5 space-y-2.5 flex-1">
                      {role.requirements.map((req) => (
                        <li key={req} className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                          <span className="text-sm leading-relaxed text-[#7A756D]">{req}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 pt-2">
                      <button
                        onClick={() => handleApply(role.title)}
                        className="inline-flex items-center gap-2 bg-accent text-black px-6 py-3 rounded-full text-[12px] uppercase tracking-[0.16em] font-medium transition-all duration-200 hover:bg-accent-glow"
                      >
                        Apply Now
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ APPLICATION FORM ═════════════════════════════════════════════ */}
      <section id="apply-form" className="py-20 md:py-28 px-6">
        <div className="mx-auto max-w-[700px]">
          <AnimatedSection className="text-center">
            <SectionLabel>Apply</SectionLabel>
            <h2 className="mt-5 font-serif font-normal text-3xl md:text-4xl lg:text-5xl tracking-hero">
              Start Your Application
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#B5B1AC]">
              Takes about 2 minutes. One question at a time.
            </p>
          </AnimatedSection>

          <div className="mt-10">
            <ApplicationForm preselectedRole={selectedRole} />
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ════════════════════════════════════════════════════ */}
      <section className="silk-bg py-24 md:py-32 px-6">
        <div className="max-w-[700px] mx-auto text-center">
          <AnimatedSection className="flex flex-col items-center gap-7">
            <h2 className="font-serif font-normal text-3xl md:text-5xl leading-[1.08] tracking-hero">
              Ready to Build Something That Actually Matters?
            </h2>
            <button
              onClick={scrollToForm}
              className="inline-block bg-accent text-black font-medium px-10 py-4 rounded-full hover:bg-accent-glow transition-all duration-200 text-[13px] uppercase tracking-[0.18em]"
            >
              Apply Now
            </button>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
