/**
 * The goal tracker's data model — Sam Ovens' "war map" method.
 *
 *   1. Set the goal for the year.
 *   2. Block out what's fixed first: a five-day break at the end of each
 *      quarter, events, family commitments.
 *   3. Reverse-engineer the goal into big projects and rank them with RICE
 *      (Reach × Impact × Confidence ÷ Effort) so the order is objective.
 *   4. Schedule the projects in that order, and see the whole year on one page.
 *   5. Each month: up to four main objectives. Each day: the actions that move
 *      the current project forward. Unfinished actions roll to tomorrow.
 *
 * RICE is for big projects only — days are planned by hand, as he says.
 */

export interface Project {
  id: string;
  name: string;
  /** people the project touches in one quarter */
  reach: number;
  /** conversion multiplier: 0.25 minimal … 3 massive */
  impact: number;
  /** 0–1: how sure you are of the reach/impact guesses */
  confidence: number;
  /** person-months */
  effort: number;
  start: string | null; // YYYY-MM-DD
  end: string | null;
  color: string;
  done: boolean;
}

export type BlockKind = "break" | "event" | "personal";

/** Fixed time that goes on the map before any project does. */
export interface Block {
  id: string;
  label: string;
  start: string;
  end: string;
  kind: BlockKind;
}

export interface Task {
  id: string;
  text: string;
  done: boolean;
}

export interface WarMap {
  version: 1;
  /** yearly goal, keyed by year */
  goals: Record<string, string>;
  projects: Project[];
  blocks: Block[];
  /** up to four main objectives per month, keyed YYYY-MM */
  objectives: Record<string, string[]>;
  /** daily actions, keyed YYYY-MM-DD */
  tasks: Record<string, Task[]>;
}

export const EMPTY_MAP: WarMap = {
  version: 1,
  goals: {},
  projects: [],
  blocks: [],
  objectives: {},
  tasks: {},
};

export const MAX_OBJECTIVES = 4;

export const IMPACT_OPTIONS = [
  { value: 3, label: "3× Massive" },
  { value: 2, label: "2× High" },
  { value: 1, label: "1× Medium" },
  { value: 0.5, label: "0.5× Low" },
  { value: 0.25, label: "0.25× Minimal" },
];

export const CONFIDENCE_OPTIONS = [
  { value: 1, label: "100% Certain" },
  { value: 0.8, label: "80% High" },
  { value: 0.5, label: "50% Medium" },
  { value: 0.2, label: "20% Low" },
];

/** Distinct on the dark map and readable with dark text on top. */
export const PROJECT_COLORS = [
  "#E3C08D", // champagne
  "#8FBF9F", // sage
  "#D98E73", // terracotta
  "#8DA9D9", // slate blue
  "#C49BD1", // plum
  "#7FC6C2", // teal
  "#E0D47A", // straw
  "#D99BB0", // rose
];

export const BLOCK_STYLE: Record<BlockKind, { label: string; color: string }> = {
  break: { label: "Break", color: "#8A857D" },
  event: { label: "Event", color: "#A88BD8" },
  personal: { label: "Personal", color: "#6E8FA6" },
};

export function riceScore(p: Pick<Project, "reach" | "impact" | "confidence" | "effort">) {
  if (!(p.effort > 0)) return 0;
  return (p.reach * p.impact * p.confidence) / p.effort;
}

/** Projects best-first, with their rank. Done projects keep their score but
 *  sink below the open ones — the list answers "what next?". */
export function rankProjects(projects: Project[]) {
  return [...projects]
    .map((p) => ({ ...p, score: riceScore(p) }))
    .sort((a, b) => Number(a.done) - Number(b.done) || b.score - a.score);
}

// ---------- dates (local calendar days, never UTC) ----------

export function ymd(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function parseYmd(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(s: string, n: number) {
  const d = parseYmd(s);
  d.setDate(d.getDate() + n);
  return ymd(d);
}

export const monthKey = (year: number, month0: number) =>
  `${year}-${String(month0 + 1).padStart(2, "0")}`;

export const daysInMonth = (year: number, month0: number) => new Date(year, month0 + 1, 0).getDate();

export function inRange(day: string, start: string | null, end: string | null) {
  return !!start && !!end && day >= start && day <= end;
}

/** The five-day break at the end of each quarter. */
export function quarterBreaks(year: number): Omit<Block, "id">[] {
  return [2, 5, 8, 11].map((m0, i) => {
    const last = daysInMonth(year, m0);
    return {
      label: `End of Q${i + 1} break`,
      start: ymd(new Date(year, m0, last - 4)),
      end: ymd(new Date(year, m0, last)),
      kind: "break" as const,
    };
  });
}

export const newId = () => Math.random().toString(36).slice(2, 10);

/** Whatever shape the stored file has, return a complete map. */
export function normalize(raw: unknown): WarMap {
  const m = (raw && typeof raw === "object" ? raw : {}) as Partial<WarMap>;
  return {
    version: 1,
    goals: m.goals ?? {},
    projects: m.projects ?? [],
    blocks: m.blocks ?? [],
    objectives: m.objectives ?? {},
    tasks: m.tasks ?? {},
  };
}
