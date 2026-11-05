"use client";

import Link from "next/link";
import type { Batch, BatchStatus } from "@/lib/ads";
import UploaderTabs from "@/components/ads/UploaderTabs";
import CTAButton from "@/components/CTAButton";

const STATUS_STYLE: Record<BatchStatus, string> = {
  complete: "bg-[#1A2E1E] text-[#4ADE80]",
  error: "bg-[#2E1A1A] text-[#E05C5C]",
  uploading: "bg-[#2E261A] text-accent",
  draft: "bg-[#1B1917] text-text-muted",
};

const STATUS_LABEL: Record<BatchStatus, string> = {
  complete: "Complete",
  error: "Failed",
  uploading: "Uploading",
  draft: "Draft",
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

export default function HistoryView({
  batches,
  error,
}: {
  batches: Batch[];
  error: string | null;
}) {
  return (
    <div className="mx-auto max-w-inner px-6 py-28 md:px-10">
      <UploaderTabs active="history" />

      {error && (
        <div className="panel p-6">
          <p className="text-[17px] text-[#E05C5C]">{error}</p>
        </div>
      )}

      {!error && batches.length === 0 && (
        <div className="panel p-8 text-center">
          <h2 className="text-[22px] font-medium text-[#FAFAFA]">Nothing uploaded yet</h2>
          <p className="mx-auto mt-3 max-w-[420px] text-[16px] text-muted">
            Every batch you launch shows up here with its ad counts, so you can tell at a
            glance which run put what into the account.
          </p>
          <div className="mt-6 flex justify-center">
            <CTAButton href="/upload">Upload your first batch</CTAButton>
          </div>
        </div>
      )}

      {batches.length > 0 && (
        <ul className="flex flex-col gap-4">
          {batches.map((batch) => (
            <li key={batch.id} className="panel p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-[19px] font-medium text-[#FAFAFA]">{batch.name}</h2>
                  <p className="mt-1.5 truncate text-[15px] text-muted">
                    {batch.campaignName ?? "No campaign"}
                    {" → "}
                    {batch.adSetName ?? "No ad set"}
                  </p>
                  <p className="mt-1 text-[14px] text-text-dim">
                    {formatDate(batch.createdAt)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <div className="text-right">
                    <p className="text-[15px] text-[#4ADE80]">
                      {batch.adsCreated} {batch.adsCreated === 1 ? "ad" : "ads"}
                    </p>
                    {batch.adsErrored > 0 && (
                      <p className="mt-0.5 text-[15px] text-[#E05C5C]">
                        {batch.adsErrored}{" "}
                        {batch.adsErrored === 1 ? "error" : "errors"}
                      </p>
                    )}
                  </div>
                  <span
                    className={`rounded-[9px] px-3 py-1 text-[13px] font-medium ${STATUS_STYLE[batch.status]}`}
                  >
                    {STATUS_LABEL[batch.status]}
                  </span>
                </div>
              </div>

              {batch.errorLog.length > 0 && (
                <ul className="mt-4 flex flex-col gap-1.5 rounded-[14px] bg-[#1B1917] p-4">
                  {batch.errorLog.map((line, index) => (
                    <li key={index} className="text-[14px] leading-[1.5] text-[#C98A8A]">
                      {line}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-9 text-[15px] text-text-dim">
        <Link href="/upload" className="text-accent hover:text-accent-glow">
          Upload another batch
        </Link>
      </p>
    </div>
  );
}
