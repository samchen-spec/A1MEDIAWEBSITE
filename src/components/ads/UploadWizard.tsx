"use client";

import { upload } from "@vercel/blob/client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CTA_TYPES,
  MAX_VARIATIONS,
  countVariations,
  ctaLabel,
  formatBytes,
  kindOf,
  mimeOf,
  safeFileName,
  todayBatchName,
  uploadPrefix,
  type AdSet,
  type Batch,
  type Campaign,
  type Creative,
  type CtaType,
  type PublicSettings,
} from "@/lib/ads";
import UploaderTabs from "@/components/ads/UploaderTabs";
import CTAButton from "@/components/CTAButton";

/* The wizard. Three steps, and the browser does more of the work than it looks:
   creative files go straight from here into Blob storage, and the launch walks
   the batch one creative at a time rather than asking a single request to push
   twenty videos into Meta before it times out. */

const STEPS = ["Upload creatives", "Ad copy & URL", "Campaign & launch"] as const;

/* Multipart is slower to start and faster to finish. Worth it for a video,
   wasted on a 2MB jpeg. */
const MULTIPART_OVER_BYTES = 8 * 1024 * 1024;

type Step = 1 | 2 | 3;

interface Progress {
  done: number;
  total: number;
  label: string;
}

async function readError(res: Response, fallback: string): Promise<string> {
  const body = (await res.json().catch(() => ({}))) as { error?: string };
  return body.error ?? fallback;
}

/* ─── Pieces ───────────────────────────────────────────────────────────────── */

