import { Metadata } from "next";
import Image from "next/image";
import SectionLabel from "@/components/SectionLabel";
import CTAButton from "@/components/CTAButton";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "About — A1 Media",
  description: "Meet Sam Chen and the team behind A1 Media. Scaling creator partnerships to 7 figures.",
};

const modelCards = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    title: "Revenue Share Only",
    desc: "No retainers. No monthly fees. We invest our own time and resources upfront. We only get paid when we generate revenue. Our incentives are 100% aligned with yours.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.384 3.164 1.421-5.94L2.35 7.737l6.052-.53L11.42 1.5l3.017 5.707 6.052.53-5.107 4.657 1.421 5.94z" />
      </svg>
    ),
    title: "Full-Stack Operator",
    desc: "We're not consultants who hand you a PDF and walk away. We build and run everything — the offer, the funnels, the ads, the sales team, the backend. You get a full operating team.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    title: "Creator-First",
    desc: "Your only job is content. We handle everything else — offer creation, funnel building, ad management, sales team, backend automation. You create. We build the business behind it.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-black text-white">

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="silk-bg pt-32 pb-20 md:pb-28">
        <div className="mx-auto max-w-[800px] px-6 text-center">
          <AnimatedSection>
            <SectionLabel>ABOUT A1 MEDIA</SectionLabel>
          </AnimatedSection>
          <AnimatedSection>
            <h1 className="mt-6 font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-hero">
              The Team Behind the <span className="text-accent">Machine</span>
            </h1>
          </AnimatedSection>
        </div>
      </section>

      {/* ══ FOUNDER ═══════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-content mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            <AnimatedSection>
              <div className="relative aspect-[3/4] max-w-[480px] mx-auto md:mx-0 rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(59,130,246,0.1)", boxShadow: "0 0 60px rgba(59,130,246,0.06)" }}>
                <Image
                  src="/founder.jpg"
                  alt="Sam Chen, Founder of A1 Media"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 480px"
                  priority
                />
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <SectionLabel>THE FOUNDER</SectionLabel>
              <h2 className="mt-5 font-serif text-3xl md:text-4xl font-bold leading-tight tracking-hero">
                Meet Sam Chen
              </h2>

              <div className="mt-6 flex flex-col gap-5 text-[#9CA3AF] text-base leading-relaxed">
                <p>Sam Chen has been in online business since he was 15 years old.</p>
                <p>Before A1 Media, he tried everything — dropshipping, day trading, reselling, digital products. He made his first dollar online at 16 selling digital products, and that was the moment he knew this was the path.</p>
                <p>What started as a teenager experimenting with business models evolved into a deep understanding of what actually makes money online: the right offer, the right audience, and the right infrastructure to connect the two.</p>
                <p>Sam saw that the most talented creators were sitting on massive audiences — audiences that trusted them, followed their advice, and were ready to buy — but they had no systems in place to capture that revenue.</p>
                <p>A1 Media was built to fix that. Sam and his team partner directly with creators, build the entire business infrastructure, and scale revenue to 7 figures — while the creator focuses on creating content.</p>
                <p>Sam has personally overseen partnerships that have generated over $500K in revenue, run campaigns at 3–10x ROAS, and scaled multiple brands to consistent multi 6-figure months.</p>
                <p>He&apos;s not a guru. He doesn&apos;t sell courses. He builds businesses alongside the creators he partners with, and he only wins when they win.</p>
              </div>

              <p className="mt-8 font-serif text-2xl italic text-accent">Sam Chen</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ══ OUR MODEL ═════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6 bg-[#0A0A0A]">
        <div className="max-w-[950px] mx-auto">
          <AnimatedSection className="text-center">
            <SectionLabel>OUR MODEL</SectionLabel>
            <h2 className="mt-5 font-serif text-3xl md:text-5xl font-bold tracking-hero">
              How We Operate
            </h2>
          </AnimatedSection>

          <div className="mt-14 grid md:grid-cols-3 gap-7">
            {modelCards.map((card, i) => (
              <AnimatedSection key={card.title} delay={i * 0.12}>
                <div className="card-blue-glow p-10 h-full flex flex-col min-h-[300px]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6] mb-7">
                    {card.icon}
                  </div>
                  <h3 className="font-serif text-xl font-bold">{card.title}</h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-[#9CA3AF] flex-1">{card.desc}</p>
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
              Want to Partner?
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
