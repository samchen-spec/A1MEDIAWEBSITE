import { NextResponse } from "next/server";
import { CTA_TYPES, MAX_VARIATIONS, type Batch, type CtaType } from "@/lib/ads";
import { failed, signedIn, unauthorized } from "@/lib/ads-auth";
import {
  blankBatch,
  listBatches,
  loadBatch,
  newBatchId,
  saveBatch,
  storeConfigured,
  updateBatch,
  validBatchId,
} from "@/lib/ads-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function noStore() {
  return NextResponse.json(
    { error: "No Blob store is connected, so batches cannot be saved." },
    { status: 503 },
  );
}

/* Either the whole history, or one batch by id. */
export async function GET(request: Request) {
  if (!signedIn()) return unauthorized();
  if (!storeConfigured()) return noStore();

  const id = new URL(request.url).searchParams.get("id");

  try {
    if (id) {
      if (!validBatchId(id)) {
        return NextResponse.json({ error: "No such batch." }, { status: 400 });
      }
      const batch = await loadBatch(id);
      if (!batch) return NextResponse.json({ error: "No such batch." }, { status: 404 });
      return NextResponse.json({ batch });
    }
    return NextResponse.json({ batches: await listBatches() });
  } catch (e) {
    return failed("read your batches", e);
  }
}

export async function POST(request: Request) {
  if (!signedIn()) return unauthorized();
  if (!storeConfigured()) return noStore();

  let body: { name?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    body = {};
  }

  const name =
    typeof body.name === "string" && body.name.trim() ? body.name.trim().slice(0, 120) : "Batch";

  try {
    const batch = blankBatch(newBatchId(), name);
    await saveBatch(batch);
    return NextResponse.json({ batch });
  } catch (e) {
    return failed("start a batch", e);
  }
}

function variations(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  const list = value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .slice(0, MAX_VARIATIONS);
  return list.length ? list : [""];
}

/* Saves whatever the wizard has so far. Called when step two is left and again
   just before the launch, so a half-filled batch survives a closed tab. */
export async function PUT(request: Request) {
  if (!signedIn()) return unauthorized();
  if (!storeConfigured()) return noStore();

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Could not read that request." }, { status: 400 });
  }

  const batchId = body.batchId;
  if (!validBatchId(batchId)) {
    return NextResponse.json({ error: "No such batch." }, { status: 400 });
  }

  const str = (value: unknown, fallback: string): string =>
    typeof value === "string" ? value.trim() : fallback;
  const orNull = (value: unknown, fallback: string | null): string | null =>
    typeof value === "string" ? value.trim() || null : fallback;

  try {
    const batch = await updateBatch(batchId, (current): Batch => ({
      ...current,
      name: str(body.name, current.name).slice(0, 120) || current.name,
      campaignId: orNull(body.campaignId, current.campaignId),
      campaignName: orNull(body.campaignName, current.campaignName),
      adSetId: orNull(body.adSetId, current.adSetId),
      adSetName: orNull(body.adSetName, current.adSetName),
      primaryTexts: variations(body.primaryTexts, current.primaryTexts),
      headlines: variations(body.headlines, current.headlines),
      descriptions: variations(body.descriptions, current.descriptions),
      ctaType: CTA_TYPES.includes(body.ctaType as CtaType)
        ? (body.ctaType as CtaType)
        : current.ctaType,
      websiteUrl: str(body.websiteUrl, current.websiteUrl).slice(0, 2000),
      displayLink: str(body.displayLink, current.displayLink).slice(0, 300),
      launchPaused:
        typeof body.launchPaused === "boolean" ? body.launchPaused : current.launchPaused,
      enhancements:
        typeof body.enhancements === "boolean" ? body.enhancements : current.enhancements,
    }));

    if (!batch) return NextResponse.json({ error: "No such batch." }, { status: 404 });
    return NextResponse.json({ batch });
  } catch (e) {
    return failed("save the batch", e);
  }
}
