import { META_API_VERSION } from "@/lib/ads";
import type { AdAccount, AdSet, Campaign, CtaType, FbPage } from "@/lib/ads";

/* Everything that talks to Meta's Marketing API.

   Server only: the access token is a system user token with ads_management on
   the client's ad account, and it never goes near the browser. */

const BASE = `https://graph.facebook.com/${META_API_VERSION}`;

/* Meta puts the useful sentence in error_user_msg and the developer-facing one
   in message. The UI shows whichever came back, so a media buyer can read
   "Your ad account is disabled" instead of a subcode. */
export class MetaError extends Error {
  readonly status: number;
  readonly code?: number;
  readonly subcode?: number;

  constructor(message: string, status: number, code?: number, subcode?: number) {
    super(message);
    this.name = "MetaError";
    this.status = status;
    this.code = code;
    this.subcode = subcode;
  }
}

interface MetaErrorBody {
  error?: {
    message?: string;
    error_user_title?: string;
    error_user_msg?: string;
    error_data?: unknown;
    code?: number;
    error_subcode?: number;
  };
}

function describe(body: MetaErrorBody, status: number): MetaError {
  const error = body.error ?? {};
  const parts: string[] = [];

  if (error.error_user_msg) {
    if (error.error_user_title) parts.push(`${error.error_user_title}:`);
    parts.push(error.error_user_msg);
  } else if (error.message) {
    parts.push(error.message);
  } else {
    parts.push(`Meta returned ${status} with no explanation.`);
  }

  if (error.error_data) {
    const extra =
      typeof error.error_data === "string"
        ? error.error_data
        : JSON.stringify(error.error_data);
    if (extra && extra !== "{}") parts.push(`(${extra})`);
  }

  return new MetaError(parts.join(" "), status, error.code, error.error_subcode);
}

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { error: { message: text.slice(0, 300) } };
  }
}

