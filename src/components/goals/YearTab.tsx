"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import {
  BLOCK_STYLE,
  daysInMonth,
  newId,
  quarterBreaks,
  ymd,
  type BlockKind,
} from "@/lib/warMap";
import { Button, IconButton, Panel, Select } from "./ui";
import { dayMarks, fieldCls, fmtDate, markColor, type TabProps } from "./shared";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** The war map: the whole year on one page, goal first, fixed time blocked out,
 *  projects plotted in RICE order. */
export default function YearTab({
  map,
  update,
  today,
  year,
  setYear,
  onOpenMonth,
}: TabProps & { year: number; setYear: (y: number) => void; onOpenMonth: (month0: number) => void }) {
  const y = String(year);
  const [draft, setDraft] = useState({ label: "", kind: "event" as BlockKind, start: "", end: "" });

  const yearBlocks = map.blocks.filter((b) => b.start.startsWith(y) || b.end.startsWith(y));
  const yearProjects = map.projects.filter((p) => p.start?.startsWith(y) || p.end?.startsWith(y));
  const hasBreaks = yearBlocks.some((b) => b.kind === "break");

  const addBlock = () => {
    if (!draft.label.trim() || !draft.start) return;
    const end = draft.end && draft.end >= draft.start ? draft.end : draft.start;
    update((m) => ({
      ...m,
      blocks: [...m.blocks, { id: newId(), label: draft.label.trim(), kind: draft.kind, start: draft.start, end }],
    }));
    setDraft({ label: "", kind: draft.kind, start: "", end: "" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <IconButton icon={ChevronLeft} size="sm" variant="secondary" title="Previous year" onClick={() => setYear(year - 1)} />
        <h2 className="tabular-nums min-w-[5rem] text-center text-lg font-semibold text-[#FAFAFA]">{year}</h2>
        <IconButton icon={ChevronRight} size="sm" variant="secondary" title="Next year" onClick={() => setYear(year + 1)} />
      </div>

      <Panel title={`What are you trying to achieve by the end of ${year}?`} subtitle="One goal. The projects below are reverse-engineered from it.">
        <input
          value={map.goals[y] ?? ""}
          onChange={(e) => update((m) => ({ ...m, goals: { ...m.goals, [y]: e.target.value } }))}
          placeholder="e.g. Take GrowingOffers from $1M to $2M a year"
          className="w-full border-0 border-b border-white/[0.07] bg-transparent pb-2 accent-italic text-[28px] text-accent placeholder:text-text-dim outline-none focus:border-accent/50"
        />
      </Panel>

      <div className="rounded-lg bg-bg-card overflow-x-auto p-4">
        <table className="w-full border-separate" style={{ borderSpacing: 2 }}>
          <thead>
            <tr>
              <th className="w-10" />
              {Array.from({ length: 31 }, (_, i) => (
                <th key={i} className="tabular-nums min-w-[20px] text-center text-[10px] font-normal text-text-muted">
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MONTHS.map((name, m0) => {
              const n = daysInMonth(year, m0);
              return (
                <tr key={name}>
                  <th className="pr-2 text-left">
                    <button
                      onClick={() => onOpenMonth(m0)}
                      className="text-xs font-medium text-text-muted transition-colors hover:text-accent"
                      title={`Open ${name}`}
                    >
                      {name}
                    </button>
                  </th>
                  {Array.from({ length: 31 }, (_, d) => {
                    if (d >= n) return <td key={d} />;
                    const day = ymd(new Date(year, m0, d + 1));
                    const marks = dayMarks(map, day);
                    const color = markColor(marks);
                    const labels = [...marks.blocks.map((b) => b.label), ...marks.projects.map((p) => p.name)].filter(Boolean);
                    const weekend = [0, 6].includes(new Date(year, m0, d + 1).getDay());
                    return (
                      <td
                        key={d}
                        title={`${fmtDate(day, { weekday: "short", day: "numeric", month: "short" })}${labels.length ? ` — ${labels.join(", ")}` : ""}`}
                        className={`h-[22px] rounded-[4px] ${day < today ? "opacity-35" : ""} ${
                          day === today ? "ring-2 ring-accent ring-offset-1 ring-offset-[#151413]" : ""
                        }`}
                        style={{ background: color ?? (weekend ? "#1E1C19" : "#26231F") }}
                      />
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-3 text-[11px] text-text-muted">
          Past days fade; today has the gold ring. Click a month to plan its days.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Key" subtitle="Projects come from the Projects tab, in RICE order.">
          {yearProjects.length + yearBlocks.length === 0 ? (
            <p className="text-sm text-text-muted">Nothing on the map for {year} yet.</p>
          ) : (
            <ul className="space-y-2">
              {yearProjects.map((p) => (
                <li key={p.id} className="flex items-center gap-3 text-sm">
                  <span className="h-3 w-3 flex-shrink-0 rounded-[3px]" style={{ background: p.color }} />
                  <span className={`flex-1 ${p.done ? "text-text-muted line-through" : "text-[#FAFAFA]"}`}>{p.name || "Untitled project"}</span>
                  <span className="tabular-nums text-[11px] text-text-muted">{range(p.start!, p.end!)}</span>
                </li>
              ))}
              {yearBlocks.map((b) => (
                <li key={b.id} className="group flex items-center gap-3 text-sm">
                  <span className="h-3 w-3 flex-shrink-0 rounded-[3px]" style={{ background: BLOCK_STYLE[b.kind].color }} />
                  <span className="flex-1 text-[#FAFAFA]">{b.label}</span>
                  <span className="tabular-nums text-[11px] text-text-muted">{range(b.start, b.end)}</span>
                  <button
                    onClick={() => update((m) => ({ ...m, blocks: m.blocks.filter((x) => x.id !== b.id) }))}
                    aria-label={`Remove ${b.label}`}
                    className="rounded p-0.5 text-text-muted opacity-0 hover:text-[#FAFAFA] group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    <X size={13} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Block out fixed time first"
          subtitle="Breaks, events and family commitments go on the map before any project."
          right={
            !hasBreaks && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  update((m) => ({ ...m, blocks: [...m.blocks, ...quarterBreaks(year).map((b) => ({ ...b, id: newId() }))] }))
                }
              >
                Add quarter breaks
              </Button>
            )
          }
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              value={draft.label}
              onChange={(e) => setDraft({ ...draft, label: e.target.value })}
              placeholder="e.g. Live event in Dubai"
              className={`${fieldCls} sm:col-span-2`}
            />
            <Select
              value={draft.kind}
              onChange={(v) => setDraft({ ...draft, kind: v as BlockKind })}
              options={(Object.keys(BLOCK_STYLE) as BlockKind[]).map((k) => ({ value: k, label: BLOCK_STYLE[k].label }))}
              ariaLabel="Kind"
            />
            <div className="flex items-center gap-2">
              <input type="date" aria-label="Start" value={draft.start} onChange={(e) => setDraft({ ...draft, start: e.target.value })} className={`${fieldCls} min-w-0 flex-1`} />
              <input type="date" aria-label="End" value={draft.end} onChange={(e) => setDraft({ ...draft, end: e.target.value })} className={`${fieldCls} min-w-0 flex-1`} />
            </div>
          </div>
          <Button className="mt-3" size="sm" variant="primary" icon={Plus} onClick={addBlock} disabled={!draft.label.trim() || !draft.start}>
            Add to map
          </Button>
        </Panel>
      </div>
    </div>
  );
}

function range(start: string, end: string) {
  const f = (s: string) => fmtDate(s, { day: "numeric", month: "short" });
  return start === end ? f(start) : `${f(start)} – ${f(end)}`;
}
