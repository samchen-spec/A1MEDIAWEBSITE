import { Metadata } from "next";
import Image from "next/image";
import SectionLabel from "@/components/SectionLabel";
import CTAButton from "@/components/CTAButton";
import AnimatedSection from "@/components/AnimatedSection";

// Everyone goes through the application on the homepage before booking.
const CAL_LINK = "/#schedule";

export const metadata: Metadata = {
  title: "About — A1 Media",
  description:
    "Meet Sam Chen and the team behind A1 Media. We craft creators a high-ticket offer, fund the ad spend, and run the business behind the brand.",
};

const modelCards = [
  {
    num: "01",
    title: "We fund it",
    desc:
      "Ad spend comes out of our pocket, not yours. No retainers, no setup fees, no media budget to approve. We're paid a share of what the offer produces, which means a launch that doesn't work costs you nothing and costs us plenty.",
  },
  {
    num: "02",
    title: "We operate it",
    desc:
      "We're not consultants with a slide deck. We build and run the offer, the funnels, the ad account and the closing team, and we stay on it after launch. You get an operating company behind your brand, not advice about one.",
  },
  {
    num: "03",
    title: "You stay the creator",
    desc:
      "Your job is the thing you're already good at — showing up, making content, being the reason people trust the offer. Everything downstream of the audience is ours to build, staff and answer for.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-[#0A0A0A] text-[#FAFAFA]">

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="silk-bg pt-44 pb-24 md:pb-32 px-6">
        <div className="mx-auto max-w-[900px] text-center">
          <AnimatedSection className="flex flex-col items-center gap-8">
            <SectionLabel>About A1 Media</SectionLabel>
            <h1 className="font-serif text-[42px] sm:text-6xl md:text-7xl lg:text-[80px] leading-[1.05] tracking-hero text-balance">
              The team behind the <span className="text-accent italic">offer</span>
            </h1>
            <div className="rule-accent" />
            <p className="max-w-[620px] text-[19px] md:text-[21px] leading-[1.65] text-[#B5B1AC] font-light">
              We back a small number of established creators — building the offer, funding the ads,
              and running everything that sits behind the brand.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ══ FOUNDER ═══════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-6 border-t border-white/[0.08]">
        <div className="max-w-content mx-auto">
          <div className="grid md:grid-cols-2 gap-14 md:gap-20 items-start">
            <AnimatedSection>
              <div className="relative aspect-[3/4] max-w-[480px] mx-auto md:mx-0 overflow-hidden border border-white/[0.08] bg-[#121110] md:sticky md:top-28">
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
              <SectionLabel>The founder</SectionLabel>
              <h2 className="mt-7 font-serif text-[34px] md:text-[52px] leading-[1.1] tracking-hero">
                Meet Sam Chen
              </h2>

              <div className="mt-8 flex flex-col gap-6 text-[17px] md:text-[18px] leading-[1.8] text-[#B5B1AC] font-light">
                <p className="text-[20px] md:text-[22px] text-[#FAFAFA] leading-[1.6]">
                  Sam has been in online business since he was fifteen. He made his first dollar
                  online at sixteen selling digital products, and never looked for a different path.
                </p>
                <p>
                  Before A1 Media there was everything else — dropshipping, day trading, reselling,
                  info products. Most of it taught the same lesson in a different accent: the money
                  isn&apos;t in the tactic, it&apos;s in the offer, the audience, and the
                  infrastructure connecting the two.
                </p>
                <p>
                  What he kept seeing was creators with the first two and none of the third. Real
                  audiences, real trust, real influence — monetised with a cheap community or a
                  brand deal, because building the rest is a second full-time job nobody was
                  offering to do for them.
                </p>
                <p>
                  The offers on the table always asked the creator to carry the risk: pay a
                  retainer, fund an ad budget, hope. A1 Media was built the other way round. We
                  craft the offer, we pay for the ad spend, we run the sales and the systems, and we
                  earn out of what it makes.
                </p>
                <p>
                  Sam has overseen partnerships generating over $500K in revenue, run campaigns at
                  3–10x ROAS, and scaled brands to consistent multi six-figure months.
                </p>
                <p className="text-[#FAFAFA]">
                  He&apos;s not a guru and he doesn&apos;t sell courses. He builds businesses
                  alongside the creators he backs, with his own money in the account.
                </p>
              </div>

              <p className="mt-10 font-serif text-[30px] italic text-accent">Sam Chen</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ══ OUR MODEL ═════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-6 bg-[#0D0C0B] border-y border-white/[0.08]">
        <div className="max-w-content mx-auto">
          <AnimatedSection className="text-center">
            <SectionLabel>Our model</SectionLabel>
            <h2 className="mt-7 font-serif text-[34px] md:text-[56px] leading-[1.1] tracking-hero">
              How we operate
            </h2>
          </AnimatedSection>

          <div className="mt-16 grid md:grid-cols-3 gap-px bg-white/[0.07] border border-white/[0.08]">
            {modelCards.map((card, i) => (
              <AnimatedSection key={card.title} delay={i * 0.1} className="bg-[#0A0A0A]">
                <div className="h-full p-10 md:p-12 flex flex-col">
                  <span className="eyebrow">{card.num}</span>
                  <h3 className="mt-7 font-serif text-[30px] md:text-[34px] leading-tight text-accent">
                    {card.title}
                  </h3>
                  <p className="mt-5 text-[17px] leading-[1.75] text-[#B5B1AC] font-light flex-1">
                    {card.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════════════════ */}
      <section className="silk-bg py-28 md:py-40 px-6">
        <div className="max-w-[760px] mx-auto text-center">
          <AnimatedSection className="flex flex-col items-center gap-8">
            <h2 className="font-serif text-[42px] md:text-[68px] leading-[1.06] tracking-hero text-balance">
              Want us in your corner?
            </h2>
            <p className="text-[18px] md:text-[20px] text-[#B5B1AC] font-light max-w-[500px] leading-[1.6]">
              We take on a handful of creators at a time, and we fund every one of them.
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
