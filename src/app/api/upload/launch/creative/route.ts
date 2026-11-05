import { NextResponse } from "next/server";
import { CONVERTED_IMAGE_TYPES, safeFileName, type Batch, type Creative } from "@/lib/ads";
import { failed, signedIn, unauthorized } from "@/lib/ads-auth";
import {
  loadBatch,
  loadSettings,
  readBlobBytes,
  updateBatch,
  validBatchId,
} from "@/lib/ads-store";
import {
  createAd,
  createAdCreative,
  uploadImageToMeta,
  uploadVideoToMeta,
  waitForVideoThumbnail,
  type CreativeMedia,
} from "@/lib/meta-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* One creative is three or four calls to Meta, and a video has to transcode far
   enough for a thumbnail before the creative will take. A minute is enough for
   one; it would not be enough for twenty, which is why this route does one. */
export const maxDuration = 60;

/* Meta's /adimages rejects WebP, BMP and TIFF outright. Converting is kinder
   than telling a media buyer to go and re-export the file. */
async function asMetaImage(
  bytes: ArrayBuffer,
  fileName: string,
  mimeType: string,
): Promise<{ bytes: ArrayBuffer; fileName: string; mimeType: string }> {
  if (!CONVERTED_IMAGE_TYPES.includes(mimeType)) {
    return { bytes, fileName, mimeType };
  }

  const sharp = (await import("sharp")).default;
  const jpeg = await sharp(new Uint8Array(bytes)).jpeg({ quality: 90 }).toBuffer();
  const stem = fileName.replace(/\.[^.]+$/, "");

  /* Copied out of the Buffer rather than handed over as one: a Buffer's
     underlying ArrayBuffer is pooled and longer than the image. */
  const copy = new Uint8Array(jpeg.byteLength);
  copy.set(jpeg);

  return {
    bytes: copy.buffer,
    fileName: `${stem}.jpg`,
    mimeType: "image/jpeg",
  };
}

export async function POST(request: Request) {
  if (!signedIn()) return unauthorized();

  let body: { batchId?: unknown; creativeId?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Could not read that request." }, { status: 400 });
  }

  const batchId = body.batchId;
  const creativeId = body.creativeId;
  if (!validBatchId(batchId) || typeof creativeId !== "string") {
    return NextResponse.json({ error: "No such creative." }, { status: 400 });
  }

  try {
    const settings = await loadSettings();
    const { accessToken, adAccountId, pageId } = settings;
    if (!accessToken || !adAccountId || !pageId) {
      return NextResponse.json(
        { error: "Settings are incomplete. Add them on the Settings page.", setup: true },
        { status: 409 },
      );
    }

    const batch = await loadBatch(batchId);
    if (!batch) return NextResponse.json({ error: "No such batch." }, { status: 404 });
    if (!batch.adSetId) {
      return NextResponse.json({ error: "This batch has no ad set." }, { status: 400 });
    }

    const creative = batch.creatives.find((c) => c.id === creativeId);
    if (!creative) {
      return NextResponse.json({ error: "No such creative." }, { status: 404 });
    }
    /* Already live. Re-running the loop must not make a second ad. */
    if (creative.status === "created") {
      return NextResponse.json({ creative });
    }

    let result: Creative;

    try {
      const raw = await readBlobBytes(creative.url);

      const media: CreativeMedia = { kind: creative.kind };

      if (creative.kind === "image") {
        const image = await asMetaImage(
          raw,
          safeFileName(creative.fileName),
          creative.mimeType,
        );
        const uploaded = await uploadImageToMeta(
          adAccountId,
          accessToken,
          image.bytes,
          image.fileName,
          image.mimeType,
        );
        media.imageHash = uploaded.hash;
      } else {
        media.videoId = await uploadVideoToMeta(
          adAccountId,
          accessToken,
          raw,
          safeFileName(creative.fileName),
          creative.mimeType,
        );

        if (creative.thumbnailUrl) {
          /* A custom thumbnail is an image in our own store, so it goes through
             /adimages first: video_data wants a URL, not a hash. */
          const thumbBytes = await readBlobBytes(creative.thumbnailUrl);
          const thumb = await uploadImageToMeta(
            adAccountId,
            accessToken,
            thumbBytes,
            `${safeFileName(creative.fileName).replace(/\.[^.]+$/, "")}_thumb.jpg`,
            "image/jpeg",
          );
          media.thumbnailUrl = thumb.url;
        }

        if (!media.thumbnailUrl) {
          media.thumbnailUrl = await waitForVideoThumbnail(
            media.videoId,
            accessToken,
            4,
            2000,
          );
        }
      }

      const made = await createAdCreative(adAccountId, accessToken, {
        name: creative.adName,
        pageId,
        copy: {
          primaryTexts: batch.primaryTexts,
          headlines: batch.headlines,
          descriptions: batch.descriptions,
          ctaType: batch.ctaType,
          websiteUrl: batch.websiteUrl,
          displayLink: batch.displayLink,
          enhancements: batch.enhancements,
        },
        media,
      });

      const ad = await createAd(adAccountId, accessToken, {
        name: creative.adName,
        adSetId: batch.adSetId,
        creativeId: made.id,
        status: batch.launchPaused ? "PAUSED" : "ACTIVE",
      });

      result = {
        ...creative,
        metaCreativeId: made.id,
        metaAdId: ad.id,
        status: "created",
        error: null,
      };
    } catch (e) {
      /* One bad file does not stop the batch: the error is recorded against
         that creative and the browser moves on to the next. */
      const message =
        e instanceof Error ? e.message : "That creative could not be uploaded.";
      result = { ...creative, status: "error", error: message };
    }

    const saved = await updateBatch(batchId, (current): Batch => ({
      ...current,
      creatives: current.creatives.map((c) => (c.id === result.id ? result : c)),
    }));

    return NextResponse.json({ creative: result, batch: saved });
  } catch (e) {
    return failed("upload that creative", e);
  }
}
