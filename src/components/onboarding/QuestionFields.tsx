"use client";

import { useEffect, useRef } from "react";
import {
  SOCIAL_PLATFORMS,
  emptySocialRow,
  type AnswerValue,
  type ContactValue,
  type Question,
  type SocialRow,
} from "@/lib/onboarding";

interface FieldProps {
  question: Question;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  /* Choice fields advance on their own once something is picked, which is what
     makes the form feel like a form rather than a page of inputs. They pass the
     value they just set, because the parent's state has not caught up yet. */
  onCommit: (value?: AnswerValue) => void;
  invalid: boolean;
}

/* The one input that gets focus when a step opens. Short text and textareas
   take it; choices do not, so the first option is not mistaken for selected. */
function useAutoFocus<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!active) return;
    const id = window.requestAnimationFrame(() => ref.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [active]);
  return ref;
}

function ShortField({ question, value, onChange, onCommit, invalid }: FieldProps) {
  const ref = useAutoFocus<HTMLInputElement>(true);
  return (
    <input
      ref={ref}
      type="text"
      className="field"
      value={typeof value === "string" ? value : ""}
      placeholder={question.placeholder ?? "Type your answer"}
      aria-invalid={invalid}
      aria-describedby={`${question.id}-help`}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onCommit();
        }
      }}
    />
  );
}

function LongField({ question, value, onChange, onCommit, invalid }: FieldProps) {
  const ref = useAutoFocus<HTMLTextAreaElement>(true);
  const text = typeof value === "string" ? value : "";
  const min = question.minChars ?? 0;
  const remaining = min - text.trim().length;

  return (
    <div>
      <textarea
        ref={ref}
        className="field field--long"
        rows={6}
        value={text}
        placeholder={question.placeholder ?? "Type your answer"}
        aria-invalid={invalid}
        aria-describedby={`${question.id}-help`}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            onCommit();
          }
        }}
      />
      {min > 0 && remaining > 0 && (
        <p className="mt-3 text-[15px] text-dim">
          {remaining} more character{remaining === 1 ? "" : "s"} on this one.
        </p>
      )}
    </div>
  );
}

/* A, B, C ... Each option is selectable by its letter, which the key badge
   advertises. See useChoiceKeys in OnboardingForm for the listener. */
export const CHOICE_KEYS = "ABCDEFGHIJ";

function ChoiceField({ question, value, onChange, onCommit }: FieldProps) {
  const selected = typeof value === "string" ? value : "";
  return (
    <div
      role="radiogroup"
      aria-labelledby={`${question.id}-label`}
      className="flex flex-col gap-2.5"
    >
      {(question.choices ?? []).map((choice, i) => {
        const isSelected = selected === choice.value;
        return (
          <button
            key={choice.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-keyshortcuts={CHOICE_KEYS[i]}
            data-selected={isSelected}
            className="choice"
            onClick={() => {
              onChange(choice.value);
              onCommit(choice.value);
            }}
          >
            <span className="choice__key" aria-hidden="true">
              {CHOICE_KEYS[i]}
            </span>
            <span className="flex-1">
              <span className="block text-[19px] leading-snug text-[#FAFAFA]">
                {choice.label}
              </span>
              {choice.hint && (
                <span className="mt-1 block text-[15px] leading-snug text-muted">
                  {choice.hint}
                </span>
              )}
            </span>
            <span className="choice__dot" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}

function SocialsField({ question, value, onChange, invalid }: FieldProps) {
  const rows: SocialRow[] =
    Array.isArray(value) && value.length > 0 ? (value as SocialRow[]) : [emptySocialRow()];

  const update = (index: number, patch: Partial<SocialRow>) => {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  return (
    <div aria-describedby={`${question.id}-help`}>
      <div className="flex flex-col gap-3">
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-[20px] bg-[#151413] p-3 sm:flex-row sm:items-center"
          >
            <select
              className="field field--inline sm:w-[160px] sm:shrink-0"
              value={row.platform}
              aria-label="Platform"
              aria-invalid={invalid && !row.platform}
              onChange={(e) => update(i, { platform: e.target.value })}
            >
              <option value="">Platform</option>
              {SOCIAL_PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <input
              type="text"
              inputMode="url"
              className="field field--inline sm:flex-1 sm:min-w-0"
              placeholder="Link or @handle"
              aria-label="Link or handle"
              value={row.url}
              onChange={(e) => update(i, { url: e.target.value })}
            />
            <input
              type="text"
              className="field field--inline sm:w-[150px] sm:shrink-0"
              placeholder="Audience size"
              aria-label="Audience size"
              value={row.followers}
              onChange={(e) => update(i, { followers: e.target.value })}
            />
            {rows.length > 1 && (
              <button
                type="button"
                className="self-start rounded-[10px] px-3 py-2 text-[15px] text-dim transition-colors hover:text-[#E05C5C] sm:self-auto"
                onClick={() => onChange(rows.filter((_, idx) => idx !== i))}
                aria-label={`Remove ${row.platform || "row"}`}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-4 text-[17px] text-accent transition-opacity hover:opacity-75"
        onClick={() => onChange([...rows, emptySocialRow()])}
      >
        Add another platform
      </button>
    </div>
  );
}

function ContactField({ question, value, onChange, onCommit, invalid }: FieldProps) {
  const ref = useAutoFocus<HTMLInputElement>(true);
  const contact = (value ?? { name: "", email: "", phone: "" }) as ContactValue;
  const set = (patch: Partial<ContactValue>) => onChange({ ...contact, ...patch });

  const onEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onCommit();
    }
  };

  return (
    <div className="flex flex-col gap-3" aria-describedby={`${question.id}-help`}>
      <input
        ref={ref}
        type="text"
        className="field"
        placeholder="Full name"
        aria-label="Full name"
        autoComplete="name"
        aria-invalid={invalid && !contact.name?.trim()}
        value={contact.name ?? ""}
        onChange={(e) => set({ name: e.target.value })}
        onKeyDown={onEnter}
      />
      <input
        type="email"
        className="field"
        placeholder="Email address"
        aria-label="Email address"
        autoComplete="email"
        aria-invalid={invalid && !contact.email?.trim()}
        value={contact.email ?? ""}
        onChange={(e) => set({ email: e.target.value })}
        onKeyDown={onEnter}
      />
      <input
        type="tel"
        className="field"
        placeholder="Phone, with country code"
        aria-label="Phone number"
        autoComplete="tel"
        value={contact.phone ?? ""}
        onChange={(e) => set({ phone: e.target.value })}
        onKeyDown={onEnter}
      />
    </div>
  );
}

export default function QuestionField(props: FieldProps) {
  switch (props.question.type) {
    case "short":
      return <ShortField {...props} />;
    case "long":
      return <LongField {...props} />;
    case "choice":
      return <ChoiceField {...props} />;
    case "socials":
      return <SocialsField {...props} />;
    case "contact":
      return <ContactField {...props} />;
  }
}

/* The keyboard hint under the field, which differs by type. */
export function fieldHint(question: Question): string | null {
  switch (question.type) {
    case "short":
      return "to continue";
    case "long":
      return "Shift + Enter for a new line";
    case "choice":
      return null;
    case "socials":
      return null;
    case "contact":
      return "to continue";
  }
}
