"use client";

import { ArrowRight, CornerDownRight } from "lucide-react";
import { addDays, parseYmd, rankProjects, type Task } from "@/lib/warMap";
import { Button, Panel } from "./ui";
import TaskList from "./TaskList";
import { dayMarks, fmtDate, type TabProps } from "./shared";

const DAY_MS = 86_400_000;

/** The page opened every morning: today's actions, and the big picture they serve. */
export default function TodayTab({ map, update, today, onOpen }: TabProps & {
  onOpen: (tab: "year" | "month" | "projects") => void;
}) {
  const tasks = map.tasks[today] ?? [];
  const yesterday = addDays(today, -1);
  const carried = (map.tasks[yesterday] ?? []).filter((t) => !t.done);
  const open = tasks.filter((t) => !t.done);
  const year = today.slice(0, 4);
  const objectives = (map.objectives[today.slice(0, 7)] ?? []).filter(Boolean);
  const { blocks, projects } = dayMarks(map, today);
  const next = rankProjects(map.projects).find((p) => !p.done && !(p.start && p.start <= today));

  const setTasks = (day: string, list: Task[]) =>
    update((m) => ({ ...m, tasks: { ...m.tasks, [day]: list } }));

  /** Moves, not copies: an action lives on exactly one day. */
  const move = (from: string, to: string, list: Task[]) =>
    update((m) => {
      const ids = new Set(list.map((t) => t.id));
      return {
        ...m,
        tasks: {
          ...m.tasks,
          [from]: (m.tasks[from] ?? []).filter((t) => !ids.has(t.id)),
          [to]: [...(m.tasks[to] ?? []), ...list],
        },
      };
    });

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <Panel
          title={fmtDate(today, { weekday: "long", day: "numeric", month: "long" })}
          subtitle={
            tasks.length
              ? `${tasks.length - open.length} of ${tasks.length} actions done`
              : "What moves the current project forward today?"
          }
          right={
            open.length > 0 && (
              <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={() => move(today, addDays(today, 1), open)}>
                Move {open.length} to tomorrow
              </Button>
            )
          }
        >
          {blocks.length > 0 && (
            <p className="mb-3 rounded-lg bg-[#1B1917] px-3 py-2 text-xs text-text-muted">
              On the map today: {blocks.map((b) => b.label).join(", ")}
            </p>
          )}
          {carried.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-accent/25 bg-accent/5 px-3 py-2">
              <span className="text-xs text-[#FAFAFA]">
                {carried.length} unfinished from yesterday
              </span>
              <Button size="sm" variant="secondary" icon={CornerDownRight} onClick={() => move(yesterday, today, carried)}>
                Bring them over
              </Button>
            </div>
          )}
          <TaskList tasks={tasks} onChange={(l) => setTasks(today, l)} />
        </Panel>
      </div>

      <div className="space-y-4">
        <Panel title={`${year} goal`} right={<LinkButton onClick={() => onOpen("year")}>Year map</LinkButton>}>
          {map.goals[year] ? (
            <p className="accent-italic text-xl leading-snug text-accent">{map.goals[year]}</p>
          ) : (
            <p className="text-sm text-text-muted">No goal set for {year} yet. Start there: everything else is reverse-engineered from it.</p>
          )}
        </Panel>

        <Panel title="Current project" right={<LinkButton onClick={() => onOpen("projects")}>Projects</LinkButton>}>
          {projects.length ? (
            <div className="space-y-4">
              {projects.map((p) => {
                const total = Math.round((+parseYmd(p.end!) - +parseYmd(p.start!)) / DAY_MS) + 1;
                const day = Math.round((+parseYmd(today) - +parseYmd(p.start!)) / DAY_MS) + 1;
                return (
                  <div key={p.id}>
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                      <span className="text-sm font-medium text-[#FAFAFA]">{p.name || "Untitled project"}</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#1B1917]">
                      <div className="h-full rounded-full" style={{ width: `${(day / total) * 100}%`, background: p.color }} />
                    </div>
                    <p className="mt-1.5 text-[11px] text-text-muted">
                      Day {day} of {total} · due {fmtDate(p.end!, { day: "numeric", month: "short" })}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-text-muted">
              Nothing scheduled for today.
              {next && <> Next by RICE score: <span className="text-[#FAFAFA]">{next.name || "Untitled project"}</span>.</>}
            </p>
          )}
        </Panel>

        <Panel title="This month's objectives" right={<LinkButton onClick={() => onOpen("month")}>Month</LinkButton>}>
          {objectives.length ? (
            <ol className="space-y-2">
              {objectives.map((o, i) => (
                <li key={i} className="flex gap-3 text-sm text-[#FAFAFA]">
                  <span className="tabular-nums w-4 text-accent">{i + 1}</span>
                  {o}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-text-muted">Set up to four main objectives for the month.</p>
          )}
        </Panel>
      </div>
    </div>
  );
}

function LinkButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-xs text-text-muted transition-colors hover:text-accent">
      {children} →
    </button>
  );
}
