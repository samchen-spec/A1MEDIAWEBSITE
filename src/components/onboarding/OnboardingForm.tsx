"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import CTAButton from "@/components/CTAButton";
import { CONTACT_EMAIL } from "@/lib/site";
import QuestionField, {
  CHOICE_KEYS,
  fieldHint,
} from "@/components/onboarding/QuestionFields";
import {
  TRACK_QUESTION_ID,
  firstInvalidIndex,
  questionsFor,
  validateAnswer,
  type AnswerValue,
  type Answers,
  type Question,
  type Track,
} from "@/lib/onboarding";

/* One question per screen, forked on the first answer. Progress is kept in
   localStorage because the set runs to about 35 questions and nobody finishes
   that in one sitting without closing a tab at least once. */

const STORAGE_KEY = "growingoffers.onboarding.v1";

type Status = "idle" | "sending" | "done" | "failed";

interface Saved {
  step: number;
  answers: Answers;
}

export default function OnboardingForm() {
  /* -1 is the intro screen. Nothing is read from storage during render, so the
     server and the first client paint agree. */
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<Answers>({});
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const [resumed, setResumed] = useState(false);

  const reduceMotion = useReducedMotion();
  const advanceTimer = useRef<number | null>(null);
  /* +1 moving forward, -1 going back. The screen travels the way you are
     going, which is what gives the form its sense of a column of answers. */
  const [direction, setDirection] = useState(1);

  const track = (answers[TRACK_QUESTION_ID] as Track | undefined) ?? null;
  const visible = useMemo(() => questionsFor(track), [track]);
  const current: Question | undefined = step >= 0 ? visible[step] : undefined;

  /* ─── Persistence ─────────────────────────────────────────────────────────── */

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Saved;
        if (saved && typeof saved.step === "number" && saved.answers) {
          setAnswers(saved.answers);
          setStep(saved.step);
          setResumed(saved.step >= 0);
        }
      }
    } catch {
      /* Private mode, blocked storage, or a shape from an older version. Start
         clean rather than erroring. */
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored || status === "done") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, answers }));
    } catch {
      /* Nothing to do: the form still works, it just will not resume. */
    }
  }, [restored, step, answers, status]);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    };
  }, []);

  /* Switching track late can leave the index past the end of the new list. */
  useEffect(() => {
    if (step > visible.length - 1) setStep(Math.max(0, visible.length - 1));
  }, [visible.length, step]);

  /* ─── Submission ──────────────────────────────────────────────────────────── */

  const submit = useCallback(
    async (finalAnswers: Answers, finalVisible: Question[]) => {
      const bad = firstInvalidIndex(finalVisible, finalAnswers);
      if (bad >= 0) {
        const q = finalVisible[bad];
        setStep(bad);
        setError(validateAnswer(q, finalAnswers[q.id]));
        return;
      }

      setStatus("sending");
      setSubmitError(null);

      try {
        const res = await fetch("/api/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            track: finalAnswers[TRACK_QUESTION_ID],
            answers: finalAnswers,
          }),
        });

        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(body.error ?? "We could not save your answers.");
        }

        setStatus("done");
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* Harmless. */
        }
      } catch (e) {
        /* Storage is deliberately left intact so a retry does not start over. */
        setStatus("failed");
        setSubmitError(
          e instanceof Error ? e.message : "We could not save your answers.",
        );
      }
    },
    [],
  );

  /* ─── Navigation ──────────────────────────────────────────────────────────── */

  const commit = useCallback(
    (override?: AnswerValue) => {
      const q = current;
      if (!q) return;

      const value = override !== undefined ? override : answers[q.id];
      const err = validateAnswer(q, value);
      if (err) {
        setError(err);
        return;
      }
      setError(null);

      const nextAnswers: Answers =
        override !== undefined ? { ...answers, [q.id]: override } : answers;
      if (override !== undefined) setAnswers(nextAnswers);

      /* Recomputed from the answer just given, so picking a track on the first
         question expands the list before we decide whether this was the end. */
      const nextTrack =
        (nextAnswers[TRACK_QUESTION_ID] as Track | undefined) ?? null;
      const nextVisible = questionsFor(nextTrack);

      if (step >= nextVisible.length - 1) {
        void submit(nextAnswers, nextVisible);
        return;
      }
      setDirection(1);
      setStep(step + 1);
    },
    [answers, current, step, submit],
  );

  const commitChoice = useCallback(
    (value?: AnswerValue) => {
      if (advanceTimer.current) return;
      /* A beat so the selected state is visible before the screen changes. */
      advanceTimer.current = window.setTimeout(
        () => {
          advanceTimer.current = null;
          commit(value);
        },
        reduceMotion ? 0 : 170,
      );
    },
    [commit, reduceMotion],
  );

  /* Letter keys pick an option, the way a Typeform does. Bound at the document
     so it works before anything is focused, and skipped while the person is in
     a text field so typing "a" does not jump the form. */
  useEffect(() => {
    const q = current;
    if (!q || q.type !== "choice" || status === "sending") return;

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      const tag = el?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const index = CHOICE_KEYS.indexOf(e.key.toUpperCase());
      const choice = index >= 0 ? q.choices?.[index] : undefined;
      if (!choice) return;

      e.preventDefault();
      setAnswers((prev) => ({ ...prev, [q.id]: choice.value }));
      commitChoice(choice.value);
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [current, commitChoice, status]);

  const back = () => {
    setError(null);
    setDirection(-1);
    setStep((s) => Math.max(-1, s - 1));
  };

  const setAnswer = (id: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    if (error) setError(null);
  };

  const restart = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* Harmless. */
    }
    setAnswers({});
    setStep(-1);
    setError(null);
    setResumed(false);
  };

  /* ─── Screens ─────────────────────────────────────────────────────────────── */

  const ease = [0.22, 1, 0.36, 1] as const;

  const fade = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.32, ease },
      };

  const slide = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: direction * 26 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: direction * -26 },
        transition: { duration: 0.34, ease },
      };

  if (status === "done") {
    return (
      <Shell progress={1}>
        <motion.div key="done" {...fade}>
          <p className="eyebrow">Received</p>
          <h1 className="mt-4 text-[40px] font-semibold leading-[1.15] text-[#FAFAFA] md:text-[52px]">
            That is everything we need to{" "}
            <span className="accent-italic text-gold">start building</span>.
          </h1>
          <p className="mt-6 max-w-[560px] text-body">
            Your answers are with the team. We read them properly before we come
            back to you, so expect a reply within two working days with the first
            read on your offer and what we would change.
          </p>
          <p className="mt-4 max-w-[560px] text-muted">
            If something important changed while you were filling this in, email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-accent transition-opacity hover:opacity-75"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            rather than submitting the form a second time.
          </p>
          <div className="mt-10">
            <CTAButton href="/">Back to the site</CTAButton>
          </div>
        </motion.div>
      </Shell>
    );
  }

  if (step === -1) {
    return (
      <Shell progress={0} aurora>
        <motion.div key="intro" {...fade}>
          <p className="eyebrow">Client onboarding</p>
          <h1 className="mt-4 text-[40px] font-semibold leading-[1.15] text-[#FAFAFA] md:text-[52px]">
            Tell us what you have, and we will{" "}
            <span className="accent-italic text-gold">build the offer</span>{" "}
            around it.
          </h1>
          <p className="mt-6 max-w-[580px] text-body">
            About 35 questions, roughly 25 minutes. The long answers are the ones
            that matter: they become your positioning, your creative and your
            objection handling, so write them the way you would say them out loud.
          </p>
          <ul className="mt-8 flex flex-col gap-3 text-muted">
            <li>Your progress saves as you go, so you can finish it later.</li>
            <li>
              The first question splits the form, depending on whether you already
              sell something.
            </li>
            <li>
              Nothing here is a test. &quot;I do not know&quot; is a useful answer
              when it is the true one.
            </li>
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <CTAButton onClick={() => setStep(0)}>
              {resumed ? "Continue where you left off" : "Start"}
            </CTAButton>
            {resumed && (
              <button
                type="button"
                onClick={restart}
                className="text-[17px] text-dim transition-colors hover:text-[#D2CEC9]"
              >
                Start again
              </button>
            )}
          </div>
        </motion.div>
      </Shell>
    );
  }

  if (!current) return <Shell progress={0}>{null}</Shell>;

  /* Before the fork is answered the visible list is just the fork itself, and
     "1 of 1" reads like a one-question form. The two tracks run to within a
     question or two of each other, so one of them stands in for the count until
     the real list is known. */
  const total = track ? visible.length : questionsFor("has-offer").length;
  const hint = fieldHint(current);
  const isLast = step === visible.length - 1;
  const sending = status === "sending";

  return (
    <Shell progress={(step + 1) / total}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={current.id} {...slide}>
          <div className="flex items-center gap-3 text-[14px]">
            <span className="text-accent">{current.section}</span>
            <span className="h-px w-5 bg-white/10" aria-hidden="true" />
            <span className="text-dim">
              {step + 1} of {total}
            </span>
          </div>

          <h2
            id={`${current.id}-label`}
            className="mt-5 text-[27px] font-medium leading-[1.28] text-[#FAFAFA] md:text-[33px] md:leading-[1.25]"
          >
            {current.label}
            {!current.required && (
              <span className="ml-2.5 align-middle text-[16px] font-normal text-dim">
                Optional
              </span>
            )}
          </h2>

          {current.help && (
            <p
              id={`${current.id}-help`}
              className="mt-3.5 max-w-[620px] text-[17px] leading-[1.55] text-muted"
            >
              {current.help}
            </p>
          )}

          <div className="mt-8">
            <QuestionField
              question={current}
              value={answers[current.id]}
              onChange={(v) => setAnswer(current.id, v)}
              onCommit={current.type === "choice" ? commitChoice : commit}
              invalid={error !== null}
            />
          </div>

          <div aria-live="polite" className="min-h-[30px]">
            {error && <p className="mt-4 text-[16px] text-[#E05C5C]">{error}</p>}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
            {current.type !== "choice" && (
              <CTAButton onClick={() => commit()}>
                {sending ? "Sending" : isLast ? "Submit" : "OK"}
              </CTAButton>
            )}
            {hint && (
              <span className="flex items-center gap-2 text-[15px] text-dim">
                {current.type === "long" ? (
                  <>
                    <span className="keycap">&#8679;</span>
                    <span className="keycap">&#8629;</span>
                    for a new line
                  </>
                ) : (
                  <>
                    <span className="keycap">&#8629;</span>
                    {hint}
                  </>
                )}
              </span>
            )}
            {current.type === "choice" && (
              <span className="text-[15px] text-dim">
                Pick one, or press its letter
              </span>
            )}
          </div>

          {status === "failed" && (
            <div className="mt-8 rounded-[20px] bg-[#151413] p-5">
              <p className="text-[17px] text-[#E05C5C]">{submitError}</p>
              <p className="mt-2 text-[16px] text-muted">
                Your answers are still saved in this browser. Try again, and if it
                keeps failing, email them to us and we will take it from there.
              </p>
              <div className="mt-4">
                <CTAButton onClick={() => void submit(answers, visible)}>
                  Try again
                </CTAButton>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <Stepper
        onBack={back}
        onNext={() => commit()}
        canGoBack={step > -1}
        canGoNext={current.type !== "choice" && !sending}
      />
    </Shell>
  );
}

/* ─── Step arrows ─────────────────────────────────────────────────────────── */

function Stepper({
  onBack,
  onNext,
  canGoBack,
  canGoNext,
}: {
  onBack: () => void;
  onNext: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
}) {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-40 md:bottom-8 md:right-8">
      <div className="stepper pointer-events-auto">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          className="stepper__btn"
          aria-label="Previous question"
        >
          <Chevron up />
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className="stepper__btn"
          aria-label="Next question"
        >
          <Chevron />
        </button>
      </div>
    </div>
  );
}

function Chevron({ up = false }: { up?: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={up ? { transform: "rotate(180deg)" } : undefined}
    >
      <path
        d="M4 6.5 8 10.5l4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Shell ───────────────────────────────────────────────────────────────── */

function Shell({
  children,
  progress,
  aurora = false,
}: {
  children: React.ReactNode;
  progress: number;
  aurora?: boolean;
}) {
  return (
    <div className={`relative min-h-[100svh] ${aurora ? "aurora" : ""}`}>
      <div
        className="progress-rail"
        role="progressbar"
        aria-label="Form progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <div
          className="progress-fill"
          style={{ transform: `scaleX(${Math.max(0, Math.min(1, progress))})` }}
        />
      </div>
      <div className="mx-auto flex min-h-[100svh] max-w-[760px] flex-col justify-center px-6 py-32">
        {children}
      </div>
    </div>
  );
}
