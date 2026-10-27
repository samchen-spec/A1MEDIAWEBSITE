"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { newId, type Task } from "@/lib/warMap";

/** One day's action items: tick, add with Enter, remove. */
export default function TaskList({
  tasks,
  onChange,
  placeholder = "Add an action…",
  past = false,
}: {
  tasks: Task[];
  onChange: (tasks: Task[]) => void;
  placeholder?: string;
  /** a day that has gone: still editable, but reads as history */
  past?: boolean;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    onChange([...tasks, { id: newId(), text, done: false }]);
    setDraft("");
  };

  return (
    <div className={past ? "opacity-70" : ""}>
      {tasks.length > 0 && (
        <ul className="mb-3 space-y-1">
          {tasks.map((t) => (
            <li key={t.id} className="group flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-[#1B1917]">
              <button
                onClick={() =>
                  onChange(tasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))
                }
                aria-label={t.done ? `Mark "${t.text}" not done` : `Mark "${t.text}" done`}
                className={`grid h-[18px] w-[18px] flex-shrink-0 place-items-center rounded-md border transition-colors ${
                  t.done ? "border-transparent bg-accent text-[#0C0C0C]" : "border-[#8A857D]/60 hover:border-accent"
                }`}
              >
                {t.done && <Check size={12} strokeWidth={3} />}
              </button>
              <span className={`flex-1 text-sm ${t.done ? "text-text-muted line-through" : "text-[#FAFAFA]"}`}>
                {t.text}
              </span>
              <button
                onClick={() => onChange(tasks.filter((x) => x.id !== t.id))}
                aria-label={`Remove "${t.text}"`}
                className="rounded p-1 text-text-muted opacity-0 transition-opacity hover:text-[#FAFAFA] group-hover:opacity-100 focus-visible:opacity-100"
              >
                <X size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && add()}
        onBlur={add}
        placeholder={placeholder}
        className="w-full rounded-[9px] bg-[#1B1917] px-3 py-2 text-sm text-[#FAFAFA] placeholder:text-text-dim outline-none focus:shadow-[inset_0_0_0_1.5px_rgba(227,192,141,0.55)]"
      />
    </div>
  );
}
