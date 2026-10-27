"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminTabs from "@/components/admin/AdminTabs";
import { ymd } from "@/lib/warMap";
import { SegmentedControl } from "./ui";
import { useWarMap, type SaveState } from "./useWarMap";
import TodayTab from "./TodayTab";
import MonthTab from "./MonthTab";
import YearTab from "./YearTab";
import ProjectsTab from "./ProjectsTab";

type Tab = "today" | "month" | "year" | "projects";

const TABS: { value: Tab; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
  { value: "projects", label: "Projects" },
];

const TAB_KEY = "go.goals.tab";

/* Goal tracker: year → projects → month → today, after Sam Ovens' war map. */
export default function GoalsView() {
  const router = useRouter();
  const { map, update, loading, loadError, save } = useWarMap();

  const today = ymd(new Date());
  const [tab, setTab] = useState<Tab>("today");
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [cursor, setCursor] = useState(() => ({ year: new Date().getFullYear(), month0: new Date().getMonth() }));
  const [selected, setSelected] = useState(today);

  useEffect(() => {
    try {
      const t = localStorage.getItem(TAB_KEY) as Tab | null;
      if (t && TABS.some((x) => x.value === t)) setTab(t);
    } catch {
      /* default tab */
    }
  }, []);

  const go = (t: Tab) => {
    setTab(t);
    try {
      localStorage.setItem(TAB_KEY, t);
    } catch {
      /* not remembered */
    }
  };

  async function signOut() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.refresh();
  }

  const props = { map, update, today };

  return (
    <div className="mx-auto max-w-content px-6 pb-28 pt-28 text-[14px] leading-normal md:px-10">
      <AdminTabs active="goals" />

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">GrowingOffers</p>
          <h1 className="mt-3 text-[34px] font-semibold leading-[1.2] text-[#FAFAFA]">Goals</h1>
          <p className="mt-2 text-[16px] text-text-muted">
            Year goal, ranked projects, monthly objectives and today&apos;s actions.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <SaveIndicator state={save} />
          <SegmentedControl options={TABS} value={tab} onChange={go} />
          <button
            type="button"
            onClick={() => void signOut()}
            className="text-[14px] text-text-dim transition-colors hover:text-[#D2CEC9]"
          >
            Sign out
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 animate-pulse rounded-lg bg-bg-card" />
      ) : loadError ? (
        <p className="rounded-lg bg-error/5 px-5 py-4 text-error">{loadError}</p>
      ) : tab === "today" ? (
        <TodayTab {...props} onOpen={go} />
      ) : tab === "month" ? (
        <MonthTab {...props} cursor={cursor} setCursor={setCursor} selected={selected} setSelected={setSelected} />
      ) : tab === "year" ? (
        <YearTab
          {...props}
          year={year}
          setYear={setYear}
          onOpenMonth={(month0) => {
            setCursor({ year, month0 });
            go("month");
          }}
        />
      ) : (
        <ProjectsTab {...props} />
      )}
    </div>
  );
}

function SaveIndicator({ state }: { state: SaveState }) {
  if (state === "idle") return null;
  const text = { saving: "Saving…", saved: "Saved", error: "Couldn't save. Will retry on your next change." }[state];
  return <span className={`text-[13px] ${state === "error" ? "text-error" : "text-text-muted"}`}>{text}</span>;
}
