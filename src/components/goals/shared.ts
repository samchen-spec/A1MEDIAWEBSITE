import { BLOCK_STYLE, inRange, type Block, type Project, type WarMap } from "@/lib/warMap";

export type Update = (fn: (m: WarMap) => WarMap) => void;

export interface TabProps {
  map: WarMap;
  update: Update;
  /** YYYY-MM-DD, local */
  today: string;
}

/** What occupies a day on the map. Fixed time wins over projects — a break
 *  is a break even if a project's dates run through it. */
export function dayMarks(map: WarMap, day: string) {
  const blocks = map.blocks.filter((b) => inRange(day, b.start, b.end));
  const projects = map.projects.filter((p) => inRange(day, p.start, p.end));
  return { blocks, projects };
}

export function markColor(m: { blocks: Block[]; projects: Project[] }) {
  if (m.blocks[0]) return BLOCK_STYLE[m.blocks[0].kind].color;
  if (m.projects[0]) return m.projects[0].color;
  return null;
}

export const fmtDate = (s: string, opts: Intl.DateTimeFormatOptions) => {
  const [y, mo, d] = s.split("-").map(Number);
  return new Date(y, mo - 1, d).toLocaleDateString("en-GB", opts);
};

export const fieldCls =
  "rounded-[9px] bg-[#1B1917] px-3 py-2 text-sm [color-scheme:dark] text-[#FAFAFA] placeholder:text-text-dim outline-none focus:shadow-[inset_0_0_0_1.5px_rgba(227,192,141,0.55)]";