function StepTrack({ step }: { step: Step }) {
  return (
    <ol className="mb-10 flex flex-wrap items-center gap-x-4 gap-y-3">
      {STEPS.map((label, index) => {
        const number = index + 1;
        const done = number < step;
        const current = number === step;

        return (
          <li key={label} className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[14px] font-semibold ${
                  done
                    ? "bg-[#4ADE80] text-[#0C0C0C]"
                    : current
                      ? "bg-accent text-[#0C0C0C]"
                      : "bg-bg-card text-text-dim"
                }`}
                aria-hidden
              >
                {done ? "✓" : number}
              </span>
              <span
                className={`text-[15px] ${
                  current ? "text-[#FAFAFA]" : done ? "text-muted" : "text-text-dim"
                }`}
              >
                {label}
              </span>
            </div>
            {number < STEPS.length && (
              <span className="hidden h-[1.5px] w-10 bg-[#1B1917] sm:block" aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Variations({
  title,
  note,
  values,
  onChange,
  long,
  placeholder,
}: {
  title: string;
  note?: string;
  values: string[];
  onChange: (next: string[]) => void;
  long?: boolean;
  placeholder: string;
}) {
  function set(index: number, value: string) {
    onChange(values.map((v, i) => (i === index ? value : v)));
  }

  return (
    <section className="panel p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-[18px] font-medium text-[#FAFAFA]">{title}</h3>
        {note && <p className="text-[14px] text-text-dim">{note}</p>}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {values.map((value, index) => (
          <div key={index} className="flex items-start gap-3">
            {long ? (
              <textarea
                className="field field--long"
                placeholder={placeholder}
                aria-label={`${title} ${index + 1}`}
                value={value}
                onChange={(e) => set(index, e.target.value)}
              />
            ) : (
              <input
                className="field"
                placeholder={placeholder}
                aria-label={`${title} ${index + 1}`}
                value={value}
                onChange={(e) => set(index, e.target.value)}
              />
            )}

            {values.length > 1 && (
              <button
                type="button"
                aria-label={`Remove ${title.toLowerCase()} ${index + 1}`}
                onClick={() => onChange(values.filter((_, i) => i !== index))}
                className="mt-1 shrink-0 rounded-[9px] bg-bg-card px-3 py-2 text-[15px] text-text-muted transition-colors hover:bg-[#1B1917] hover:text-[#E05C5C]"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {values.length < MAX_VARIATIONS && (
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className="mt-4 text-[15px] text-accent transition-colors hover:text-accent-glow"
        >
          + Add variation
        </button>
      )}
    </section>
  );
}

function CreativeRow({
  creative,
  onRename,
  onThumbnail,
  thumbBusy,
}: {
  creative: Creative;
  onRename: (adName: string) => void;
  onThumbnail: (file: File) => void;
  thumbBusy: boolean;
}) {
  const thumbInput = useRef<HTMLInputElement>(null);

  return (
    <li className="flex flex-wrap items-center gap-3 rounded-[14px] bg-[#1B1917] p-3">
      <span className="text-[17px]" aria-hidden>
        {creative.kind === "video" ? "📹" : "🖼️"}
      </span>
      <span className="min-w-0 flex-1 basis-[180px] truncate text-[15px] text-muted">
        {creative.fileName}
      </span>

      <input
        className="field field--inline flex-1 basis-[200px]"
        aria-label={`Ad name for ${creative.fileName}`}
        value={creative.adName}
        onChange={(e) => onRename(e.target.value)}
      />

      {creative.kind === "video" && (
        <>
          <button
            type="button"
            disabled={thumbBusy}
            onClick={() => thumbInput.current?.click()}
            className={`shrink-0 rounded-[9px] px-3 py-2 text-[14px] transition-colors ${
              creative.thumbnailUrl
                ? "bg-[#1A2E1E] text-[#4ADE80]"
                : "bg-bg-card text-text-muted hover:text-[#FAFAFA]"
            } ${thumbBusy ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {thumbBusy ? "…" : creative.thumbnailUrl ? "✓ Thumb" : "+ Thumb"}
          </button>
          <input
            ref={thumbInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onThumbnail(file);
              e.target.value = "";
            }}
          />
        </>
      )}
    </li>
  );
}

function LaunchProgress({ creatives }: { creatives: Creative[] }) {
  return (
    <ul className="mt-5 flex flex-col gap-2">
      {creatives.map((creative) => (
        <li
          key={creative.id}
          className="flex flex-wrap items-center gap-3 rounded-[14px] bg-[#1B1917] p-3"
        >
          <span
            className={`shrink-0 text-[15px] ${
              creative.status === "created"
                ? "text-[#4ADE80]"
                : creative.status === "error"
                  ? "text-[#E05C5C]"
                  : "text-text-dim"
            }`}
            aria-hidden
          >
            {creative.status === "created" ? "✓" : creative.status === "error" ? "✕" : "·"}
          </span>
          <span className="min-w-0 flex-1 basis-[180px] truncate text-[15px] text-muted">
            {creative.adName}
          </span>
          {creative.error && (
            <span className="basis-full text-[14px] leading-[1.5] text-[#C98A8A]">
              {creative.error}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

/* ─── The wizard ───────────────────────────────────────────────────────────── */

export default function UploadWizard({ settings }: { settings: PublicSettings }) {
  const configured =
    settings.hasToken && Boolean(settings.adAccountId) && Boolean(settings.pageId);

  const [step, setStep] = useState<Step>(1);
  const [batchName, setBatchName] = useState(todayBatchName());
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const [primaryTexts, setPrimaryTexts] = useState<string[]>([""]);
  const [headlines, setHeadlines] = useState<string[]>([""]);
  const [descriptions, setDescriptions] = useState<string[]>([""]);
  const [cta, setCta] = useState<CtaType>("LEARN_MORE");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [displayLink, setDisplayLink] = useState("");
  const [thumbBusy, setThumbBusy] = useState<string | null>(null);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignId, setCampaignId] = useState("");
  const [adSets, setAdSets] = useState<AdSet[]>([]);
  const [adSetId, setAdSetId] = useState("");
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [loadingAdSets, setLoadingAdSets] = useState(false);
  const [makingAdSet, setMakingAdSet] = useState(false);
  const [sourceAdSetId, setSourceAdSetId] = useState("");
  const [newAdSetName, setNewAdSetName] = useState("");
  const [launchPaused, setLaunchPaused] = useState(true);
  const [enhancements, setEnhancements] = useState(false);
  const [launched, setLaunched] = useState(false);

  const campaign = campaigns.find((c) => c.id === campaignId) ?? null;
  const adSet = adSets.find((a) => a.id === adSetId) ?? null;

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const usable = Array.from(incoming).filter((file) => kindOf(mimeOf(file)) !== null);
    if (usable.length) setError(null);
    setFiles((current) => [...current, ...usable]);
  }, []);

  /* ─── Step 1 ─────────────────────────────────────────────────────────────── */

  async function uploadFiles() {
    if (busy) return;
    if (!files.length) {
      setError("Add at least one image or video.");
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/upload/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: batchName }),
      });
      if (!res.ok) throw new Error(await readError(res, "Could not start a batch."));
      const { batch: created } = (await res.json()) as { batch: Batch };

      const uploaded: Record<string, unknown>[] = [];
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        const mimeType = mimeOf(file);
        setProgress({ done: index, total: files.length, label: file.name });

        /* Straight into Blob storage. /api/upload/blob only signs the token:
           the bytes never pass through a serverless function. */
        const result = await upload(
          `${uploadPrefix(created.id)}${safeFileName(file.name)}`,
          file,
          {
            access: "private",
            handleUploadUrl: "/api/upload/blob",
            clientPayload: created.id,
            multipart: file.size > MULTIPART_OVER_BYTES,
            contentType: mimeType || undefined,
          },
        );

        uploaded.push({
          fileName: file.name,
          mimeType,
          size: file.size,
          url: result.url,
          pathname: result.pathname,
        });
      }

      setProgress({ done: files.length, total: files.length, label: "Attaching" });

      const attach = await fetch("/api/upload/creatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchId: created.id, files: uploaded }),
      });
      if (!attach.ok) {
        throw new Error(await readError(attach, "Those files could not be attached."));
      }

      const { batch: withFiles } = (await attach.json()) as { batch: Batch };
      setBatch(withFiles);
      setFiles([]);
      setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : "That upload did not finish.");
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  /* ─── Step 2 ─────────────────────────────────────────────────────────────── */

  function renameCreative(creativeId: string, adName: string) {
    setBatch((current) =>
      current
        ? {
            ...current,
            creatives: current.creatives.map((c) =>
              c.id === creativeId ? { ...c, adName } : c,
            ),
          }
        : current,
    );
  }

  /* Saved when the field loses focus rather than on every keystroke: it is one
     request either way, and nothing downstream reads the name until launch. */
  async function persistCreative(creativeId: string, adName: string) {
    if (!batch) return;
    await fetch("/api/upload/creative", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batchId: batch.id, creativeId, adName }),
    }).catch(() => {});
  }

  async function uploadThumbnail(creativeId: string, file: File) {
    if (!batch) return;
    setThumbBusy(creativeId);
    setError(null);

    try {
      const result = await upload(
        `${uploadPrefix(batch.id)}thumbs/${safeFileName(file.name)}`,
        file,
        {
          access: "private",
          handleUploadUrl: "/api/upload/blob",
          clientPayload: batch.id,
          contentType: mimeOf(file) || undefined,
        },
      );

      const res = await fetch("/api/upload/creative", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId: batch.id,
          creativeId,
          thumbnailUrl: result.url,
          thumbnailPathname: result.pathname,
        }),
      });
      if (!res.ok) {
        throw new Error(await readError(res, "That thumbnail could not be saved."));
      }

      const { batch: updated } = (await res.json()) as { batch: Batch };
      setBatch(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "That thumbnail could not be saved.");
    } finally {
      setThumbBusy(null);
    }
  }

  async function saveCopy(): Promise<boolean> {
    if (!batch) return false;

    const problems: string[] = [];
    if (!primaryTexts.some((t) => t.trim())) problems.push("one primary text");
    if (!headlines.some((h) => h.trim())) problems.push("one headline");
    if (!websiteUrl.trim()) problems.push("a destination URL");

    if (problems.length) {
      setError(`Add ${problems.join(", ")} before carrying on.`);
      return false;
    }
    if (!/^https?:\/\//i.test(websiteUrl.trim())) {
      setError("The destination URL has to start with http:// or https://");
      return false;
    }

    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/upload/batch", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId: batch.id,
          name: batchName,
          primaryTexts: primaryTexts.filter((t) => t.trim()),
          headlines: headlines.filter((h) => h.trim()),
          descriptions: descriptions.filter((d) => d.trim()),
          ctaType: cta,
          websiteUrl: websiteUrl.trim(),
          displayLink: displayLink.trim(),
        }),
      });
      if (!res.ok) throw new Error(await readError(res, "Could not save the copy."));

      const { batch: updated } = (await res.json()) as { batch: Batch };
      setBatch(updated);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the copy.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  /* ─── Step 3 ─────────────────────────────────────────────────────────────── */

  const loadCampaigns = useCallback(async () => {
    setLoadingCampaigns(true);
    try {
      const res = await fetch("/api/upload/meta/campaigns");
      if (!res.ok) throw new Error(await readError(res, "Could not load campaigns."));
      const body = (await res.json()) as { campaigns?: Campaign[] };
      setCampaigns(body.campaigns ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load campaigns.");
    } finally {
      setLoadingCampaigns(false);
    }
  }, []);

  /* Fetched once on arriving at step three, and the ref is what makes it once.
     Keying the effect off "no campaigns yet" instead would retry forever when
     the token is wrong: the fetch fails, the list is still empty, the
     dependencies land back where they started and it goes again. */
  const campaignsRequested = useRef(false);

  useEffect(() => {
    if (step !== 3 || campaignsRequested.current) return;
    campaignsRequested.current = true;
    void loadCampaigns();
  }, [step, loadCampaigns]);

  function reloadCampaigns() {
    setError(null);
    setCampaignId("");
    setAdSetId("");
    setAdSets([]);
    void loadCampaigns();
  }

  const loadAdSets = useCallback(async (id: string) => {
    setLoadingAdSets(true);
    setAdSets([]);
    try {
      const res = await fetch(`/api/upload/meta/adsets?campaignId=${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error(await readError(res, "Could not load ad sets."));
      const body = (await res.json()) as { adSets?: AdSet[] };
      setAdSets(body.adSets ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load ad sets.");
    } finally {
      setLoadingAdSets(false);
    }
  }, []);

  function pickCampaign(id: string) {
    setCampaignId(id);
    setAdSetId("");
    setSourceAdSetId("");
    setMakingAdSet(false);
    if (id) void loadAdSets(id);
    else setAdSets([]);
  }

  async function createAdSet() {
    if (busy || !campaignId || !sourceAdSetId || !newAdSetName.trim()) {
      setError("Pick an ad set to copy and name the new one.");
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/upload/meta/adsets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newAdSetName.trim(),
          campaignId,
          sourceAdSetId,
        }),
      });
      if (!res.ok) throw new Error(await readError(res, "Could not create the ad set."));

      const { adSet: created } = (await res.json()) as { adSet: AdSet };
      setAdSets((current) => [created, ...current]);
      setAdSetId(created.id);
      setNewAdSetName("");
      setMakingAdSet(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create the ad set.");
    } finally {
      setBusy(false);
    }
  }

  async function launch() {
    if (busy || !batch) return;
    if (!adSetId) {
      setError("Pick an ad set first.");
      return;
    }

    setBusy(true);
    setError(null);

    try {
      await fetch("/api/upload/batch", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId: batch.id,
          campaignId,
          campaignName: campaign?.name ?? null,
          adSetId,
          adSetName: adSet?.name ?? null,
          launchPaused,
          enhancements,
        }),
      });

      const start = await fetch("/api/upload/launch/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchId: batch.id }),
      });
      if (!start.ok) throw new Error(await readError(start, "Could not start the launch."));

      const started = (await start.json()) as { batch: Batch; pending: string[] };
      setBatch(started.batch);

      let stopped: string | null = null;

      for (let index = 0; index < started.pending.length; index += 1) {
        const creativeId = started.pending[index];
        const name =
          started.batch.creatives.find((c) => c.id === creativeId)?.adName ?? "creative";
        setProgress({ done: index, total: started.pending.length, label: name });

        const res = await fetch("/api/upload/launch/creative", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ batchId: batch.id, creativeId }),
        });
        const body = (await res.json().catch(() => ({}))) as {
          batch?: Batch;
          error?: string;
        };

        if (body.batch) setBatch(body.batch);

        /* A creative that Meta refuses comes back 200 with the error recorded
           against it, and the loop carries on. A non-OK response is something
           wrong with the setup itself, so there is no point trying the other
           nineteen. */
        if (!res.ok) {
          stopped = body.error ?? "The launch stopped partway.";
          break;
        }
      }

      /* Always closed off, even after stopping early: a batch left "uploading"
         would sit in the history looking like it is still running. */
      const finish = await fetch("/api/upload/launch/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchId: batch.id }),
      });
      if (finish.ok) {
        const { batch: finished } = (await finish.json()) as { batch: Batch };
        setBatch(finished);
      }

      if (stopped) setError(stopped);
      setLaunched(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The launch did not finish.");
      setLaunched(true);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  /* The copy and the URL survive: the next batch is usually the same offer with
     new creative. Everything tied to the files does not. */
  function reset() {
    setBatch(null);
    setFiles([]);
    setBatchName(todayBatchName());
    setStep(1);
    setLaunched(false);
    setError(null);
    setAdSetId("");
    setMakingAdSet(false);
  }

  /* ─── Setup gate ─────────────────────────────────────────────────────────── */

  if (!configured) {
    return (
      <div className="mx-auto max-w-prose px-6 py-28 md:px-10">
        <UploaderTabs active="upload" />
        <div className="panel p-7">
          <h2 className="text-[22px] font-medium text-[#FAFAFA]">Setup required</h2>
          <p className="mt-3 text-[16px] text-muted">
            The uploader needs a Meta access token, an ad account and a Facebook page
            before it can create anything. That takes about a minute on the Settings
            page.
          </p>
          <ul className="mt-5 flex flex-col gap-2 text-[15px] text-muted">
            <li>{settings.hasToken ? "✓" : "·"} Access token</li>
            <li>{settings.adAccountId ? "✓" : "·"} Ad account</li>
            <li>{settings.pageId ? "✓" : "·"} Facebook page</li>
          </ul>
          <div className="mt-6">
            <CTAButton href="/upload/settings">Open settings</CTAButton>
          </div>
        </div>
      </div>
    );
  }

  const creatives = batch?.creatives ?? [];
  const images = creatives.filter((c) => c.kind === "image").length;
  const videos = creatives.filter((c) => c.kind === "video").length;

  return (
    <div className="mx-auto max-w-inner px-6 py-28 md:px-10">
      <UploaderTabs active="upload" />
      <StepTrack step={step} />

      {/* ─── Step 1 ─────────────────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="flex flex-col gap-6">
          <section className="panel p-5 md:p-6">
            <label
              htmlFor="batch-name"
              className="text-[18px] font-medium text-[#FAFAFA]"
            >
              Batch name
            </label>
            <input
              id="batch-name"
              className="field mt-4"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
            />
          </section>

          <section
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              addFiles(e.dataTransfer.files);
            }}
            className={`rounded-lg p-10 text-center transition-colors duration-200 ${
              dragging ? "bg-[#1B1917]" : "bg-bg-card"
            }`}
          >
            <p className="text-[30px]" aria-hidden>
              📁
            </p>
            <h2 className="mt-3 text-[20px] font-medium text-[#FAFAFA]">
              Drag and drop images or videos
            </h2>
            <p className="mt-2 text-[15px] text-text-dim">
              JPG, PNG, GIF, WebP, MP4, MOV. WebP is converted to JPEG on the way to
              Meta.
            </p>
            <div className="mt-6 flex justify-center">
              <CTAButton onClick={() => fileInput.current?.click()}>
                Browse files
              </CTAButton>
            </div>
            <input
              ref={fileInput}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </section>

          {files.length > 0 && (
            <section className="panel p-5 md:p-6">
              <h2 className="text-[18px] font-medium text-[#FAFAFA]">
                {files.length} {files.length === 1 ? "file" : "files"} ready
              </h2>
              <ul className="mt-4 flex flex-col gap-2">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-3 rounded-[14px] bg-[#1B1917] p-3"
                  >
                    <span className="text-[17px]" aria-hidden>
                      {kindOf(mimeOf(file)) === "video" ? "📹" : "🖼️"}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[15px] text-muted">
                      {file.name}
                    </span>
                    <span className="shrink-0 text-[14px] text-text-dim">
                      {formatBytes(file.size)}
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove ${file.name}`}
                      onClick={() =>
                        setFiles((current) => current.filter((_, i) => i !== index))
                      }
                      className="shrink-0 rounded-[9px] bg-bg-card px-3 py-1.5 text-[14px] text-text-muted transition-colors hover:text-[#E05C5C]"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <Feedback error={error} progress={progress} />

          <div>
            <CTAButton onClick={() => void uploadFiles()}>
              {busy
                ? progress
                  ? `Uploading ${progress.done + 1} of ${progress.total}`
                  : "Uploading"
                : `Upload ${files.length || ""} ${files.length === 1 ? "file" : "files"}`.trim()}
            </CTAButton>
          </div>
        </div>
      )}

      {/* ─── Step 2 ─────────────────────────────────────────────────────────── */}
      {step === 2 && batch && (
        <div className="flex flex-col gap-6">
          <section className="panel p-5 md:p-6">
            <h2 className="text-[18px] font-medium text-[#FAFAFA]">
              {creatives.length} {creatives.length === 1 ? "creative" : "creatives"}{" "}
              uploaded
            </h2>
            <p className="mt-2 text-[15px] text-text-dim">
              The filename became the ad name. Change it here if you label ads
              differently.
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {creatives.map((creative) => (
                <CreativeRow
                  key={creative.id}
                  creative={creative}
                  thumbBusy={thumbBusy === creative.id}
                  onRename={(adName) => {
                    renameCreative(creative.id, adName);
                    void persistCreative(creative.id, adName);
                  }}
                  onThumbnail={(file) => void uploadThumbnail(creative.id, file)}
                />
              ))}
            </ul>
          </section>

          <Variations
            title="Primary text"
            note="Meta rotates them automatically"
            values={primaryTexts}
            onChange={setPrimaryTexts}
            long
            placeholder="The line above the creative"
          />
          <Variations
            title="Headlines"
            values={headlines}
            onChange={setHeadlines}
            placeholder="The bold line under the creative"
          />
          <Variations
            title="Descriptions"
            note="Optional"
            values={descriptions}
            onChange={setDescriptions}
            placeholder="The quiet line under the headline"
          />

          <section className="panel p-5 md:p-6">
            <h3 className="text-[18px] font-medium text-[#FAFAFA]">
              Destination and call to action
            </h3>

            <label htmlFor="website-url" className="mt-4 block text-[15px] text-muted">
              Website URL
            </label>
            <input
              id="website-url"
              className="field mt-2"
              placeholder="https://growingoffers.com/webinar"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
            />

            <label htmlFor="display-link" className="mt-5 block text-[15px] text-muted">
              Display link <span className="text-text-dim">optional</span>
            </label>
            <input
              id="display-link"
              className="field mt-2"
              placeholder="growingoffers.com"
              value={displayLink}
              onChange={(e) => setDisplayLink(e.target.value)}
            />

            <label htmlFor="cta" className="mt-5 block text-[15px] text-muted">
              Call to action
            </label>
            <select
              id="cta"
              className="field mt-2"
              value={cta}
              onChange={(e) => setCta(e.target.value as CtaType)}
            >
              {CTA_TYPES.map((type) => (
                <option key={type} value={type}>
                  {ctaLabel(type)}
                </option>
              ))}
            </select>
          </section>

          <Feedback error={error} progress={progress} />

          <div className="flex flex-wrap gap-3">
            <CTAButton variant="secondary" onClick={() => setStep(1)}>
              Back
            </CTAButton>
            <CTAButton
              onClick={() => {
                void saveCopy().then((ok) => {
                  if (ok) setStep(3);
                });
              }}
            >
              {busy ? "Saving" : "Campaign and launch"}
            </CTAButton>
          </div>
        </div>
      )}

      {/* ─── Step 3 ─────────────────────────────────────────────────────────── */}
      {step === 3 && batch && (
        <div className="flex flex-col gap-6">
          <section className="panel p-5 md:p-6">
            <h3 className="text-[18px] font-medium text-[#FAFAFA]">Campaign</h3>
            <select
              className="field mt-4"
              aria-label="Campaign"
              value={campaignId}
              disabled={loadingCampaigns || launched}
              onChange={(e) => pickCampaign(e.target.value)}
            >
              <option value="">
                {loadingCampaigns ? "Loading campaigns" : "Pick a campaign"}
              </option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.status}
                </option>
              ))}
            </select>

            {!launched && !loadingCampaigns && (
              <button
                type="button"
                onClick={reloadCampaigns}
                className="mt-3 text-[15px] text-accent transition-colors hover:text-accent-glow"
              >
                {campaigns.length ? "Reload campaigns" : "Try again"}
              </button>
            )}

            {campaignId && (
              <>
                <h3 className="mt-8 text-[18px] font-medium text-[#FAFAFA]">Ad set</h3>
                <p className="mt-2 text-[15px] text-text-dim">
                  Dynamic Creative ad sets only allow one ad, so use Create new ad set
                  for a bulk upload.
                </p>

                {!makingAdSet ? (
                  <>
                    <select
                      className="field mt-4"
                      aria-label="Ad set"
                      value={adSetId}
                      disabled={loadingAdSets || launched}
                      onChange={(e) => setAdSetId(e.target.value)}
                    >
                      <option value="">
                        {loadingAdSets ? "Loading ad sets" : "Pick an ad set"}
                      </option>
                      {adSets.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                          {a.is_dynamic_creative ? " · dynamic creative" : ""}
                        </option>
                      ))}
                    </select>
                    {!launched && (
                      <button
                        type="button"
                        onClick={() => setMakingAdSet(true)}
                        className="mt-4 text-[15px] text-accent transition-colors hover:text-accent-glow"
                      >
                        Create new ad set
                      </button>
                    )}
                  </>
                ) : (
                  <div className="mt-4 flex flex-col gap-3 rounded-[14px] bg-[#1B1917] p-4">
                    <label className="text-[15px] text-muted" htmlFor="source-ad-set">
                      Copy every setting from
                    </label>
                    <select
                      id="source-ad-set"
                      className="field"
                      value={sourceAdSetId}
                      onChange={(e) => setSourceAdSetId(e.target.value)}
                    >
                      <option value="">Pick an ad set to copy</option>
                      {adSets.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>

                    <label className="mt-1 text-[15px] text-muted" htmlFor="new-ad-set">
                      New ad set name
                    </label>
                    <input
                      id="new-ad-set"
                      className="field"
                      placeholder="Cold · broad · November"
                      value={newAdSetName}
                      onChange={(e) => setNewAdSetName(e.target.value)}
                    />

                    <div className="mt-2 flex flex-wrap gap-3">
                      <CTAButton onClick={() => void createAdSet()}>
                        {busy ? "Creating" : "Create ad set"}
                      </CTAButton>
                      <CTAButton
                        variant="secondary"
                        onClick={() => setMakingAdSet(false)}
                      >
                        Cancel
                      </CTAButton>
                    </div>
                    <p className="text-[14px] text-text-dim">
                      Created paused, with the targeting, optimisation and budget of the
                      ad set you copy.
                    </p>
                  </div>
                )}
              </>
            )}
          </section>

          <section className="panel p-5 md:p-6">
            <h3 className="text-[18px] font-medium text-[#FAFAFA]">Launch options</h3>

            <label className="mt-4 flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-[#E3C08D]"
                checked={launchPaused}
                disabled={launched}
                onChange={(e) => setLaunchPaused(e.target.checked)}
              />
              <span>
                <span className="text-[16px] text-[#FAFAFA]">Launch as paused</span>
                <span className="block text-[14px] text-text-dim">
                  Review them in Ads Manager before anything spends.
                </span>
              </span>
            </label>

            <label className="mt-4 flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-[#E3C08D]"
                checked={enhancements}
                disabled={launched}
                onChange={(e) => setEnhancements(e.target.checked)}
              />
              <span>
                <span className="text-[16px] text-[#FAFAFA]">
                  Enable creative enhancements
                </span>
                <span className="block text-[14px] text-text-dim">
                  Meta adjusts the creative itself: brightness, crops, text overlays.
                </span>
              </span>
            </label>
          </section>

          <section className="panel p-5 md:p-6">
            <h3 className="text-[18px] font-medium text-[#FAFAFA]">Ready to launch</h3>
            <dl className="mt-4 grid gap-x-8 gap-y-3 text-[15px] sm:grid-cols-2">
              <Row label="Creatives">
                {creatives.length} ({images} image{images === 1 ? "" : "s"}, {videos}{" "}
                video{videos === 1 ? "" : "s"})
              </Row>
              <Row label="Text variations">
                {countVariations(batch)} per field
              </Row>
              <Row label="Call to action">{ctaLabel(batch.ctaType)}</Row>
              <Row label="Destination">{batch.websiteUrl || "Not set"}</Row>
              <Row label="Enhancements">{enhancements ? "On" : "Off"}</Row>
              <Row label="Ads launch">{launchPaused ? "Paused" : "Active"}</Row>
            </dl>
          </section>

          {(busy || launched) && creatives.length > 0 && (
            <section className="panel p-5 md:p-6">
              <h3 className="text-[18px] font-medium text-[#FAFAFA]">
                {launched ? "Results" : "Uploading to Meta"}
              </h3>
              {launched && (
                <p className="mt-2 text-[15px] text-muted">
                  {batch.adsCreated} {batch.adsCreated === 1 ? "ad" : "ads"} created
                  {batch.adsErrored > 0
                    ? `, ${batch.adsErrored} failed`
                    : launchPaused
                      ? ", all paused in Ads Manager"
                      : ""}
                  .
                </p>
              )}
              <LaunchProgress creatives={creatives} />
            </section>
          )}

          <Feedback error={error} progress={progress} />

          {!launched ? (
            <div className="flex flex-wrap gap-3">
              <CTAButton variant="secondary" onClick={() => setStep(2)}>
                Back
              </CTAButton>
              <CTAButton onClick={() => void launch()}>
                {busy
                  ? progress
                    ? `Creating ${progress.done + 1} of ${progress.total}`
                    : "Launching"
                  : `Launch ${creatives.length} ${creatives.length === 1 ? "ad" : "ads"}`}
              </CTAButton>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-5">
              <CTAButton onClick={reset}>Upload another batch</CTAButton>
              <Link
                href="/upload/history"
                className="text-[15px] text-accent transition-colors hover:text-accent-glow"
              >
                See the history
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-text-dim">{label}</dt>
      <dd className="mt-0.5 break-words text-muted">{children}</dd>
    </div>
  );
}

function Feedback({
  error,
  progress,
}: {
  error: string | null;
  progress: Progress | null;
}) {
  return (
    <div aria-live="polite" className="min-h-[26px]">
      {error && <p className="text-[16px] leading-[1.5] text-[#E05C5C]">{error}</p>}
      {!error && progress && (
        <p className="text-[16px] text-muted">
          {progress.label} · {progress.done + 1} of {progress.total}
        </p>
      )}
    </div>
  );
}
