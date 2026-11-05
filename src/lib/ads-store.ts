import { del, get, list, put } from "@vercel/blob";
import type { AdsSettings, Batch, CtaType, Creative, PublicSettings } from "@/lib/ads";
import { CTA_TYPES, uploadPrefix } from "@/lib/ads";

/* The uploader keeps its state in the same Vercel Blob store as the onboarding
   submissions, which is why this project still has no database.

   Two kinds of object:
     ads/settings.json              the Meta token, ad account and page
     ads/batches/<id>/batch.json    one upload session, creatives included

   Creatives are embedded in their batch rather than listed separately: nothing
   ever reads a creative without its batch, and one object per batch means a
   launch updates one document instead of racing several.

   Every write adds a random suffix and then deletes the older objects under the
   same prefix. Overwriting a fixed pathname is served through a cache with a
   one-minute floor, so a reload straight after a save could show the previous
   state; a fresh URL per save never can. */

const SETTINGS_PREFIX = "ads/settings";
const BATCH_PREFIX = "ads/batches/";

/* A history page is a glance at recent work, not an archive. */
const HISTORY_LIMIT = 50;

export interface StoredSettings extends AdsSettings {
  accessToken: string | null;
}

export const EMPTY_SETTINGS: StoredSettings = {
  accessToken: null,
  adAccountId: null,
  adAccountName: null,
  pageId: null,
  pageName: null,
};

/* Three ways the Blob SDK can authenticate, and the site has to recognise all
   of them or it reports no store while the store is sitting right there.
   BLOB_READ_WRITE_TOKEN is the classic one. BLOB_STORE_ID is the OIDC
   connection Vercel now makes by default: there the credential arrives on each
   request as an `x-vercel-oidc-token` header, never as an environment
   variable, so checking the environment for a token finds nothing in
   production even though every read and write would have worked. */
export function storeConfigured(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.BLOB_STORE_ID ||
      process.env.VERCEL_OIDC_TOKEN,
  );
}

async function readJson<T>(url: string): Promise<T | null> {
  const result = await get(url, { access: "private" });
  if (!result || result.statusCode !== 200) return null;
  return JSON.parse(await new Response(result.stream).text()) as T;
}

async function newest(prefix: string): Promise<string | null> {
  const { blobs } = await list({ prefix });
  const latest = [...blobs].sort((a, b) => +b.uploadedAt - +a.uploadedAt)[0];
  return latest?.url ?? null;
}

/* Best effort: a leftover old version is harmless, because every read takes the
   newest object under the prefix. */
async function pruneStale(prefix: string, keepUrl: string): Promise<void> {
  const { blobs } = await list({ prefix });
  const stale = blobs.filter((b) => b.url !== keepUrl).map((b) => b.url);
  if (stale.length) await del(stale).catch(() => {});
}

function str(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

export async function loadSettings(): Promise<StoredSettings> {
  const url = await newest(SETTINGS_PREFIX);
  if (!url) return EMPTY_SETTINGS;

  const raw = await readJson<Partial<StoredSettings>>(url);
  if (!raw) return EMPTY_SETTINGS;

  return {
    accessToken: str(raw.accessToken),
    adAccountId: str(raw.adAccountId),
    adAccountName: str(raw.adAccountName),
    pageId: str(raw.pageId),
    pageName: str(raw.pageName),
  };
}

export async function saveSettings(settings: StoredSettings): Promise<void> {
  const saved = await put(`${SETTINGS_PREFIX}.json`, JSON.stringify(settings), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: true,
  });
  await pruneStale(SETTINGS_PREFIX, saved.url);
}

/* What the browser is allowed to see. Shared by the page that renders the
   uploader and the route that saves to it, so the token cannot leak through one
   of them having been written more loosely than the other. */
export function publicSettings(settings: StoredSettings): PublicSettings {
  return {
    adAccountId: settings.adAccountId,
    adAccountName: settings.adAccountName,
    pageId: settings.pageId,
    pageName: settings.pageName,
    hasToken: Boolean(settings.accessToken),
    tokenTail: settings.accessToken ? settings.accessToken.slice(-8) : null,
  };
}

