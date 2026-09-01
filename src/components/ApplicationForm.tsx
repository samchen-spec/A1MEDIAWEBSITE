"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_STEPS = 10;

const roleOptions = ["Video Editor", "Setter", "Closer", "Sales Manager", "Copywriter", "Technical Expert", "Client Success Manager", "Clipper"];
const incomeOptions = ["$0 – $1k", "$1k – $3k", "$3k – $5k", "$5k – $10k", "$10k+"];
const hoursOptions = ["10 – 20", "20 – 30", "30 – 40", "40+"];

interface FormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  location: string;
  experience: string;
  portfolio: string;
  income: string;
  availability: string;
  whyA1: string;
}

const initialData: FormData = {
  name: "",
  email: "",
  phone: "",
  role: "",
  location: "",
  experience: "",
  portfolio: "",
  income: "",
  availability: "",
  whyA1: "",
};

export default function ApplicationForm({ preselectedRole }: { preselectedRole?: string }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<FormData>({
    ...initialData,
    role: preselectedRole || "",
  });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (preselectedRole) {
      setData((prev) => ({ ...prev, role: preselectedRole }));
    }
  }, [preselectedRole]);

  const validate = useCallback((): boolean => {
    switch (step) {
      case 0: if (!data.name.trim()) { setError("Please enter your name."); return false; } break;
      case 1: if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { setError("Please enter a valid email."); return false; } break;
      case 2: if (!data.phone.trim()) { setError("Please enter your phone number."); return false; } break;
      case 3: if (!data.role) { setError("Please select a role."); return false; } break;
      case 4: if (!data.location.trim()) { setError("Please enter your location."); return false; } break;
      case 5: if (!data.experience.trim()) { setError("Please tell us about your experience."); return false; } break;
      case 6: if (!data.portfolio.trim()) { setError("Please enter a link or type N/A."); return false; } break;
      case 7: if (!data.income) { setError("Please select an option."); return false; } break;
      case 8: if (!data.availability) { setError("Please select an option."); return false; } break;
      case 9: if (!data.whyA1.trim()) { setError("Please answer this question."); return false; } break;
    }
    setError("");
    return true;
  }, [step, data]);

  const next = useCallback(() => {
    if (!validate()) return;
    if (step < TOTAL_STEPS) { setDirection(1); setStep((s) => s + 1); }
  }, [step, validate]);

  const prev = useCallback(() => {
    if (step > 0) { setDirection(-1); setStep((s) => s - 1); setError(""); }
  }, [step]);

  const submit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        location: data.location,
        experience: data.experience,
        portfolio: data.portfolio,
        income: data.income,
        availability: data.availability,
        whyA1: data.whyA1,
      };
      console.log("📋 Application payload:", JSON.stringify(payload, null, 2));
      const res = await fetch("/api/apply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (submitted || step === TOTAL_STEPS) return;
      const isTextarea = document.activeElement?.tagName === "TEXTAREA";
      if (e.key === "Enter" && !isTextarea && !e.shiftKey) { e.preventDefault(); next(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, step, submitted]);

  const updateField = (field: keyof FormData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -200 : 200, opacity: 0 }),
  };

  const inputClass = "w-full bg-[#121110] border border-white/6 rounded-sm px-5 py-4 text-[#FAFAFA] text-base placeholder:text-white/25 focus:outline-none focus:border-[#E3C08D]/50 transition-colors font-sans";

  const renderStep = () => {
    if (submitted) {
      return (
        <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-2xl mb-6 bg-accent/15 text-accent">
            ✓
          </div>
          <h3 className="font-serif font-normal text-2xl md:text-3xl">Thanks for Applying!</h3>
          <p className="mt-4 text-base leading-relaxed text-[#B5B1AC]">
            We&apos;ll review your application and get back to you within 48 hours.
          </p>
        </motion.div>
      );
    }

    if (step === TOTAL_STEPS) {
      const fields = [
        ["Name", data.name], ["Email", data.email], ["Phone", data.phone], ["Role", data.role],
        ["Location", data.location], ["Experience", data.experience], ["Portfolio", data.portfolio],
        ["Monthly Income", data.income], ["Availability", data.availability], ["Why A1 Media", data.whyA1],
      ];
      return (
        <motion.div key="review" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: "easeInOut" }}>
          <h3 className="font-serif font-normal text-xl md:text-2xl mb-6">Review Your Application</h3>
          <div className="space-y-4">
            {fields.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">{label}</span>
                <span className="text-sm leading-relaxed text-white/70">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button onClick={prev} className="px-6 py-3 rounded-full border border-white/10 text-white font-semibold text-sm hover:border-accent hover:text-accent transition-all">Go Back</button>
            <button onClick={submit} disabled={submitting} className="px-7 py-3.5 rounded-full bg-accent text-black font-semibold text-sm hover:bg-accent-glow transition-all disabled:opacity-50">
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        </motion.div>
      );
    }

    const questions: { label: string; sub?: string; field: keyof FormData; type: "text" | "email" | "tel" | "textarea" | "select" | "url"; options?: string[] }[] = [
      { label: "What's your full name?", field: "name", type: "text" },
      { label: "What's your email address?", field: "email", type: "email" },
      { label: "What's your phone number?", sub: "WhatsApp preferred", field: "phone", type: "tel" },
      { label: "Which role are you applying for?", field: "role", type: "select", options: roleOptions },
      { label: "Where are you based?", field: "location", type: "text" },
      { label: "Tell us about your relevant experience", field: "experience", type: "textarea" },
      { label: "Link to your portfolio or past work", sub: "Loom, website, etc. Type N/A if you don't have one", field: "portfolio", type: "url" },
      { label: "What's your current monthly income?", field: "income", type: "select", options: incomeOptions },
      { label: "How many hours per week are you available?", field: "availability", type: "select", options: hoursOptions },
      { label: "Why do you want to work with A1 Media?", field: "whyA1", type: "textarea" },
    ];

    const q = questions[step];

    return (
      <motion.div key={step} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: "easeInOut" }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-accent">{step + 1} of {TOTAL_STEPS}</p>
        <h3 className="font-serif font-normal text-xl md:text-2xl leading-snug">{q.label}</h3>
        {q.sub && <p className="mt-1 text-sm text-[#7A756D]">{q.sub}</p>}

        <div className="mt-6">
          {q.type === "select" && q.options ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => updateField(q.field, opt)}
                  className={`text-left px-5 py-4 rounded-xl border transition-all duration-200 text-sm font-medium ${
                    data[q.field] === opt
                      ? "border-[#E3C08D]/40 bg-[#E3C08D]/10 text-[#E3C08D]"
                      : "border-white/6 bg-[#121110] text-white/60 hover:border-white/15"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : q.type === "textarea" ? (
            <textarea value={data[q.field]} onChange={(e) => updateField(q.field, e.target.value)} rows={4} className={inputClass + " resize-none"} placeholder="Type your answer here..." autoFocus />
          ) : (
            <input type={q.type} value={data[q.field]} onChange={(e) => updateField(q.field, e.target.value)} className={inputClass} placeholder="Type your answer here..." autoFocus />
          )}
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <div className="mt-8 flex items-center gap-4">
          {step > 0 && (
            <button onClick={prev} className="px-5 py-3 rounded-full border border-white/10 text-white font-semibold text-sm hover:border-accent hover:text-accent transition-all">Back</button>
          )}
          <button onClick={next} className="px-7 py-3.5 rounded-full bg-accent text-black font-semibold text-sm hover:bg-accent-glow transition-all">
            {step === TOTAL_STEPS - 1 ? "Review" : "Continue"}
          </button>
        </div>

        <p className="mt-4 text-xs hidden md:block text-[#5F5A53]">
          Press <span className="font-semibold text-[#7A756D]">Enter ↵</span> to continue
        </p>
      </motion.div>
    );
  };

  const progress = submitted ? 100 : ((step + 1) / (TOTAL_STEPS + 1)) * 100;

  return (
    <div className="rounded-2xl overflow-hidden bg-[#0D0C0B]" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="h-1 w-full bg-white/5">
        <div className="h-full transition-all duration-500 ease-out bg-accent" style={{ width: `${progress}%` }} />
      </div>
      <div className="p-8 md:p-12 min-h-[360px] flex flex-col justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
}
