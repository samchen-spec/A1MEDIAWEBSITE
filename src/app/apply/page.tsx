"use client";

import { useState } from "react";
import SectionLabel from "@/components/SectionLabel";
import CTAButton from "@/components/CTAButton";
import AnimatedSection from "@/components/AnimatedSection";

const steps = [
  {
    number: "01",
    title: "We Review Your Application",
    description:
      "We review your application within 48 hours. We look at your audience, your niche, and your current situation to assess whether there's a clear path to scaling.",
  },
  {
    number: "02",
    title: "Strategy Call",
    description:
      "If there's a fit, we schedule a strategy call. This is a real conversation — no pitch deck, no slides. We map out what a partnership would look like for your specific brand.",
  },
  {
    number: "03",
    title: "We Get to Work",
    description:
      "If we both agree it makes sense, we get to work. Market research, offer creation, and funnel build start immediately. You start seeing results, not invoices.",
  },
];

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [hasOffer, setHasOffer] = useState<"yes" | "no" | "sort of — it needs work" | "">("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="bg-[#08090E] min-h-screen text-white">
      {/* ── Hero ── */}
      <section className="pt-32 py-[120px] max-w-[800px] mx-auto px-6 text-center">
        <AnimatedSection>
          <SectionLabel>APPLY TO PARTNER</SectionLabel>
          <h1 className="mt-5 text-4xl md:text-6xl font-bold leading-tight tracking-hero">
            Let&apos;s See If We&apos;re a Fit.
          </h1>
          <p className="mt-5 text-base md:text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
            We only take on a limited number of partnerships at a time. Fill out the application below and our team will be in touch within 48 hours.
          </p>
        </AnimatedSection>
      </section>

      {/* ── Application Form ── */}
      <section className="pb-[120px] max-w-content mx-auto px-6">
        <AnimatedSection>
          <div className="max-w-2xl mx-auto">
            {submitted ? (
              <div className="bg-[#11131A] border border-[rgba(255,255,255,0.08)] rounded-2xl px-8 py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-[#2D7AFF]/20 flex items-center justify-center mx-auto mb-5">
                  <svg
                    className="w-7 h-7 text-[#2D7AFF]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-3">Application Submitted</h2>
                <p style={{ color: "rgba(255,255,255,0.55)" }}>
                  Thanks for applying. We review every submission and will be in touch if we&apos;re a
                  good match.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-[#11131A] border border-[rgba(255,255,255,0.08)] rounded-2xl px-8 py-10 space-y-6"
              >
                {/* Name */}
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Smith"
                    className="bg-[#11131A] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:border-[#2D7AFF] transition-colors w-full"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane@yourbrand.com"
                    className="bg-[#11131A] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:border-[#2D7AFF] transition-colors w-full"
                  />
                </div>

                {/* Instagram / Social Handle */}
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    Instagram handle (or primary social platform)
                  </label>
                  <input
                    type="text"
                    placeholder="@yourusername"
                    className="bg-[#11131A] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:border-[#2D7AFF] transition-colors w-full"
                  />
                </div>

                {/* Monthly Revenue */}
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    Current monthly revenue
                  </label>
                  <select
                    required
                    defaultValue=""
                    className="bg-[#11131A] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2D7AFF] transition-colors w-full appearance-none"
                  >
                    <option value="" disabled style={{ color: "rgba(255,255,255,0.35)" }}>
                      Select a range
                    </option>
                    <option value="0-5k">$0–$5K</option>
                    <option value="5k-10k">$5K–$10K</option>
                    <option value="10k-20k">$10K–$20K</option>
                    <option value="20k-50k">$20K–$50K</option>
                    <option value="50k+">$50K+</option>
                  </select>
                </div>

                {/* Niche / Market */}
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    Your niche or market
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. fitness, personal finance, e-commerce"
                    className="bg-[#11131A] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:border-[#2D7AFF] transition-colors w-full"
                  />
                </div>

                {/* Existing Offer */}
                <div>
                  <label className="text-sm font-medium text-white mb-3 block">
                    Do you have an existing offer?
                  </label>
                  <div className="flex gap-6">
                    {(["yes", "no", "sort of — it needs work"] as const).map((val) => (
                      <label key={val} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="existing_offer"
                          value={val}
                          checked={hasOffer === val}
                          onChange={() => setHasOffer(val)}
                          className="sr-only"
                        />
                        <div
                          className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            hasOffer === val
                              ? "border-[#2D7AFF]"
                              : "border-[rgba(255,255,255,0.25)]"
                          }`}
                          style={{ width: "18px", height: "18px", minWidth: "18px" }}
                        >
                          {hasOffer === val && (
                            <div
                              className="rounded-full bg-[#2D7AFF]"
                              style={{ width: "8px", height: "8px" }}
                            />
                          )}
                        </div>
                        <span className="text-sm text-white capitalize">{val}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brand Description */}
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    Briefly describe your brand and audience
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your brand, what you create, and your goals…"
                    className="bg-[#11131A] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:border-[#2D7AFF] transition-colors w-full resize-none"
                  />
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <CTAButton type="submit" className="w-full justify-center text-center">
                    Submit Application
                  </CTAButton>
                </div>
              </form>
            )}
          </div>
        </AnimatedSection>
      </section>

      {/* ── What Happens Next ── */}
      <section className="py-[120px] border-t border-[rgba(255,255,255,0.08)]">
        <div className="max-w-content mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <SectionLabel>The Process</SectionLabel>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold">After You Apply</h2>
            <p className="mt-4 max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
              Here&apos;s exactly what to expect after you hit submit.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <AnimatedSection key={step.number}>
                <div className="bg-[#11131A] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 h-full card-hover">
                  <div
                    className="w-11 h-11 rounded-full bg-[#2D7AFF]/15 flex items-center justify-center mb-5"
                    style={{ minWidth: "44px" }}
                  >
                    <span className="text-sm font-bold text-[#2D7AFF]">{step.number}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {step.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
