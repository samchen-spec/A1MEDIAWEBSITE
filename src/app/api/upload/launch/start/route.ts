import { NextResponse } from "next/server";
import type { Batch } from "@/lib/ads";
import { failed, signedIn, unauthorized } from "@/lib/ads-auth";
import { loadSettings, updateBatch, validBatchId } from "@/lib/ads-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* The launch is split across three routes rather than done in one: a batch of
   twenty videos is twenty uploads to Meta, which no single serverless request
   is going to finish. This one checks that the batch can launch at all and
   hands back the work; the browser then walks it one creative at a time, which
   is also what gives the progress bar something true to show. */
export async function POST(request: Request) {
  if (!signedIn()) return unauthorized();

  let body: { batchId?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Could not read that request." }, { status: 400 });
  }

  const batchId = body.batchId;
  if (!validBatchId(batchId)) {
    return NextResponse.json({ error: "No such batch." }, { status: 400 });
  }

  try {
    const settings = await loadSettings();
    const problems: string[] = [];

    if (!settings.accessToken) problems.push("a Meta access token");
    if (!settings.adAccountId) problems.push("an ad account");
    if (!settings.pageId) problems.push("a Facebook page");

    if (problems.length) {
      return NextResponse.json(
        {
          error: `Settings are missing ${problems.join(", ")}. Add them on the Settings page.`,
          setup: true,
        },
        { status: 409 },
      );
    }

    let blockers: string[] = [];
    const batch = await updateBatch(batchId, (current): Batch => {
      blockers = [];
      if (!current.adSetId) blockers.push("Pick an ad set.");
      if (!current.websiteUrl) blockers.push("Add a destination URL.");
      if (!current.primaryTexts.some(Boolean)) blockers.push("Write at least one primary text.");
      if (!current.headlines.some(Boolean)) blockers.push("Write at least one headline.");
      if (!current.creatives.length) blockers.push("Upload at least one creative.");
      if (blockers.length) return current;

      return {
        ...current,
        status: "uploading",
        errorLog: [],
        adsErrored: 0,
        /* Ads already created are left alone: relaunching after a partial
           failure must not duplicate them in the ad set. */
        creatives: current.creatives.map((creative) =>
          creative.status === "created"
            ? creative
            : { ...creative, status: "pending", error: null },
        ),
      };
    });

    if (!batch) return NextResponse.json({ error: "No such batch." }, { status: 404 });
    if (blockers.length) {
      return NextResponse.json({ error: blockers.join(" ") }, { status: 400 });
    }

    return NextResponse.json({
      batch,
      pending: batch.creatives.filter((c) => c.status !== "created").map((c) => c.id),
    });
  } catch (e) {
    return failed("start the launch", e);
  }
}
