import { NextResponse } from "next/server";
import { failed, signedIn, unauthorized } from "@/lib/ads-auth";
import { loadSettings } from "@/lib/ads-store";
import { createAdSet, getAdSets } from "@/lib/meta-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Copying an ad set reads the source and then creates one, so it is two
   round trips to Meta rather than one. */
export const maxDuration = 60;

function setupRequired() {
  return NextResponse.json(
    { error: "Connect a Meta token and pick an ad account first.", setup: true },
    { status: 409 },
  );
}

export async function GET(request: Request) {
  if (!signedIn()) return unauthorized();

  const campaignId = new URL(request.url).searchParams.get("campaignId");
  if (!campaignId) {
    return NextResponse.json({ error: "campaignId is required." }, { status: 400 });
  }

  try {
    const { accessToken } = await loadSettings();
    if (!accessToken) return setupRequired();
    return NextResponse.json({ adSets: await getAdSets(campaignId, accessToken) });
  } catch (e) {
    return failed("load the ad sets", e);
  }
}

export async function POST(request: Request) {
  if (!signedIn()) return unauthorized();

  let body: { name?: unknown; campaignId?: unknown; sourceAdSetId?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Could not read that request." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const campaignId = typeof body.campaignId === "string" ? body.campaignId : "";
  const sourceAdSetId =
    typeof body.sourceAdSetId === "string" ? body.sourceAdSetId : "";

  if (!name) return NextResponse.json({ error: "Name the new ad set." }, { status: 400 });
  if (!campaignId || !sourceAdSetId) {
    return NextResponse.json(
      { error: "Pick a campaign and an ad set to copy the settings from." },
      { status: 400 },
    );
  }

  try {
    const { accessToken, adAccountId } = await loadSettings();
    if (!accessToken || !adAccountId) return setupRequired();

    const created = await createAdSet(adAccountId, accessToken, {
      name,
      campaignId,
      sourceAdSetId,
    });
    return NextResponse.json({ adSet: { id: created.id, name, status: "PAUSED" } });
  } catch (e) {
    return failed("create the ad set", e);
  }
}