export async function metaGet<T>(
  endpoint: string,
  accessToken: string,
  params: Record<string, string | number> = {},
): Promise<T> {
  const url = new URL(`${BASE}/${endpoint.replace(/^\//, "")}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }
  /* In the header rather than the query string: Meta logs full request URLs and
     a token in one is a token in a log. */
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  const body = await readBody(response);
  if (!response.ok) throw describe(body as MetaErrorBody, response.status);
  return body as T;
}

export async function metaPost<T>(
  endpoint: string,
  accessToken: string,
  payload: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(`${BASE}/${endpoint.replace(/^\//, "")}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const body = await readBody(response);
  if (!response.ok) throw describe(body as MetaErrorBody, response.status);
  return body as T;
}

async function metaUpload<T>(
  endpoint: string,
  accessToken: string,
  form: FormData,
): Promise<T> {
  const response = await fetch(`${BASE}/${endpoint.replace(/^\//, "")}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: form,
    cache: "no-store",
  });

  const body = await readBody(response);
  if (!response.ok) throw describe(body as MetaErrorBody, response.status);
  return body as T;
}

/* ─── Accounts, pages, campaigns, ad sets ──────────────────────────────────── */

export async function getAdAccounts(accessToken: string): Promise<AdAccount[]> {
  const data = await metaGet<{ data?: AdAccount[] }>("me/adaccounts", accessToken, {
    fields: "id,name,account_id,account_status,currency",
    limit: 200,
  });
  return data.data ?? [];
}

export async function getPages(accessToken: string): Promise<FbPage[]> {
  const data = await metaGet<{ data?: FbPage[] }>("me/accounts", accessToken, {
    fields: "id,name",
    limit: 200,
  });
  return data.data ?? [];
}

export async function getCampaigns(
  adAccountId: string,
  accessToken: string,
): Promise<Campaign[]> {
  const data = await metaGet<{ data?: Campaign[] }>(
    `${adAccountId}/campaigns`,
    accessToken,
    { fields: "id,name,status,objective", limit: 200 },
  );
  return data.data ?? [];
}

export async function getAdSets(
  campaignId: string,
  accessToken: string,
): Promise<AdSet[]> {
  const data = await metaGet<{ data?: AdSet[] }>(
    `${campaignId}/adsets`,
    accessToken,
    { fields: "id,name,status,is_dynamic_creative", limit: 200 },
  );
  return data.data ?? [];
}

const AD_SET_COPY_FIELDS = [
  "id",
  "name",
  "campaign_id",
  "targeting",
  "billing_event",
  "optimization_goal",
  "optimization_sub_event",
  "bid_amount",
  "bid_strategy",
  "daily_budget",
  "lifetime_budget",
  "promoted_object",
  "destination_type",
  "attribution_spec",
  "pacing_type",
  "end_time",
  "is_dynamic_creative",
].join(",");

export interface AdSetDetails {
  id: string;
  name: string;
  campaign_id?: string;
  targeting?: unknown;
  billing_event?: string;
  optimization_goal?: string;
  optimization_sub_event?: string;
  bid_amount?: string;
  bid_strategy?: string;
  daily_budget?: string;
  lifetime_budget?: string;
  promoted_object?: unknown;
  destination_type?: string;
  attribution_spec?: unknown;
  pacing_type?: string[];
  end_time?: string;
  is_dynamic_creative?: boolean;
}

export function getAdSetDetails(
  adSetId: string,
  accessToken: string,
): Promise<AdSetDetails> {
  return metaGet<AdSetDetails>(adSetId, accessToken, { fields: AD_SET_COPY_FIELDS });
}

/* A new ad set by copying an existing one.

   Only fields the source actually carries are sent. That matters more than it
   looks: an ad set under a campaign budget has no daily_budget of its own, and
   sending one anyway is rejected. Always created paused. */
export async function createAdSet(
  adAccountId: string,
  accessToken: string,
  { name, campaignId, sourceAdSetId }: {
    name: string;
    campaignId: string;
    sourceAdSetId: string;
  },
): Promise<{ id: string }> {
  const source = await getAdSetDetails(sourceAdSetId, accessToken);

  const payload: Record<string, unknown> = {
    name,
    campaign_id: campaignId,
    status: "PAUSED",
  };

  const copy: (keyof AdSetDetails)[] = [
    "targeting",
    "billing_event",
    "optimization_goal",
    "optimization_sub_event",
    "bid_amount",
    "bid_strategy",
    "daily_budget",
    "lifetime_budget",
    "promoted_object",
    "destination_type",
    "attribution_spec",
    "pacing_type",
  ];
  for (const field of copy) {
    const value = source[field];
    if (value !== undefined && value !== null) payload[field] = value;
  }

  /* A lifetime budget is meaningless without the date it runs to, so that one
     field comes across with it. start_time is deliberately left out: the source's
     is in the past and Meta rejects it. */
  if (source.lifetime_budget && source.end_time) payload.end_time = source.end_time;

  return metaPost<{ id: string }>(`${adAccountId}/adsets`, accessToken, payload);
}

/* ─── Media ────────────────────────────────────────────────────────────────── */

export interface UploadedImage {
  hash: string;
  url: string | null;
}

/* /adimages keys its response by the field name, which is the filename. */
export async function uploadImageToMeta(
  adAccountId: string,
  accessToken: string,
  bytes: ArrayBuffer,
  fileName: string,
  mimeType: string,
): Promise<UploadedImage> {
  const form = new FormData();
  form.append(fileName, new Blob([bytes], { type: mimeType }), fileName);

  const body = await metaUpload<{
    images?: Record<string, { hash?: string; url?: string }>;
  }>(`${adAccountId}/adimages`, accessToken, form);

  const entry = Object.values(body.images ?? {})[0];
  if (!entry?.hash) {
    throw new MetaError("Meta accepted the image but returned no hash.", 502);
  }
  return { hash: entry.hash, url: entry.url ?? null };
}

export async function uploadVideoToMeta(
  adAccountId: string,
  accessToken: string,
  bytes: ArrayBuffer,
  fileName: string,
  mimeType: string,
): Promise<string> {
  const form = new FormData();
  form.append("source", new Blob([bytes], { type: mimeType }), fileName);
  form.append("name", fileName);

  const body = await metaUpload<{ id?: string }>(
    `${adAccountId}/advideos`,
    accessToken,
    form,
  );
  if (!body.id) {
    throw new MetaError("Meta accepted the video but returned no id.", 502);
  }
  return body.id;
}

/* A video creative needs a thumbnail, and Meta only generates them once the
   upload has been transcoded. Worth a short wait: without one the creative call
   fails with a message about image_url that reads like a bug in the app. */
export async function waitForVideoThumbnail(
  videoId: string,
  accessToken: string,
  attempts = 6,
  delayMs = 2500,
): Promise<string | null> {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const body = await metaGet<{
        data?: { uri?: string; is_preferred?: boolean }[];
      }>(`${videoId}/thumbnails`, accessToken, { fields: "uri,is_preferred" });

      const thumbs = body.data ?? [];
      const preferred = thumbs.find((t) => t.is_preferred && t.uri) ?? thumbs.find((t) => t.uri);
      if (preferred?.uri) return preferred.uri;
    } catch {
      /* Still processing. Fall through to the wait. */
    }
    if (attempt < attempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return null;
}

/* ─── Creatives and ads ────────────────────────────────────────────────────── */

export interface CreativeCopy {
  primaryTexts: string[];
  headlines: string[];
  descriptions: string[];
  ctaType: CtaType;
  websiteUrl: string;
  displayLink: string;
  enhancements: boolean;
}

export interface CreativeMedia {
  kind: "image" | "video";
  imageHash?: string;
  videoId?: string;
  thumbnailUrl?: string | null;
}

export async function createAdCreative(
  adAccountId: string,
  accessToken: string,
  {
    name,
    pageId,
    copy,
    media,
  }: { name: string; pageId: string; copy: CreativeCopy; media: CreativeMedia },
): Promise<{ id: string }> {
  const bodies = copy.primaryTexts.filter(Boolean);
  const titles = copy.headlines.filter(Boolean);
  const descriptions = copy.descriptions.filter(Boolean);

  const multiple = bodies.length > 1 || titles.length > 1 || descriptions.length > 1;

  const payload: Record<string, unknown> = { name };

  /* Enhancements are opted in or out explicitly rather than left unset, so the
     checkbox in step three is what decides it and not an account default. */
  payload.degrees_of_freedom_spec = {
    creative_features_spec: {
      standard_enhancements: {
        enroll_status: copy.enhancements ? "OPT_IN" : "OPT_OUT",
      },
    },
  };

  if (multiple) {
    /* More than one of anything has to go through asset_feed_spec, which is
       what lets Meta rotate the combinations. object_story_spec then carries
       nothing but the page. */
    const feed: Record<string, unknown> = {
      bodies: bodies.map((text) => ({ text })),
      titles: titles.map((text) => ({ text })),
      call_to_action_types: [copy.ctaType],
      link_urls: [
        copy.displayLink
          ? { website_url: copy.websiteUrl, display_url: copy.displayLink }
          : { website_url: copy.websiteUrl },
      ],
    };
    if (descriptions.length) {
      feed.descriptions = descriptions.map((text) => ({ text }));
    }

    if (media.kind === "image") {
      feed.images = [{ hash: media.imageHash }];
      feed.ad_formats = ["SINGLE_IMAGE"];
    } else {
      feed.videos = [
        media.thumbnailUrl
          ? { video_id: media.videoId, thumbnail_url: media.thumbnailUrl }
          : { video_id: media.videoId },
      ];
      feed.ad_formats = ["SINGLE_VIDEO"];
    }

    payload.asset_feed_spec = feed;
    payload.object_story_spec = { page_id: pageId };
  } else if (media.kind === "image") {
    const linkData: Record<string, unknown> = {
      image_hash: media.imageHash,
      link: copy.websiteUrl,
      message: bodies[0] ?? "",
      name: titles[0] ?? "",
      call_to_action: { type: copy.ctaType, value: { link: copy.websiteUrl } },
    };
    if (descriptions[0]) linkData.description = descriptions[0];
    if (copy.displayLink) linkData.caption = copy.displayLink;

    payload.object_story_spec = { page_id: pageId, link_data: linkData };
  } else {
    const videoData: Record<string, unknown> = {
      video_id: media.videoId,
      message: bodies[0] ?? "",
      title: titles[0] ?? "",
      call_to_action: { type: copy.ctaType, value: { link: copy.websiteUrl } },
    };
    if (descriptions[0]) videoData.link_description = descriptions[0];
    if (media.thumbnailUrl) videoData.image_url = media.thumbnailUrl;

    payload.object_story_spec = { page_id: pageId, video_data: videoData };
  }

  return metaPost<{ id: string }>(`${adAccountId}/adcreatives`, accessToken, payload);
}

export function createAd(
  adAccountId: string,
  accessToken: string,
  { name, adSetId, creativeId, status }: {
    name: string;
    adSetId: string;
    creativeId: string;
    status: "ACTIVE" | "PAUSED";
  },
): Promise<{ id: string }> {
  return metaPost<{ id: string }>(`${adAccountId}/ads`, accessToken, {
    name,
    adset_id: adSetId,
    creative: { creative_id: creativeId },
    status,
  });
}
