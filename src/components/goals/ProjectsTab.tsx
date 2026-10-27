"use client";

import { Plus, Trash2 } from "lucide-react";
import {
  CONFIDENCE_OPTIONS,
  IMPACT_OPTIONS,
  PROJECT_COLORS,
  newId,
  rankProjects,
  type Project,
} from "@/lib/warMap";
import { Button, IconButton, Select } from "./ui";
import { fieldCls, type TabProps } from "./shared";

const fmtScore = (n: number) => n.toLocaleString("en-GB", { maximumFractionDigits: n < 10 ? 1 : 0 });

/** RICE scoring: rank the big projects objectively, then schedule them in that order. */
export default function ProjectsTab({ map, update }: TabProps) {
  const ranked = rankProjects(map.projects);

  const patch = (id: string, change: Partial<Project>) =>
    update((m) => ({ ...m, projects: m.projects.map((p) => (p.id === id ? { ...p, ...change } : p)) }));

  const add = () =>
    update((m) => ({
      ...m,
      projects: [
        ...m.projects,
        {
          id: newId(),
          name: "",
          reach: 500,
          impact: 1,
          confidence: 0.5,
          effort: 1,
          start: null,
          end: null,
          color: PROJECT_COLORS[m.projects.length % PROJECT_COLORS.length],
          done: false,
        },
      ],
    }));

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-bg-card p-5">
        <dl className="grid grid-cols-2 gap-4 text-xs md:grid-cols-5">
          <Def term="Reach">People this project touches in one quarter.</Def>
          <Def term="Impact">How much it lifts conversion when they meet it.</Def>
          <Def term="Confidence">How sure you are of those guesses. Rarely 100%.</Def>
          <Def term="Effort">Person-months. 2 people × 1 month = 2.</Def>
          <Def term="Score">Reach × Impact × Confidence ÷ Effort. Highest goes first.</Def>
        </dl>
      </div>

      <div className="overflow-x-auto rounded-lg bg-bg-card p-0">
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="border-b border-white/[0.07] text-left text-[11px] text-text-muted">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-2 py-3 font-medium">Project</th>
              <th className="px-2 py-3 font-medium">Reach</th>
              <th className="px-2 py-3 font-medium">Impact</th>
              <th className="px-2 py-3 font-medium">Confidence</th>
              <th className="px-2 py-3 font-medium">Effort</th>
              <th className="px-2 py-3 text-right font-medium">Score</th>
              <th className="px-2 py-3 font-medium">Start</th>
              <th className="px-2 py-3 font-medium">Finish</th>
              <th className="px-2 py-3 font-medium">Done</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {ranked.map((p, i) => (
              <tr key={p.id} className={`border-b border-white/[0.05] last:border-0 ${p.done ? "opacity-50" : ""}`}>
                <td className="tabular-nums px-4 py-2 text-text-muted">{p.done ? "✓" : i + 1}</td>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        patch(p.id, { color: PROJECT_COLORS[(PROJECT_COLORS.indexOf(p.color) + 1) % PROJECT_COLORS.length] })
                      }
                      title="Change colour"
                      aria-label="Change colour"
                      className="h-4 w-4 flex-shrink-0 rounded-[4px]"
                      style={{ background: p.color }}
                    />
                    <input
                      value={p.name}
                      onChange={(e) => patch(p.id, { name: e.target.value })}
                      placeholder="e.g. New webinar funnel"
                      className={`${fieldCls} w-full min-w-[180px] py-1.5`}
                    />
                  </div>
                </td>
                <td className="px-2 py-2">
                  <NumberField value={p.reach} onChange={(v) => patch(p.id, { reach: v })} step={50} />
                </td>
                <td className="px-2 py-2">
                  <Select
                    size="sm"
                    value={String(p.impact)}
                    onChange={(v) => patch(p.id, { impact: Number(v) })}
                    options={IMPACT_OPTIONS.map((o) => ({ value: String(o.value), label: o.label }))}
                    ariaLabel="Impact"
                  />
                </td>
                <td className="px-2 py-2">
                  <Select
                    size="sm"
                    value={String(p.confidence)}
                    onChange={(v) => patch(p.id, { confidence: Number(v) })}
                    options={CONFIDENCE_OPTIONS.map((o) => ({ value: String(o.value), label: o.label }))}
                    ariaLabel="Confidence"
                  />
                </td>
                <td className="px-2 py-2">
                  <NumberField value={p.effort} onChange={(v) => patch(p.id, { effort: v })} step={0.5} />
                </td>
                <td className="tabular-nums px-2 py-2 text-right text-base font-semibold text-accent">{fmtScore(p.score)}</td>
                <td className="px-2 py-2">
                  <input type="date" aria-label="Start" value={p.start ?? ""} onChange={(e) => patch(p.id, { start: e.target.value || null })} className={`${fieldCls} py-1.5`} />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="date"
                    aria-label="Finish"
                    value={p.end ?? ""}
                    min={p.start ?? undefined}
                    onChange={(e) => patch(p.id, { end: e.target.value || null })}
                    className={`${fieldCls} py-1.5`}
                  />
                </td>
                <td className="px-2 py-2">
                  <input type="checkbox" aria-label="Done" checked={p.done} onChange={(e) => patch(p.id, { done: e.target.checked })} className="h-4 w-4" />
                </td>
                <td className="px-4 py-2">
                  <IconButton
                    icon={Trash2}
                    size="sm"
                    title="Delete project"
                    onClick={() => update((m) => ({ ...m, projects: m.projects.filter((x) => x.id !== p.id) }))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {ranked.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-text-muted">
            List the big projects that would make this year's goal happen, then score them.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="primary" icon={Plus} onClick={add}>
          Add project
        </Button>
        <p className="text-xs text-text-muted">
          Give each project start and finish dates in rank order. They appear on the year map.
        </p>
      </div>
    </div>
  );
}

function Def({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-medium text-accent">{term}</dt>
      <dd className="mt-1 leading-relaxed text-text-muted">{children}</dd>
    </div>
  );
}

function NumberField({ value, onChange, step }: { value: number; onChange: (v: number) => void; step: number }) {
  return (
    <input
      type="number"
      min={0}
      step={step}
      value={Number.isFinite(value) ? value : ""}
      onChange={(e) => onChange(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)))}
      className={`${fieldCls} tabular-nums w-24 py-1.5`}
    />
  );
}
