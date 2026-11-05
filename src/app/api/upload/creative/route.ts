import { NextResponse } from "next/server";
import type { Batch } from "@/lib/ads";
import { failed, signedIn, unauthorized } from "@/lib/ads-auth";
import { updateBatch, validBatchId, validBlobRef } from "@/lib/ads-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Renames an ad or attaches a custom video thumbnail. Both are per-creative
   edits made in step two, so they share a route. */
export async function PUT(request: Request) {
  if (!signedIn()) return unauthorized();

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Could not read that request." }, { status: 400 });
  }

  const batchId = body.batchId;
  const creativeId = body.creativeId;
  if (!validBatchId(batchId) || typeof creativeId !== "string") {
    return NextResponse.json({ error: "No such creative." }, { status: 400 });
  }

  const hasThumbnail = "thumbnailUrl" in body && body.thumbnailUrl !== null;
  if (hasThumbnail && !validBlobRef(body.thumbnailUrl, body.thumbnailPathname, batchId)) {
    return NextResponse.json(
      { error: "That thumbnail did not come from this batch." },
      { status: 400 },
    );
  }

  try {
    let found = false;
    const batch = await updateBatch(batchId, (current): Batch => ({
      ...current,
      creatives: current.creatives.map((creative) => {
        if (creative.id !== creativeId) return creative;
        found = true;
        return {
          ...creative,
          adName:
            typeof body.adName === "string" && body.adName.trim()
              ? body.adName.trim().slice(0, 120)
              : creative.adName,
          thumbnailUrl: hasThumbnail
            ? (body.thumbnailUrl as string)
            : creative.thumbnailUrl,
          thumbnailPathname: hasThumbnail
            ? (body.thumbnailPathname as string)
            : creative.thumbnailPathname,
        };
      }),
    }));

    if (!batch) return NextResponse.json({ error: "No such batch." }, { status: 404 });
    if (!found) return NextResponse.json({ error: "No such creative." }, { status: 404 });
    return NextResponse.json({ batch });
  } catch (e) {
    return failed("save that change", e);
  }
}
