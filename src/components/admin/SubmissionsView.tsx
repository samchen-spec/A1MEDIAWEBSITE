"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  QUESTIONS,
  allSheetColumns,
  answerToCell,
  questionsFor,
  type ContactValue,
  type Track,
} from "@/lib/onboarding";
import type { Submission } from "@/lib/store";

const TRACK_LABELS: Record<Track, string> = {
  "has-offer": "Has an offer",
  building: "Building first offer",
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso || "Unknown";
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* Answers come back as the form stored them, so socials is an array and
   contact is an object. Everything the cards show is flattened here. */
function cellFor(submission: Submission, key: string): string {
  return answerToCell(key, submission.answers[key]);
}

function contactOf(submission: Submission): ContactValue {
  return (submission.answers.contact ?? {}) as ContactValue;
}

function csvCell(value: string): string {
  return `"${(value ?? "").replace(/"/g, '""')}"`;
}

export default function SubmissionsView({
  submissions,
  configured,
  error,
}: {
  submissions: Submission[];
  configured: boolean;
  error: string | null;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState<"all" | Track>("all");
  const [openRow, setOpenRow] = useState<string | null>(null);

  /* The store already returns newest first. */
  const ordered = submissions;

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return ordered.filter((s) => {
      if (track !== "all" && s.track !== track) return false;
      if (!needle) return true;
      return Object.values(s.answers).some((v) =>
        typeof v === "string" ? v.toLowerCase().includes(needle) : false,
      );
    });
  }, [ordered, query, track]);

  function exportCsv() {
    const columns = allSheetColumns();
    const lines = [
      columns.map((c) => csvCell(c.label)).join(","),
      ...filtered.map((s) =>
        columns
          .map((c) => {
            if (c.key === "track") return csvCell(TRACK_LABELS[s.track]);
            if (c.key === "submitted_at") return csvCell(s.submittedAt);
            return csvCell(cellFor(s, c.key));
          })
          .join(","),
      ),
    ];
    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `onboarding-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function signOut() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-content px-6 py-28 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">GrowingOffers</p>
          <h1 className="mt-3 text-[34px] font-semibold leading-[1.2] text-[#FAFAFA]">
            Onboarding submissions
          </h1>
          <p className="mt-2 text-muted">
            {submissions.length === 0
              ? "Nothing yet."
              : `${submissions.length} total${
                  filtered.length !== submissions.length
                    ? `, ${filtered.length} shown`
                    : ""
                }.`}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.refresh()}
            className="text-[16px] text-muted transition-colors hover:text-[#FAFAFA]"
          >
            Refresh
          </button>
          {filtered.length > 0 && (
            <button
              type="button"
              onClick={exportCsv}
              className="text-[16px] text-accent transition-opacity hover:opacity-75"
            >
              Export CSV
            </button>
          )}
          <button
            type="button"
            onClick={() => void signOut()}
            className="text-[16px] text-dim transition-colors hover:text-[#D2CEC9]"
          >
            Sign out
          </button>
        </div>
      </div>

      {!configured && (
        <div className="mt-8 rounded-[20px] bg-[#151413] p-5">
          <p className="text-[17px] text-[#FAFAFA]">
            The submission store is not connected yet.
          </p>
          <p className="mt-2 text-[16px] text-muted">
            Submissions are still accepted and still posted to Discord, but there
            is nothing to read back until the Vercel Blob store is attached to
            this environment.
          </p>
        </div>
      )}

      {error && (
        <div className="mt-8 rounded-[20px] bg-[#151413] p-5">
          <p className="text-[17px] text-[#E05C5C]">Could not read the sheet.</p>
          <p className="mt-2 text-[16px] text-muted">{error}</p>
        </div>
      )}

      {configured && !error && (
        <>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              className="field sm:flex-1"
              placeholder="Search every answer"
              aria-label="Search submissions"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="field sm:w-[220px] sm:shrink-0"
              aria-label="Filter by track"
              value={track}
              onChange={(e) => setTrack(e.target.value as "all" | Track)}
            >
              <option value="all">Both tracks</option>
              <option value="has-offer">Has an offer</option>
              <option value="building">Building first offer</option>
            </select>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {filtered.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                open={openRow === submission.id}
                onToggle={() =>
                  setOpenRow(
                    openRow === submission.id ? null : submission.id,
                  )
                }
              />
            ))}
          </div>

          {filtered.length === 0 && submissions.length > 0 && (
            <p className="mt-10 text-muted">Nothing matches that search.</p>
          )}

          {submissions.length === 0 && (
            <p className="mt-10 text-muted">
              No submissions yet. They appear here as soon as someone finishes the
              form at <span className="text-accent">/onboarding</span>.
            </p>
          )}
        </>
      )}
    </div>
  );
}

function SubmissionCard({
  submission,
  open,
  onToggle,
}: {
  submission: Submission;
  open: boolean;
  onToggle: () => void;
}) {
  const track = submission.track;
  const contact = contactOf(submission);
  const revenue =
    cellFor(submission, "revenue_90") ||
    cellFor(submission, "revenue_90_building");

  return (
    <div className="overflow-hidden rounded-[24px] bg-[#151413]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full flex-col gap-3 p-6 text-left transition-colors hover:bg-[#1B1917]"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[22px] font-medium text-[#FAFAFA]">
            {cellFor(submission, "business_name") || "Unnamed"}
          </span>
          <span className="rounded-[10px] bg-[#0C0C0C] px-3 py-1 text-[14px] text-accent">
            {TRACK_LABELS[track]}
          </span>
          <span className="text-[15px] text-dim">
            {formatDate(submission.submittedAt)}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-7 gap-y-2 text-[16px] text-muted">
          {contact.name && <span>{contact.name}</span>}
          {contact.email && (
            <span className="text-[#D2CEC9]">{contact.email}</span>
          )}
          {contact.phone && <span>{contact.phone}</span>}
        </div>

        <div className="flex flex-wrap gap-x-7 gap-y-2 text-[15px] text-dim">
          {revenue && <span>Last 90 days: {revenue}</span>}
          {cellFor(submission, "target") && (
            <span>Target: {cellFor(submission, "target")}</span>
          )}
          {cellFor(submission, "capacity") && (
            <span>Capacity: {cellFor(submission, "capacity")}</span>
          )}
          {cellFor(submission, "hours") && (
            <span>Hours a week: {cellFor(submission, "hours")}</span>
          )}
        </div>
      </button>

      {open && <SubmissionDetail submission={submission} track={track} />}
    </div>
  );
}

function SubmissionDetail({
  submission,
  track,
}: {
  submission: Submission;
  track: Track;
}) {
  /* Rendered from the question set rather than from the row, so the answers
     appear in the order they were asked and under their own section headings. */
  const questions = questionsFor(track).filter(
    (q) => q.type !== "contact" && q.id !== "track",
  );

  let lastSection = "";

  return (
    <div className="border-t border-white/[0.06] px-6 pb-7 pt-2">
      {questions.map((question) => {
        const answer = cellFor(submission, question.id).trim();
        if (!answer) return null;

        const heading = question.section !== lastSection ? question.section : null;
        lastSection = question.section;

        return (
          <div key={question.id}>
            {heading && (
              <p className="mt-7 text-[15px] text-accent">{heading}</p>
            )}
            <p className="mt-4 text-[16px] text-dim">{question.label}</p>
            <p className="mt-1 whitespace-pre-wrap text-[17px] leading-[1.6] text-[#D2CEC9]">
              {answer}
            </p>
          </div>
        );
      })}

      {QUESTIONS.length > 0 && (
        <p className="mt-8 text-[14px] text-dim">
          Submitted {formatDate(submission.submittedAt)}
        </p>
      )}
    </div>
  );
}
