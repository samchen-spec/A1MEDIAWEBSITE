"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SCHEDULER_URL = "https://calendly.com/samchen-a1media/call-60";

function buildEmbedSrc(name: string, email: string) {
  const url = new URL(SCHEDULER_URL);
  if (url.hostname.includes("calendly.com")) {
    url.searchParams.set("embed_type", "Inline");
    url.searchParams.set("hide_gdpr_banner", "1");
    url.searchParams.set("background_color", "0d0c0b");
    url.searchParams.set("text_color", "fafafa");
    url.searchParams.set("primary_color", "e3c08d");
  } else {
    url.searchParams.set("theme", "dark");
  }
  if (name) url.searchParams.set("name", name);
  if (email) url.searchParams.set("email", email);
  return url.toString();
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  instagram: string;
  youtube: string;
  fit: string;
}

const initial: FormData = { name: "", email: "", phone: "", instagram: "", youtube: "", fit: "" };

type Question = {
  key: keyof FormData;
  question: string;
  helper?: string;
  placeholder: string;
  type?: string;
  multiline?: boolean;
  optional?: boolean;
  validate?: (value: string) => string | null;
};

const questions: Question[] = [
  {
    key: "name",
    question: "First, what's your name?",
    placeholder: "Jane Smith",
    validate: (v) => (v.trim().length < 2 ? "Please enter your name." : null),
  },
  {
    key: "email",
    question: "What's the best email for you?",
    helper: "We send the call details here.",
    placeholder: "jane@yourbrand.com",
    type: "email",
    validate: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : "Please enter a valid email address."),
  },
  {
    key: "phone",
    question: "And your phone number?",
    helper: "Only used to reach you about the call.",
    placeholder: "+44 7700 900000",
    type: "tel",
    validate: (v) => (v.replace(/\D/g, "").length < 7 ? "Please enter a valid phone number." : null),
  },
  {
    key: "instagram",
    question: "What's your Instagram?",
    helper: "So we can look at what you've built before we speak.",
    placeholder: "@yourhandle",
    validate: (v) => (v.trim().length < 2 ? "Please enter your Instagram handle." : null),
  },
  {
    key: "youtube",
    question: "Do you have a YouTube channel?",
    helper: "Optional — skip if you don't.",
    placeholder: "youtube.com/@yourchannel",
    optional: true,
  },
  {
    key: "fit",
    question: "Why would you be a good fit?",
    helper: "What you've built, what you're selling now, and what you think is being left on the table.",
    placeholder: "Tell us in a couple of sentences…",
    multiline: true,
    validate: (v) => (v.trim().length < 20 ? "Tell us a little more so we can prepare properly." : null),
  },
];

export default function ScheduleCall() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<FormData>(initial);
  const [error, setError] = useState("");
  const [booked, setBooked] = useState(false);
  const [embedReady, setEmbedReady] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const embedRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const current = questions[step];
  const value = data[current?.key] ?? "";
  const isLast = step === questions.length - 1;

  useEffect(() => {
    // Never focus on mount — that would scroll the hero video out of view on
    // landing (and pop the keyboard open on mobile). Only follow the user in.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!booked) inputRef.current?.focus({ preventScroll: true });
  }, [step, booked]);

  function submit(final: FormData) {
    // Fire and forget: the POST fans out to the webhooks in the background while
    // the calendar comes straight up. `keepalive` keeps it alive across the
    // transition, so nothing is lost if the applicant navigates away.
    void fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formType: "Partner Application", ...final }),
      keepalive: true,
    }).catch(() => {
      /* Never block the booking on a webhook being down. */
    });

    setBooked(true);
    window.setTimeout(() => embedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }

  function next() {
    const problem = current.validate?.(value) ?? null;
    if (problem && !(current.optional && !value.trim())) {
      setError(problem);
      return;
    }
    setError("");
    if (isLast) {
      submit(data);
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  }

  function back() {
    if (step === 0) return;
    setError("");
    setDirection(-1);
    setStep((s) => s - 1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (!current.multiline || e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      next();
    }
  }

  if (booked) {
    return (
      <div ref={embedRef} className="mx-auto max-w-[900px] scroll-mt-28">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <div className="text-center">
            <p className="font-serif text-[30px] text-[#FAFAFA] md:text-[38px]">
              Thanks {data.name.split(" ")[0]} — now pick your time.
            </p>
            <p className="mt-3 text-[16px] text-[#B5B1AC]">
              We&apos;ve got your details. Choose a slot below and we&apos;ll come prepared.
            </p>
          </div>

          <div className="panel relative mt-8 overflow-hidden p-2 md:p-3">
            {!embedReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <span className="h-7 w-7 animate-spin rounded-full border-2 border-accent/25 border-t-accent" />
                <p className="text-[14px] text-[#7A756D]">Loading the calendar…</p>
              </div>
            )}
            <motion.iframe
              src={buildEmbedSrc(data.name, data.email)}
              title="Schedule your call"
              onLoad={() => setEmbedReady(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: embedReady ? 1 : 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="h-[820px] w-full rounded-xl border-0 bg-[#0D0C0B]"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[720px]">
      <div className="panel px-7 py-9 md:px-12 md:py-12">
        {/* Progress */}
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-accent">
            Question {step + 1} of {questions.length}
          </span>
          {step > 0 && (
            <button
              type="button"
              onClick={back}
              className="text-[14px] text-[#7A756D] transition-colors hover:text-[#FAFAFA]"
            >
              ← Back
            </button>
          )}
        </div>

        <div className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.08]">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--gold-gradient)" }}
            initial={false}
            animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* Question */}
        <div className="relative mt-9 min-h-[210px] md:min-h-[200px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.key}
              custom={direction}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -24, transition: { duration: 0.12, ease: "easeIn" } }}
              transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.7 }}
            >
              <h3 className="font-serif text-[26px] leading-[1.2] text-[#FAFAFA] md:text-[34px]">
                {current.question}
              </h3>
              {current.helper && (
                <p className="mt-3 text-[15px] text-[#7A756D] md:text-[16px]">{current.helper}</p>
              )}

              {current.multiline ? (
                <textarea
                  ref={(el) => { inputRef.current = el; }}
                  rows={4}
                  value={value}
                  onChange={(e) => { setData({ ...data, [current.key]: e.target.value }); if (error) setError(""); }}
                  onKeyDown={handleKeyDown}
                  placeholder={current.placeholder}
                  className="field mt-6 resize-none"
                />
              ) : (
                <input
                  ref={(el) => { inputRef.current = el; }}
                  type={current.type || "text"}
                  value={value}
                  onChange={(e) => { setData({ ...data, [current.key]: e.target.value }); if (error) setError(""); }}
                  onKeyDown={handleKeyDown}
                  placeholder={current.placeholder}
                  autoComplete="off"
                  className="field mt-6"
                />
              )}

              {error && <p className="mt-3 text-[15px] text-[#E07A5F]">{error}</p>}
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.button
          type="button"
          onClick={next}
          whileTap={{ scale: 0.985 }}
          whileHover={{ scale: 1.008 }}
          transition={{ type: "spring", stiffness: 520, damping: 30 }}
          className="btn-gold mt-2 w-full rounded-full py-4 text-[14px] font-semibold uppercase tracking-[0.14em]"
        >
          {isLast ? "Continue to the calendar" : current.optional && !value.trim() ? "Skip" : "Next"}
        </motion.button>

      </div>
    </div>
  );
}
