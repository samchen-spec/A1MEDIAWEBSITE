import { NextResponse } from "next/server";
import { adNameFromFile, kindOf, type Batch, type Creative } from "@/lib/ads";
import { failed, signedIn, unauthorized } from "@/lib/ads-auth";
import {
  newCreativeId,
  updateBatch,
  validBatchId,
  validBlobRef,
} from "@/lib/ads-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Attaches files the browser has already put in Blob storage to their batch.
   This is the step the tutorial's /api/upload did by writing to disk; on Vercel
   there is no disk, so the upload happened client side and only the record of
   it comes through here. */
export async function POST(request: Request) {
  if (!signedIn()) return unauthorized();

  let body: { batchId?: unknown; files?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Could not read that request." }, { status: 400 });
  }

  const batchId = body.batchId;
  if (!validBatchId(batchId)) {
    return NextResponse.json({ error: "No such batch." }, { status: 400 });
  }
  if (!Array.isArray(body.files) || body.files.length === 0) {
    return NextResponse.json({ error: "No files to attach." }, { status: 400 });
  }

  const creatives: Creative[] = [];
  for (const raw of body.files) {
    if (!raw || typeof raw !== "object") continue;
    const file = raw as Record<string, unknown>;

    if (!validBlobRef(file.url, file.pathname, batchId)) {
      return NextResponse.json(
        { error: "One of those uploads did not come from this batch." },
        { status: 400 },
      );
    }

    const mimeType = typeof file.mimeType === "string" ? file.mimeType : "";
    const kind = kindOf(mimeType);
    if (!kind) {
      return NextResponse.json(
        { error: `${String(file.fileName ?? "That file")} is not an image or a video.` },
        { status: 400 },
      );
    }

    const fileName = typeof file.fileName === "string" ? file.fileName.slice(0, 200) : "file";

    creatives.push({
      id: newCreativeId(),
      fileName,
      kind,
      mimeType,
      size: typeof file.size === "number" ? file.size : 0,
      url: file.url as string,
      pathname: file.pathname as string,
      thumbnailUrl: null,
      thumbnailPathname: null,
      /* The filename is the ad name until step two says otherwise. */
      adName: adNameFromFile(fileName),
      metaAdId: null,
      metaCreativeId: null,
      status: "pending",
      error: null,
    });
  }

  if (!creatives.length) {
    return NextResponse.json({ error: "No usable files in that upload." }, { status: 400 });
  }

  try {
    const batch = await updateBatch(batchId, (current): Batch => ({
      ...current,
      creatives: [...current.creatives, ...creatives],
    }));
    if (!batch) return NextResponse.json({ error: "No such batch." }, { status: 404 });
    return NextResponse.json({ batch });
  } catch (e) {
    return failed("attach those files", e);
  }
}
