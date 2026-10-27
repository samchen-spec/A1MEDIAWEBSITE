"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { MAX_OBJECTIVES, daysInMonth, monthKey, ymd, type Task } from "@/lib/warMap";
import { IconButton, Panel } from "./ui";
import TaskList from "./TaskList";
import { dayMarks, fieldCls, fmtDate, markColor, type TabProps } from "./shared";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** One month: its main objectives, and each day's actions on a calendar. */
export default function MonthTab({
  map,
  update,
  today,
  cursor,
  setCursor,
  selected,
  setSelected,
}: TabProps & {
  cursor: { year: number; month0: number };
  setCursor: (c: { year: number; month0: number }) => void;
  selected: string;
  setSelected: (day: string) => void;
}) {
  const { year, month0 } = cursor;
  const key = monthKey(year, month0);
  const objectives = map.objectives[key] ?? [];
  const lead = (new Date(year, month0, 1).getDay() + 6) % 7; // Monday-first
  const count = daysInMonth(year, month0);
  const cells = [...Array(lead).fill(null), ...Array.from({ length: count }, (_, i) => ymd(new Date(year, month0, i + 1)))];
  while (cells.length % 7) cells.push(null);

  const shift = (n: number) => {
    const d = new Date(year, month0 + n, 1);
    setCursor({ year: d.getFullYear(), month0: d.getMonth() });
  };

  const setObjective = (i: number, text: string) =>
    update((m) => {
      const list = [...(m.objectives[key] ?? [])];
      list[i] = text;
      return { ...m, objectives: { ...m.objectives, [key]: list } };
    });

  const setTasks = (day: string, list: Task[]) =>
    update((m) => ({ ...m, tasks: { ...m.tasks, [day]: list } }));

  const selectedInMonth = selected.startsWith(key);
  const marks = dayMarks(map, selected);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <IconButton icon={ChevronLeft} size="sm" variant="secondary" title="Previous month" onClick={() => shift(-1)} />
        <h2 className="min-w-[10rem] text-center text-lg font-semibold text-[#FAFAFA]">
          {new Date(year, month0, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
        </h2>
        <IconButton icon={ChevronRight} size="sm" variant="secondary" title="Next month" onClick={() => shift(1)} />
      </div>

      <Panel title="Main objectives" subtitle="The few big things this month has to deliver. Plan the days around them.">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {Array.from({ length: MAX_OBJECTIVES }, (_, i) => (
            <label key={i} className="flex items-center gap-3">
              <span className="tabular-nums w-4 text-sm text-accent">{i + 1}</span>
              <input
                value={objectives[i] ?? ""}
                onChange={(e) => setObjective(i, e.target.value)}
                placeholder={i === 0 ? "e.g. Launch the new webinar" : ""}
                className={`${fieldCls} flex-1`}
              />
            </label>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-lg bg-bg-card overflow-hidden p-0 xl:col-span-2">
          <div className="grid grid-cols-7 border-b border-white/[0.07]">
            {WEEKDAYS.map((d) => (
              <div key={d} className="px-3 py-2 text-[11px] font-medium text-text-muted">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              if (!day) return <div key={i} className="min-h-[96px] border-b border-r border-white/[0.05] bg-bg-primary/40" />;
              const m = dayMarks(map, day);
              const color = markColor(m);
              const tasks = map.tasks[day] ?? [];
              const past = day < today;
              const isToday = day === today;
              const isSel = day === selected;
              const label = m.blocks[0]?.label ?? m.projects[0]?.name;
              return (
                <button
                  key={day}
                  onClick={() => setSelected(day)}
                  className={`relative min-h-[96px] border-b border-r border-white/[0.05] p-2 text-left transition-colors hover:bg-[#1B1917] ${
                    isSel ? "bg-[#1B1917]" : ""
                  } ${past ? "opacity-45" : ""}`}
                >
                  <span
                    className={`tabular-nums inline-grid h-6 w-6 place-items-center rounded-full text-xs ${
                      isToday ? "bg-accent font-semibold text-[#0C0C0C]" : "text-[#FAFAFA]"
                    }`}
                  >
                    {Number(day.slice(8))}
                  </span>
                  {color && (
                    <div className="mt-1 truncate rounded px-1.5 py-0.5 text-[10px] font-medium text-[#0C0C0C]" style={{ background: color }}>
                      {label || " "}
                    </div>
                  )}
                  <ul className="mt-1 space-y-0.5">
                    {tasks.slice(0, 2).map((t) => (
                      <li key={t.id} className={`truncate text-[11px] ${t.done || past ? "text-text-muted line-through" : "text-[#FAFAFA]"}`}>
                        {t.text}
                      </li>
                    ))}
                    {tasks.length > 2 && <li className="text-[10px] text-text-muted">+{tasks.length - 2} more</li>}
                  </ul>
                  {isSel && <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-accent/60" />}
                </button>
              );
            })}
          </div>
        </div>

        <Panel
          title={selectedInMonth ? fmtDate(selected, { weekday: "long", day: "numeric", month: "long" }) : "Pick a day"}
          subtitle={
            selectedInMonth
              ? [...marks.blocks.map((b) => b.label), ...marks.projects.map((p) => p.name)].filter(Boolean).join(" · ") || "Nothing on the map"
              : "Click a day to plan its actions."
          }
        >
          {selectedInMonth && (
            <TaskList
              tasks={map.tasks[selected] ?? []}
              onChange={(l) => setTasks(selected, l)}
              past={selected < today}
            />
          )}
        </Panel>
      </div>
    </div>
  );
}