export const NO_SETTINGS: PublicSettings = {
  adAccountId: null,
  adAccountName: null,
  pageId: null,
  pageName: null,
  hasToken: false,
  tokenTail: null,
};

/* ─── Batches ──────────────────────────────────────────────────────────────── */

function batchPrefix(id: string): string {
  return `${BATCH_PREFIX}${id}/batch`;
}

/* Batch ids end up in Blob pathnames and in client requests, so they are
   generated here and validated on the way back in. */
export function newBatchId(): string {
  const stamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${stamp}-${rand}`;
}

export function validBatchId(id: unknown): id is string {
  return typeof id === "string" && /^[0-9]{14}-[a-z0-9]{6}$/.test(id);
}

function cta(value: unknown): CtaType {
  return CTA_TYPES.includes(value as CtaType) ? (value as CtaType) : "LEARN_MORE";
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [""];
  const list = value.filter((v): v is string => typeof v === "string");
  return list.length ? list : [""];
}

function normalizeCreative(raw: unknown): Creative | null {
  if (!raw || typeof raw !== "object") return null;
  const c = raw as Record<string, unknown>;
  if (typeof c.id !== "string" || typeof c.url !== "string") return null;

  return {
    id: c.id,
    fileName: typeof c.fileName === "string" ? c.fileName : "file",
    kind: c.kind === "video" ? "video" : "image",
    mimeType: typeof c.mimeType === "string" ? c.mimeType : "application/octet-stream",
    size: typeof c.size === "number" ? c.size : 0,
    url: c.url,
    pathname: typeof c.pathname === "string" ? c.pathname : "",
    thumbnailUrl: str(c.thumbnailUrl),
    thumbnailPathname: str(c.thumbnailPathname),
    adName: typeof c.adName === "string" ? c.adName : "Ad",
    metaAdId: str(c.metaAdId),
    metaCreativeId: str(c.metaCreativeId),
    status:
      c.status === "created" || c.status === "error" ? c.status : "pending",
    fileRemoved: c.fileRemoved === true,
    error: str(c.error),
  };
}

/* Anything read back out of storage is re-shaped here, so a half-written or
   hand-edited object cannot crash a page render. */
function normalizeBatch(raw: unknown): Batch | null {
  if (!raw || typeof raw !== "object") return null;
  const b = raw as Record<string, unknown>;
  if (typeof b.id !== "string") return null;

  return {
    id: b.id,
    name: typeof b.name === "string" ? b.name : "Batch",
    createdAt:
      typeof b.createdAt === "string" ? b.createdAt : new Date().toISOString(),
    campaignId: str(b.campaignId),
    campaignName: str(b.campaignName),
    adSetId: str(b.adSetId),
    adSetName: str(b.adSetName),
    primaryTexts: stringList(b.primaryTexts),
    headlines: stringList(b.headlines),
    descriptions: stringList(b.descriptions),
    ctaType: cta(b.ctaType),
    websiteUrl: typeof b.websiteUrl === "string" ? b.websiteUrl : "",
    displayLink: typeof b.displayLink === "string" ? b.displayLink : "",
    launchPaused: b.launchPaused !== false,
    enhancements: b.enhancements === true,
    status:
      b.status === "uploading" || b.status === "complete" || b.status === "error"
        ? b.status
        : "draft",
    adsCreated: typeof b.adsCreated === "number" ? b.adsCreated : 0,
    adsErrored: typeof b.adsErrored === "number" ? b.adsErrored : 0,
    errorLog: Array.isArray(b.errorLog)
      ? b.errorLog.filter((e): e is string => typeof e === "string")
      : [],
    creatives: Array.isArray(b.creatives)
      ? b.creatives
          .map(normalizeCreative)
          .filter((c): c is Creative => c !== null)
      : [],
  };
}

export function blankBatch(id: string, name: string): Batch {
  return {
    id,
    name,
    createdAt: new Date().toISOString(),
    campaignId: null,
    campaignName: null,
    adSetId: null,
    adSetName: null,
    primaryTexts: [""],
    headlines: [""],
    descriptions: [""],
    ctaType: "LEARN_MORE",
    websiteUrl: "",
    displayLink: "",
    launchPaused: true,
    enhancements: false,
    status: "draft",
    adsCreated: 0,
    adsErrored: 0,
    errorLog: [],
    creatives: [],
  };
}

export async function loadBatch(id: string): Promise<Batch | null> {
  const url = await newest(batchPrefix(id));
  if (!url) return null;
  try {
    return normalizeBatch(await readJson(url));
  } catch {
    return null;
  }
}

export async function saveBatch(batch: Batch): Promise<void> {
  const prefix = batchPrefix(batch.id);
  const saved = await put(`${prefix}.json`, JSON.stringify(batch), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: true,
  });
  await pruneStale(prefix, saved.url);
}

/* Cleanup, and deliberately silent: by the time this runs the ads are already
   live in Meta, so a Blob that refuses to delete is a storage bill rather than
   anything the person can act on. Returns whether the files actually went, so
   the batch is only marked as cleaned when they did. */
export async function removeCreativeFiles(urls: string[]): Promise<boolean> {
  if (!urls.length) return false;
  try {
    await del(urls);
    return true;
  } catch {
    return false;
  }
}

/* Read, change, write. Every caller is a single request acting on one batch and
   the wizard launches creatives one at a time, so there is no write to race. */
export async function updateBatch(
  id: string,
  change: (batch: Batch) => Batch,
): Promise<Batch | null> {
  const current = await loadBatch(id);
  if (!current) return null;
  const next = change(current);
  await saveBatch(next);
  return next;
}

export async function listBatches(): Promise<Batch[]> {
  const { blobs } = await list({ prefix: BATCH_PREFIX });

  /* One folder per batch, several objects in it after a few saves. Take the
     newest object in each folder and ignore the rest. */
  const perBatch = new Map<string, { url: string; at: number }>();
  for (const blob of blobs) {
    const rest = blob.pathname.slice(BATCH_PREFIX.length);
    const id = rest.split("/")[0];
    if (!id) continue;
    const at = +blob.uploadedAt;
    const seen = perBatch.get(id);
    if (!seen || at > seen.at) perBatch.set(id, { url: blob.url, at });
  }

  const recent = Array.from(perBatch.values())
    .sort((a, b) => b.at - a.at)
    .slice(0, HISTORY_LIMIT);

  const batches = await Promise.all(
    recent.map(async ({ url }) => {
      try {
        return normalizeBatch(await readJson(url));
      } catch {
        /* One unreadable object must not blank the whole history. */
        return null;
      }
    }),
  );

  return batches
    .filter((b): b is Batch => b !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/* The browser uploads to Blob and then reports back where the file landed. That
   report is the one place a client string becomes something the server will
   later fetch, so both halves are checked: the host has to be Blob's and the
   pathname has to be inside this batch's folder. */
export function validBlobRef(
  url: unknown,
  pathname: unknown,
  batchId: string,
): boolean {
  if (typeof url !== "string" || typeof pathname !== "string") return false;
  if (!pathname.startsWith(uploadPrefix(batchId))) return false;

  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname.endsWith(".blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}

export function newCreativeId(): string {
  return `c-${Math.random().toString(36).slice(2, 10)}`;
}

/* Pulls a stored creative back out as bytes, which is what both Meta media
   endpoints want. Private blobs are not readable without the store's token, so
   this only works from the server. */
export async function readBlobBytes(url: string): Promise<ArrayBuffer> {
  const result = await get(url, { access: "private" });
  if (!result || result.statusCode !== 200) {
    throw new Error("That file could not be read back out of storage.");
  }
  return new Response(result.stream).arrayBuffer();
}
