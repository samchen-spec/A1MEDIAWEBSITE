/* Shared vocabulary for the bulk uploader at /upload.

   Imported by both the client wizard and the server routes, so nothing in here
   may touch node:crypto, the Blob SDK or process.env. */

export const META_API_VERSION = "v22.0";

/* Meta's call-to-action enum, limited to the ones that make sense for a link
   ad. Sent through to the creative untouched. */
export const CTA_TYPES = [
  "LEARN_MORE",
  "SHOP_NOW",
  "SIGN_UP",
  "SUBSCRIBE",
  "GET_OFFER",
  "ORDER_NOW",
  "BOOK_NOW",
  "CONTACT_US",
  "DOWNLOAD",
  "GET_QUOTE",
  "APPLY_NOW",
  "BUY_NOW",
  "WATCH_MORE",
  "SEE_MENU",
  "SEND_MESSAGE",
  "GET_STARTED",
] as const;

export type CtaType = (typeof CTA_TYPES)[number];

export function ctaLabel(cta: string): string {
  return cta
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* Meta rotates up to five of each. More than that is accepted by the API and
   then quietly ignored, which is worse than refusing it here. */
export const MAX_VARIATIONS = 5;

/* Files go straight from the browser to Blob storage, so the only ceiling is
   Meta's own: 4GB for a video. This is well under it and catches a mis-drag. */
export const MAX_UPLOAD_BYTES = 512 * 1024 * 1024;

/* Media for a batch lives under its own folder. Shared with the browser,
   because the browser is what writes the files: the client-token route only
   signs for paths inside this prefix. */
export function uploadPrefix(batchId: string): string {
  return `ads/uploads/${batchId}/`;
}

export const IMAGE_MIME_PREFIX = "image/";
export const VIDEO_MIME_PREFIX = "video/";

/* Meta's /adimages rejects these outright, so they are converted to JPEG on the
   way through. Kept here so the UI can say so before the launch. */
export const CONVERTED_IMAGE_TYPES = ["image/webp", "image/bmp", "image/tiff"];

export interface AdAccount {
  id: string;
  name: string;
  account_id: string;
  account_status?: number;
  currency?: string;
}

export interface FbPage {
  id: string;
  name: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: string;
  objective?: string;
}

export interface AdSet {
  id: string;
  name: string;
  status?: string;
  is_dynamic_creative?: boolean;
}

export interface AdsSettings {
  adAccountId: string | null;
  adAccountName: string | null;
  pageId: string | null;
  pageName: string | null;
}

/* What the browser is allowed to see. The access token itself never leaves the
   server; the last eight characters are enough to tell two tokens apart. */
export interface PublicSettings extends AdsSettings {
  hasToken: boolean;
  tokenTail: string | null;
}

export type CreativeKind = "image" | "video";
export type CreativeStatus = "pending" | "created" | "error";

export interface Creative {
  id: string;
  fileName: string;
  kind: CreativeKind;
  mimeType: string;
  size: number;
  /* Where the file sits in Blob storage. */
  url: string;
  pathname: string;
  /* Optional custom video thumbnail, same storage. */
  thumbnailUrl: string | null;
  thumbnailPathname: string | null;
  adName: string;
  metaAdId: string | null;
  metaCreativeId: string | null;
  status: CreativeStatus;
  error: string | null;
}

export type BatchStatus = "draft" | "uploading" | "complete" | "error";

export interface Batch {
  id: string;
  name: string;
  createdAt: string;
  campaignId: string | null;
  campaignName: string | null;
  adSetId: string | null;
  adSetName: string | null;
  primaryTexts: string[];
  headlines: string[];
  descriptions: string[];
  ctaType: CtaType;
  websiteUrl: string;
  displayLink: string;
  launchPaused: boolean;
  enhancements: boolean;
  status: BatchStatus;
  adsCreated: number;
  adsErrored: number;
  errorLog: string[];
  creatives: Creative[];
}

/* Browsers do not always know what they just handed over: a .mov dragged in
   from a Finder window can arrive with an empty type. The extension is a good
   enough second opinion, and getting it wrong only means Meta refuses the file
   with its own message. */
const EXTENSION_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
  tif: "image/tiff",
  tiff: "image/tiff",
  mp4: "video/mp4",
  m4v: "video/x-m4v",
  mov: "video/quicktime",
  webm: "video/webm",
  avi: "video/x-msvideo",
  mkv: "video/x-matroska",
};

export function mimeOf(file: { name: string; type: string }): string {
  if (file.type) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_TYPES[ext] ?? "";
}

export function kindOf(mimeType: string): CreativeKind | null {
  if (mimeType.startsWith(VIDEO_MIME_PREFIX)) return "video";
  if (mimeType.startsWith(IMAGE_MIME_PREFIX)) return "image";
  return null;
}

/* Blob pathnames are URLs. Anything outside this set gets folded to an
   underscore so a dropped file called "50% off (final).mp4" cannot produce a
   path that needs escaping later. */
export function safeFileName(name: string): string {
  const dot = name.lastIndexOf(".");
  const stem = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
  const cleanStem =
    stem.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 80) ||
    "file";
  const cleanExt = ext.replace(/[^a-z0-9]/g, "").slice(0, 8);
  return cleanExt ? `${cleanStem}.${cleanExt}` : cleanStem;
}

/* The filename is the ad name, because that is how media buyers already label
   their creative. Editable in step two. */
export function adNameFromFile(name: string): string {
  const dot = name.lastIndexOf(".");
  const stem = dot > 0 ? name.slice(0, dot) : name;
  return stem.replace(/[_]+/g, " ").trim().slice(0, 120) || "Ad";
}

export function todayBatchName(now = new Date()): string {
  return `Batch ${now.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
}

export function countVariations(batch: Batch): number {
  return Math.max(
    batch.primaryTexts.filter(Boolean).length,
    batch.headlines.filter(Boolean).length,
    batch.descriptions.filter(Boolean).length,
  );
}

/* More than one of anything means the creative has to be built as an
   asset_feed_spec rather than a plain link_data. */
export function needsAssetFeed(batch: Batch): boolean {
  return (
    batch.primaryTexts.filter(Boolean).length > 1 ||
    batch.headlines.filter(Boolean).length > 1 ||
    batch.descriptions.filter(Boolean).length > 1
  );
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
