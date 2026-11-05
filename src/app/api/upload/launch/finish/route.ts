import { NextResponse } from "next/server";
import type { Batch } from "@/lib/ads";
import { failed, signedIn, unauthorized } from "@/lib/ads-auth";
import {
  loadBatch,
  removeCreativeFiles,
  updateBatch,
  validBatchId,
} from "@/lib/ads-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Closes the batch once the browser has walked every creative. Counts are
   recomputed from the creatives rather than tallied as they go, so a retried or
   abandoned launch still ends up with a true total. */
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
    const current = await loadBatch(batchId);
    if (!current) return NextResponse.json({ error: "No such batch." }, { status: 404 });

    /* A creative file has done its job the moment Meta has the ad: Meta keeps
       its own copy and nothing here reads the Blob again. Left behind, a single
       batch of video fills a Hobby store's whole gigabyte and the next launch
       fails on quota instead of on anything real.

       Files belonging to a creative that failed stay where they are, because
       relaunching the batch retries exactly those and has to read them. They go
       on the next finish, once their ad exists. */
    const spent = current.creatives.filter(
      (c) => c.status === "created" && !c.fileRemoved,
    );
    const urls = spent
      .flatMap((c) => [c.url, c.thumbnailUrl])
      .filter((u): u is string => Boolean(u));
    const removed = await removeCreativeFiles(urls);

    const batch = await updateBatch(batchId, (cur): Batch => {
      const created = cur.creatives.filter((c) => c.status === "created");
      const errored = cur.creatives.filter((c) => c.status === "error");

      return {
        ...cur,
        creatives: removed
          ? cur.creatives.map((c) =>
              c.status === "created" ? { ...c, fileRemoved: true } : c,
            )
          : cur.creatives,
        adsCreated: created.length,
        adsErrored: errored.length,
        errorLog: errored.map((c) => `${c.adName}: ${c.error ?? "failed"}`),
        /* "error" is reserved for a batch where nothing got through. A partial
           run is complete with errors listed, because the ads that did launch
           are live and the page has to say so. */
        status: created.length === 0 && errored.length > 0 ? "error" : "complete",
      };
    });

    if (!batch) return NextResponse.json({ error: "No such batch." }, { status: 404 });
    return NextResponse.json({ batch });
  } catch (e) {
    return failed("finish the launch", e);
  }
}
